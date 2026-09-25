import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CampaignFeed from "@/components/campaigns/CampaignFeed";
import { getContent, getSite } from "@/lib/content";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: {
      default: `${site.name} | Maquinaria agrícola y de construcción`,
      template: `%s | ${site.name}`,
    },
    description: site.seoDescription,
    metadataBase: new URL(site.url),
    openGraph: {
      type: "website",
      locale: "es_PE",
      siteName: site.name,
      images: [site.heroImage || "/images/hero-morgillo.webp"],
    },
  };
}
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
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <Header
          site={content.site}
          categories={content.categories}
          brands={content.brands.filter((b) => b.primary !== false)}
        />
        <main id="contenido">{children}</main>
        <Footer />
        <CampaignFeed
          initial={content.campaigns}
          serverNow={content.serverNow}
          placement="popup"
        />
      </body>
    </html>
  );
}
