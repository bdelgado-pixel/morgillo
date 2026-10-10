"""Portable CMS snapshots without copying database-specific tables or sessions."""
import hashlib
import json
from pathlib import Path, PurePosixPath

from django.apps import apps
from django.core import serializers
from django.core.management.base import CommandError


def transfer_models():
    labels = ["auth.group", "auth.user", "admin.logentry"]
    labels.extend(model._meta.label_lower for model in apps.get_app_config("content").get_models())
    return [apps.get_model(label) for label in labels]


def records_from_database(alias="default"):
    records = []
    for model in transfer_models():
        queryset = model._base_manager.using(alias).order_by(model._meta.pk.name)
        records.extend(json.loads(serializers.serialize("json", queryset, use_natural_foreign_keys=True)))
    return records


def record_digest(records):
    canonical = []
    for record in records:
        fields = dict(record["fields"])
        model = apps.get_model(record["model"])
        for field in model._meta.many_to_many:
            if field.name in fields:
                fields[field.name] = sorted(fields[field.name], key=lambda value: json.dumps(value, sort_keys=True))
        canonical.append({"model": record["model"], "pk": record["pk"], "fields": fields})
    canonical.sort(key=lambda record: (record["model"], str(record["pk"])))
    data = json.dumps(canonical, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def file_digest(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def safe_media_path(root, name):
    relative = PurePosixPath(name)
    if not name or "\\" in name or relative.is_absolute() or any(part in {".", ".."} or ":" in part for part in relative.parts):
        raise CommandError("El respaldo contiene una ruta multimedia inválida.")
    root = Path(root).resolve()
    target = (root / str(relative)).resolve()
    if not target.is_relative_to(root) or target == root:
        raise CommandError("Un archivo multimedia apunta fuera de MEDIA_ROOT.")
    return target


def load_bundle(directory):
    directory = Path(directory).resolve()
    try:
        manifest = json.loads((directory / "manifest.json").read_text(encoding="utf-8"))
        if manifest["format_version"] != 1:
            raise ValueError
        for filename in ("data.json", "db.sqlite3", "media.zip"):
            if file_digest(directory / filename) != manifest["sha256"][filename]:
                raise CommandError(f"El archivo {filename} está incompleto o fue modificado.")
        records = json.loads((directory / "data.json").read_text(encoding="utf-8"))
        expected = {model._meta.label_lower for model in transfer_models()}
        if set(manifest["counts"]) != expected or any(record["model"] not in expected for record in records):
            raise ValueError
        counts = {label: sum(record["model"] == label for record in records) for label in expected}
        if counts != manifest["counts"] or record_digest(records) != manifest["records_sha256"]:
            raise ValueError
        if not isinstance(manifest["media"], dict):
            raise ValueError
    except CommandError:
        raise
    except (OSError, ValueError, KeyError, TypeError, LookupError):
        raise CommandError("El directorio no contiene un respaldo Morgillo válido y completo.") from None
    return directory, manifest
