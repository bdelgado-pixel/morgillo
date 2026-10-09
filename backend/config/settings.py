import os
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')
def flag(key, default=False): return os.environ.get(key, str(default)).lower() in ('1', 'true', 'yes')
DEBUG = flag('DJANGO_DEBUG')
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', '')
if not SECRET_KEY: raise ImproperlyConfigured('Ejecuta python setup_local.py o define DJANGO_SECRET_KEY.')
ALLOWED_HOSTS = [v.strip() for v in os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',') if v.strip()]
CSRF_TRUSTED_ORIGINS = [v.strip() for v in os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS', '').split(',') if v.strip()]
INSTALLED_APPS = ['content.admin_site.MorgilloAdminConfig','django.contrib.auth','django.contrib.contenttypes','django.contrib.sessions','django.contrib.messages','django.contrib.staticfiles','content.apps.ContentConfig']
MIDDLEWARE = ['django.middleware.security.SecurityMiddleware','whitenoise.middleware.WhiteNoiseMiddleware','django.contrib.sessions.middleware.SessionMiddleware','django.middleware.common.CommonMiddleware','django.middleware.csrf.CsrfViewMiddleware','django.contrib.auth.middleware.AuthenticationMiddleware','django.contrib.messages.middleware.MessageMiddleware','django.middleware.clickjacking.XFrameOptionsMiddleware']
ROOT_URLCONF = 'config.urls'
TEMPLATES = [{'BACKEND':'django.template.backends.django.DjangoTemplates','DIRS':[BASE_DIR/'templates'],'APP_DIRS':True,'OPTIONS':{'context_processors':['django.template.context_processors.request','django.contrib.auth.context_processors.auth','django.contrib.messages.context_processors.messages']}}]
WSGI_APPLICATION = 'config.wsgi.application'
if os.environ.get('DB_ENGINE', 'sqlite') == 'postgres':
    DATABASES = {'default': {'ENGINE':'django.db.backends.postgresql','NAME':os.environ['DB_NAME'],'USER':os.environ['DB_USER'],'PASSWORD':os.environ['DB_PASSWORD'],'HOST':os.environ.get('DB_HOST','127.0.0.1'),'PORT':os.environ.get('DB_PORT','5432'),'CONN_MAX_AGE':60,'OPTIONS':{'sslmode':os.environ.get('DB_SSLMODE','prefer')}}}
else:
    DATABASES = {'default': {'ENGINE':'django.db.backends.sqlite3','NAME':BASE_DIR/'db.sqlite3','OPTIONS':{'timeout':20}}}
AUTH_PASSWORD_VALIDATORS = [{'NAME':'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},{'NAME':'django.contrib.auth.password_validation.MinimumLengthValidator','OPTIONS':{'min_length':12}},{'NAME':'django.contrib.auth.password_validation.CommonPasswordValidator'},{'NAME':'django.contrib.auth.password_validation.NumericPasswordValidator'}]
LANGUAGE_CODE = 'es-pe'
TIME_ZONE = 'America/Lima'
USE_I18N = True
USE_TZ = True
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR/'static']
MEDIA_ROOT = Path(os.environ.get('MEDIA_ROOT', str(BASE_DIR/'media')))
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
STORAGES = {'default':{'BACKEND':'django.core.files.storage.FileSystemStorage'},'staticfiles':{'BACKEND':'whitenoise.storage.CompressedManifestStaticFilesStorage'}}
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_AGE = 28800
SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_SSL_REDIRECT = flag('DJANGO_SECURE_SSL_REDIRECT', not DEBUG)
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
# Activar solo detrás de un proxy propio que sustituya este encabezado.
if flag('DJANGO_TRUST_PROXY'): SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
FILE_UPLOAD_MAX_MEMORY_SIZE = 2 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024
FILE_UPLOAD_PERMISSIONS = 0o644

