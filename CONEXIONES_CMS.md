# MORGILLO — CMS conectado al frontend

Esta entrega agrega un backend Django al proyecto Next.js existente. El panel está en español y usa el diseño de administración de Django personalizado con los colores de Morgillo.

## 1. Qué se conecta con qué

| Componente | Dirección local | Función |
|---|---|---|
| Web Next.js | http://localhost:3000 | Sitio público |
| Panel Django | http://127.0.0.1:8000/admin/ | Administrar contenido y usuarios |
| API de contenido | http://127.0.0.1:8000/api/content/ | Lectura de contenido publicado |
| API de campañas | http://127.0.0.1:8000/api/campaigns/ | Campañas activas según el reloj del servidor |
| Estado del backend | http://127.0.0.1:8000/api/health/ | Comprobar si Django está encendido |
| Base de datos local | `backend/db.sqlite3` | Se crea con las migraciones |
| Biblioteca de archivos | `backend/media/library/` | Imágenes y PDFs subidos |

Flujo: **panel → Django → base de datos/archivos → API → Next.js → visitante**.

Next.js consulta Django desde el servidor. El navegador no conoce contraseñas de la base de datos ni necesita una clave del administrador. La API pública es solo de lectura: las escrituras se hacen en el panel autenticado, con permisos y protección CSRF.

## 2. Instalación en Windows / VS Code

Requisitos: Python 3.12 y Node.js 22.18 o superior. Extrae el ZIP en una carpeta nueva y abre `morgillo-web` en VS Code. Conserva tu carpeta anterior.

### Terminal 1 — backend

Desde la raíz `morgillo-web`, ejecuta en PowerShell:

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe setup_local.py
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py seed_initial --demo
.\.venv\Scripts\python.exe manage.py createsuperuser
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

`createsuperuser` te pedirá el usuario, correo y contraseña. La contraseña no se muestra mientras la escribes. No hay credenciales predefinidas en el proyecto.

`seed_initial --demo` carga las marcas, categorías, imágenes, configuración y las cuatro fichas de demostración del frontend anterior. **No son ofertas ni modelos comerciales confirmados**. Para empezar con catálogo vacío utiliza `seed_initial` sin `--demo`. El comando conserva los registros existentes y no duplica la carga al repetirlo.

No necesitas activar el entorno virtual: los comandos usan directamente su Python. Esto evita problemas con las políticas de ejecución de PowerShell.

### Terminal 2 — frontend

Abre otra terminal en la raíz `morgillo-web`:

```powershell
npm ci
npm run dev
```

Entra a http://localhost:3000 para ver la web y a http://127.0.0.1:8000/admin/ para administrar. **Ambas terminales deben permanecer abiertas.**

Si `py` no existe, instala Python con su lanzador o usa `python -m venv .venv`.

### Linux/macOS

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python setup_local.py
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed_initial --demo
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py runserver 127.0.0.1:8000
```

En otra terminal, desde la raíz: `npm ci` y `npm run dev`.

## 3. Archivos de conexión

`setup_local.py` crea estos dos archivos si no existen; nunca los sobrescribe:

### Frontend: `.env.local` en la raíz

```dotenv
CONTENT_SOURCE=cms
CMS_INTERNAL_URL=http://127.0.0.1:8000
```

`CMS_INTERNAL_URL` es la dirección que **el servidor Next.js** puede alcanzar. No añadas `/api/` al final. Reinicia Next.js si cambias esta variable.

`CONTENT_SOURCE=mock` permite ver las fichas de ejemplo sin Django, pero no refleja los cambios del panel. La configuración habitual debe ser `cms`. Si el CMS falla, el sitio no sustituye silenciosamente su contenido por mocks.

### Backend: `backend/.env`

```dotenv
DJANGO_DEBUG=true
DJANGO_SECRET_KEY=CLAVE_UNICA_GENERADA_POR_SETUP_LOCAL
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=sqlite
```

El script genera una clave criptográfica única. Conserva ese valor: el texto de arriba es solo una explicación. Reinicia Django al cambiar su configuración.

SQLite no necesita usuario, contraseña ni XAMPP. Sus tablas se crean con `migrate`.

## 4. Uso del CMS

### Biblioteca multimedia

- Abre **Biblioteca multimedia → Añadir**.
- Escribe un título y un texto alternativo; elige el archivo de tu dispositivo.
- Se aceptan JPG, PNG, WebP y PDF de hasta 15 MB; las imágenes se validan también por contenido y dimensiones.
- En los demás formularios usa el buscador **Seleccionar de biblioteca** para reutilizar el archivo.
- El botón **+** al lado del selector abre una ventana para subir un archivo nuevo y después seleccionarlo.
- No se permite eliminar un archivo referenciado por una marca, producto, campaña o configuración. Retira o cambia primero esas referencias.

Esta biblioteca es para archivos públicos del sitio. No contiene un área de documentos privados. Los archivos se sirven por identificador y no se ejecutan como código. Los PDFs se descargan como documentos.

### Productos

1. Entra a **Productos → Añadir**.
2. Completa nombre, modelo, URL, marca, categoría y descripción.
3. Agrega imágenes a la galería y define su orden.
4. Agrega especificaciones con característica, valor y unidad.
5. Agrega PDFs desde la biblioteca.
6. Marca **Publicado** para mostrarlo y **Destacado en Inicio** si corresponde.
7. Desmarca **Ficha de demostración** solo cuando los datos estén confirmados.

Despublicar mantiene el registro en el panel y lo retira de la API y del sitio. También puedes eliminarlo con la confirmación de Django. Las marcas y categorías utilizadas están protegidas contra borrado accidental.

Las tres categorías principales son Agrícola, Construcción e Implementos. Sus textos e imágenes son editables. Puedes crear otras marcas; **Marca principal** controla el protagonismo en Inicio y navegación. Las otras aparecen en el catálogo y la página general de marcas.

### Campañas y popup

- **Inicio/fin de publicación** se introducen en hora de Perú (`America/Lima`).
- Configura imagen para escritorio, imagen para móvil, texto y enlace del botón.
- Marca **Activa** y elige **Inicio**, **Popup** o ambos.
- La frecuencia inicial es **una vez por sesión de pestaña**. También admite cada visita o una vez al día del visitante.
- En **Rutas** escribe una por línea. Vacío permite todas; `/` limita al inicio.
- Si coinciden varias, se utiliza primero la menor prioridad numérica y después la fecha de inicio más reciente.
- Django solo entrega campañas activas dentro del periodo vigente. Una pestaña abierta vuelve a consultar cada 30 segundos; las campañas ya cargadas vencen mediante un control cada segundo con referencia al reloj del servidor.
- Las fechas de un evento son independientes de la campaña que lo anuncia: puedes promocionarlo antes de que empiece.

### Eventos y novedades

Completa título, URL, resumen, contenido e imagen. Solo aparecen si **Publicado** está marcado y la fecha de publicación ya llegó. Los eventos agregan lugar y fechas del evento. El contenido se presenta como texto; no se ejecuta HTML escrito en el editor.

### Configuración general

Edita ventas, oficina, servicio, WhatsApp, correo, dirección, horario, redes sociales, logo, Hero, texto de empresa y descripción SEO. El número de WhatsApp lleva código de país y solo dígitos.

La **URL pública del frontend** empieza en `http://localhost:3000`. Al desplegar, cámbiala al dominio real para que metadata, sitemap y robots apunten al sitio correcto.

### Usuarios y permisos

El superusuario administra todo. Para otra persona, crea un usuario, activa **Es staff** y asígnalo al grupo **Editores de contenido**, creado por `seed_initial`. Ese grupo puede gestionar contenido; no administra usuarios. Puedes quitar permisos concretos en el panel. Desactiva usuarios que ya no deban acceder.

## 5. PostgreSQL opcional

Para desarrollo puedes mantener SQLite. Para una instalación con varios administradores y producción, configura PostgreSQL.

1. Crea una base de datos y un usuario propietario en PostgreSQL (por ejemplo mediante pgAdmin).
2. Cambia `backend/.env`:

```dotenv
DB_ENGINE=postgres
DB_NAME=morgillo
DB_USER=morgillo
DB_PASSWORD=TU_CONTRASENA_PRIVADA
DB_HOST=127.0.0.1
DB_PORT=5432
DB_SSLMODE=prefer
```

3. Ejecuta `manage.py migrate`, `seed_initial` y `createsuperuser` con el Python del entorno virtual.

Usa `DB_SSLMODE=require` si tu proveedor exige SSL, o la configuración con verificación de certificado que indique el proveedor. El servidor de Next.js sigue leyendo la API; **no se conecta directamente a PostgreSQL**.

Cambiar `DB_ENGINE` no copia los datos existentes. Si ya editaste contenido en SQLite, expórtalo antes del cambio, conserva la carpeta multimedia y migra los datos. En una instalación nueva solo debes ejecutar las migraciones y la carga inicial. No uses `--demo` al cargar un catálogo comercial real.

## 6. Producción y persistencia

Esta entrega se probó localmente con SQLite. No se configuró ninguna cuenta de hosting ni una base de datos remota.

- Ejecuta Next.js con `npm run build` y `npm run start` en un servidor Node.
- En Django usa `DJANGO_DEBUG=false`, una `DJANGO_SECRET_KEY` privada y `DJANGO_ALLOWED_HOSTS` con el dominio del CMS.
- Añade su origen HTTPS a `DJANGO_CSRF_TRUSTED_ORIGINS`, por ejemplo `https://cms.tudominio.com`.
- Ejecuta `python manage.py migrate` y `python manage.py collectstatic --noinput`.
- En Linux, inicia Django con `gunicorn config.wsgi:application --bind 127.0.0.1:8000` desde `backend`.
- Publica ambos servicios detrás de HTTPS. Usa `DJANGO_TRUST_PROXY=true` únicamente si tu proxy de confianza reemplaza `X-Forwarded-Proto`; así Django reconoce HTTPS correctamente. Evita exponer el puerto interno directamente.
- `CMS_INTERNAL_URL` debe apuntar al backend desde el host de Next.js. Si son contenedores separados, utiliza el nombre del servicio o su URL, no `127.0.0.1`.
- Define `MEDIA_ROOT` hacia un **volumen persistente**. Conserva también la base de datos. No uses almacenamiento efímero para la biblioteca.
- WhiteNoise sirve los archivos estáticos del administrador. Los medios se sirven desde Django mediante respuesta de archivo y Next.js los expone por `/cms-media/<id>`; no hace falta permitir dominios de imágenes arbitrarios ni configurar CORS.
- Protege el acceso al administrador y limita intentos de login en el proxy del despliegue.

Comprobación previa: `python manage.py check --deploy` con las variables de producción cargadas.

### Copias de seguridad

Respalda conjuntamente la base de datos y `MEDIA_ROOT`. Una copia de la base de datos sin imágenes no restaura el sitio completo. En SQLite, detén las escrituras o usa una herramienta de copia consistente. Para PostgreSQL utiliza `pg_dump` y las copias que ofrezca tu proveedor. Conserva `.env` por separado de forma privada.

Los archivos antiguos no se eliminan automáticamente del disco al sustituir o borrar un registro multimedia, para evitar pérdida de referencias y facilitar recuperación. La limpieza de archivos huérfanos debe hacerse tras un respaldo.

## 7. Actualización del contenido

Las páginas consultan el CMS sin caché de datos persistente. Tras guardar, **recarga la página** para ver el contenido actualizado; una navegación ya precargada puede conservar datos hasta recargar. No necesitas reconstruir Next.js por cada producto.

Las campañas se actualizan además cada 30 segundos mientras la página permanece abierta. Al reemplazar un archivo multimedia conservando su identificador, su versión anterior puede permanecer alrededor de 60 segundos en la caché de imágenes. Para un cambio inmediato crea un nuevo archivo y selecciónalo.

## 8. Problemas frecuentes

| Síntoma | Qué revisar |
|---|---|
| La web indica que el contenido no está disponible | Django encendido, `CMS_INTERNAL_URL`, migraciones y `seed_initial` |
| Cambios del panel no aparecen | `CONTENT_SOURCE=cms`, recargar la web, Publicado y fecha de publicación |
| Error CSRF en producción | Origen HTTPS, `CSRF_TRUSTED_ORIGINS` y encabezados del proxy |
| No se ven las imágenes | Archivo en MEDIA_ROOT, backend accesible, `/cms-media/<id>` devuelve 200 |
| No puedes borrar una marca o imagen | Tiene referencias; cambia o elimina primero esas relaciones |
| No recuerdas tu contraseña | `python manage.py changepassword TU_USUARIO` usando el Python del entorno |
| Puerto ocupado | Cierra la instancia anterior o cambia el puerto y `CMS_INTERNAL_URL` |
| Error de importación de Django | Usa `.venv\Scripts\python.exe`, no otro Python del equipo |

## 9. Verificaciones y referencias

Backend: `python manage.py check`, `python manage.py test content`.
Frontend: `npm run lint`, `npm test`, `npm run build`, `npm run typecheck`.

Resultado de validación de esta entrega: compilación, TypeScript, lint, 3 pruebas de campañas y 10 pruebas del backend correctos. Se verificó en navegador el acceso al panel, subida de imagen y PDF, creación y publicación de producto, especificaciones, descarga del PDF, despublicación, edición de portada y vista móvil. PostgreSQL queda configurable; las pruebas se ejecutaron con SQLite.

Documentación de referencia:
- https://docs.djangoproject.com/en/5.2/ref/contrib/admin/
- https://docs.djangoproject.com/en/5.2/topics/http/file-uploads/
- https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/
