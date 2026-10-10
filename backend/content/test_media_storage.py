import hashlib
import io
import tempfile
from pathlib import Path

from PIL import Image
from django.contrib.auth.models import User
from django.core.exceptions import ImproperlyConfigured, ValidationError
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import SimpleTestCase, TestCase, override_settings
from django.urls import reverse

from config.media import media_storage_config
from content.database_transfer import record_digest, records_from_database
from content.models import MediaAsset, PersistentMediaFile
from content.storage import DatabaseMediaStorage, MAX_FILE_BYTES


DATABASE_STORAGES = {
    "default": {"BACKEND": "content.storage.DatabaseMediaStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}


def png(color="red"):
    output = io.BytesIO()
    Image.new("RGB", (12, 12), color).save(output, format="PNG")
    return output.getvalue()


class MediaConfigurationTests(SimpleTestCase):
    def test_render_postgres_uses_persistent_files_by_default(self):
        self.assertEqual(media_storage_config({"RENDER": "true"}, "django.db.backends.postgresql"), DATABASE_STORAGES["default"])

    def test_local_files_and_explicit_persistent_disk_remain_available(self):
        expected = {"BACKEND": "django.core.files.storage.FileSystemStorage"}
        self.assertEqual(media_storage_config({}, "django.db.backends.sqlite3"), expected)
        self.assertEqual(media_storage_config({"RENDER": "true", "MEDIA_STORAGE": "filesystem"}, "django.db.backends.postgresql"), expected)

    def test_invalid_mode_and_render_without_postgres_fail_clearly(self):
        with self.assertRaises(ImproperlyConfigured):
            media_storage_config({"MEDIA_STORAGE": "unknown"}, "django.db.backends.postgresql")
        with self.assertRaises(ImproperlyConfigured):
            media_storage_config({"RENDER": "true"}, "django.db.backends.sqlite3")


@override_settings(STORAGES=DATABASE_STORAGES)
class DatabaseMediaTests(TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.settings_override = override_settings(MEDIA_ROOT=self.root / "no-local-files")
        self.settings_override.enable()
        self.addCleanup(self.settings_override.disable)
        self.storage = DatabaseMediaStorage()

    def uploaded_image(self):
        asset = MediaAsset(title="Imagen original", alt="Equipo", file=SimpleUploadedFile("original.png", png(), "image/png"))
        asset.full_clean()
        asset.save()
        return asset

    def original(self, name="library/original.png"):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(png())
        asset = MediaAsset.objects.create(title="Original", alt="Equipo original", file=name)
        return asset, path

    def restore(self, **options):
        output = io.StringIO()
        call_command("restore_media", source=str(self.root), stdout=output, **options)
        return output.getvalue()

    def test_uploaded_image_api_and_file_widget_work_without_local_files(self):
        asset = self.uploaded_image()
        stored = PersistentMediaFile.objects.get(pk=asset.file.name)
        self.assertEqual(bytes(stored.data), png())
        self.assertEqual(stored.sha256, hashlib.sha256(png()).hexdigest())
        self.assertFalse((self.root / "no-local-files").exists())
        self.assertEqual(asset.file.url, f"/api/media/{asset.pk}/")
        response = self.client.get(asset.file.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/png")
        self.assertEqual(b"".join(response.streaming_content), png())
        response.close()

    def test_pdf_download_preserves_type_and_attachment(self):
        payload = b"%PDF-1.7\n%original-pdf"
        asset = MediaAsset.objects.create(title="Ficha", alt="Ficha técnica", file=SimpleUploadedFile("ficha.pdf", payload))
        response = self.client.get(asset.file.url)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertIn("attachment", response["Content-Disposition"])
        self.assertEqual(b"".join(response.streaming_content), payload)
        response.close()

    def test_new_storage_instance_reads_files_after_process_restart(self):
        asset = self.uploaded_image()
        with DatabaseMediaStorage().open(asset.file.name, "rb") as file:
            self.assertEqual(file.read(), png())

    def test_missing_file_returns_404(self):
        asset = MediaAsset.objects.create(title="Ausente", alt="Ausente", file="library/missing.png")
        self.assertEqual(self.client.get(f"/api/media/{asset.pk}/").status_code, 404)

    def test_filename_collision_preserves_both_files(self):
        first = self.storage.save("library/same.png", ContentFile(png("red")))
        second = self.storage.save("library/same.png", ContentFile(png("blue")))
        self.assertNotEqual(first, second)
        with self.storage.open(first) as file:
            self.assertEqual(file.read(), png("red"))
        self.assertEqual(self.storage.size(second), len(png("blue")))

    def test_oversized_upload_never_creates_a_file(self):
        with self.assertRaises(ValidationError):
            self.storage.save("library/large.pdf", ContentFile(b"x" * (MAX_FILE_BYTES + 1)))
        self.assertFalse(PersistentMediaFile.objects.exists())

    def test_admin_editor_keeps_working_with_stored_image(self):
        asset = self.uploaded_image()
        user = User.objects.create_superuser("media-admin", "media@example.test", "Media-test-password-123")
        self.client.force_login(user)
        response = self.client.get(reverse("admin:content_mediaasset_change", args=[asset.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, asset.file.url)

    def test_restore_preserves_ids_references_and_portable_fixture(self):
        asset, _ = self.original()
        before = record_digest(records_from_database())
        self.restore()
        self.assertEqual(record_digest(records_from_database()), before)
        asset.refresh_from_db()
        self.assertEqual(asset.file.name, "library/original.png")
        with asset.file.open("rb") as file:
            self.assertEqual(file.read(), png())

    def test_restore_can_be_repeated_without_duplicate_files(self):
        self.original()
        self.restore()
        self.assertIn("0 archivos nuevos y 1 ya existentes", self.restore())
        self.assertEqual(PersistentMediaFile.objects.count(), 1)

    def test_dry_run_verifies_without_storing_files(self):
        self.original()
        self.restore(dry_run=True)
        self.assertFalse(PersistentMediaFile.objects.exists())

    def test_missing_source_prevents_partial_restore(self):
        self.original("library/a-present.png")
        MediaAsset.objects.create(title="Ausente", alt="Ausente", file="library/z-missing.png")
        with self.assertRaisesMessage(CommandError, "Falta un archivo original"):
            self.restore()
        self.assertFalse(PersistentMediaFile.objects.exists())

    def test_existing_different_file_is_never_overwritten(self):
        self.original()
        self.storage.save("library/original.png", ContentFile(png("blue")))
        with self.assertRaisesMessage(CommandError, "No se sobrescribe"):
            self.restore()
        self.assertEqual(bytes(PersistentMediaFile.objects.get().data), png("blue"))

    def test_corrupted_stored_bytes_are_detected(self):
        self.original()
        self.restore()
        PersistentMediaFile.objects.update(data=b"corrupted")
        with self.assertRaisesMessage(CommandError, "no coincide"):
            self.restore()

    def test_invalid_original_is_rejected(self):
        _, path = self.original()
        path.write_bytes(b"not a png")
        with self.assertRaisesMessage(CommandError, "Archivo original inválido"):
            self.restore()
        self.assertFalse(PersistentMediaFile.objects.exists())
