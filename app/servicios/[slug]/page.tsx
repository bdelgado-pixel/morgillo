import { notFound } from "next/navigation";
import { PageHeading } from "@/components/ui/SectionHeading";
import { whatsapp } from "@/data/site";
import { getServices, getSite } from "@/lib/content";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = (await getServices()).find((s) => s.slug === slug);
  return { title: service?.title ?? "Servicios" };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const service = (await getServices()).find((s) => s.slug === slug);
  const site = await getSite();
  if (!service) notFound();
  return (
    <>
      <PageHeading
        eyebrow="Acompañamos tu operación"
        title={service.title}
        description={service.description}
      />
      <section className="morgillo-container section-space">
        {service.requirements.length > 0 && (
          <>
            <h2 className="text-2xl font-bold">Para ayudarte, ten a mano:</h2>
            <ul className="list-disc pl-6 mt-6 space-y-4 muted">
              {service.requirements.map((i, index) => (
                <li key={index}>{i}</li>
              ))}
            </ul>
          </>
        )}
        <a
          href={whatsapp(
            `Hola, quisiera consultar sobre ${service.title.toLowerCase()}.`,
            site.whatsapp,
          )}
          className="button button-red mt-10"
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar atención ↗
        </a>
      </section>
    </>
  );
}
