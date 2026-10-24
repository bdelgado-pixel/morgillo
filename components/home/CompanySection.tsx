import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Sprout, Wrench } from "lucide-react";
import { getSite } from "@/lib/content";
import { company } from "@/data/company";
import styles from "./CompanySection.module.css";

export default async function CompanySection() {
  const site = await getSite();
  return <section id="empresa" className={styles.section} aria-labelledby="company-title">
    <div className="morgillo-container">
      <div className={styles.layout}>
        <div className={styles.photograph}>
          <Image src="/images/company/tractor-en-campo.webp" alt="Tractor Kubota trabajando la tierra en un campo agrícola" fill sizes="(max-width: 850px) 100vw, 50vw" />
          <div className={styles.photoLabel}><Sprout size={20} /><span>Con los pies en el campo.<br /><strong>Con la mirada en tu progreso.</strong></span></div>
          <span className={styles.location}><MapPin size={14} />Tarapoto · San Martín</span>
        </div>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Somos Morgillo</p>
          <h2 id="company-title">{site.companyTitle}</h2>
          <p className={styles.origin}>{company.origin}</p>
          <p className={styles.history}>{company.history}</p>
          <p>{site.companyDescription}</p>
          <Link href="/empresa" className={styles.link}>Conoce nuestra historia<ArrowUpRight size={20} /></Link>
          <div className={styles.support}><Wrench size={23} /><div><strong>El respaldo también cuenta.</strong><span>Asesoría, repuestos y servicio técnico para seguir trabajando.</span></div></div>
        </div>
      </div>
      <div className={styles.purpose}>
        <div><p className={styles.eyebrow}>Lo que nos mueve</p><h3>Tu trabajo tiene un propósito.<br /><span>El nuestro es acompañarte.</span></h3></div>
        <div><strong>Nuestra misión</strong><p>Maquinaria de calidad y respaldo para elegir, operar y mantener tu equipo.</p></div>
        <div><strong>Nuestra visión</strong><p>Ser tu primera opción por la confianza, el rendimiento y la atención.</p><Link href="/empresa#proposito">Conoce nuestro compromiso<ArrowUpRight size={16} /></Link></div>
      </div>
    </div>
  </section>;
}
