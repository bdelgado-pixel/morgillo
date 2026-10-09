# Contenido del frontend aprobado

La copia `frontend-2026-10-09` permite reconstruir el contenido publicado el
9 de octubre de 2026: 26 equipos, 6 marcas, 3 categorías, 45 imágenes de
productos y 29 enlaces a documentos técnicos. Incluye los nuevos fondos de
Kubota, Kobelco y BULL y el contenido publicado de AgriExpo 2026.

- `content.json`: registros de los modelos de contenido de Django.
- `media/`: 86 archivos referenciados por esos registros.
- `manifest.json`: tamaños y huellas SHA-256 para verificar los archivos.

La copia incluye contenido destinado a la web. La base de datos de trabajo,
los usuarios del administrador, las credenciales y las variables de entorno
se mantienen fuera de Git.

## Restaurar en una instalación nueva

Prepara el entorno siguiendo `CONEXIONES_CMS.md`. Con una base de datos vacía,
ejecuta estos comandos desde `backend/` en PowerShell:

```powershell
.\.venv\Scripts\python.exe manage.py migrate
New-Item -ItemType Directory -Path '.\media\library' -Force | Out-Null
Get-ChildItem -LiteralPath '.\content-snapshots\frontend-2026-10-09\media\library' -File | Copy-Item -Destination '.\media\library'
.\.venv\Scripts\python.exe manage.py loaddata content-snapshots/frontend-2026-10-09/content.json
.\.venv\Scripts\python.exe manage.py createsuperuser
```

`loaddata` conserva las claves de los registros de esta copia. Úsalo en una
base nueva; en una base existente puede reemplazar registros con las mismas
claves. Para conservar cambios posteriores del CMS, respalda primero esa base
y revisa los registros que deseas importar.

El contenido restaurado se sirve mediante la API de Django y sigue siendo
administrable desde el CMS.
