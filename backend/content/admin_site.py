"""Permission-aware navigation and live editorial dashboard for Morgillo."""
from django.contrib.admin import AdminSite
from django.contrib.admin.apps import AdminConfig
from django.db.models import Count, Q
from django.urls import reverse
from django.utils import timezone


class MorgilloAdminConfig(AdminConfig):
    default_site = "content.admin_site.MorgilloAdminSite"


MODULES = (
    ("Catálogo", "product", "Maquinaria", "tractor", "Equipos, fotografías y fichas técnicas", "Nuevo equipo"),
    ("Catálogo", "brand", "Marcas", "layers", "Marcas y representación comercial", "Nueva marca"),
    ("Catálogo", "category", "Categorías", "grid", "Agricultura, construcción e implementos", "Nueva categoría"),
    ("Contenido", "mediaasset", "Biblioteca", "image", "Imágenes y documentos de tu web", "Subir archivo"),
    ("Contenido", "article", "Novedades", "file", "Noticias, anuncios y publicaciones", "Nueva novedad"),
    ("Contenido", "event", "Eventos", "calendar", "Ferias, encuentros y exposiciones", "Nuevo evento"),
    ("Contenido", "campaign", "Campañas", "megaphone", "Banners y promociones programadas", "Nueva campaña"),
    ("Empresa", "service", "Servicios", "tool", "Servicio técnico y atención al cliente", "Nuevo servicio"),
    ("Empresa", "sitesettings", "Configuración", "settings", "Empresa, contacto e identidad del sitio", "Configurar sitio"),
)


class MorgilloAdminSite(AdminSite):
    site_header = "MORGILLO · Administración"
    site_title = "Morgillo CMS"
    index_title = "Resumen general"

    def each_context(self, request):
        from .models import SiteSettings
        context = super().each_context(request)
        settings = SiteSettings.objects.only("url").first()
        if settings:
            context["site_url"] = settings.url.rstrip("/")
        models = {(app["app_label"], model["object_name"].lower()): model
                  for app in context["available_apps"] for model in app["models"]}
        groups, modules = {}, []
        for group, name, label, icon, description, create_label in MODULES:
            model = models.pop(("content", name), None)
            if not model:
                continue
            url = model.get("admin_url") or model.get("add_url")
            module = {**model, "key": name, "label": label, "icon": icon,
                      "description": description, "create_label": create_label,
                      "url": url, "current": bool(url and request.path.startswith(url))}
            groups.setdefault(group, []).append(module)
            modules.append(module)
        for (_, name), model in models.items():
            url = model.get("admin_url") or model.get("add_url")
            groups.setdefault("Administración", []).append({
                **model, "key": name, "label": model["name"], "icon": "users",
                "url": url, "current": bool(url and request.path.startswith(url))})
        context.update({
            "cms_navigation": [{"label": label, "items": items} for label, items in groups.items()],
            "cms_modules": modules,
            "cms_current": next((item for item in modules if item["current"]), None),
            "cms_is_home": request.path == reverse("admin:index", current_app=self.name),
        })
        return context

    def index(self, request, extra_context=None):
        from .models import Article, Campaign, Category, Event, MediaAsset, Product
        context = self.each_context(request)
        modules = context["cms_modules"]
        visible = {item["key"]: item for item in modules if item.get("admin_url")}
        stats, attention, agenda = [], [], []
        now = timezone.now()

        def queryset(model):
            return self._registry[model].get_queryset(request)

        for item in modules:
            if item["key"] in visible:
                model = next(model for model in self._registry if model._meta.model_name == item["key"])
                item["count"] = queryset(model).count()
        if "product" in visible:
            products = queryset(Product)
            totals = products.aggregate(total=Count("pk"), published=Count("pk", filter=Q(published=True)))
            stats.append({"label": "Equipos en catálogo", "value": totals["total"],
                          "detail": f'{totals["published"]} publicados · {totals["total"] - totals["published"]} borradores',
                          "url": visible["product"]["url"], "icon": "tractor", "tone": "red"})
            for relation, key, label, hint in (
                ("gallery", "photos", "Equipos sin fotografías", "Completa su galería para presentar mejor cada equipo."),
                ("specifications", "specs", "Equipos sin especificaciones", "Añade características para ayudar al cliente a elegir."),
                ("documents", "documents", "Equipos sin ficha PDF", "Revisa si tienes un documento técnico disponible."),
            ):
                count = products.filter(**{f"{relation}__isnull": True}).distinct().count()
                if count:
                    attention.append({"label": label, "count": count, "hint": hint,
                                      "url": f'{visible["product"]["url"]}?review={key}'})
            context["cms_recent_products"] = products.order_by("-updated_at")[:4]
            if "category" in visible:
                categories = list(queryset(Category).annotate(equipment_count=Count("product")))
                for category in categories:
                    category.share = round(category.equipment_count / totals["total"] * 100) if totals["total"] else 0
                    category.cms_url = f'{visible["product"]["url"]}?category__id__exact={category.pk}'
                context["cms_categories"] = categories
            context["cms_product_module"] = visible["product"]
        if "mediaasset" in visible:
            totals = queryset(MediaAsset).aggregate(images=Count("pk", filter=Q(kind="image")), pdfs=Count("pk", filter=Q(kind="pdf")))
            stats.append({"label": "Archivos de biblioteca", "value": totals["images"] + totals["pdfs"],
                          "detail": f'{totals["images"]} imágenes · {totals["pdfs"]} documentos PDF',
                          "url": visible["mediaasset"]["url"], "icon": "image", "tone": "blue"})
        if "article" in visible:
            articles = queryset(Article)
            live = articles.filter(published=True, published_at__lte=now).count()
            stats.append({"label": "Novedades publicadas", "value": live,
                          "detail": f'{articles.count()} publicaciones en total',
                          "url": visible["article"]["url"], "icon": "file", "tone": "green"})
        if "campaign" in visible:
            campaigns = queryset(Campaign)
            live = campaigns.filter(active=True, start__lte=now, end__gte=now).count()
            stats.append({"label": "Campañas vigentes", "value": live,
                          "detail": f'{campaigns.filter(active=True, start__gt=now).count()} programadas para después',
                          "url": visible["campaign"]["url"], "icon": "megaphone", "tone": "amber"})
        for name, model in (("event", Event), ("campaign", Campaign)):
            if name not in visible:
                continue
            entries = queryset(model).filter(end__gte=now)
            entries = entries.filter(published=True, published_at__lte=now) if name == "event" else entries.filter(active=True)
            for entry in entries.order_by("start")[:3]:
                agenda.append({"title": entry.title, "start": entry.start, "end": entry.end,
                               "label": "Evento" if name == "event" else "Campaña", "place": entry.place,
                               "url": reverse(f"admin:content_{name}_change", args=[entry.pk], current_app=self.name)})
        activity = []
        for log in self.get_log_entries(request).select_related("content_type", "user")[:20]:
            model = log.content_type.model_class() if log.content_type else None
            model_admin = self._registry.get(model)
            if model_admin and model_admin.has_view_or_change_permission(request):
                activity.append(log)
            if len(activity) == 5:
                break
        context.update({
            "cms_stats": stats, "cms_attention": attention, "cms_can_review": "product" in visible,
            "cms_agenda": sorted(agenda, key=lambda item: item["start"])[:4], "cms_activity": activity,
            "cms_quick_actions": [item for item in modules if item.get("add_url") and item["key"] in ("product", "mediaasset", "article", "campaign")],
        })
        return super().index(request, extra_context={**context, **(extra_context or {})})
