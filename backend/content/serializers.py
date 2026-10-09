from django.db.models import Q
from django.utils import timezone
from .models import Product,Brand,Category,Campaign,Article,Event,Service,SiteSettings

def media_url(asset):return f'/cms-media/{asset.pk}' if asset else ''
def asset_data(asset):return {'id':str(asset.pk),'url':media_url(asset),'alt':asset.alt,'kind':asset.kind}
def brand_data(b):return {'id':b.slug,'name':b.name,'description':b.description,'image':media_url(b.image),'primary':b.primary}
def category_data(c):return {'id':c.slug,'name':c.name,'brand':c.subtitle,'description':c.description,'image':media_url(c.image)}
def product_data(p):return {'id':str(p.pk),'slug':p.slug,'name':p.name,'model':p.model,'brandId':p.brand.slug if p.brand else '', 'category':p.category.slug,'description':p.description,'images':[asset_data(i.asset) for i in p.gallery.all()],'documents':[asset_data(d.asset) for d in p.documents.all()],'specifications':[{'label':s.label,'value':s.value,'unit':s.unit} for s in p.specifications.all()],'featured':p.featured,'published':p.published,'mock':p.mock}
def campaign_data(c):return {'id':str(c.pk),'title':c.title,'subtitle':c.subtitle,'description':c.description,'desktopImage':media_url(c.desktop_image),'mobileImage':media_url(c.mobile_image or c.desktop_image),'start':c.start.isoformat(),'end':c.end.isoformat(),'place':c.place,'buttonText':c.button_text,'href':c.href,'active':c.active,'placements':(['home'] if c.show_home else [])+(['popup'] if c.show_popup else []),'frequency':c.frequency,'paths':[p.strip() for p in c.paths.splitlines() if p.strip()]}
def article_data(a):
    data={'slug':a.slug,'title':a.title,'excerpt':a.excerpt,'body':a.body,'image':media_url(a.image),'publishedAt':a.published_at.isoformat(),'published':a.published}
    if isinstance(a,Event):data.update(start=a.start.isoformat(),end=a.end.isoformat(),place=a.place)
    return data

def campaign_payload():
    now=timezone.now()
    # No se entregan campañas inactivas, futuras ni vencidas. El frontend consulta cada 30 s.
    return {'serverNow':now.isoformat(),'campaigns':[campaign_data(c) for c in Campaign.objects.filter(active=True,start__lte=now,end__gte=now).select_related('desktop_image','mobile_image')]}

def site_data(s):
    return {'name':s.name,'url':s.url,'phone':s.phone,'office':s.office,'service':s.service,'whatsapp':s.whatsapp,'email':s.email,'address':s.address,'hours':s.hours,'logo':media_url(s.logo),'heroImage':media_url(s.hero_image),'heroTitle':s.hero_title,'heroDescription':s.hero_description,'companyTitle':s.company_title,'companyDescription':s.company_description,'seoDescription':s.seo_description,'social':[{'label':label,'href':getattr(s,key)} for key,label in [('facebook','Facebook'),('instagram','Instagram'),('linkedin','LinkedIn'),('youtube','YouTube')] if getattr(s,key)]}

def content_payload():
    now=timezone.now()
    site=SiteSettings.objects.select_related('logo','hero_image').first()
    if not site:raise ValueError('Ejecuta python manage.py seed_initial.')
    products=Product.objects.filter(published=True,category__published=True).filter(Q(brand__isnull=True)|Q(brand__active=True)).select_related('brand','category').prefetch_related('gallery__asset','documents__asset','specifications')
    return {'products':[product_data(p) for p in products],'brands':[brand_data(b) for b in Brand.objects.filter(active=True).select_related('image')],'categories':[category_data(c) for c in Category.objects.filter(published=True).select_related('image')],'articles':[article_data(a) for a in Article.objects.filter(published=True,published_at__lte=now).select_related('image')],'events':[article_data(e) for e in Event.objects.filter(published=True,published_at__lte=now).select_related('image')],'services':[{'slug':s.slug,'title':s.title,'description':s.description,'requirements':s.requirements.splitlines()} for s in Service.objects.filter(published=True)],'site':site_data(site),**campaign_payload()}
