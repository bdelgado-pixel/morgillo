import { notFound } from "next/navigation";
import { getBrands, getProducts } from "@/lib/content";
import ProductCard from "@/components/catalog/ProductCard";
import { PageHeading } from "@/components/ui/SectionHeading";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const brand = (await getBrands()).find((b) => b.id === slug);
  return {
    title: brand?.name ?? "Marca",
    alternates: { canonical: `/marcas/${slug}` },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const brand = (await getBrands()).find((b) => b.id === slug);
  if (!brand) notFound();
  const products = (await getProducts()).filter((p) => p.brandId === slug);
  return (
    <>
      <PageHeading
        eyebrow="Nuestras marcas"
        title={brand.name}
        description={brand.description}
      />
      <section className="section-space morgillo-container">
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {!products.length && (
          <p className="empty-state">
            Consulta los equipos disponibles con nuestro equipo comercial.
          </p>
        )}
      </section>
    </>
  );
}
