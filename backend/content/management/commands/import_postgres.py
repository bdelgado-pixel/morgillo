import shutil
import zipfile
from pathlib import Path

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.db import connections, transaction

from content.database_transfer import file_digest, load_bundle, record_digest, records_from_database, safe_media_path, transfer_models


class Command(BaseCommand):
    help = "Importa un respaldo verificado en PostgreSQL vacío y conserva los accesos al CMS."

    def add_arguments(self, parser):
        parser.add_argument("bundle", help="Directorio generado por export_sqlite.")

    def handle(self, *args, **options):
        connection = connections["default"]
        if connection.vendor != "postgresql":
            raise CommandError("Configura DATABASE_URL de PostgreSQL antes de importar. SQLite no se modifica.")
        directory, manifest = load_bundle(options["bundle"])
        media_root = Path(settings.MEDIA_ROOT).resolve()
        with zipfile.ZipFile(directory / "media.zip") as archive:
            members = archive.infolist()
            if len(members) != len(manifest["media"]) or {member.filename for member in members} != set(manifest["media"]):
                raise CommandError("El listado multimedia no coincide con el respaldo.")
            for name, digest in manifest["media"].items():
                target = safe_media_path(media_root, name)
                if target.exists() and (not target.is_file() or file_digest(target) != digest):
                    raise CommandError("MEDIA_ROOT ya contiene un archivo diferente. Usa una carpeta de destino vacía.")
            call_command("migrate", database="default", interactive=False, stdout=self.stdout, verbosity=options["verbosity"])
            with transaction.atomic():
                # Serialize concurrent imports and refuse to overwrite existing CMS data.
                with connection.cursor() as cursor:
                    cursor.execute("SELECT pg_advisory_xact_lock(726674552102)")
                if any(model._base_manager.exists() for model in transfer_models()):
                    raise CommandError("La base de destino contiene datos. Usa una base PostgreSQL nueva y vacía.")
                call_command("loaddata", str(directory / "data.json"), database="default", stdout=self.stdout, verbosity=options["verbosity"])
                actual = {model._meta.label_lower: model._base_manager.count() for model in transfer_models()}
                if actual != manifest["counts"] or record_digest(records_from_database()) != manifest["records_sha256"]:
                    raise CommandError("Los datos importados no coinciden con SQLite. Se revierte la importación.")
                for name, digest in manifest["media"].items():
                    target = safe_media_path(media_root, name)
                    if not target.exists():
                        target.parent.mkdir(parents=True, exist_ok=True)
                        with archive.open(name) as source, target.open("xb") as output:
                            shutil.copyfileobj(source, output, length=1024 * 1024)
                    if file_digest(target) != digest:
                        raise CommandError("Un archivo multimedia no superó la verificación. Se revierte la importación.")
        self.stdout.write(self.style.SUCCESS("PostgreSQL verificado: contenido, relaciones, permisos y archivos coinciden con el respaldo."))
        self.stdout.write("Se conservan los usuarios y sus contraseñas. Las sesiones se inician de nuevo.")
