import type { Brand, Product, Campaign, Article, Event } from "@/types/content";
export const brands: Brand[] = [
  {
    id: "kubota",
    name: "KUBOTA",
    description: "Soluciones para el trabajo agrícola.",
    image: "/images/brands/kubota.webp",
  },
  {
    id: "kobelco",
    name: "KOBELCO",
    description: "Maquinaria para tus proyectos de construcción.",
    image: "/images/brands/kobelco.webp",
  },
  {
    id: "bull",
    name: "BULL",
    description: "Equipos para construcción y movimiento de tierra.",
    image: "/images/brands/bull.webp",
  },
];
// Muestras de estructura, NO modelos ni disponibilidad comercial confirmados.
export const products: Product[] = [
  {
    id: "demo-agricola",
    slug: "demo-tractor",
    name: "Tractor agrícola",
    model: "Modelo por confirmar",
    brandId: "kubota",
    category: "agricola",
    description:
      "Ficha de demostración. El modelo, las características y la disponibilidad deberán confirmarse antes de su publicación comercial.",
    images: [
      {
        id: "agricola",
        url: "/images/machinery/maquinaria-agricola.webp",
        alt: "Imagen de referencia de maquinaria agrícola",
        kind: "image",
      },
    ],
    documents: [],
    specifications: [],
    featured: true,
    published: true,
    mock: true,
  },
  {
    id: "demo-kobelco",
    slug: "demo-excavadora",
    name: "Excavadora",
    model: "Modelo por confirmar",
    brandId: "kobelco",
    category: "construccion",
    description:
      "Ficha de demostración para un equipo de construcción. Las especificaciones técnicas se incorporarán desde la documentación oficial del modelo.",
    images: [
      {
        id: "kobelco",
        url: "/images/machinery/KOBELCO.webp",
        alt: "Imagen de referencia de maquinaria Kobelco",
        kind: "image",
      },
    ],
    documents: [],
    specifications: [],
    featured: true,
    published: true,
    mock: true,
  },
  {
    id: "demo-bull",
    slug: "demo-bull",
    name: "Equipo de construcción",
    model: "Modelo por confirmar",
    brandId: "bull",
    category: "construccion",
    description:
      "Ficha de demostración de la línea BULL. Consulta al equipo comercial por los modelos disponibles.",
    images: [
      {
        id: "bull",
        url: "/images/machinery/BULL.webp",
        alt: "Imagen de referencia de maquinaria BULL",
        kind: "image",
      },
    ],
    documents: [],
    specifications: [],
    featured: true,
    published: true,
    mock: true,
  },
  {
    id: "demo-implemento",
    slug: "demo-implemento",
    name: "Implemento agrícola",
    model: "Modelo por confirmar",
    brandId: "",
    category: "implementos",
    description:
      "Ficha de demostración. La marca, compatibilidad y características deben verificarse antes de publicar este equipo.",
    images: [
      {
        id: "implemento",
        url: "/images/machinery/IMPLEMENTOS.webp",
        alt: "Imagen de referencia de implemento agrícola",
        kind: "image",
      },
    ],
    documents: [],
    specifications: [],
    featured: false,
    published: true,
    mock: true,
  },
];
export const campaigns: Campaign[] = [];
export const articles: Article[] = [];
export const events: Event[] = [];
