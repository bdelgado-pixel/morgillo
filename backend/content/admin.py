from django.contrib import admin, messages
from django.db import transaction
from django.db.models import Prefetch
from django.urls import reverse
from django.utils import timezone
from django.utils.html import format_html, format_html_join
from django.utils.text import slugify

from .models import (
    Article,
    Brand,
    Campaign,
    Category,
    Event,
    MediaAsset,
    Product,
    ProductDocument,
    ProductImage,
    Service,
    SiteSettings,
    Specification,
)


admin.site.site_header = "MORGILLO · Administración"
admin.site.site_title = "Morgillo CMS"
admin.site.index_title = "Centro de contenido"
admin.site.site_url = "http://localhost:3000"


# =========================================================
# HELPERS
# =========================================================


def media_url(asset: MediaAsset | None) -> str:
    if not asset or not asset.pk:
        return ""

    return f"/api/media/{asset.pk}/"


def image_preview(
    asset: MediaAsset | None,
    *,
    width: int = 180,
    height: int = 120,
):
    if not asset:
        return "Sin imagen seleccionada."

    if asset.kind != "image":
        return "El archivo seleccionado no es una imagen."

    return format_html(
        '<a class="mg-image-preview" href="{}" target="_blank" rel="noopener noreferrer" '
        'style="--preview-width:{}px;--preview-height:{}px">'
        '<img src="{}" alt="{}" loading="lazy"></a>',
        media_url(asset), width, height, media_url(asset), asset.alt or asset.title,
    )


def status_badge(label: str, tone: str = "neutral"):
    return format_html('<span class="mg-badge" data-tone="{}">{}</span>', tone, label)



def frontend_url(path: str) -> str:
    site = SiteSettings.objects.only("url").first()
    base = (site.url if site else admin.site.site_url or "http://localhost:3000").rstrip("/")

    return f"{base}{path}"


def frontend_link(
    path: str,
    label: str = "Ver en la web ↗",
):
    return format_html(
        '<a href="{}" '
        'target="_blank" '
        'rel="noopener noreferrer" '
        'style="font-weight:700;text-decoration:none">'
        "{}"
        "</a>",
        frontend_url(path),
        label,
    )


# =========================================================
# ACTIONS
# =========================================================


@admin.action(
    permissions=["change"],
    description="Publicar seleccionados"
)
def publish_selected(
    modeladmin,
    request,
    queryset,
):
    updated = queryset.update(
        published=True
    )

    modeladmin.message_user(
        request,
        f"{updated} elemento(s) publicados.",
        level=messages.SUCCESS,
    )


@admin.action(
    permissions=["change"],
    description="Pasar seleccionados a borrador"
)
def unpublish_selected(
    modeladmin,
    request,
    queryset,
):
    updated = queryset.update(
        published=False
    )

    modeladmin.message_user(
        request,
        f"{updated} elemento(s) pasaron a borrador.",
        level=messages.SUCCESS,
    )


@admin.action(
    permissions=["change"],
    description="Publicar marcas seleccionadas"
)
def activate_brands(
    modeladmin,
    request,
    queryset,
):
    updated = queryset.update(
        active=True
    )

    modeladmin.message_user(
        request,
        f"{updated} marca(s) activadas.",
        level=messages.SUCCESS,
    )


@admin.action(
    permissions=["change"],
    description="Ocultar marcas seleccionadas"
)
def deactivate_brands(
    modeladmin,
    request,
    queryset,
):
    updated = queryset.update(
        active=False
    )

    modeladmin.message_user(
        request,
        f"{updated} marca(s) desactivadas.",
        level=messages.SUCCESS,
    )


# =========================================================
# MEDIA LIBRARY
# =========================================================


@admin.register(MediaAsset)
class MediaAdmin(admin.ModelAdmin):
    list_display_links = ("title",)
    search_help_text = "Busca por título, descripción o nombre del archivo."

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related(
            "brands", "categories", "product_images", "product_documents",
            "campaign_desktop", "campaign_mobile", "articles", "events",
            "site_logos", "site_heroes",
        )

    list_display = (
        "thumbnail",
        "title",
        "kind_badge",
        "usage_count",
        "created_at",
    )

    list_filter = (
        "kind",
        "created_at",
    )

    search_fields = (
        "title",
        "alt",
        "file",
    )

    ordering = (
        "-created_at",
    )

    list_per_page = 30

    readonly_fields = (
        "kind",
        "large_preview",
        "usage_detail",
        "created_at",
    )

    fieldsets = (
        (
            "Archivo",
            {
                "fields": (
                    "title",
                    "alt",
                    "file",
                ),
                "description": (
                    "Sube una imagen o PDF destinado a la web. "
                    "Usa un título claro y describe la imagen "
                    "en Texto alternativo."
                ),
            },
        ),
        (
            "Vista previa",
            {
                "fields": (
                    "large_preview",
                    "kind",
                ),
            },
        ),
        (
            "Uso del archivo",
            {
                "fields": (
                    "usage_detail",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
        (
            "Información técnica",
            {
                "fields": (
                    "created_at",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    @admin.display(
        description="Vista"
    )
    def thumbnail(
        self,
        obj,
    ):
        if obj.kind == "image":
            return image_preview(
                obj,
                width=86,
                height=62,
            )

        return format_html(
            '<a href="{}" '
            'target="_blank" '
            'rel="noopener noreferrer" '
            'style="font-weight:800;text-decoration:none">'
            "PDF ↗"
            "</a>",
            media_url(obj),
        )

    @admin.display(
        description="Tipo",
        ordering="kind",
    )
    def kind_badge(
        self,
        obj,
    ):
        if obj.kind == "image":
            return status_badge(
                "Imagen",
                "info",
            )

        return status_badge(
            "PDF",
            "neutral",
        )

    @admin.display(
        description="Vista previa"
    )
    def large_preview(
        self,
        obj,
    ):
        if (
            not obj
            or obj._state.adding
        ):
            return (
                "Selecciona el archivo y guarda "
                "para ver su vista previa aquí."
            )

        if obj.kind == "image":
            return image_preview(
                obj,
                width=420,
                height=260,
            )

        return format_html(
            '<a href="{}" '
            'target="_blank" '
            'rel="noopener noreferrer" '
            'style="'
            "display:inline-flex;"
            "padding:10px 14px;"
            "border:1px solid #ccc;"
            "border-radius:8px;"
            "font-weight:800;"
            "text-decoration:none"
            '">'
            "Abrir PDF ↗"
            "</a>",
            media_url(obj),
        )

    def _usage_total(
        self,
        obj,
    ):
        return sum(
            relation.count()
            for relation in (
                obj.brands,
                obj.categories,
                obj.product_images,
                obj.product_documents,
                obj.campaign_desktop,
                obj.campaign_mobile,
                obj.articles,
                obj.events,
                obj.site_logos,
                obj.site_heroes,
            )
        )

    @admin.display(
        description="Usos"
    )
    def usage_count(
        self,
        obj,
    ):
        total = self._usage_total(
            obj
        )

        label = (
            f"{total} uso"
            if total == 1
            else f"{total} usos"
        )

        return status_badge(
            label,
            "success"
            if total
            else "neutral",
        )

    @admin.display(
        description="Dónde se utiliza"
    )
    def usage_detail(
        self,
        obj,
    ):
        if (
            not obj
            or obj._state.adding
        ):
            return (
                "Guarda el archivo para consultar "
                "dónde se utiliza."
            )

        rows = [
            (
                "Marcas",
                obj.brands.count(),
            ),
            (
                "Categorías",
                obj.categories.count(),
            ),
            (
                "Galerías de maquinaria",
                obj.product_images.count(),
            ),
            (
                "Documentos de maquinaria",
                obj.product_documents.count(),
            ),
            (
                "Campañas · escritorio",
                obj.campaign_desktop.count(),
            ),
            (
                "Campañas · móvil",
                obj.campaign_mobile.count(),
            ),
            (
                "Novedades",
                obj.articles.count(),
            ),
            (
                "Eventos",
                obj.events.count(),
            ),
            (
                "Logo del sitio",
                obj.site_logos.count(),
            ),
            (
                "Hero del sitio",
                obj.site_heroes.count(),
            ),
        ]

        used = [
            (
                label,
                count,
            )
            for label, count in rows
            if count
        ]

        if not used:
            return (
                "Este archivo todavía no "
                "está siendo utilizado."
            )

        items = format_html_join(
            "",
            "<li><strong>{}</strong>: {}</li>",
            (
                (
                    label,
                    count,
                )
                for label, count in used
            ),
        )

        return format_html(
            "<ul "
            "style='margin:0;padding-left:18px'"
            ">{}</ul>",
            items,
        )


# =========================================================
# BRANDS
# =========================================================


class CatalogEditingMixin:
    """Keep photo previews separate from unmistakable record editing links."""

    list_display_links = ("catalog_name",)

    def changelist_view(self, request, extra_context=None):
        context = {**(extra_context or {}), "catalog_can_edit": self.has_change_permission(request)}
        return super().changelist_view(request, extra_context=context)

    @admin.display(description="Nombre y detalles", ordering="name")
    def catalog_name(self, obj):
        if isinstance(obj, Product):
            details = " · ".join(filter(None, (
                obj.model, obj.brand.name if obj.brand else "Sin marca", obj.category.name,
            )))
        elif isinstance(obj, Category):
            details = obj.subtitle or obj.slug
        else:
            details = "Marca representada · " + obj.slug
        return format_html(
            '<span class="mg-record-name">{}</span><small class="mg-record-detail">{}</small>',
            obj.name, details,
        )

    def get_list_display_links(self, request, list_display):
        return ("name",) if request.GET.get("_popup") else ("catalog_name",)

    def get_list_display(self, request):
        columns = super().get_list_display(request)
        if request.GET.get("_popup"):
            return tuple("name" if column == "catalog_name" else column for column in columns)

        @admin.display(description="Administrar")
        def record_controls(obj):
            can_edit = self.has_change_permission(request, obj)
            label = "Editar" if can_edit else "Ver detalle"
            url = reverse(
                f"{self.admin_site.name}:{self.opts.app_label}_{self.opts.model_name}_change",
                args=[obj.pk],
            )
            return format_html(
                '<a class="mg-row-edit" href="{}" aria-label="{} {}">'
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" '
                'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
                'stroke-linejoin="round" aria-hidden="true">'
                '<path d="m16 3 5 5-12 12-6 1 1-6zM14 5l5 5"/></svg>{}</a>',
                url, label, obj.name, label,
            )

        return (record_controls, *columns)


@admin.register(Brand)
class BrandAdmin(CatalogEditingMixin, admin.ModelAdmin):
    list_display = (
        "image_thumb",
        "catalog_name",
        "status",
        "active",
        "primary",
        "position",
        "frontend",
    )

    list_filter = (
        "active",
        "primary",
    )

    search_fields = (
        "name",
        "slug",
        "description",
    )

    list_editable = (
        "active",
        "primary",
        "position",
    )

    ordering = (
        "position",
        "name",
    )

    list_per_page = 30

    prepopulated_fields = {
        "slug": (
            "name",
        )
    }

    autocomplete_fields = (
        "image",
    )

    readonly_fields = (
        "image_preview",
        "frontend",
    )

    actions = (
        activate_brands,
        deactivate_brands,
    )

    fieldsets = (
        (
            "Marca",
            {
                "fields": (
                    "name",
                    "description",
                    "image",
                    "image_preview",
                ),
            },
        ),
        (
            "Publicación",
            {
                "fields": (
                    "active",
                    "primary",
                    "frontend",
                ),
            },
        ),
        (
            "Opciones avanzadas",
            {
                "fields": (
                    "slug",
                    "position",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    @admin.display(
        description="Imagen"
    )
    def image_thumb(
        self,
        obj,
    ):
        return image_preview(
            obj.image,
            width=76,
            height=54,
        )

    @admin.display(
        description="Vista previa"
    )
    def image_preview(
        self,
        obj,
    ):
        return image_preview(
            obj.image
            if obj
            else None,
            width=360,
            height=220,
        )

    @admin.display(
        description="Estado",
        ordering="active",
    )
    def status(
        self,
        obj,
    ):
        if obj.active:
            return status_badge(
                "Publicada",
                "success",
            )

        return status_badge(
            "Oculta",
            "neutral",
        )

    @admin.display(
        description="Frontend"
    )
    def frontend(
        self,
        obj,
    ):
        if (
            not obj
            or obj._state.adding
        ):
            return (
                "Guarda la marca para "
                "abrirla en el sitio."
            )

        return frontend_link(
            f"/marcas/{obj.slug}"
        )


# =========================================================
# CATEGORIES
# =========================================================


@admin.register(Category)
class CategoryAdmin(CatalogEditingMixin, admin.ModelAdmin):
    list_display = (
        "image_thumb",
        "catalog_name",
        "status",
        "published",
        "position",
        "frontend",
    )

    search_fields = (
        "name",
        "subtitle",
        "description",
    )

    list_editable = (
        "published",
        "position",
    )

    list_filter = ("published",)
    actions = (publish_selected, unpublish_selected)

    ordering = (
        "position",
    )

    autocomplete_fields = (
        "image",
    )

    readonly_fields = (
        "image_preview",
        "frontend",
    )

    fieldsets = (
        (
            "Categoría",
            {
                "fields": (
                    "slug",
                    "name",
                    "subtitle",
                    "description",
                    "image",
                    "image_preview",
                ),
            },
        ),
        (
            "Opciones",
            {
                "fields": (
                    "published",
                    "position",
                    "frontend",
                ),
            },
        ),
    )

    @admin.display(description="Estado", ordering="published")
    def status(self, obj):
        return status_badge("Publicada" if obj.published else "Oculta", "success" if obj.published else "neutral")

    @admin.display(
        description="Imagen"
    )
    def image_thumb(
        self,
        obj,
    ):
        return image_preview(
            obj.image,
            width=76,
            height=54,
        )

    @admin.display(
        description="Vista previa"
    )
    def image_preview(
        self,
        obj,
    ):
        return image_preview(
            obj.image
            if obj
            else None,
            width=360,
            height=220,
        )

    @admin.display(
        description="Frontend"
    )
    def frontend(
        self,
        obj,
    ):
        if (
            not obj
            or obj._state.adding
        ):
            return (
                "Guarda la categoría para "
                "abrirla en el catálogo."
            )

        return frontend_link(
            f"/maquinaria?categoria={obj.slug}"
        )


# =========================================================
# PRODUCT INLINES
# =========================================================


class ImageInline(
    admin.TabularInline
):
    model = ProductImage

    autocomplete_fields = (
        "asset",
    )

    readonly_fields = (
        "thumbnail",
    )

    fields = (
        "thumbnail",
        "asset",
        "position",
    )

    extra = 1

    ordering = (
        "position",
        "pk",
    )

    verbose_name = (
        "imagen de galería"
    )

    verbose_name_plural = (
        "Galería del equipo"
    )

    @admin.display(
        description="Vista"
    )
    def thumbnail(
        self,
        obj,
    ):
        if (
            not obj
            or not obj.pk
            or not obj.asset_id
        ):
            return "—"

        return image_preview(
            obj.asset,
            width=96,
            height=68,
        )


class SpecificationInline(
    admin.TabularInline
):
    model = Specification

    fields = (
        "label",
        "value",
        "unit",
        "position",
    )

    extra = 1

    ordering = (
        "position",
        "pk",
    )

    verbose_name = (
        "especificación"
    )

    verbose_name_plural = (
        "Especificaciones técnicas"
    )


class DocumentInline(
    admin.TabularInline
):
    model = ProductDocument

    autocomplete_fields = (
        "asset",
    )

    readonly_fields = (
        "open_document",
    )

    fields = (
        "asset",
        "open_document",
    )

    extra = 0

    verbose_name = (
        "documento"
    )

    verbose_name_plural = (
        "Documentos / fichas técnicas"
    )

    @admin.display(
        description="Archivo"
    )
    def open_document(
        self,
        obj,
    ):
        if (
            not obj
            or not obj.pk
            or not obj.asset_id
        ):
            return "—"

        return format_html(
            '<a href="{}" '
            'target="_blank" '
            'rel="noopener noreferrer" '
            'style="'
            "font-weight:800;"
            "text-decoration:none"
            '">'
            "Abrir PDF ↗"
            "</a>",
            media_url(
                obj.asset
            ),
        )


# =========================================================
# PRODUCTS
# =========================================================


class ProductReviewFilter(admin.SimpleListFilter):
    title = "Revisión de fichas"
    parameter_name = "review"

    def lookups(self, request, model_admin):
        return (("photos", "Sin fotografías"), ("specs", "Sin especificaciones"), ("documents", "Sin ficha PDF"))

    def queryset(self, request, queryset):
        relation = {"photos": "gallery", "specs": "specifications", "documents": "documents"}.get(self.value())
        return queryset.filter(**{f"{relation}__isnull": True}).distinct() if relation else queryset


@admin.register(Product)
class ProductAdmin(CatalogEditingMixin, admin.ModelAdmin):
    search_help_text = "Busca por nombre, modelo, marca o descripción del equipo."

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("brand", "category").prefetch_related(
            Prefetch("gallery", queryset=ProductImage.objects.select_related("asset")),
            "specifications", "documents",
        )

    @admin.display(description="Equipo")
    def thumbnail(self, obj):
        photo = next(iter(obj.gallery.all()), None)
        return image_preview(photo.asset, width=90, height=64) if photo else "Sin fotografía"

    list_display = (
        "thumbnail",
        "catalog_name",
        "status",
        "published",
        "featured",
        "frontend",
    )

    list_filter = (
        ProductReviewFilter,
        "published",
        "featured",
        "mock",
        "category",
        "brand",
    )

    search_fields = (
        "name",
        "model",
        "description",
        "slug",
        "brand__name",
    )

    list_select_related = (
        "brand",
        "category",
    )

    list_editable = (
        "published",
        "featured",
    )

    ordering = (
        "position",
        "name",
    )

    list_per_page = 30

    date_hierarchy = (
        "updated_at"
    )

    prepopulated_fields = {
        "slug": (
            "name",
            "model",
        )
    }

    autocomplete_fields = (
        "brand",
        "category",
    )

    readonly_fields = (
        "updated_at",
        "frontend",
    )

    inlines = (
        ImageInline,
        SpecificationInline,
        DocumentInline,
    )

    actions = (
        publish_selected,
        unpublish_selected,
        "duplicate_as_draft",
    )

    fieldsets = (
        (
            "Información principal",
            {
                "fields": (
                    "name",
                    "model",
                    "brand",
                    "category",
                    "description",
                ),
                "description": (
                    "Estos son los datos principales "
                    "que verá el cliente en la ficha "
                    "del equipo."
                ),
            },
        ),
        (
            "Publicación",
            {
                "fields": (
                    "published",
                    "featured",
                    "frontend",
                    "updated_at",
                ),
                "description": (
                    "Mantén Publicado desactivado "
                    "mientras preparas la ficha. "
                    "Destacado en Inicio controla "
                    "si puede aparecer en la "
                    "selección principal."
                ),
            },
        ),
        (
            "Opciones avanzadas",
            {
                "fields": (
                    "slug",
                    "position",
                    "mock",
                ),
                "classes": (
                    "collapse",
                ),
                "description": (
                    "Normalmente no necesitas "
                    "modificar estos campos."
                ),
            },
        ),
    )

    @admin.display(
        description="Estado",
        ordering="published",
    )
    def status(
        self,
        obj,
    ):
        if obj.published and not obj.category.published:
            return status_badge("Categoría oculta", "warning")
        if obj.published and obj.brand and not obj.brand.active:
            return status_badge("Marca oculta", "warning")
        if obj.published:
            return status_badge(
                "Publicado",
                "success",
            )

        return status_badge(
            "Borrador",
            "warning",
        )

    @admin.display(
        description="Frontend"
    )
    def frontend(
        self,
        obj,
    ):
        if (
            not obj
            or obj._state.adding
        ):
            return (
                "Guarda el equipo para "
                "abrir su ficha."
            )

        return frontend_link(
            obj.get_absolute_url()
        )

    @admin.action(
        permissions=["change"],
        description=(
            "Duplicar seleccionados "
            "como borrador"
        )
    )
    def duplicate_as_draft(
        self,
        request,
        queryset,
    ):
        created = 0

        for product in queryset.select_related(
            "brand",
            "category",
        ):
            with transaction.atomic():
                base_slug = (
                    slugify(
                        f"{product.slug}-copia"
                    )
                    or "equipo-copia"
                )

                slug = base_slug
                counter = 2

                while Product.objects.filter(
                    slug=slug
                ).exists():
                    slug = (
                        f"{base_slug}-"
                        f"{counter}"
                    )
                    counter += 1

                copy = Product.objects.create(
                    name=(
                        f"{product.name} "
                        "(copia)"
                    ),
                    slug=slug,
                    model=product.model,
                    brand=product.brand,
                    category=product.category,
                    description=(
                        product.description
                    ),
                    featured=False,
                    published=False,
                    mock=product.mock,
                    position=(
                        product.position
                    ),
                )

                ProductImage.objects.bulk_create(
                    [
                        ProductImage(
                            product=copy,
                            asset=item.asset,
                            position=(
                                item.position
                            ),
                        )
                        for item
                        in product.gallery.all()
                    ]
                )

                Specification.objects.bulk_create(
                    [
                        Specification(
                            product=copy,
                            label=item.label,
                            value=item.value,
                            unit=item.unit,
                            position=(
                                item.position
                            ),
                        )
                        for item
                        in product.specifications.all()
                    ]
                )

                ProductDocument.objects.bulk_create(
                    [
                        ProductDocument(
                            product=copy,
                            asset=item.asset,
                        )
                        for item
                        in product.documents.all()
                    ]
                )

                created += 1

        self.message_user(
            request,
            (
                f"{created} equipo(s) "
                "duplicados como borrador."
            ),
            level=messages.SUCCESS,
        )


# =========================================================
# CAMPAIGNS
# =========================================================


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = (
        "status",
        "title",
        "start",
        "end",
        "placements",
        "frequency",
        "priority",
    )

    list_filter = (
        "active",
        "show_home",
        "show_popup",
        "frequency",
        "start",
    )

    search_fields = (
        "title",
        "subtitle",
        "description",
        "place",
        "href",
    )

    ordering = (
        "priority",
        "-start",
    )

    list_editable = (
        "priority",
    )

    list_per_page = 30

    date_hierarchy = (
        "start"
    )

    autocomplete_fields = (
        "desktop_image",
        "mobile_image",
    )

    readonly_fields = (
        "desktop_preview",
        "mobile_preview",
    )

    fieldsets = (
        (
            "Contenido",
            {
                "fields": (
                    "title",
                    "subtitle",
                    "description",
                    "place",
                ),
            },
        ),
        (
            "Imágenes",
            {
                "fields": (
                    "desktop_image",
                    "desktop_preview",
                    "mobile_image",
                    "mobile_preview",
                ),
                "description": (
                    "La imagen móvil es opcional. "
                    "Si no existe, el frontend "
                    "puede reutilizar la de escritorio."
                ),
            },
        ),
        (
            "Programación",
            {
                "fields": (
                    "active",
                    "start",
                    "end",
                ),
                "description": (
                    "Las fechas se administran "
                    "en horario de Perú."
                ),
            },
        ),
        (
            "Dónde mostrarla",
            {
                "fields": (
                    "show_home",
                    "show_popup",
                    "frequency",
                    "paths",
                ),
            },
        ),
        (
            "Botón",
            {
                "fields": (
                    "button_text",
                    "href",
                ),
            },
        ),
        (
            "Opciones avanzadas",
            {
                "fields": (
                    "priority",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    @admin.display(
        description="Estado"
    )
    def status(
        self,
        obj,
    ):
        now = timezone.now()

        if not obj.active:
            return status_badge(
                "Inactiva",
                "neutral",
            )

        if now < obj.start:
            return status_badge(
                "Programada",
                "info",
            )

        if now > obj.end:
            return status_badge(
                "Finalizada",
                "danger",
            )

        return status_badge(
            "Activa ahora",
            "success",
        )

    @admin.display(
        description="Ubicación"
    )
    def placements(
        self,
        obj,
    ):
        labels = []

        if obj.show_home:
            labels.append(
                "Inicio"
            )

        if obj.show_popup:
            labels.append(
                "Popup"
            )

        return (
            " + ".join(
                labels
            )
            if labels
            else "Sin ubicación"
        )

    @admin.display(
        description="Vista escritorio"
    )
    def desktop_preview(
        self,
        obj,
    ):
        return image_preview(
            (
                obj.desktop_image
                if obj
                else None
            ),
            width=440,
            height=220,
        )

    @admin.display(
        description="Vista móvil"
    )
    def mobile_preview(
        self,
        obj,
    ):
        return image_preview(
            (
                obj.mobile_image
                if obj
                else None
            ),
            width=220,
            height=300,
        )


# =========================================================
# ARTICLES / NEWS
# =========================================================


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = (
        "status",
        "title",
        "published_at",
        "frontend",
    )

    list_filter = (
        "published",
        "published_at",
    )

    search_fields = (
        "title",
        "excerpt",
        "body",
        "slug",
    )

    ordering = (
        "-published_at",
    )

    list_per_page = 30

    date_hierarchy = (
        "published_at"
    )

    prepopulated_fields = {
        "slug": (
            "title",
        )
    }

    autocomplete_fields = (
        "image",
    )

    readonly_fields = (
        "image_preview",
        "frontend",
    )

    actions = (
        publish_selected,
        unpublish_selected,
    )

    fieldsets = (
        (
            "Publicación",
            {
                "fields": (
                    "title",
                    "excerpt",
                    "body",
                    "image",
                    "image_preview",
                ),
            },
        ),
        (
            "Estado",
            {
                "fields": (
                    "published",
                    "published_at",
                    "frontend",
                ),
            },
        ),
        (
            "Opciones avanzadas",
            {
                "fields": (
                    "slug",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    @admin.display(
        description="Estado",
        ordering="published",
    )
    def status(
        self,
        obj,
    ):
        if obj.published:
            return status_badge(
                "Publicada",
                "success",
            )

        return status_badge(
            "Borrador",
            "warning",
        )

    @admin.display(
        description="Vista previa"
    )
    def image_preview(
        self,
        obj,
    ):
        return image_preview(
            (
                obj.image
                if obj
                else None
            ),
            width=420,
            height=240,
        )

    @admin.display(
        description="Frontend"
    )
    def frontend(
        self,
        obj,
    ):
        if (
            not obj
            or obj._state.adding
        ):
            return (
                "Guarda la novedad para "
                "abrirla en el sitio."
            )

        return frontend_link(
            f"/novedades/{obj.slug}"
        )


# =========================================================
# EVENTS
# =========================================================


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "event_status",
        "publication_status",
        "title",
        "start",
        "end",
        "place",
        "frontend",
    )

    list_filter = (
        "published",
        "start",
        "end",
    )

    search_fields = (
        "title",
        "excerpt",
        "body",
        "place",
        "slug",
    )

    ordering = (
        "-start",
    )

    list_per_page = 30

    date_hierarchy = (
        "start"
    )

    prepopulated_fields = {
        "slug": (
            "title",
        )
    }

    autocomplete_fields = (
        "image",
    )

    readonly_fields = (
        "image_preview",
        "frontend",
    )

    actions = (
        publish_selected,
        unpublish_selected,
    )

    fieldsets = (
        (
            "Evento",
            {
                "fields": (
                    "title",
                    "excerpt",
                    "body",
                    "image",
                    "image_preview",
                    "place",
                ),
            },
        ),
        (
            "Fechas del evento",
            {
                "fields": (
                    "start",
                    "end",
                ),
            },
        ),
        (
            "Publicación",
            {
                "fields": (
                    "published",
                    "published_at",
                    "frontend",
                ),
            },
        ),
        (
            "Opciones avanzadas",
            {
                "fields": (
                    "slug",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    @admin.display(
        description="Evento"
    )
    def event_status(
        self,
        obj,
    ):
        now = timezone.now()

        if now < obj.start:
            return status_badge(
                "Próximo",
                "info",
            )

        if (
            obj.start
            <= now
            <= obj.end
        ):
            return status_badge(
                "En curso",
                "success",
            )

        return status_badge(
            "Finalizado",
            "neutral",
        )

    @admin.display(
        description="Publicación",
        ordering="published",
    )
    def publication_status(
        self,
        obj,
    ):
        if obj.published:
            return status_badge(
                "Publicado",
                "success",
            )

        return status_badge(
            "Borrador",
            "warning",
        )

    @admin.display(
        description="Vista previa"
    )
    def image_preview(
        self,
        obj,
    ):
        return image_preview(
            (
                obj.image
                if obj
                else None
            ),
            width=420,
            height=240,
        )

    @admin.display(
        description="Frontend"
    )
    def frontend(
        self,
        obj,
    ):
        if (
            not obj
            or obj._state.adding
        ):
            return (
                "Guarda el evento para "
                "abrirlo en el sitio."
            )

        return frontend_link(
            f"/eventos/{obj.slug}"
        )


# =========================================================
# SERVICES
# =========================================================


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        "status",
        "title",
        "position",
        "frontend",
    )

    list_filter = (
        "published",
    )

    search_fields = (
        "title",
        "description",
        "requirements",
        "slug",
    )

    list_editable = (
        "position",
    )

    ordering = (
        "position",
    )

    prepopulated_fields = {
        "slug": (
            "title",
        )
    }

    readonly_fields = (
        "frontend",
    )

    actions = (
        publish_selected,
        unpublish_selected,
    )

    fieldsets = (
        (
            "Servicio",
            {
                "fields": (
                    "title",
                    "description",
                    "requirements",
                ),
            },
        ),
        (
            "Publicación",
            {
                "fields": (
                    "published",
                    "frontend",
                ),
            },
        ),
        (
            "Opciones avanzadas",
            {
                "fields": (
                    "slug",
                    "position",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
    )

    @admin.display(
        description="Estado",
        ordering="published",
    )
    def status(
        self,
        obj,
    ):
        if obj.published:
            return status_badge(
                "Publicado",
                "success",
            )

        return status_badge(
            "Borrador",
            "warning",
        )

    @admin.display(
        description="Frontend"
    )
    def frontend(
        self,
        obj,
    ):
        if (
            not obj
            or obj._state.adding
        ):
            return (
                "Guarda el servicio para "
                "abrirlo en el sitio."
            )

        return frontend_link(
            f"/servicios/{obj.slug}"
        )


# =========================================================
# SITE SETTINGS
# =========================================================


@admin.register(SiteSettings)
class SettingsAdmin(admin.ModelAdmin):
    autocomplete_fields = (
        "logo",
        "hero_image",
    )

    readonly_fields = (
        "logo_preview",
        "hero_preview",
        "frontend_home",
    )

    fieldsets = (
        (
            "Empresa",
            {
                "fields": (
                    "name",
                    "url",
                    "seo_description",
                    "frontend_home",
                ),
            },
        ),
        (
            "Contacto",
            {
                "fields": (
                    "phone",
                    "office",
                    "service",
                    "whatsapp",
                    "email",
                    "address",
                    "hours",
                ),
            },
        ),
        (
            "Redes sociales",
            {
                "fields": (
                    "facebook",
                    "instagram",
                    "linkedin",
                    "youtube",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),
        (
            "Inicio · identidad",
            {
                "fields": (
                    "logo",
                    "logo_preview",
                    "hero_image",
                    "hero_preview",
                    "hero_title",
                    "hero_description",
                ),
            },
        ),
        (
            "Empresa · contenido",
            {
                "fields": (
                    "company_title",
                    "company_description",
                ),
            },
        ),
    )

    @admin.display(
        description="Logo actual"
    )
    def logo_preview(
        self,
        obj,
    ):
        return image_preview(
            (
                obj.logo
                if obj
                else None
            ),
            width=300,
            height=120,
        )

    @admin.display(
        description="Hero actual"
    )
    def hero_preview(
        self,
        obj,
    ):
        return image_preview(
            (
                obj.hero_image
                if obj
                else None
            ),
            width=520,
            height=260,
        )

    @admin.display(
        description="Sitio"
    )
    def frontend_home(
        self,
        obj,
    ):
        if (
            obj
            and obj.url
        ):
            return format_html(
                '<a href="{}" '
                'target="_blank" '
                'rel="noopener noreferrer" '
                'style="'
                "font-weight:800;"
                "text-decoration:none"
                '">'
                "Abrir frontend ↗"
                "</a>",
                obj.url,
            )

        return frontend_link(
            "/"
        )

    def has_add_permission(
        self,
        request,
    ):
        return (
            not SiteSettings.objects.exists()
            and super().has_add_permission(
                request
            )
        )

    def has_delete_permission(
        self,
        request,
        obj=None,
    ):
        return False
