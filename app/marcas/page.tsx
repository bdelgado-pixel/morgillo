import BrandsSection from "@/components/home/BrandsSection";
import { PageHeading } from "@/components/ui/SectionHeading";
import { getBrands } from "@/lib/content";
export const metadata = {
  title: "Marcas",
  alternates: { canonical: "/marcas" },
};
export default async function Page() {
  return (
    <>
      <PageHeading eyebrow="Morgillo" title="Marcas para cada desafío." />
      <BrandsSection brands={await getBrands()} />
    </>
  );
}
