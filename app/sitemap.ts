import type {
  MetadataRoute,
} from "next";

import {
  getArticles,
  getBrands,
  getEvents,
  getProducts,
  getServices,
  getSite,
} from "@/lib/content";


export const dynamic =
  "force-dynamic";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    site,
    services,
    products,
    brands,
    articles,
    events,
  ] =
    await Promise.all([
      getSite(),
      getServices(),
      getProducts(),
      getBrands(),
      getArticles(),
      getEvents(),
    ]);


  const paths = [
    "/",

    "/maquinaria",

    "/marcas",

    "/servicios",

    "/empresa",

    "/contacto",

    "/eventos",

    "/novedades",


    /* SERVICES */

    ...services.map(
      (service) =>
        `/servicios/${service.slug}`,
    ),


    /* BRANDS */

    ...brands.map(
      (brand) =>
        `/marcas/${brand.id}`,
    ),


    /* PRODUCTS */

    ...products
      .filter(
        (product) =>
          product.published &&
          !product.mock,
      )
      .map(
        (product) =>
          `/maquinaria/${product.slug}`,
      ),


    /* NEWS */

    ...articles
      .filter(
        (article) =>
          article.published,
      )
      .map(
        (article) =>
          `/novedades/${article.slug}`,
      ),


    /* EVENTS */

    ...events
      .filter(
        (event) =>
          event.published,
      )
      .map(
        (event) =>
          `/eventos/${event.slug}`,
      ),
  ];


  return paths.map(
    (path) => ({
      url:
        new URL(
          path,
          site.url,
        ).toString(),
    }),
  );
}