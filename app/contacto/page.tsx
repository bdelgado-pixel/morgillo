import Section from "@/components/home/ContactSection";
import { PageHeading } from "@/components/ui/SectionHeading";
export const metadata = {
  title: "Contacto",
  alternates: { canonical: "/contacto" },
};
export default function Page() {
  return (
    <>
      <PageHeading eyebrow="Morgillo" title="Contacto" />
      <Section />
    </>
  );
}
