import Link from "next/link";
import { PageHeading } from "@/components/ui/SectionHeading";
import { getArticles } from "@/lib/content";
export const metadata = {
  title: "Novedades",
  alternates: { canonical: "/novedades" },
};
export default async function Page() {
  const items = await getArticles();
  return (
    <>
      <PageHeading
        eyebrow="Actualidad Morgillo"
        title="Novedades"
        description="Conoce lo que sucede en Morgillo."
      />
      <section className="morgillo-container section-space">
        {items.length ? (
          <div className="product-grid">
            {items.map((a) => (
              <Link
                className="content-card"
                key={a.slug}
                href={`/novedades/${a.slug}`}
              >
                <h2>{a.title}</h2>
                <p>{a.excerpt}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>{"Pronto tendremos novedades para ti."}</h2>
            <p>Consulta con nuestro equipo para conocer más.</p>
            <Link href="/contacto" className="button button-outline mt-6">
              Contactar →
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
