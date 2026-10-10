import copy
import io
import tempfile
import uuid
from pathlib import Path
from unittest.mock import patch

from django.contrib.auth.models import Group, Permission, User
from django.core.exceptions import ImproperlyConfigured
from django.core.management import call_command
from django.core.management.base import CommandError
from django.db import connections
from django.test import SimpleTestCase, TransactionTestCase, override_settings

from config.database import database_config
from content.database_transfer import load_bundle, record_digest, records_from_database, safe_media_path
from content.models import Category, MediaAsset, Product, ProductImage, Specification


class DatabaseConfigurationTests(SimpleTestCase):
    def test_local_sqlite_is_preserved(self):
        config = database_config({}, Path("/app/backend"), debug=True)
        self.assertEqual(config["ENGINE"], "django.db.backends.sqlite3")
        self.assertEqual(config["NAME"], Path("/app/backend/db.sqlite3"))

    def test_render_url_overrides_local_variables_and_decodes_credentials(self):
        config = database_config({
            "DATABASE_URL": "postgresql://editor:p%40ss%3Aword@db.example.test:5433/morgillo?sslmode=require",
            "DB_ENGINE": "sqlite", "DB_NAME": "old",
        }, Path("/app"))
        self.assertEqual(config["ENGINE"], "django.db.backends.postgresql")
        self.assertEqual(config["PASSWORD"], "p@ss:word")
        self.assertEqual(config["NAME"], "morgillo")
        self.assertEqual(config["PORT"], "5433")
        self.assertEqual(config["OPTIONS"]["sslmode"], "require")
        self.assertTrue(config["CONN_HEALTH_CHECKS"])

    def test_existing_separate_postgres_settings_work(self):
        config = database_config({"DB_ENGINE": "postgres", "DB_NAME": "cms", "DB_USER": "cms", "DB_PASSWORD": "test"}, Path("/app"))
        self.assertEqual(config["NAME"], "cms")
        self.assertEqual(config["OPTIONS"]["sslmode"], "require")

    def test_invalid_configuration_fails_without_exposing_password(self):
        cases = [
            {"DB_ENGINE": "postgress"},
            {"DB_ENGINE": "postgres"},
            {"DATABASE_URL": "mysql://editor:private-password@db.example.test/cms"},
            {"DATABASE_URL": "postgres://editor:private-password@db.example.test:invalid/cms"},
            {"DATABASE_URL": "postgres://editor:private-password@db.example.test/cms?sslmode=invalid"},
            {"DATABASE_URL": "postgres://editor:private-password@db.example.test/cms?unknown=1"},
            {"DATABASE_URL": "postgres://editor:private-password@db.example.test/cms", "DB_CONNECT_TIMEOUT": "0"},
        ]
        for env in cases:
            with self.subTest(env={key: "configured" for key in env}):
                with self.assertRaises(ImproperlyConfigured) as error:
                    database_config(env, Path("/app"))
                self.assertNotIn("private-password", str(error.exception))

    def test_media_paths_cannot_escape_destination(self):
        for name in ("../outside", "/absolute", "C:/outside", "library\\outside"):
            with self.subTest(name=name), self.assertRaises(CommandError):
                safe_media_path(Path(tempfile.gettempdir()) / "morgillo-test-media", name)


class SQLiteSnapshotTests(TransactionTestCase):
    databases = "__all__"

    def setUp(self):
        if connections["default"].vendor != "sqlite":
            self.skipTest("La exportación de origen se prueba con SQLite.")
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.media = self.root / "media"
        (self.media / "library").mkdir(parents=True)
        (self.media / "library/photo.png").write_bytes(b"image-for-transfer-test")
        self.override = override_settings(MEDIA_ROOT=self.media)
        self.override.enable()
        self.addCleanup(self.override.disable)
        asset = MediaAsset.objects.create(title="Foto", alt="Foto de prueba", file="library/photo.png")
        category = Category.objects.create(slug="agricola", name="Agrícola", description="Prueba", image=asset)
        product = Product.objects.create(name="Equipo de prueba", slug="migration-test", model="TEST", category=category, description="Descripción", published=True)
        ProductImage.objects.create(product=product, asset=asset)
        Specification.objects.create(product=product, label="Potencia", value="108", unit="HP")
        group = Group.objects.create(name="Migration editors")
        group.permissions.add(Permission.objects.get(content_type__app_label="content", codename="view_product"))
        user = User.objects.create_user("migration-editor", password="Transfer-test-password-123")
        user.groups.add(group)
        self.bundle = self.root / "bundle"

    def export(self):
        snapshot_id = uuid.UUID(int=42)
        original = type(self).databases
        type(self).databases = frozenset({*original, "snapshot_" + snapshot_id.hex})
        try:
            with patch("content.management.commands.export_sqlite.uuid.uuid4", return_value=snapshot_id):
                call_command("export_sqlite", output=str(self.bundle), stdout=io.StringIO())
        finally:
            type(self).databases = original

    def test_export_round_trip_preserves_content_ids_passwords_and_permissions(self):
        self.export()
        directory, manifest = load_bundle(self.bundle)
        self.assertEqual(manifest["counts"]["content.product"], 1)
        self.assertEqual(manifest["counts"]["content.specification"], 1)
        self.assertEqual(list(manifest["media"]), ["library/photo.png"])
        alias = "roundtrip_" + uuid.uuid4().hex
        config = copy.deepcopy(connections["default"].settings_dict)
        config["NAME"] = self.root / "roundtrip.sqlite3"
        connections.databases[alias] = config
        original = type(self).databases
        type(self).databases = frozenset({*original, alias})
        try:
            call_command("migrate", database=alias, interactive=False, verbosity=0, stdout=io.StringIO())
            call_command("loaddata", str(directory / "data.json"), database=alias, verbosity=0, stdout=io.StringIO())
            self.assertEqual(record_digest(records_from_database(alias)), manifest["records_sha256"])
            user = User.objects.using(alias).get(username="migration-editor")
            self.assertTrue(user.check_password("Transfer-test-password-123"))
            self.assertEqual(user.groups.get().permissions.get().codename, "view_product")
            self.assertEqual(Product.objects.using(alias).get().gallery.get().asset.file.name, "library/photo.png")
        finally:
            connections[alias].close()
            del connections[alias]
            del connections.databases[alias]
            type(self).databases = original

    def test_modified_fixture_is_rejected(self):
        self.export()
        (self.bundle / "data.json").write_text("[]", encoding="utf-8")
        with self.assertRaisesMessage(CommandError, "data.json"):
            load_bundle(self.bundle)

    def test_missing_media_prevents_export(self):
        (self.media / "library/photo.png").unlink()
        with self.assertRaisesMessage(CommandError, "Faltan imágenes"):
            self.export()

    def test_existing_backup_is_never_overwritten(self):
        self.export()
        with self.assertRaisesMessage(CommandError, "ya existe"):
            self.export()

    def test_import_cannot_write_to_sqlite(self):
        before = record_digest(records_from_database())
        with self.assertRaisesMessage(CommandError, "PostgreSQL"):
            call_command("import_postgres", str(self.bundle), stdout=io.StringIO())
        self.assertEqual(record_digest(records_from_database()), before)
