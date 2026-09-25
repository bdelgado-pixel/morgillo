import Hero from "@/components/home/Hero";
import FeaturedMachinery from "@/components/home/FeaturedMachinery";
import Categories from "@/components/home/Categories";
import BrandsSection from "@/components/home/BrandsSection";
import ServicesSection from "@/components/home/ServicesSection";
import CompanySection from "@/components/home/CompanySection";
import ContactSection from "@/components/home/ContactSection";
import NewsSection from "@/components/home/NewsSection";
import CampaignFeed from "@/components/campaigns/CampaignFeed";

import {
  getProducts,
  getBrands,
  getCampaigns,
  getArticles,
  getContent,
} from "@/lib/content";

export const metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const [
    products,
    brands,
    campaigns,
    articles,
    content,
  ] = await Promise.all([
    getProducts(),
    getBrands(),
    getCampaigns(),
    getArticles(),
    getContent(),
  ]);

  const primaryBrands = brands.filter(
    (brand) => brand.primary !== false,
  );

  return (
    <div className="morgillo-home-page">
      {/* =============================================
          HERO
      ============================================== */}

      <Hero />

      {/* =============================================
          01 — MAQUINARIA DESTACADA
      ============================================== */}

      <FeaturedMachinery products={products} />

      {/* =============================================
          02 — CATEGORÍAS
      ============================================== */}

      <Categories />

      {/* =============================================
          03 — MARCAS
      ============================================== */}

      <BrandsSection brands={primaryBrands} />

      {/* =============================================
          04 — SERVICIOS
      ============================================== */}

      <ServicesSection />

      {/* =============================================
          05 — EMPRESA
      ============================================== */}

      <CompanySection />

      {/* =============================================
          CAMPAÑA ACTIVA
      ============================================== */}

      <div className="morgillo-home-campaign">
        <CampaignFeed
          initial={campaigns}
          serverNow={content.serverNow}
          placement="home"
        />
      </div>

      {/* =============================================
          06 — NOVEDADES
      ============================================== */}

      <NewsSection articles={articles} />

      {/* =============================================
          07 — CONTACTO
      ============================================== */}

      <ContactSection />
    </div>
  );
}