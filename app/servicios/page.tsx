import Section from "@/components/home/ServicesSection";
import { PageHeading } from "@/components/ui/SectionHeading";
export const metadata = {
  title: "Servicios",
  alternates: { canonical: "/servicios" },
};
export default function Page() {
  return (
    <>
      <PageHeading eyebrow="Morgillo" title="Servicios" />
      <Section />
    </>
  );
}
