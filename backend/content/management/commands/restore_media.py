import hashlib
from pathlib import Path

from django.core.exceptions import ValidationError
from django.core.files import File
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from content.database_transfer import file_digest, safe_media_path
from content.models import MediaAsset, PersistentMediaFile
from content.validators import validate_upload


class Command(BaseCommand):
    help = "Restaura los archivos de la biblioteca en almacenamiento persistente sin cambiar sus referencias."

    def add_arguments(self, parser):
        parser.add_argument("--source", required=True, help="Carpeta media original de la PC.")
        parser.add_argument("--dry-run", action="store_true", help="Verificar el origen sin guardar archivos.")

    def handle(self, *args, **options):
        root = Path(options["source"]).resolve()
        names = sorted(set(MediaAsset.objects.values_list("file", flat=True)))
        plan = []
        # Check every source file before creating anything; existing files are never replaced.
        for name in names:
            path = safe_media_path(root, name)
            if not path.is_file():
                raise CommandError(f"Falta un archivo original: {name}. No se cambió la biblioteca.")
            try:
                with path.open("rb") as source:
                    validate_upload(File(source, name=name))
            except ValidationError as error:
                raise CommandError(f"Archivo original inválido: {name}.") from error
            digest = file_digest(path)
            size = path.stat().st_size
            existing = PersistentMediaFile.objects.filter(pk=name).only("sha256", "size").first()
            if existing and (existing.sha256 != digest or existing.size != size):
                raise CommandError(f"El destino contiene otro archivo con ese nombre: {name}. No se sobrescribe.")
            plan.append((name, path, digest, size))
        self.stdout.write(f"Origen verificado: {len(plan)} archivos, {sum(item[3] for item in plan)} bytes.")
        if options["dry_run"]:
            return
        created = 0
        for index, (name, path, digest, size) in enumerate(plan, start=1):
            payload = path.read_bytes()
            if len(payload) != size or hashlib.sha256(payload).hexdigest() != digest:
                raise CommandError("El origen cambió durante el traslado. Repite con los archivos originales.")
            with transaction.atomic():
                stored, was_created = PersistentMediaFile.objects.get_or_create(
                    name=name, defaults={"data": payload, "size": size, "sha256": digest},
                )
                if stored.size != size or stored.sha256 != digest or hashlib.sha256(bytes(stored.data)).hexdigest() != digest:
                    raise CommandError(f"El archivo guardado no coincide con el original: {name}.")
            created += int(was_created)
            if index % 10 == 0 or index == len(plan):
                self.stdout.write(f"Verificados {index}/{len(plan)} archivos.")
        self.stdout.write(self.style.SUCCESS(f"Biblioteca restaurada: {created} archivos nuevos y {len(plan)-created} ya existentes, todos verificados."))
