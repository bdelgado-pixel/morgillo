import Section from "@/components/home/CompanySection";
import { PageHeading } from "@/components/ui/SectionHeading";
export const metadata = {
  title: "Empresa",
  alternates: { canonical: "/empresa" },
};
export default function Page() {
  return (
    <>
      <PageHeading eyebrow="Morgillo" title="Empresa" />
      <Section />
    </>
  );
}
