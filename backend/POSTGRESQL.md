# PostgreSQL de prueba en Render

El origen conservado es `backend/db.sqlite3`. La configuración habitual `.env`
ahora usa PostgreSQL de prueba en Render. La configuración SQLite anterior
se conserva en `.env.sqlite`. El backend acepta `DATABASE_URL`
de Render o las variables `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` y
`DB_PORT`. `DATABASE_URL` tiene prioridad; una conexión PostgreSQL inválida
produce un error en lugar de cambiar silenciosamente a SQLite.

## Respaldo del 10 de octubre de 2026

`backups/render-prueba-2026-10-10/` contiene 362 registros y 164 archivos:

- `db.sqlite3`: copia consistente del origen, incluidos sus datos internos.
- `data.json`: contenido, usuarios, grupos y registro de administración.
- `media.zip`: imágenes, PDF y otros archivos de MEDIA_ROOT.
- `manifest.json`: cantidades y hashes para verificar el traslado.

Los respaldos y `.env` privados se excluyen de Git. La importación conserva los
usuarios y contraseñas; las sesiones se inician de nuevo. Los permisos estándar
se regeneran mediante migraciones y las asignaciones a usuarios/grupos se
restauran mediante claves naturales.

## Importar desde la PC

Copiar **External Database URL** de Render y pegarla completa después de
`DATABASE_URL=` en `backend/.env.render`. Ese archivo privado conserva la clave
local de Django y exige SSL. Desde PowerShell, en la carpeta `backend`:

```powershell
$env:DJANGO_ENV_FILE = '.env.render'
.\.venv\Scripts\python.exe manage.py import_postgres backups\render-prueba-2026-10-10
.\.venv\Scripts\python.exe manage.py check --database default
```

La herramienta prepara las tablas, exige una base vacía y verifica que valores,
cantidades y relaciones coincidan exactamente. Django reajusta las secuencias
al cargar la fixture para permitir nuevos registros. Si los datos no coinciden,
se revierte la transacción. Los archivos existentes solo se reutilizan si son
idénticos; no se sobrescriben. SQLite original se conserva.

Para probar el CMS local contra PostgreSQL, detener el servidor local anterior
y, en esa misma terminal con `DJANGO_ENV_FILE` definido, ejecutar:

```powershell
.\.venv\Scripts\python.exe manage.py runserver
```

Para usar el respaldo SQLite local, definir `DJANGO_ENV_FILE=.env.sqlite`.
Sin esa variable, el `.env` habitual ahora conecta con PostgreSQL de Render.
No repetir la importación sobre una base PostgreSQL que ya tenga contenido.

Si cambia el contenido antes del traslado final, suspender las ediciones del CMS
y generar un respaldo nuevo usando la configuración SQLite de origen:

```powershell
$env:DJANGO_ENV_FILE = '.env.sqlite'
.\.venv\Scripts\python.exe manage.py export_sqlite --output backups\nuevo-respaldo
```

## Posterior alojamiento de Django en Render

- Root Directory: `backend`.
- Build: `pip install -r requirements.txt && python manage.py collectstatic --noinput`.
- Start: `python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`.
- `DATABASE_URL`: **Internal Database URL** de la misma base y región.
- `DB_ENGINE=postgres`, `DJANGO_DEBUG=false`, `DJANGO_TRUST_PROXY=true`.
- `DJANGO_SECRET_KEY`: clave privada definida en el servicio.
- Dominios propios: `DJANGO_ALLOWED_HOSTS` y `DJANGO_CSRF_TRUSTED_ORIGINS`.
  El dominio de Render se incorpora desde `RENDER_EXTERNAL_HOSTNAME`.

En Vercel: `CONTENT_SOURCE=cms` y
`CMS_INTERNAL_URL=https://<dominio-del-backend>.onrender.com`.
Vercel consulta Django; las credenciales PostgreSQL pertenecen al backend.

Esta fase usa la base gratuita de prueba. Según los [límites de Render](https://render.com/docs/free),
caduca a los 30 días y el servicio web gratuito tiene un sistema de archivos
efímero. Antes de alojar el CMS hay que resolver el almacenamiento de fotos y
PDF; migrar la base no copia los archivos al servidor Django.

Referencias: [Django PostgreSQL](https://docs.djangoproject.com/en/5.2/ref/databases/#postgresql-notes),
[fixtures](https://docs.djangoproject.com/en/5.2/ref/django-admin/#loaddata),
[Render Django](https://render.com/docs/deploy-django).
