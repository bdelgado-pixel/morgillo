import copy
import hashlib
import json
import sqlite3
import uuid
import zipfile
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path

from django.apps import apps
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connections

from content.database_transfer import file_digest, record_digest, records_from_database, safe_media_path, transfer_models


class Command(BaseCommand):
    help = "Respalda SQLite, contenido, usuarios y media para importar en PostgreSQL."

    def add_arguments(self, parser):
        parser.add_argument("--output", required=True, help="Directorio nuevo para el respaldo privado.")

    def handle(self, *args, **options):
        source = connections["default"]
        if source.vendor != "sqlite":
            raise CommandError("Ejecuta export_sqlite con la conexión SQLite de origen.")
        directory = Path(options["output"]).resolve()
        try:
            directory.mkdir(parents=True, exist_ok=False)
        except FileExistsError:
            raise CommandError("El directorio ya existe. Usa otro nombre para conservar ese respaldo.") from None
        source.ensure_connection()
        snapshot = directory / "db.sqlite3"
        with closing(sqlite3.connect(snapshot)) as destination:
            source.connection.backup(destination)
            if destination.execute("PRAGMA integrity_check").fetchone()[0] != "ok" or destination.execute("PRAGMA foreign_key_check").fetchall():
                raise CommandError("La copia SQLite no superó la verificación de integridad.")

        alias = "snapshot_" + uuid.uuid4().hex
        config = copy.deepcopy(source.settings_dict)
        config["NAME"] = snapshot
        connections.databases[alias] = config
        try:
            records = records_from_database(alias)
            counts = {model._meta.label_lower: model._base_manager.using(alias).count() for model in transfer_models()}
            media_root = Path(settings.MEDIA_ROOT).resolve()
            references = apps.get_model("content.MediaAsset").objects.using(alias).values_list("file", flat=True)
            if any(not safe_media_path(media_root, name).is_file() for name in references):
                raise CommandError("Faltan imágenes o PDF registrados. Completa MEDIA_ROOT antes de exportar.")
        finally:
            connections[alias].close()
            del connections[alias]
            del connections.databases[alias]

        (directory / "data.json").write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
        media_hashes = {}
        with zipfile.ZipFile(directory / "media.zip", "w", compression=zipfile.ZIP_DEFLATED, compresslevel=1) as archive:
            for path in sorted(media_root.rglob("*")):
                if not path.is_file():
                    continue
                name = path.relative_to(media_root).as_posix()
                safe_media_path(media_root, name)
                if path.is_symlink():
                    raise CommandError("MEDIA_ROOT contiene enlaces simbólicos; revisa el respaldo.")
                digest = hashlib.sha256()
                with path.open("rb") as source_file, archive.open(name, "w", force_zip64=True) as output:
                    for chunk in iter(lambda: source_file.read(1024 * 1024), b""):
                        output.write(chunk)
                        digest.update(chunk)
                media_hashes[name] = digest.hexdigest()
        manifest = {
            "format_version": 1,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "counts": counts,
            "records_sha256": record_digest(records),
            "sha256": {name: file_digest(directory / name) for name in ("data.json", "db.sqlite3", "media.zip")},
            "media": media_hashes,
        }
        (directory / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
        self.stdout.write(self.style.SUCCESS(f"Respaldo verificado: {directory}"))
        self.stdout.write(f"{len(records)} registros y {len(media_hashes)} archivos. SQLite original conservado.")
