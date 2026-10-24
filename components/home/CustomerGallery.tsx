import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Handshake, Sprout } from "lucide-react";
import styles from "./CustomerGallery.module.css";

const photos = [
  { image: "agricultor-en-campo", alt: "Agricultor al volante de un tractor Kubota en un terreno de cultivo", label: "En el campo", title: "Cada jornada tiene un propósito.", text: "Maquinaria junto a quienes trabajan la tierra.", position: "center" },
  { image: "entrega-tractor-morgillo", alt: "Clientes junto a un tractor y una llave de entrega en las instalaciones de Morgillo", label: "Entregas Morgillo", title: "El comienzo de nuevos proyectos.", text: "Equipos y personas que avanzan juntos.", position: "center 58%" },
  { image: "entrega-excavadora-morgillo", alt: "Clientes y personal junto a una excavadora Kobelco en las instalaciones de Morgillo", label: "También en construcción", title: "Listos para el siguiente desafío.", text: "El respaldo empieza desde la entrega.", position: "center 58%" },
];

export default function CustomerGallery() {
  return <section className={styles.section} id="en-campo" aria-labelledby="customer-gallery-title">
    <div className="morgillo-container">
      <div className={styles.header}>
        <div><p className={styles.eyebrow}><span />Junto a nuestros clientes</p><h2 id="customer-gallery-title">Tu trabajo nos mueve.<br /><span>Tu confianza nos acompaña.</span></h2></div>
        <p>En el campo, en la entrega y en cada nuevo proyecto. Conoce a Morgillo a través de imágenes de nuestros equipos y clientes.</p>
      </div>
      <div className={styles.gallery}>
        {photos.map((photo, index) => <figure key={photo.image} className={index === 0 ? styles.fieldPhoto : styles.deliveryPhoto}>
          <div className={styles.photo}><Image src={`/images/company/${photo.image}.webp`} alt={photo.alt} fill sizes={index === 0 ? "(max-width: 680px) 100vw, (max-width: 1000px) 100vw, 45vw" : "(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 25vw"} style={{ objectPosition: photo.position }} /></div>
          <figcaption><p>{photo.label}</p><h3>{photo.title}</h3><span>{photo.text}</span></figcaption>
        </figure>)}
      </div>
      <div className={styles.footer}><p><Sprout size={21} /><span>Maquinaria para tu trabajo.<strong>Personas para acompañarte.</strong></span></p><Link href="/contacto"><Handshake size={20} />Conversemos sobre tu proyecto<ArrowUpRight size={18} /></Link></div>
    </div>
  </section>;
}
