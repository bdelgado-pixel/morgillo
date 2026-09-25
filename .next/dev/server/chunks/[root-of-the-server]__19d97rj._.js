module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[project]/app/api/campaigns/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content/index.ts [app-route] (ecmascript)");
;
const dynamic = "force-dynamic";
async function GET() {
    try {
        if (process.env.CONTENT_SOURCE === "mock") return Response.json({
            campaigns: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCampaigns"])(),
            serverNow: new Date().toISOString()
        });
        const response = await fetch(`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cmsOrigin"])()}/api/campaigns/`, {
            cache: "no-store",
            signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) throw new Error("CMS unavailable");
        return Response.json(await response.json(), {
            headers: {
                "Cache-Control": "no-store"
            }
        });
    } catch  {
        return Response.json({
            error: "Campañas no disponibles"
        }, {
            status: 503,
            headers: {
                "Cache-Control": "no-store"
            }
        });
    }
}
}),
"[project]/data/mock/content.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "articles",
    ()=>articles,
    "brands",
    ()=>brands,
    "campaigns",
    ()=>campaigns,
    "events",
    ()=>events,
    "products",
    ()=>products
]);
const brands = [
    {
        id: "kubota",
        name: "KUBOTA",
        description: "Soluciones para el trabajo agrícola.",
        image: "/images/brands/kubota.webp"
    },
    {
        id: "kobelco",
        name: "KOBELCO",
        description: "Maquinaria para tus proyectos de construcción.",
        image: "/images/brands/kobelco.webp"
    },
    {
        id: "bull",
        name: "BULL",
        description: "Equipos para construcción y movimiento de tierra.",
        image: "/images/brands/bull.webp"
    }
];
const products = [
    {
        id: "demo-agricola",
        slug: "demo-tractor",
        name: "Tractor agrícola",
        model: "Modelo por confirmar",
        brandId: "kubota",
        category: "agricola",
        description: "Ficha de demostración. El modelo, las características y la disponibilidad deberán confirmarse antes de su publicación comercial.",
        images: [
            {
                id: "agricola",
                url: "/images/machinery/maquinaria-agricola.webp",
                alt: "Imagen de referencia de maquinaria agrícola",
                kind: "image"
            }
        ],
        documents: [],
        specifications: [],
        featured: true,
        published: true,
        mock: true
    },
    {
        id: "demo-kobelco",
        slug: "demo-excavadora",
        name: "Excavadora",
        model: "Modelo por confirmar",
        brandId: "kobelco",
        category: "construccion",
        description: "Ficha de demostración para un equipo de construcción. Las especificaciones técnicas se incorporarán desde la documentación oficial del modelo.",
        images: [
            {
                id: "kobelco",
                url: "/images/machinery/KOBELCO.webp",
                alt: "Imagen de referencia de maquinaria Kobelco",
                kind: "image"
            }
        ],
        documents: [],
        specifications: [],
        featured: true,
        published: true,
        mock: true
    },
    {
        id: "demo-bull",
        slug: "demo-bull",
        name: "Equipo de construcción",
        model: "Modelo por confirmar",
        brandId: "bull",
        category: "construccion",
        description: "Ficha de demostración de la línea BULL. Consulta al equipo comercial por los modelos disponibles.",
        images: [
            {
                id: "bull",
                url: "/images/machinery/BULL.webp",
                alt: "Imagen de referencia de maquinaria BULL",
                kind: "image"
            }
        ],
        documents: [],
        specifications: [],
        featured: true,
        published: true,
        mock: true
    },
    {
        id: "demo-implemento",
        slug: "demo-implemento",
        name: "Implemento agrícola",
        model: "Modelo por confirmar",
        brandId: "",
        category: "implementos",
        description: "Ficha de demostración. La marca, compatibilidad y características deben verificarse antes de publicar este equipo.",
        images: [
            {
                id: "implemento",
                url: "/images/machinery/IMPLEMENTOS.webp",
                alt: "Imagen de referencia de implemento agrícola",
                kind: "image"
            }
        ],
        documents: [],
        specifications: [],
        featured: false,
        published: true,
        mock: true
    }
];
const campaigns = [];
const articles = [];
const events = [];
}),
"[project]/data/site.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "navigation",
    ()=>navigation,
    "site",
    ()=>site,
    "whatsapp",
    ()=>whatsapp
]);
const site = {
    name: "Morgillo",
    url: "https://morgillo.pe",
    phone: "994 974 243",
    whatsapp: "51994974243",
    office: "976 080 995",
    service: "942 420 214",
    address: "Vía de Evitamiento Cdra. 28, Tarapoto",
    hours: "Lunes a sábado · 8:00 – 19:00",
    // Datos contrastados con la portada oficial. Confirmar vigencia antes de publicar.
    social: [
        {
            label: "Facebook",
            href: "https://www.facebook.com/maquinariapesadaconstruccionyagricultura"
        },
        {
            label: "Instagram",
            href: "https://www.instagram.com/morgillomaquinaria/"
        },
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/company/morgillo-selva-sac/"
        },
        {
            label: "YouTube",
            href: "https://www.youtube.com/channel/UC5hn7bljPrZB2HIeuwAIzRw/videos"
        }
    ]
};
const categories = [
    {
        id: "agricola",
        name: "Agrícola",
        brand: "Kubota",
        image: "/images/machinery/maquinaria-agricola.webp",
        description: "Equipos para acompañar cada etapa del trabajo en el campo."
    },
    {
        id: "construccion",
        name: "Construcción",
        brand: "Kobelco · BULL",
        image: "/images/machinery/KOBELCO.webp",
        description: "Maquinaria para excavación y movimiento de tierra."
    },
    {
        id: "implementos",
        name: "Implementos",
        brand: "Complementa tu equipo",
        image: "/images/machinery/IMPLEMENTOS.webp",
        description: "Encuentra el complemento adecuado para tu operación."
    }
];
const navigation = [
    {
        href: "/servicios",
        label: "Servicios"
    },
    {
        href: "/eventos",
        label: "Eventos"
    },
    {
        href: "/novedades",
        label: "Novedades"
    },
    {
        href: "/empresa",
        label: "Empresa"
    },
    {
        href: "/contacto",
        label: "Contacto"
    }
];
function whatsapp(message = "Hola, quisiera información sobre maquinaria Morgillo.", phone = site.whatsapp) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
}),
"[project]/lib/content/index.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cmsOrigin",
    ()=>cmsOrigin,
    "getArticles",
    ()=>getArticles,
    "getBrands",
    ()=>getBrands,
    "getCampaigns",
    ()=>getCampaigns,
    "getCategories",
    ()=>getCategories,
    "getContent",
    ()=>getContent,
    "getEvents",
    ()=>getEvents,
    "getProduct",
    ()=>getProduct,
    "getProducts",
    ()=>getProducts,
    "getServices",
    ()=>getServices,
    "getSite",
    ()=>getSite
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mock$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/mock/content.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$site$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/site.ts [app-route] (ecmascript)");
;
;
;
function cmsOrigin() {
    const value = process.env.CMS_INTERNAL_URL || "http://127.0.0.1:8000";
    const url = new URL(value);
    if (![
        "http:",
        "https:"
    ].includes(url.protocol) || url.username || url.password) throw new Error("CMS_INTERNAL_URL inválida");
    return url.origin;
}
const getContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cache"])(async ()=>{
    if (process.env.CONTENT_SOURCE === "mock") return {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$mock$2f$content$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
        categories: [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$site$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["categories"]
        ],
        services: [],
        serverNow: new Date().toISOString(),
        site: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$site$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["site"],
            logo: "/images/logo-morgillo.webp",
            heroImage: "/images/hero-morgillo.webp",
            heroTitle: "Maquinaria para hacer avanzar tus proyectos.",
            heroDescription: "Maquinaria agrícola, construcción e implementos.",
            companyTitle: "Maquinaria que mueve proyectos.",
            companyDescription: "Maquinaria agrícola, construcción e implementos, con asesoría, repuestos y servicio técnico.",
            seoDescription: "Maquinaria agrícola y de construcción."
        }
    };
    const response = await fetch(`${cmsOrigin()}/api/content/`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`CMS no disponible (${response.status})`);
    const data = await response.json();
    if (!data.site || !Array.isArray(data.products) || !Array.isArray(data.brands)) throw new Error("Respuesta del CMS inválida");
    return data;
});
async function getProducts() {
    return (await getContent()).products;
}
async function getProduct(slug) {
    return (await getProducts()).find((p)=>p.slug === slug);
}
async function getBrands() {
    return (await getContent()).brands;
}
async function getCategories() {
    return (await getContent()).categories;
}
async function getCampaigns() {
    return (await getContent()).campaigns;
}
async function getArticles() {
    return (await getContent()).articles;
}
async function getEvents() {
    return (await getContent()).events;
}
async function getSite() {
    return (await getContent()).site;
}
async function getServices() {
    return (await getContent()).services;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__19d97rj._.js.map