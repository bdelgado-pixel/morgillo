import type {
  Metadata,
} from "next";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CampaignFeed from "@/components/campaigns/CampaignFeed";

import {
  getContent,
  getSite,
} from "@/lib/content";


export const dynamic =
  "force-dynamic";


/* =========================================================
   METADATA GLOBAL
========================================================= */

export async function generateMetadata(): Promise<Metadata> {
  const site =
    await getSite();


  return {
    /*
     * IMPORTANTE:
     * Las páginas internas ya definen:
     *
     * "Maquinaria | Morgillo"
     * "Servicios | Morgillo"
     * etc.
     *
     * Por eso NO usamos title.template aquí.
     * Así evitamos:
     *
     * Maquinaria | Morgillo | Morgillo
     */

    title:
      `${site.name} | Maquinaria agrícola y de construcción`,

    description:
      site.seoDescription,

    metadataBase:
      new URL(
        site.url,
      ),

    openGraph: {
      type: "website",

      locale:
        "es_PE",

      siteName:
        site.name,

      images: [
        site.heroImage ||
          "/images/hero-morgillo.webp",
      ],
    },
  };
}


/* =========================================================
   THEME
========================================================= */

const themeScript = `
(function () {
  try {
    var savedTheme = localStorage.getItem("morgillo-theme");

    var dark =
      savedTheme === "dark" ||
      (
        !savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );

    document.documentElement.classList.toggle("dark", dark);

    document.documentElement.style.colorScheme =
      dark
        ? "dark"
        : "light";
  } catch (e) {}
})();
`;


/* =========================================================
   ROOT LAYOUT
========================================================= */

export default async function RootLayout({
  children,
}: {
  children:
    React.ReactNode;
}) {
  const content =
    await getContent();


  return (
    <html
      lang="es"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              themeScript,
          }}
        />
      </head>


      <body>
        {/* ACCESSIBILITY */}

        <a
          className="skip-link"
          href="#contenido"
        >
          Saltar al contenido
        </a>


        {/* HEADER GLOBAL */}

        <Header
          site={
            content.site
          }
          categories={
            content.categories
          }
          brands={content.brands.filter(
            (brand) =>
              brand.primary !==
              false,
          )}
        />


        {/*
         * No usamos <main> aquí.
         *
         * Cada página pública nueva
         * ya tiene su propio <main>.
         *
         * De esta forma evitamos:
         *
         * <main>
         *   <main>...</main>
         * </main>
         */}

        <div
          id="contenido"
          tabIndex={-1}
        >
          {children}
        </div>


        {/* FOOTER GLOBAL */}

        <Footer />


        {/* CAMPAIGN POPUP GLOBAL */}

        <CampaignFeed
          initial={
            content.campaigns
          }
          serverNow={
            content.serverNow
          }
          placement="popup"
        />
      </body>
    </html>
  );
}