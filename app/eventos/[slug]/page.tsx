import { notFound } from "next/navigation";
import Image from "next/image";
import { getEvents } from "@/lib/content";
import { PageHeading } from "@/components/ui/SectionHeading";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = (await getEvents()).find((x) => x.slug === slug);
  return {
    title: item?.title ?? "Eventos",
    alternates: { canonical: `/eventos/${slug}` },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const item = (await getEvents()).find((x) => x.slug === slug);
  if (!item) notFound();
  return (
    <>
      <PageHeading
        eyebrow="Eventos"
        title={item.title}
        description={item.excerpt}
      />
      <article className="morgillo-container section-space max-w-4xl">
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            width={1200}
            height={700}
            className="w-full mb-8"
          />
        )}
        <time dateTime={item.publishedAt} className="muted">
          {new Date(item.publishedAt).toLocaleDateString("es-PE", {
            timeZone: "America/Lima",
          })}
        </time>
        <p className="mt-4">
          {item.place} ·{" "}
          {new Date(item.start).toLocaleDateString("es-PE", {
            timeZone: "America/Lima",
          })}{" "}
          –{" "}
          {new Date(item.end).toLocaleDateString("es-PE", {
            timeZone: "America/Lima",
          })}
        </p>
        <div className="whitespace-pre-line leading-8 mt-6">{item.body}</div>
      </article>
    </>
  );
}
