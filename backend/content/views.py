from django.http import JsonResponse, FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET
from django.views.decorators.cache import never_cache
from .models import MediaAsset
from .serializers import content_payload,campaign_payload
from pathlib import Path

@require_GET
@never_cache
def content(request):
    try:return JsonResponse(content_payload())
    except ValueError:return JsonResponse({'error':'CMS sin configurar. Ejecuta seed_initial.'},status=503)
@require_GET
@never_cache
def campaigns(request):return JsonResponse(campaign_payload())
@require_GET
def health(request):return JsonResponse({'status':'ok'})
@require_GET
def media(request,asset_id):
    asset=get_object_or_404(MediaAsset,pk=asset_id)
    try:file=asset.file.open('rb')
    except (FileNotFoundError,ValueError):raise Http404('Archivo no disponible')
    extension=Path(asset.file.name).suffix.lower()
    mime={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf'}[extension]
    response=FileResponse(file,content_type=mime,as_attachment=asset.kind=='pdf',filename=Path(asset.file.name).name)
    response['Cache-Control']='public, max-age=60'
    response['X-Content-Type-Options']='nosniff'
    response['Content-Security-Policy']="default-src 'none'; sandbox"
    return response
