"""Crea configuración de desarrollo sin sobrescribir archivos existentes."""
from pathlib import Path
import secrets
root=Path(__file__).resolve().parent
backend=root/'.env'
if not backend.exists():
    backend.write_text('DJANGO_DEBUG=true\nDJANGO_SECRET_KEY='+secrets.token_urlsafe(60)+'\nDJANGO_ALLOWED_HOSTS=localhost,127.0.0.1\nDB_ENGINE=sqlite\n',encoding='utf-8')
    print('Creado backend/.env con clave única.')
else: print('backend/.env existente: conservado.')
frontend=root.parent/'.env.local'
if not frontend.exists():
    frontend.write_text('CONTENT_SOURCE=cms\nCMS_INTERNAL_URL=http://127.0.0.1:8000\n',encoding='utf-8')
    print('Creado .env.local: frontend conectado al CMS local.')
else:print('.env.local existente: conservado. Revisa CONTENT_SOURCE y CMS_INTERNAL_URL.')
