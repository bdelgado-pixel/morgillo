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
  getArticles,
  getBrands,
  getCampaigns,
  getContent,
  getProducts,
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
  ] =
    await Promise.all([
      getProducts(),
      getBrands(),
      getCampaigns(),
      getArticles(),
    ]);


  const content =
    await getContent();


  return (
    <main>
      <Hero />

      <FeaturedMachinery
        products={
          products
        }
      />

      <Categories />

      <BrandsSection
        brands={brands.filter(
          (brand) =>
            brand.primary !==
            false,
        )}
      />

      <CompanySection />

      <ServicesSection />

      <CampaignFeed
        initial={
          campaigns
        }
        serverNow={
          content.serverNow
        }
        placement="home"
      />

      <NewsSection
        articles={
          articles
        }
      />

      <ContactSection />
    </main>
  );
}                                                                                                                                                           
