import type { MetadataRoute } from "next";
import {
  getProducts,
  getBrands,
  getArticles,
  getEvents,
  getSite,
  getServices,
} from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  const services = await getServices();
  const [products, brands, articles, events] = await Promise.all([
    getProducts(),
    getBrands(),
    getArticles(),
    getEvents(),
  ]);
  return [
    "",
    "/maquinaria",
    "/marcas",
    "/servicios",
    "/empresa",
    "/contacto",
    "/eventos",
    "/novedades",
    ...services.map((s) => `/servicios/${s.slug}`),
    ...brands.map((b) => `/marcas/${b.id}`),
    ...products.filter((p) => !p.mock).map((p) => `/maquinaria/${p.slug}`),
    ...articles.map((a) => `/novedades/${a.slug}`),
    ...events.map((e) => `/eventos/${e.slug}`),
  ].map((path) => ({ url: site.url + path }));
}
