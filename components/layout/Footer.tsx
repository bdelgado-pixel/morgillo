
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";

import {
  navigation,
  site as siteConfig,
  whatsapp,
} from "@/data/site";

import { getSite } from "@/lib/content";
import { partsPhone } from "@/lib/contact";
import styles from "./Footer.module.css";

/* =========================================
   SEDES MORGILLO
========================================= */

const sedesMorgillo = [

  {
    nombre: "Pucallpa",
    direccion:
      "Sector Santa Teresita, parcela El Arca de Noé, lote B2, Campo Verde, Ucayali, Perú",
  },
  {
    nombre: "Cusco",
    direccion:
      "Chingo Grande S/N, Saylla, Cusco, Perú",
  },
  {
    nombre: "Ica",
    direccion:
      "Panamericana Sur, km 296.20, Subtanjalla, Ica, Perú",
  },
  {
    nombre: "Huancayo",
    direccion:
      "Carretera Central, km 13.5, Hualhuas, Junín, Perú",
  },
  {
    nombre: "Lambayeque",
    direccion:
      "Sector Mocce, sublote 02, Lambayeque, Perú",
  },
  {
    nombre: "Callao",
    direccion:
      "Av. Guardia Chalaca 1802, Bellavista, Callao, Perú",
  },
];

function mapsHref(address: string) {
  return (
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(address)
  );
}

function phoneHref(value: string) {
  const digits = value.replace(/\D/g, "");

  const normalized = digits.startsWith("51")
    ? digits
    : `51${digits}`;

  return `tel:+${normalized}`;
}

/* =========================================
   FOOTER
========================================= */

export default async function Footer() {
  const site = await getSite();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>

      {/* RED LINE */}
      <div
        className={styles.topLine}
        aria-hidden="true"
      >
        <span />
      </div>

      <div className="morgillo-container">
        <div className={styles.main}>

          {/* =================================
              BRAND
          ================================= */}

          <div className={styles.brandColumn}>

            <Link
              href="/"
              className={styles.brand}
              aria-label="Morgillo, inicio"
            >
              <Image
                src={
                  site.logo ||
                  "/images/logo-morgillo.webp"
                }
                alt="Morgillo"
                width={190}
                height={70}
                className={styles.logo}
              />
            </Link>

            <p className={styles.description}>
              {site.companyDescription}
            </p>

            <Link
              href="/maquinaria"
              className={styles.primaryCta}
            >
              <span>Ver maquinaria</span>

              <span aria-hidden="true">
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.8}
                />
              </span>
            </Link>

            <div className={styles.areas}>
              <span>Agricultura</span>
              <i />
              <span>Construcción</span>
              <i />
              <span>Implementos</span>
            </div>

          </div>

          {/* =================================
              COLUMNAS
          ================================= */}

          <div className={styles.links}>

            {/* NAVEGACIÓN */}

            <div className={styles.column}>
              <div className={styles.columnTitle}>
                <h2>Navegación</h2>
              </div>

              <nav
                aria-label="Navegación del pie de página"
                className={styles.nav}
              >
                <FooterLink
                  href="/maquinaria"
                  label="Maquinaria"
                />

                <FooterLink
                  href="/marcas"
                  label="Marcas"
                />

                {navigation.map((item) => (
                  <FooterLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                  />
                ))}

                <a
                  href={siteConfig.webmail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.navLink}
                >
                  <span>Webmail</span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </a>
              </nav>
            </div>

            {/* =================================
                CONTACTO
            ================================= */}

            <div className={styles.column}>
              <div className={styles.columnTitle}>
                <h2>Contacto</h2>
              </div>

              <div className={styles.contact}>

                <div>
                  <span>
                    Oficina principal · Tarapoto
                  </span>

                  <p>{site.address}</p>
                </div>

                <div>
                  <span>Ventas</span>
                  <a href={phoneHref(site.phone)}>
                    {site.phone}
                  </a>
                </div>

                <div>
                  <span>Oficina</span>
                  <a href={phoneHref(site.office)}>
                    {site.office}
                  </a>
                </div>

                <div>
                  <span>Servicio</span>
                  <a href={phoneHref(site.service)}>
                    {site.service}
                  </a>
                </div>

                <div>
                  <span>Repuestos</span>
                  <a href={phoneHref(partsPhone)}>
                    {partsPhone}
                  </a>
                </div>

                {site.email && (
                  <div>
                    <span>Correo</span>
                    <a href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </div>
                )}

                <div>
                  <span>Horario</span>
                  <p>{site.hours}</p>
                </div>

              </div>

              <a
                href={whatsapp(
                  undefined,
                  site.whatsapp
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsapp}
              >
                <span
                  className={styles.status}
                  aria-hidden="true"
                />

                <span>Hablar por WhatsApp</span>

                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* =================================
                SEDES - NUEVA COLUMNA
            ================================= */}

            <div className={styles.column}>
              <div className={styles.columnTitle}>
                <h2>Sedes</h2>
              </div>

              <nav
                className={styles.social}
                aria-label="Ubicaciones de Morgillo"
              >
                {sedesMorgillo.map((sede) => (
                  <a
                    key={sede.nombre}
                    href={mapsHref(sede.direccion)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={sede.direccion}
                    aria-label={
                      `Buscar Morgillo ${sede.nombre} en Google Maps`
                    }
                  >
                    <span>{sede.nombre}</span>

                    <span>
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            {/* =================================
                REDES SOCIALES
            ================================= */}

            <div className={styles.column}>
              <div className={styles.columnTitle}>
                <h2>Síguenos</h2>
              </div>

              <div className={styles.social}>
                {site.social.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{social.label}</span>

                    <span>
                      <ArrowUpRight
                        size={15}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* =================================
            GIANT BRAND
        ================================= */}

        <div
          className={styles.giant}
          aria-hidden="true"
        >
          <span>MORGILLO</span>
        </div>

        {/* =================================
            BOTTOM
        ================================= */}

        <div className={styles.bottom}>

          <div className={styles.copyright}>
            <span>© {year} Morgillo</span>
            <span>
              Todos los derechos reservados
            </span>
          </div>

          <div className={styles.bottomCenter}>
            <span />
            <p>
              Maquinaria · Servicio · Respaldo
            </p>
          </div>

          <div className={styles.bottomActions}>
            <a
              href={siteConfig.webmail}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.webmail}
            >
              Webmail

              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </a>

            <a
              href="#contenido"
              className={styles.backTop}
            >
              <span>Volver arriba</span>

              <span>
                <ArrowUp
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

/* =========================================
   FOOTER LINK
========================================= */

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={styles.navLink}
    >
      <span>{label}</span>

      <ArrowUpRight
        size={15}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </Link>
  );
}
