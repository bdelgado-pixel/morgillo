import json, uuid
from pathlib import Path
from django.core.management.base import BaseCommand
from django.core.files import File
from django.db import transaction
from django.contrib.auth.models import Group,Permission
from django.conf import settings
from content.models import MediaAsset,Brand,Category,Product,ProductImage,SiteSettings,Service

class Command(BaseCommand):
    help='Carga contenido inicial sin sobrescribir datos. --demo incluye los cuatro productos marcados como demostración.'
    def add_arguments(self,parser):parser.add_argument('--demo',action='store_true')
    @transaction.atomic
    def handle(self,*args,**options):
        root=settings.BASE_DIR.parent
        data=json.loads((settings.BASE_DIR/'seed-data.json').read_text(encoding='utf-8'))
        def asset(path,alt):
            asset_id=uuid.uuid5(uuid.NAMESPACE_URL,'morgillo-seed:'+path)
            current=MediaAsset.objects.filter(pk=asset_id).first()
            if current:return current
            source=root/'public'/path.lstrip('/')
            obj=MediaAsset(id=asset_id,title=alt,alt=alt)
            with source.open('rb') as f:obj.file.save(source.name,File(f),save=False);obj.full_clean();obj.save()
            return obj
        brands={}
        for i,b in enumerate(data['brands']):
            brands[b['id']],_=Brand.objects.get_or_create(slug=b['id'],defaults={'name':b['name'],'description':b['description'],'image':asset(b['image'],b['name']),'primary':True,'position':i})
        categories={}
        for i,c in enumerate(data['categories']):
            categories[c['id']],_=Category.objects.get_or_create(slug=c['id'],defaults={'name':c['name'],'subtitle':c['brand'],'description':c['description'],'image':asset(c['image'],c['name']),'position':i})
        s=data['site']
        defaults={k:s[k] for k in ['name','phone','office','service','whatsapp','address','hours']}
        defaults.update(url='http://localhost:3000',logo=asset('/images/logo-morgillo.webp','Logo Morgillo'),hero_image=asset('/images/hero-morgillo.webp','Portada Morgillo'))
        for social in s['social']:defaults[social['label'].lower()]=social['href']
        SiteSettings.objects.get_or_create(pk=1,defaults=defaults)
        for i,(slug,title,description) in enumerate([
            ('servicio-tecnico','Servicio técnico','Soporte para mantener tus equipos trabajando y atender las necesidades de tu operación.'),
            ('mantenimiento','Mantenimiento','Atención y mantenimiento para conservar el rendimiento y la disponibilidad de tu maquinaria.'),
            ('repuestos','Repuestos','Encuentra los repuestos que necesitas para continuar con tus trabajos.'),
            ('asesoria','Asesoría','Orientación para encontrar la maquinaria y solución adecuada para cada proyecto.')]):
            Service.objects.get_or_create(slug=slug,defaults={'title':title,'description':description,'position':i,'requirements':'Marca y modelo del equipo\nDescripción de la consulta\nUbicación del equipo'})
        if options['demo']:
            for d in data['products']:
                product,created=Product.objects.get_or_create(slug=d['slug'],defaults={'name':d['name'],'model':d['model'],'brand':brands.get(d['brandId']),'category':categories[d['category']],'description':d['description'],'featured':d['featured'],'published':True,'mock':True})
                if created:
                    for i,image in enumerate(d['images']):ProductImage.objects.create(product=product,asset=asset(image['url'],image['alt']),position=i)
        group,_=Group.objects.get_or_create(name='Editores de contenido')
        group.permissions.set(Permission.objects.filter(content_type__app_label='content'))
        self.stdout.write(self.style.SUCCESS('CMS inicializado. Datos existentes conservados. Crea tu administrador con createsuperuser.'))
