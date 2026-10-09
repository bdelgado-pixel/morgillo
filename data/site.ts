export const site = {
  name: "Morgillo",

  url: "https://morgillo.pe",

  phone: "994 974 243",

  whatsapp: "51994974243",

  office: "976 080 995",

  service: "942 420 214",

  address:
    "Vía de Evitamiento Cdra. 28, Tarapoto",

  hours:
    "Lunes a sábado · 8:00 – 19:00",

  webmail:
    "https://webmail.supremecluster.com/",

  // Datos contrastados con la portada oficial.
  // Confirmar vigencia antes de publicar.
  social: [
    {
      label: "Facebook",
      href:
        "https://www.facebook.com/maquinariapesadaconstruccionyagricultura",
    },

    {
      label: "Instagram",
      href:
        "https://www.instagram.com/morgillomaquinaria/",
    },

    {
      label: "LinkedIn",
      href:
        "https://www.linkedin.com/company/morgillo-selva-sac/",
    },

    {
      label: "YouTube",
      href:
        "https://www.youtube.com/channel/UC5hn7bljPrZB2HIeuwAIzRw/videos",
    },
  ],
};


export const categories = [
  {
    id: "agricola",

    name: "Agrícola",

    brand: "Kubota",

    image:
      "/images/machinery/maquinaria-agricola.webp",

    description:
      "Equipos para acompañar cada etapa del trabajo en el campo.",
  },

  {
    id: "construccion",

    name: "Construcción",

    brand:
      "Kobelco · BULL",

    image:
      "/images/machinery/KOBELCO.webp",

    description:
      "Maquinaria para excavación y movimiento de tierra.",
  },

  {
    id: "implementos",

    name: "Implementos",

    brand:
      "Complementa tu equipo",

    image:
      "/images/machinery/IMPLEMENTOS.webp",

    description:
      "Encuentra el complemento adecuado para tu operación.",
  },
] as const;


export const navigation = [
  {
    href: "/servicios",
    label: "Servicios",
  },

  {
    href: "/eventos",
    label: "Eventos",
  },

  {
    href: "/novedades",
    label: "Novedades",
  },

  {
    href: "/empresa",
    label: "Empresa",
  },

  {
    href: "/contacto",
    label: "Contacto",
  },
];


export function whatsapp(
  message =
    "Hola, quisiera información sobre maquinaria Morgillo.",

  phone =
    site.whatsapp,
) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;
}