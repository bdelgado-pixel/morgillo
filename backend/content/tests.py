import io, tempfile
from datetime import timedelta
from PIL import Image
from django.test import TestCase, Client, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from django.db.models.deletion import ProtectedError
from django.contrib.auth.models import User
from django.utils import timezone
from django.urls import reverse
from .models import MediaAsset, Brand, Category, Product, ProductImage, ProductDocument, Specification, SiteSettings, Campaign, Article, Event
from .validators import validate_link,validate_upload

class CMSTests(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp=tempfile.TemporaryDirectory()
        cls.override=override_settings(MEDIA_ROOT=cls.temp.name)
        cls.override.enable()
        super().setUpClass()
    @classmethod
    def tearDownClass(cls):
        super().tearDownClass();cls.override.disable();cls.temp.cleanup()
    def setUp(self):
        f=io.BytesIO();Image.new('RGB',(20,20),'red').save(f,format='PNG')
        self.asset=MediaAsset(title='Test image',alt='Imagen de prueba',file=SimpleUploadedFile('test.png',f.getvalue(),'image/png'))
        self.asset.full_clean();self.asset.save()
        self.brand=Brand.objects.create(slug='test',name='Test',description='Prueba',image=self.asset)
        self.category=Category.objects.create(slug='agricola',name='Agrícola',description='Prueba',image=self.asset)
        self.product=Product.objects.create(name='Equipo prueba',slug='equipo-prueba',model='DEMO',brand=self.brand,category=self.category,description='Prueba',published=False)
        ProductImage.objects.create(product=self.product,asset=self.asset)
        SiteSettings.objects.create(phone='123456789',office='123456789',service='123456789',whatsapp='51123456789',address='Dato de prueba',hours='Dato de prueba')
    def test_drafts_publication_and_brand_visibility(self):
        self.assertEqual(self.client.get('/api/content/').json()['products'],[])
        self.product.published=True;self.product.save()
        data=self.client.get('/api/content/').json()['products']
        self.assertEqual(data[0]['slug'],'equipo-prueba')
        self.assertEqual(data[0]['images'][0]['url'],f'/cms-media/{self.asset.pk}')
        self.brand.active=False;self.brand.save()
        self.assertEqual(self.client.get('/api/content/').json()['products'],[])
    def test_campaign_scheduling_and_deactivation(self):
        now=timezone.now()
        c=Campaign.objects.create(title='Prueba',description='Prueba',desktop_image=self.asset,start=now-timedelta(hours=1),end=now+timedelta(hours=1),href='/maquinaria',active=True,show_popup=True)
        self.assertEqual(len(self.client.get('/api/campaigns/').json()['campaigns']),1)
        c.start=now+timedelta(minutes=1);c.save()
        self.assertEqual(self.client.get('/api/campaigns/').json()['campaigns'],[])
        c.start=now-timedelta(hours=2);c.end=now-timedelta(hours=1);c.save()
        self.assertEqual(self.client.get('/api/campaigns/').json()['campaigns'],[])
        c.end=now+timedelta(hours=1);c.active=False;c.save()
        self.assertEqual(self.client.get('/api/campaigns/').json()['campaigns'],[])
    def test_invalid_period_and_unsafe_link(self):
        c=Campaign(title='Test',description='Test',desktop_image=self.asset,start=timezone.now(),end=timezone.now()-timedelta(days=1),href='javascript:alert(1)')
        with self.assertRaises(ValidationError):c.full_clean()
        for url in ['javascript:alert(1)','//evil.example','data:text/html,hi']:
            with self.assertRaises(ValidationError):validate_link(url)
        validate_link('/maquinaria?marca=kubota');validate_link('https://morgillo.pe/')
    def test_future_articles_hidden(self):
        Article.objects.create(title='Futura',slug='futura',excerpt='Prueba',body='Prueba',published=True,published_at=timezone.now()+timedelta(days=1))
        self.assertEqual(self.client.get('/api/content/').json()['articles'],[])
    def test_anonymous_cannot_edit_and_csrf_required(self):
        self.assertEqual(self.client.get(reverse('admin:content_product_add')).status_code,302)
        self.assertEqual(self.client.post('/api/content/',{'name':'bad'}).status_code,405)
        admin=User.objects.create_superuser('qa','qa@example.test','Temporary-password-1234')
        client=Client(enforce_csrf_checks=True);client.force_login(admin)
        self.assertEqual(client.post(reverse('admin:content_product_add'),{}).status_code,403)
    def test_staff_without_permission_cannot_edit(self):
        staff=User.objects.create_user('viewer',password='Temporary-password-1234',is_staff=True)
        self.client.force_login(staff)
        self.assertEqual(self.client.get(reverse('admin:content_product_add')).status_code,403)
    def test_media_validation(self):
        for name,body in [('bad.svg',b'<svg/>'),('bad.png',b'<html>fake</html>'),('bad.pdf',b'not a pdf')]:
            with self.assertRaises(ValidationError):validate_upload(SimpleUploadedFile(name,body))
        validate_upload(SimpleUploadedFile('valid.pdf',b'%PDF-1.7\n%test'))
    def test_media_reuse_and_protected_delete(self):
        other=Product.objects.create(name='Segundo',slug='segundo',model='DEMO',category=self.category,description='Prueba')
        ProductImage.objects.create(product=other,asset=self.asset)
        with self.assertRaises(ProtectedError):self.asset.delete()
        response=self.client.get(f'/api/media/{self.asset.pk}/')
        self.assertEqual(response.status_code,200)
        self.assertEqual(response['Content-Type'],'image/png')
        response.close()
    def test_specs_and_pdf_contract(self):
        pdf=MediaAsset.objects.create(title='PDF prueba',alt='Ficha de prueba',file=SimpleUploadedFile('ficha.pdf',b'%PDF-1.7\n%test'))
        ProductDocument.objects.create(product=self.product,asset=pdf)
        Specification.objects.create(product=self.product,label='Campo prueba',value='25',unit='unidad')
        self.product.published=True;self.product.save()
        result=self.client.get('/api/content/').json()['products'][0]
        self.assertEqual(result['documents'][0]['kind'],'pdf')
        self.assertEqual(result['specifications'][0],{'label':'Campo prueba','value':'25','unit':'unidad'})
    def test_settings_api_and_public_methods(self):
        settings=SiteSettings.objects.get();settings.hero_title='Título actualizado';settings.save()
        self.assertEqual(self.client.get('/api/content/').json()['site']['heroTitle'],'Título actualizado')
        self.assertEqual(self.client.post('/api/campaigns/').status_code,405)
        self.assertEqual(self.client.get('/api/content/')['Cache-Control'],'max-age=0, no-cache, no-store, must-revalidate, private')
