import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Building2, Check, Compass, Handshake, MapPin, MessageCircle, Package, Phone, Sprout, Target, Wrench } from "lucide-react";
import { getBrands, getCategories, getServices, getSite } from "@/lib/content";
import { company } from "@/data/company";
import { whatsapp } from "@/data/site";
import CustomerGallery from "@/components/home/CustomerGallery";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Empresa | Morgillo",
  description: "Conoce el origen de Morgillo en Tarapoto, nuestra misión y visión, y nuestro compromiso con la agricultura y la construcción.",
  alternates: { canonical: "/empresa" },
};

const commitments = [
  { icon: Handshake, title: "Elegir con confianza", text: "Te orientamos según tu terreno, tu trabajo y el equipo que necesitas." },
  { icon: Wrench, title: "Cuidar tu inversión", text: "Servicio técnico y mantenimiento para acompañar la operación de tu maquinaria." },
  { icon: Package, title: "Seguir trabajando", text: "Asesoría para encontrar los repuestos e implementos que necesita tu equipo." },
];

function tel(value: string) { const digits = value.replace(/\D/g, ""); return `tel:+${digits.startsWith("51") ? digits : `51${digits}`}`; }

export default async function CompanyPage() {
  const [site, brands, categories, services] = await Promise.all([getSite(), getBrands(), getCategories(), getServices()]);
  const contact = whatsapp("Hola, quisiera conocer las soluciones de maquinaria y respaldo de Morgillo.", site.whatsapp);
  return <main className={styles.page}>
    <section className={styles.hero} aria-labelledby="company-page-title">
      <Image src="/images/company/arrozales-morgillo.webp" alt="Tractor trabajando en un arrozal rodeado de vegetación" fill priority sizes="100vw" className={styles.heroPhoto} />
      <div className={styles.heroShade} />
      <div className={`morgillo-container ${styles.heroInner}`}>
        <nav aria-label="Ruta de navegación" className={styles.breadcrumb}><Link href="/">Inicio</Link><span>/</span><span>Empresa</span></nav>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Morgillo · Tarapoto, San Martín</p>
          <h1 id="company-page-title">Nuestra historia<br />empieza <em>en el campo.</em></h1>
          <p>Maquinaria y respaldo para quienes trabajan la tierra y construyen el futuro.</p>
          <a href="#historia" className={styles.primary}>Conoce Morgillo<ArrowDown size={18} /></a>
        </div>
        <div className={styles.heroTag}><Sprout size={24} /><span>Raíces en la selva.<strong>Compromiso con tu trabajo.</strong></span></div>
      </div>
    </section>

    <div className={styles.context}><div className="morgillo-container"><span><Sprout size={19} />Agricultura</span><span><Building2 size={19} />Construcción</span><span><Wrench size={19} />Servicio y repuestos</span></div></div>

    <section id="historia" className={styles.section} aria-labelledby="history-title"><div className={`morgillo-container ${styles.story}`}>
      <div><p className={styles.eyebrow}>Quiénes somos</p><h2 id="history-title">Bienvenido a<br /><em>Morgillo.</em></h2><p className={styles.lead}>{company.about[0]}</p><p>{company.about[1]}</p><p>{company.about[2]}</p><a href={contact} target="_blank" rel="noopener noreferrer" className={styles.textLink}>Conversemos sobre tu proyecto<ArrowUpRight size={19} /></a></div>
      <figure className={styles.storyPhoto}><div><Image src="/images/company/tractor-en-campo.webp" alt="Tractor Kubota preparando el terreno agrícola" fill sizes="(max-width: 850px) 100vw, 45vw" /></div><figcaption><MapPin size={15} />Del trabajo en campo a tu próximo proyecto.</figcaption></figure>
    </div></section>

    <section id="proposito" className={`${styles.section} ${styles.purpose}`} aria-labelledby="purpose-title"><div className="morgillo-container">
      <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Nuestro propósito</p><h2 id="purpose-title">Lo que hacemos.<br /><em>Hacia dónde vamos.</em></h2></div><p>Una misma dirección: ayudarte a avanzar con equipos y atención en los que puedas confiar.</p></div>
      <div className={styles.purposeGrid}><article><span className={styles.purposeIcon}><Target size={27} /></span><p>Nuestra misión</p><h3>Equiparte para avanzar.</h3><p>{company.mission}</p></article><article><span className={styles.purposeIcon}><Compass size={27} /></span><p>Nuestra visión</p><h3>Ser tu primera opción.</h3><p>{company.vision}</p></article></div>
    </div></section>

    <section className={styles.section} aria-labelledby="commitment-title"><div className="morgillo-container">
      <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Nuestro compromiso</p><h2 id="commitment-title">La máquina importa.<br /><em>El respaldo también.</em></h2></div><p>Desde la primera consulta hasta el cuidado de tu equipo: contamos con asesoría, repuestos y servicio técnico.</p></div>
      <div className={styles.commitments}>{commitments.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={28} strokeWidth={1.6} /><h3>{title}</h3><p>{text}</p></article>)}</div>
      <div className={styles.support}><div className={styles.supportPhoto}><Image src="/images/company/servicio-tecnico-morgillo.webp" alt="Técnico de Morgillo realizando mantenimiento de un tractor en el taller" fill sizes="(max-width: 850px) 100vw, 45vw" /></div><div className={styles.supportCopy}><p className={styles.eyebrow}>Después de la entrega</p><h3>Tu equipo sigue.<br />Nosotros te acompañamos.</h3>{services.length > 0 ? <ul>{services.map(service => <li key={service.slug}><Link href={`/servicios/${service.slug}`}><Check size={16} />{service.title}<ArrowUpRight size={17} /></Link></li>)}</ul> : <p>Consulta por mantenimiento, repuestos y atención técnica para tu maquinaria.</p>}<Link href="/servicios" className={styles.textLink}>Ver nuestros servicios<ArrowUpRight size={18} /></Link></div></div>
    </div></section>

    {categories.length > 0 && <section className={`${styles.section} ${styles.solutions}`} aria-labelledby="solutions-title"><div className="morgillo-container"><div className={styles.sectionHeader}><div><p className={styles.eyebrow}>Soluciones Morgillo</p><h2 id="solutions-title">Cada trabajo necesita<br /><em>el equipo indicado.</em></h2></div><Link href="/maquinaria" className={styles.textLink}>Explorar maquinaria<ArrowUpRight size={19} /></Link></div><div className={styles.categoryGrid}>{categories.map(category => <Link key={category.id} href={`/maquinaria?categoria=${category.id}`} className={styles.category}>{category.image && <div className={styles.categoryPhoto}><Image src={category.image} alt={category.name} fill sizes="(max-width: 650px) 100vw, 33vw" /></div>}<div><h3>{category.name}</h3><p>{category.description}</p><span>Ver equipos<ArrowUpRight size={18} /></span></div></Link>)}</div>{brands.length > 0 && <div className={styles.brands}><strong>Conoce nuestras marcas</strong><div>{brands.map(brand => <Link href={`/marcas/${brand.id}`} key={brand.id}>{brand.name}<ArrowUpRight size={14} /></Link>)}</div></div>}</div></section>}

    <CustomerGallery />

    <section className={styles.contact} aria-labelledby="company-contact-title"><div className="morgillo-container"><p className={styles.eyebrow}>Hablemos de tu próximo proyecto</p><h2 id="company-contact-title">Estamos para ayudarte<br />a dar el siguiente paso.</h2><div className={styles.contactActions}><a href={contact} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} />Consultar por WhatsApp<ArrowUpRight size={19} /></a><Link href="/contacto">Ver todos los contactos<ArrowUpRight size={19} /></Link></div><div className={styles.contactDetails}><span><MapPin size={17} />{site.address}</span><a href={tel(site.phone)}><Phone size={17} />Ventas: {site.phone}</a><a href={tel(site.office)}>Oficina: {site.office}</a><a href={tel(site.service)}>Servicio: {site.service}</a><a href="tel:+51942012195">Repuestos: 942 012 195</a></div></div></section>
  </main>;
}
