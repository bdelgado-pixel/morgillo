import uuid
from pathlib import Path
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.utils import timezone
from .validators import validate_upload, validate_link

def upload_path(instance, filename): return f'library/{uuid.uuid4().hex}{Path(filename).suffix.lower()}'

class MediaAsset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField('Título', max_length=180)
    alt = models.CharField('Texto alternativo / descripción', max_length=250)
    file = models.FileField('Subir desde dispositivo', upload_to=upload_path, validators=[validate_upload], help_text='JPG, PNG, WebP o PDF. Máximo 15 MB. Biblioteca de archivos destinados a publicación; no subir documentos privados.')
    kind = models.CharField(max_length=10, choices=[('image','Imagen'),('pdf','PDF')], editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: verbose_name='archivo multimedia'; verbose_name_plural='Biblioteca multimedia'; ordering=['-created_at']
    def __str__(self): return f'{self.title} ({self.kind})'
    def clean(self):
        super().clean()
        if self.file:
            validate_upload(self.file)
            kind = 'pdf' if self.file.name.lower().endswith('.pdf') else 'image'
            if self.pk:
                previous = MediaAsset.objects.filter(pk=self.pk).first()
                if previous and previous.kind != kind: raise ValidationError({'file':'Crea otro archivo para cambiar de imagen a PDF o viceversa.'})
            self.kind = kind
    def save(self,*args,**kwargs):
        self.kind = 'pdf' if self.file.name.lower().endswith('.pdf') else 'image'
        super().save(*args,**kwargs)

def image_fk(**kwargs): return models.ForeignKey(MediaAsset,on_delete=models.PROTECT,limit_choices_to={'kind':'image'},**kwargs)

class Brand(models.Model):
    slug = models.SlugField('Identificador', unique=True)
    name = models.CharField('Nombre',max_length=100)
    description = models.TextField('Descripción')
    image = image_fk(verbose_name='Imagen de biblioteca',related_name='brands')
    primary = models.BooleanField('Marca principal',default=False)
    active = models.BooleanField('Publicada',default=True)
    position = models.PositiveIntegerField('Orden',default=0)
    class Meta: verbose_name='marca'; ordering=['position','name']
    def __str__(self): return self.name

CATEGORY_CHOICES=[('agricola','Agrícola'),('construccion','Construcción'),('implementos','Implementos')]
class Category(models.Model):
    slug=models.CharField('Categoría',max_length=20,choices=CATEGORY_CHOICES,unique=True)
    name=models.CharField('Nombre visible',max_length=80)
    subtitle=models.CharField('Subtítulo',max_length=120,blank=True)
    description=models.TextField('Descripción')
    image=image_fk(verbose_name='Imagen de biblioteca',related_name='categories')
    published=models.BooleanField('Publicada',default=True,help_text='Al desmarcarla, se ocultan esta categoría y sus equipos en la web. Los equipos conservan su propio estado de publicación y vuelven a mostrarse al publicar la categoría.')
    position=models.PositiveIntegerField('Orden',default=0)
    class Meta: verbose_name='categoría'; ordering=['position']
    def __str__(self):return self.name

class Product(models.Model):
    name=models.CharField('Nombre',max_length=180)
    slug=models.SlugField('URL',unique=True)
    model=models.CharField('Modelo',max_length=120)
    brand=models.ForeignKey(Brand,verbose_name='Marca',on_delete=models.PROTECT,null=True,blank=True)
    category=models.ForeignKey(Category,verbose_name='Categoría',on_delete=models.PROTECT)
    description=models.TextField('Descripción')
    featured=models.BooleanField('Destacado en Inicio',default=False)
    published=models.BooleanField('Publicado',default=False)
    mock=models.BooleanField('Ficha de demostración',default=False)
    position=models.PositiveIntegerField('Orden',default=0)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta:verbose_name='producto';ordering=['position','name']
    def __str__(self):return f'{self.name} — {self.model}'
    def get_absolute_url(self):return f'/maquinaria/{self.slug}'
    def clean(self):
        if self.slug in dict(CATEGORY_CHOICES):raise ValidationError({'slug':'Esta URL está reservada para una categoría.'})

class ProductImage(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name='gallery')
    asset=image_fk(verbose_name='Seleccionar de biblioteca (o + para subir)',related_name='product_images')
    position=models.PositiveIntegerField('Orden',default=0)
    class Meta:verbose_name='imagen';ordering=['position','pk'];constraints=[models.UniqueConstraint(fields=['product','asset'],name='unique_product_image')]

class ProductDocument(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name='documents')
    asset=models.ForeignKey(MediaAsset,verbose_name='PDF de biblioteca (o + para subir)',on_delete=models.PROTECT,limit_choices_to={'kind':'pdf'},related_name='product_documents')
    class Meta:verbose_name='documento';constraints=[models.UniqueConstraint(fields=['product','asset'],name='unique_product_document')]

class Specification(models.Model):
    product=models.ForeignKey(Product,on_delete=models.CASCADE,related_name='specifications')
    label=models.CharField('Característica',max_length=100)
    value=models.CharField('Valor',max_length=180)
    unit=models.CharField('Unidad',max_length=30,blank=True)
    position=models.PositiveIntegerField('Orden',default=0)
    class Meta:verbose_name='especificación técnica';ordering=['position','pk']

class Campaign(models.Model):
    title=models.CharField('Título',max_length=180)
    subtitle=models.CharField('Subtítulo',max_length=180,blank=True)
    description=models.TextField('Descripción')
    desktop_image=image_fk(verbose_name='Imagen escritorio',related_name='campaign_desktop')
    mobile_image=image_fk(verbose_name='Imagen móvil',related_name='campaign_mobile',null=True,blank=True)
    start=models.DateTimeField('Inicio de publicación')
    end=models.DateTimeField('Fin de publicación')
    place=models.CharField('Lugar',max_length=180,blank=True)
    button_text=models.CharField('Texto del botón',max_length=80,default='Conocer más')
    href=models.CharField('Enlace del botón',max_length=500,validators=[validate_link])
    active=models.BooleanField('Activa',default=False)
    show_home=models.BooleanField('Mostrar dentro del Inicio',default=True)
    show_popup=models.BooleanField('Mostrar popup al entrar',default=False)
    frequency=models.CharField('Frecuencia',max_length=10,choices=[('session','Una vez por sesión'),('visit','Cada visita'),('day','Una vez por día')],default='session')
    paths=models.TextField('Rutas donde se muestra',blank=True,help_text='Una por línea, por ejemplo / o /maquinaria. Vacío = todas las páginas.')
    priority=models.PositiveIntegerField('Prioridad (menor primero)',default=0)
    class Meta:verbose_name='campaña';ordering=['priority','-start'];constraints=[models.CheckConstraint(condition=models.Q(end__gte=models.F('start')),name='campaign_valid_period')]
    def __str__(self):return self.title
    def clean(self):
        if self.start and self.end and self.end<self.start:raise ValidationError({'end':'Debe ser posterior al inicio.'})
        if self.active and not (self.show_home or self.show_popup):raise ValidationError('Selecciona al menos una ubicación de publicación.')
        for path in self.paths.splitlines():
            if path.strip() and (not path.startswith('/') or path.startswith('//') or '?' in path or '#' in path):raise ValidationError({'paths':'Usa rutas internas sin parámetros, una por línea.'})

class Article(models.Model):
    title=models.CharField('Título',max_length=180)
    slug=models.SlugField('URL',unique=True)
    excerpt=models.TextField('Resumen')
    body=models.TextField('Contenido',help_text='Texto normal; separa párrafos con saltos de línea.')
    image=image_fk(verbose_name='Imagen de biblioteca',related_name='articles',null=True,blank=True)
    published=models.BooleanField('Publicado',default=False)
    published_at=models.DateTimeField('Fecha de publicación',default=timezone.now)
    class Meta:verbose_name='novedad';verbose_name_plural='Novedades';ordering=['-published_at']
    def __str__(self):return self.title

class Event(models.Model):
    title=models.CharField('Título',max_length=180)
    slug=models.SlugField('URL',unique=True)
    excerpt=models.TextField('Resumen')
    body=models.TextField('Contenido')
    image=image_fk(verbose_name='Imagen de biblioteca',related_name='events',null=True,blank=True)
    published=models.BooleanField('Publicado',default=False)
    published_at=models.DateTimeField('Fecha de publicación',default=timezone.now)
    start=models.DateTimeField('Inicio del evento')
    end=models.DateTimeField('Fin del evento')
    place=models.CharField('Lugar',max_length=180)
    class Meta:verbose_name='evento';ordering=['-start'];constraints=[models.CheckConstraint(condition=models.Q(end__gte=models.F('start')),name='event_valid_period')]
    def __str__(self):return self.title
    def clean(self):
        if self.start and self.end and self.end<self.start:raise ValidationError({'end':'Debe ser posterior al inicio.'})

class Service(models.Model):
    slug=models.SlugField('URL',unique=True)
    title=models.CharField('Título',max_length=120)
    description=models.TextField('Descripción')
    requirements=models.TextField('Datos a solicitar al cliente',blank=True,help_text='Un punto por línea.')
    published=models.BooleanField('Publicado',default=True)
    position=models.PositiveIntegerField('Orden',default=0)
    class Meta:verbose_name='servicio';ordering=['position']
    def __str__(self):return self.title

class SiteSettings(models.Model):
    id=models.PositiveSmallIntegerField(primary_key=True,default=1,editable=False)
    name=models.CharField('Nombre de empresa',max_length=120,default='Morgillo')
    url=models.URLField('URL pública del frontend',default='http://localhost:3000')
    phone=models.CharField('Ventas',max_length=40)
    office=models.CharField('Oficina',max_length=40)
    service=models.CharField('Servicio',max_length=40)
    whatsapp=models.CharField('WhatsApp (país y número, sin +)',max_length=18,validators=[RegexValidator(r'^\d{8,18}$','Escribe solo dígitos, incluyendo el código de país.')])
    email=models.EmailField('Correo',blank=True)
    address=models.CharField('Dirección',max_length=250)
    hours=models.CharField('Horario',max_length=180)
    facebook=models.URLField('Facebook',blank=True)
    instagram=models.URLField('Instagram',blank=True)
    linkedin=models.URLField('LinkedIn',blank=True)
    youtube=models.URLField('YouTube',blank=True)
    logo=image_fk(verbose_name='Logo',related_name='site_logos',null=True,blank=True)
    hero_image=image_fk(verbose_name='Imagen del Hero',related_name='site_heroes',null=True,blank=True)
    hero_title=models.CharField('Título del Hero',max_length=180,default='Maquinaria para hacer avanzar tus proyectos.')
    hero_description=models.TextField('Descripción del Hero',default='Soluciones en maquinaria agrícola, construcción e implementos, con respaldo comercial y servicio técnico.')
    company_title=models.CharField('Título de empresa',max_length=180,default='Maquinaria que mueve proyectos.')
    company_description=models.TextField('Descripción de empresa',default='Maquinaria agrícola, construcción e implementos, con asesoría, repuestos y servicio técnico.')
    seo_description=models.CharField('Descripción SEO',max_length=250,default='Maquinaria agrícola, construcción, implementos, repuestos y servicio técnico.')
    class Meta:verbose_name='configuración general';verbose_name_plural='Configuración general';constraints=[models.CheckConstraint(condition=models.Q(id=1),name='singleton_site')]
    def __str__(self):return 'Configuración de Morgillo'
    def save(self,*args,**kwargs):self.id=1;super().save(*args,**kwargs)
