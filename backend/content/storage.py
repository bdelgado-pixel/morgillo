"""Persist trial images/PDFs without depending on Render's local filesystem."""
import hashlib
import io

from django.apps import apps
from django.core.exceptions import ValidationError
from django.core.files import File
from django.core.files.storage import Storage
from django.db import IntegrityError, transaction
from django.utils.deconstruct import deconstructible


MAX_FILE_BYTES = 15 * 1024 * 1024


@deconstructible
class DatabaseMediaStorage(Storage):
    def _model(self):
        return apps.get_model("content.PersistentMediaFile")

    def _open(self, name, mode="rb"):
        if mode not in {"r", "rb"}:
            raise ValueError("Abre los archivos guardados solo para lectura.")
        try:
            record = self._model().objects.only("data").get(pk=name)
        except self._model().DoesNotExist:
            raise FileNotFoundError(name) from None
        return File(io.BytesIO(bytes(record.data)), name=name)

    def _save(self, name, content):
        data = bytearray()
        for chunk in content.chunks():
            if len(data) + len(chunk) > MAX_FILE_BYTES:
                raise ValidationError("El archivo supera 15 MB.")
            data.extend(chunk)
        payload = bytes(data)
        digest = hashlib.sha256(payload).hexdigest()
        while True:
            try:
                with transaction.atomic():
                    self._model().objects.create(name=name, data=payload, size=len(payload), sha256=digest)
                return name
            except IntegrityError:
                if not self.exists(name):
                    raise
                name = self.get_available_name(name)

    def exists(self, name):
        return self._model().objects.filter(pk=name).exists()

    def size(self, name):
        try:
            return self._model().objects.values_list("size", flat=True).get(pk=name)
        except self._model().DoesNotExist:
            raise FileNotFoundError(name) from None

    def delete(self, name):
        self._model().objects.filter(pk=name).delete()

    def url(self, name):
        asset_id = apps.get_model("content.MediaAsset").objects.filter(file=name).values_list("pk", flat=True).first()
        if asset_id is None:
            raise ValueError("El archivo todavía no pertenece a la biblioteca.")
        return f"/api/media/{asset_id}/"

    def get_created_time(self, name):
        return self._model().objects.values_list("created_at", flat=True).get(pk=name)

    def get_modified_time(self, name):
        return self.get_created_time(name)
