import { cache } from "react";
import type { ContentSnapshot } from "@/types/content";
import * as mock from "@/data/mock/content";
import { site, categories } from "@/data/site";
export function cmsOrigin() {
  const value = process.env.CMS_INTERNAL_URL || "http://127.0.0.1:8000";
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("CMS_INTERNAL_URL inválida");
  return url.origin;
}
export const getContent = cache(async (): Promise<ContentSnapshot> => {
  if (process.env.CONTENT_SOURCE === "mock")
    return {
      ...mock,
      categories: [...categories],
      services: [],
      serverNow: new Date().toISOString(),
      site: {
        ...site,
        logo: "/images/logo-morgillo.webp",
        heroImage: "/images/hero-morgillo.webp",
        heroTitle: "Maquinaria para hacer avanzar tus proyectos.",
        heroDescription: "Maquinaria agrícola, construcción e implementos.",
        companyTitle: "Maquinaria que mueve proyectos.",
        companyDescription:
          "Maquinaria agrícola, construcción e implementos, con asesoría, repuestos y servicio técnico.",
        seoDescription: "Maquinaria agrícola y de construcción.",
      },
    };
  const response = await fetch(`${cmsOrigin()}/api/content/`, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`CMS no disponible (${response.status})`);
  const data = (await response.json()) as ContentSnapshot;
  if (
    !data.site ||
    !Array.isArray(data.products) ||
    !Array.isArray(data.brands)
  )
    throw new Error("Respuesta del CMS inválida");
  return data;
});
export async function getProducts() {
  return (await getContent()).products;
}
export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}
export async function getBrands() {
  return (await getContent()).brands;
}
export async function getCategories() {
  return (await getContent()).categories;
}
export async function getCampaigns() {
  return (await getContent()).campaigns;
}
export async function getArticles() {
  return (await getContent()).articles;
}
export async function getEvents() {
  return (await getContent()).events;
}
export async function getSite() {
  return (await getContent()).site;
}
export async function getServices() {
  return (await getContent()).services;
}
