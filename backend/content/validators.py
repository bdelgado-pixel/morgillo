from pathlib import Path
from urllib.parse import urlsplit
from PIL import Image, UnidentifiedImageError
from django.core.exceptions import ValidationError

def validate_link(value):
    if value.startswith('/') and not value.startswith('//') and '\\' not in value: return
    url = urlsplit(value)
    if url.scheme not in ('http','https') or not url.netloc or url.username or url.password:
        raise ValidationError('Usa una ruta interna /maquinaria o una URL http(s) completa.')

def validate_upload(file):
    if file.size > 15 * 1024 * 1024: raise ValidationError('El archivo supera 15 MB.')
    ext = Path(file.name).suffix.lower()
    try:
        file.seek(0)
        if ext == '.pdf':
            if file.read(5) != b'%PDF-': raise ValidationError('El archivo no tiene formato PDF.')
        elif ext in ('.jpg','.jpeg','.png','.webp'):
            with Image.open(file) as image:
                if image.width * image.height > 30_000_000: raise ValidationError('La imagen supera 30 megapíxeles.')
                expected = {'.jpg':'JPEG','.jpeg':'JPEG','.png':'PNG','.webp':'WEBP'}[ext]
                if image.format != expected: raise ValidationError('La extensión no coincide con el contenido de la imagen.')
                image.verify()
        else: raise ValidationError('Solo JPG, PNG, WebP y PDF.')
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as exc:
        raise ValidationError('Imagen inválida o dañada.') from exc
    finally: file.seek(0)
