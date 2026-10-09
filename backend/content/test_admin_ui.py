"""Admin workflow and permission regressions, using an isolated test database."""
from datetime import timedelta
from html.parser import HTMLParser

from django.contrib.auth.models import Permission, User
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone

from .models import Article, Brand, Campaign, Category, MediaAsset, Product, ProductImage, SiteSettings


@override_settings(STORAGES={
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
})
class AdminUITests(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Paths only: these tests never write to the site's media library.
        cls.image = MediaAsset.objects.create(title="Foto de tractor", alt="Tractor en campo", file="library/qa.webp")
        cls.brand = Brand.objects.create(name="Kubota", slug="kubota", description="Maquinaria", image=cls.image)
        cls.category = Category.objects.create(name="Agrícola", slug="agricola", description="Equipos", image=cls.image)
        cls.product = Product.objects.create(name="Tractor de prueba", model="M108S", slug="tractor-qa", brand=cls.brand, category=cls.category, description="Equipo agrícola", published=True)
        ProductImage.objects.create(product=cls.product, asset=cls.image)
        cls.draft = Product.objects.create(name="Equipo pendiente", model="B230", slug="pendiente-qa", category=cls.category, description="Implemento")
        cls.admin_user = User.objects.create(username="cms_qa", is_staff=True, is_superuser=True)
        cls.admin_user.set_unusable_password()
        cls.admin_user.save()

    def setUp(self):
        self.client.force_login(self.admin_user)

    def test_dashboard_counts_and_review_links_use_real_records(self):
        response = self.client.get(reverse("admin:index"))
        self.assertEqual(response.status_code, 200)
        equipment = response.context["cms_stats"][0]
        self.assertEqual(equipment["value"], 2)
        self.assertEqual(equipment["detail"], "1 publicados · 1 borradores")
        photos = next(item for item in response.context["cms_attention"] if "photos" in item["url"])
        self.assertEqual(photos["count"], 1)
        result = self.client.get(photos["url"])
        self.assertEqual(list(result.context["cl"].queryset), [self.draft])

    def test_read_only_staff_sees_only_authorized_modules_and_no_create_links(self):
        staff = User.objects.create(username="catalog_viewer", is_staff=True)
        staff.user_permissions.add(Permission.objects.get(codename="view_product"))
        self.client.force_login(staff)
        response = self.client.get(reverse("admin:index"))
        self.assertEqual([item["key"] for item in response.context["cms_modules"]], ["product"])
        self.assertEqual(len(response.context["cms_stats"]), 1)
        self.assertEqual(response.context["cms_quick_actions"], [])
        self.assertNotContains(response, reverse("admin:content_mediaasset_changelist"))
        self.assertNotContains(response, reverse("admin:content_product_add"))
        self.assertEqual(self.client.get(reverse("admin:content_product_add")).status_code, 403)

    def test_staff_without_permissions_gets_an_empty_dashboard(self):
        staff = User.objects.create(username="no_modules", is_staff=True)
        self.client.force_login(staff)
        response = self.client.get(reverse("admin:index"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["cms_modules"], [])
        self.assertEqual(response.context["cms_stats"], [])
        self.assertNotContains(response, self.product.name)

    def test_dashboard_scheduling_matches_publication_dates(self):
        now = timezone.now()
        Article.objects.create(title="Visible", slug="visible", body="Texto", excerpt="Texto", published=True, published_at=now-timedelta(days=1))
        Article.objects.create(title="Futura", slug="futura", body="Texto", excerpt="Texto", published=True, published_at=now+timedelta(days=1))
        Campaign.objects.create(title="Vigente", description="Texto", desktop_image=self.image, start=now-timedelta(days=1), end=now+timedelta(days=1), href="/", active=True)
        Campaign.objects.create(title="Programada", description="Texto", desktop_image=self.image, start=now+timedelta(days=2), end=now+timedelta(days=3), href="/", active=True)
        response = self.client.get(reverse("admin:index"))
        stats = {item["label"]: item["value"] for item in response.context["cms_stats"]}
        self.assertEqual(stats["Novedades publicadas"], 1)
        self.assertEqual(stats["Campañas vigentes"], 1)

    def test_all_content_lists_and_add_forms_render(self):
        for model in ("product", "brand", "category", "mediaasset", "campaign", "article", "event", "service", "sitesettings"):
            for view in ("changelist", "add"):
                with self.subTest(model=model, view=view):
                    response = self.client.get(reverse(f"admin:content_{model}_{view}"))
                    self.assertEqual(response.status_code, 200)
                    self.assertContains(response, "cms.css")
        response = self.client.get(reverse("admin:content_product_change", args=[self.product.pk]))
        self.assertContains(response, 'id="gallery-group"')
        self.assertContains(response, 'name="gallery-TOTAL_FORMS"')
        self.assertContains(response, 'name="specifications-TOTAL_FORMS"')
        self.assertContains(response, 'name="documents-TOTAL_FORMS"')

    def test_inline_editor_saves_characteristics_with_product(self):
        response = self.client.post(reverse("admin:content_product_change", args=[self.draft.pk]), {
            "name": "Equipo editado", "model": "B230", "slug": self.draft.slug,
            "brand": "", "category": self.category.pk, "description": "Descripción actualizada", "position": 0,
            "gallery-TOTAL_FORMS": 1, "gallery-INITIAL_FORMS": 0,
            "gallery-0-asset": str(self.image.pk), "gallery-0-position": 0,
            "specifications-TOTAL_FORMS": 1, "specifications-INITIAL_FORMS": 0,
            "specifications-0-label": "Ancho", "specifications-0-value": "230", "specifications-0-unit": "cm", "specifications-0-position": 0,
            "documents-TOTAL_FORMS": 0, "documents-INITIAL_FORMS": 0,
            "_save": "Guardar",
        })
        self.assertEqual(response.status_code, 302)
        self.draft.refresh_from_db()
        self.assertEqual(self.draft.name, "Equipo editado")
        self.assertFalse(self.draft.published)
        self.assertEqual(self.draft.gallery.count(), 1)
        self.assertEqual(self.draft.specifications.get().value, "230")

    def test_search_retains_review_filter(self):
        response = self.client.get(reverse("admin:content_product_changelist"), {"review": "photos", "q": "pendiente"})
        self.assertContains(response, 'name="review" value="photos"')
        self.assertEqual(list(response.context["cl"].queryset), [self.draft])

    def test_login_and_popup_preserve_native_flow(self):
        self.client.logout()
        response = self.client.get(reverse("admin:login"), {"next": reverse("admin:content_product_changelist")})
        self.assertContains(response, "Bienvenido de nuevo.")
        self.assertContains(response, 'name="csrfmiddlewaretoken"')
        self.assertContains(response, 'name="next"')
        self.client.force_login(self.admin_user)
        response = self.client.get(reverse("admin:content_mediaasset_add"), {"_popup": "1"})
        self.assertContains(response, 'name="_popup" value="1"')
        self.assertNotContains(response, 'id="mg-command"')

    def test_catalog_edit_links_are_explicit_and_photo_links_are_not_nested(self):
        class LinkInspector(HTMLParser):
            def __init__(self):
                super().__init__()
                self.depth = 0
                self.nested_links = 0

            def handle_starttag(self, tag, attrs):
                if tag == "a":
                    self.nested_links += bool(self.depth)
                    self.depth += 1

            def handle_endtag(self, tag):
                if tag == "a":
                    self.depth -= 1

        for model, obj in (("product", self.product), ("brand", self.brand), ("category", self.category)):
            with self.subTest(model=model):
                response = self.client.get(reverse(f"admin:content_{model}_changelist"))
                self.assertContains(response, f'aria-label="Editar {obj.name}"')
                self.assertContains(response, "Editar datos e imágenes")
                self.assertNotContains(response, "Tu cuenta tiene acceso de lectura")
                self.assertContains(response, reverse(f"admin:content_{model}_change", args=[obj.pk]))
                inspector = LinkInspector()
                inspector.feed(response.content.decode())
                self.assertEqual(inspector.nested_links, 0)

    def test_brand_editor_changes_image_and_unpublishes(self):
        replacement = MediaAsset.objects.create(title="Nueva imagen de marca", alt="Marca", file="library/brand-qa.webp")
        url = reverse("admin:content_brand_change", args=[self.brand.pk])
        response = self.client.get(url)
        self.assertContains(response, 'name="image"')
        self.assertContains(response, 'name="active"')
        response = self.client.post(url, {
            "name": self.brand.name, "slug": self.brand.slug, "description": "Descripción editada",
            "image": str(replacement.pk), "position": 0, "_save": "Guardar",
        })
        self.assertEqual(response.status_code, 302)
        self.brand.refresh_from_db()
        self.assertEqual(self.brand.image_id, replacement.pk)
        self.assertFalse(self.brand.active)

    def test_category_editor_changes_image_and_visibility_controls_public_catalog(self):
        SiteSettings.objects.create(phone="123456789", office="123456789", service="123456789", whatsapp="51123456789", address="Prueba", hours="Prueba")
        replacement = MediaAsset.objects.create(title="Nueva imagen de categoría", alt="Categoría", file="library/category-qa.webp")
        url = reverse("admin:content_category_change", args=[self.category.pk])
        response = self.client.get(url)
        self.assertContains(response, 'name="image"')
        self.assertContains(response, 'name="published"')
        data = {"name": self.category.name, "slug": self.category.slug, "subtitle": "Campo",
                "description": "Descripción editada", "image": str(replacement.pk), "position": 0, "_save": "Guardar"}
        self.assertEqual(self.client.post(url, data).status_code, 302)
        self.category.refresh_from_db()
        self.assertEqual(self.category.image_id, replacement.pk)
        self.assertFalse(self.category.published)
        public = self.client.get("/api/content/").json()
        self.assertEqual(public["categories"], [])
        self.assertEqual(public["products"], [])
        self.product.refresh_from_db()
        self.assertTrue(self.product.published)
        data["published"] = "on"
        self.assertEqual(self.client.post(url, data).status_code, 302)
        public = self.client.get("/api/content/").json()
        self.assertEqual([item["slug"] for item in public["products"]], [self.product.slug])
        self.assertEqual(public["categories"][0]["image"], f"/cms-media/{replacement.pk}")
        self.draft.refresh_from_db()
        self.assertFalse(self.draft.published)

    def test_product_editor_replaces_gallery_image_and_unpublishes(self):
        replacement = MediaAsset.objects.create(title="Nueva foto de equipo", alt="Tractor", file="library/product-qa.webp")
        photo = self.product.gallery.get()
        response = self.client.post(reverse("admin:content_product_change", args=[self.product.pk]), {
            "name": self.product.name, "model": self.product.model, "slug": self.product.slug,
            "brand": self.brand.pk, "category": self.category.pk, "description": "Datos editados", "position": 0,
            "gallery-TOTAL_FORMS": 1, "gallery-INITIAL_FORMS": 1,
            "gallery-0-id": photo.pk, "gallery-0-product": self.product.pk,
            "gallery-0-asset": str(replacement.pk), "gallery-0-position": 0,
            "specifications-TOTAL_FORMS": 0, "specifications-INITIAL_FORMS": 0,
            "documents-TOTAL_FORMS": 0, "documents-INITIAL_FORMS": 0, "_save": "Guardar",
        })
        self.assertEqual(response.status_code, 302)
        self.product.refresh_from_db()
        self.assertFalse(self.product.published)
        self.assertEqual(self.product.gallery.get().asset_id, replacement.pk)

    def test_publication_can_be_saved_from_each_catalog_list(self):
        for name, model, obj, publication_field in (
            ("product", Product, self.product, "published"),
            ("brand", Brand, self.brand, "active"),
            ("category", Category, self.category, "published"),
        ):
            with self.subTest(model=name):
                url = reverse(f"admin:content_{name}_changelist")
                response = self.client.get(url)
                formset = response.context["cl"].formset
                self.assertIsNotNone(formset)
                data = {"form-TOTAL_FORMS": len(formset.forms), "form-INITIAL_FORMS": len(formset.forms), "_save": "Guardar"}
                for form in formset:
                    for field in form.fields:
                        value = getattr(form.instance, field)
                        if field == publication_field and form.instance.pk == obj.pk:
                            continue
                        if isinstance(value, bool):
                            if value:
                                data[f"{form.prefix}-{field}"] = "on"
                        else:
                            data[f"{form.prefix}-{field}"] = value
                self.assertEqual(self.client.post(url, data).status_code, 302)
                self.assertFalse(getattr(model.objects.get(pk=obj.pk), publication_field))

    def test_read_only_catalog_access_cannot_use_publication_actions(self):
        staff = User.objects.create(username="catalog_read_only", is_staff=True)
        staff.user_permissions.add(*Permission.objects.filter(codename__in=("view_product", "view_brand", "view_category")))
        self.client.force_login(staff)
        for name, model, obj, publication_field, action in (
            ("product", Product, self.product, "published", "unpublish_selected"),
            ("brand", Brand, self.brand, "active", "deactivate_brands"),
            ("category", Category, self.category, "published", "unpublish_selected"),
        ):
            with self.subTest(model=name):
                url = reverse(f"admin:content_{name}_changelist")
                response = self.client.get(url)
                self.assertContains(response, f'aria-label="Ver detalle {obj.name}"')
                self.assertContains(response, "Tu cuenta tiene acceso de lectura")
                self.assertNotContains(response, f'aria-label="Editar {obj.name}"')
                self.assertNotContains(response, f'value="{action}"')
                self.client.post(url, {"action": action, "_selected_action": obj.pk, "index": 0})
                self.assertTrue(getattr(model.objects.get(pk=obj.pk), publication_field))

    def test_catalog_popup_selectors_keep_native_selection_links(self):
        for name, obj in (("product", self.product), ("brand", self.brand), ("category", self.category)):
            with self.subTest(model=name):
                response = self.client.get(reverse(f"admin:content_{name}_changelist"), {"_popup": "1"})
                self.assertEqual(response.status_code, 200)
                self.assertContains(response, f'data-popup-opener="{obj.pk}"')
                self.assertNotContains(response, 'class="mg-row-edit"')
                self.assertNotContains(response, 'data-catalog-view=')
