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

# =========================================================
# MORGILLO - REGISTRO DE CLIENTES INTERESADOS
# =========================================================

import os
import json
import re
import hmac

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone

from .models import ClienteInteresado


@csrf_exempt
@require_POST
def registrar_interesado(request):

    # Clave privada para proteger la API
    secreto = os.environ.get(
        "MORGILLO_LEADS_TOKEN", ""
    )

    recibido = request.headers.get(
        "X-Morgillo-Token", ""
    )

    if not secreto or not hmac.compare_digest(
        secreto, recibido
    ):
        return JsonResponse(
            {"error": "No autorizado"},
            status=403
        )

    # Limitar tamaño de la solicitud
    if len(request.body) > 4096:
        return JsonResponse(
            {"error": "Solicitud demasiado grande"},
            status=413
        )

    # Leer datos del cliente
    try:
        datos = json.loads(request.body)
    except (ValueError, UnicodeDecodeError):
        return JsonResponse(
            {"error": "Datos inválidos"},
            status=400
        )

    if not isinstance(datos, dict):
        return JsonResponse(
            {"error": "Formato inválido"},
            status=400
        )

    campos = [
        "nombre",
        "celular",
        "ciudad",
        "maquina",
        "modelo",
        "origen",
    ]

    if any(
        not isinstance(datos.get(campo, ""), str)
        for campo in campos
    ):
        return JsonResponse(
            {"error": "Campos inválidos"},
            status=400
        )

    nombre = datos.get("nombre", "").strip()

    celular = re.sub(
        r"\s+", "", datos.get("celular", "")
    )

    ciudad = datos.get("ciudad", "").strip()
    maquina = datos.get("maquina", "").strip()
    modelo = datos.get("modelo", "").strip()
    origen = datos.get("origen", "").strip()

    # Validar los campos
    if not (
        2 <= len(nombre) <= 100
        and 2 <= len(ciudad) <= 100
        and 1 <= len(maquina) <= 100
        and len(modelo) <= 100
        and len(origen) <= 250
        and re.fullmatch(r"9\d{8}", celular)
    ):
        return JsonResponse(
            {"error": "Revisa los datos ingresados"},
            status=400
        )

    # Verificar autorización del cliente
    if datos.get("consentimiento") is not True:
        return JsonResponse(
            {"error": "Falta autorización de contacto"},
            status=400
        )

    # Guardar contacto en Django
    cliente = ClienteInteresado.objects.create(
        nombre=nombre,
        celular=celular,
        ciudad=ciudad,
        maquina=maquina,
        modelo=modelo,
        origen=origen,
        consentimiento_at=timezone.now(),
    )

    return JsonResponse(
        {
            "ok": True,
            "id": cliente.pk,
        },
        status=201
    )
