"""Media storage for local development and the Render trial."""
from django.core.exceptions import ImproperlyConfigured


def media_storage_config(environ, database_engine):
    default = "database" if environ.get("RENDER", "").lower() == "true" else "filesystem"
    mode = environ.get("MEDIA_STORAGE", default).strip().lower()
    if mode == "filesystem":
        return {"BACKEND": "django.core.files.storage.FileSystemStorage"}
    if mode == "database":
        if database_engine != "django.db.backends.postgresql":
            raise ImproperlyConfigured("MEDIA_STORAGE=database requiere PostgreSQL.")
        return {"BACKEND": "content.storage.DatabaseMediaStorage"}
    raise ImproperlyConfigured("MEDIA_STORAGE debe ser filesystem o database.")
