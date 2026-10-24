import type {
  Metadata,
} from "next";
import Image from "next/image";

import {
  ArrowUpRight,
  Building2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Package,
  Wrench,
} from "lucide-react";

import {
  getSite,
} from "@/lib/content";

import {
  whatsapp,
} from "@/data/site";

import ContactForm from "@/components/contact/ContactForm";
import { getContactNumbers, partsPhone } from "@/lib/contact";

import styles from "./page.module.css";


export const metadata: Metadata = {
  title: "Contacto | Morgillo",

  description:
    "Contacta con Morgillo para consultas sobre maquinaria, servicio, repuestos y atención comercial.",

  alternates: {
    canonical:
      "/contacto",
  },
};


function telHref(
  value: string,
) {
  const digits =
    value.replace(
      /\D/g,
      "",
    );


  const normalized =
    digits.startsWith("51")
      ? digits
      : `51${digits}`;


  return `tel:+${normalized}`;
}


const sedesMorgillo = [
 
  {
    nombre: "Pucallpa",
    region: "Ucayali",
    direccion: "Sector Santa Teresita, parcela El Arca de Noé, lote B2, Campo Verde, Ucayali, Perú",
  },
  {
    nombre: "Cusco",
    region: "Cusco",
    direccion: "Chingo Grande S/N, Saylla, Cusco, Perú",
  },
  {
    nombre: "Ica",
    region: "Ica",
    direccion: "Panamericana Sur, km 296.20, Subtanjalla, Ica, Perú",
  },
  {
    nombre: "Huancayo",
    region: "Junín",
    direccion: "Carretera Central, km 13.5, Hualhuas, Junín, Perú",
  },
  {
    nombre: "Lambayeque",
    region: "Lambayeque",
    direccion: "Sector Mocce, sublote 02, Lambayeque, Perú",
  },
  {
    nombre: "Callao",
    region: "Callao",
    direccion: "Av. Guardia Chalaca 1802, Bellavista, Callao, Perú",
  },
];

function googleMapsSearch(direccion: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
}


export default async function ContactPage() {
  const site =
    await getSite();


  const whatsappHref =
    whatsapp(
      "Hola, quisiera información sobre Morgillo.",
      site.whatsapp,
    );


  const mapHref =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      site.address,
    )}`;


  return (
    <main
      className={
        styles.page
      }
    >
      {/* =================================================
          HERO
      ================================================== */}

      <section
        className={
          styles.hero
        }
        aria-labelledby="contact-page-title"
      >
        <Image src="/images/company/maquinaria-morgillo.webp" alt="Tractores Kubota en las instalaciones de Morgillo" fill priority sizes="100vw" className={styles.heroPhoto} />
        <div className={styles.heroVeil} aria-hidden="true" />

        <div
          className={
            styles.heroGrid
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.heroCircle
          }
          aria-hidden="true"
        />


        <div className="morgillo-container">
          <div
            className={
              styles.heroTop
            }
          >
            <div
              className={
                styles.eyebrow
              }
            >
              <i />

              <p>
                Contacto
              </p>
            </div>


            <span
              className={
                styles.heroCode
              }
            >
              MRG / CONTACT
            </span>
          </div>


          <div
            className={
              styles.heroContent
            }
          >
            <div>
              <h1
                id="contact-page-title"
              >
                Cuéntanos qué
                <span>
                  {" "}
                  necesitas hacer.
                </span>
              </h1>
            </div>


            <div
              className={
                styles.heroSide
              }
            >
              <p>
                Consulta sobre
                maquinaria, servicio,
                repuestos o atención
                comercial y comunícate
                directamente con el
                equipo Morgillo.
              </p>


              <a
                href={
                  whatsappHref
                }
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.heroWhatsapp
                }
              >
                <MessageCircle
                  size={19}
                  strokeWidth={1.8}
                />

                WhatsApp

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.8}
                />
              </a>
            </div>
          </div>


          {/* =============================================
              RAIL
          ============================================== */}

          <div
            className={
              styles.heroRail
            }
          >
            <div>
              <Clock3
                size={19}
                strokeWidth={1.8}
              />

              <div>
                <span>
                  Horario
                </span>

                <strong>
                  {
                    site.hours
                  }
                </strong>
              </div>
            </div>


            <div
              className={
                styles.heroRailText
              }
            >
              <span />

              <p>
                Ventas · oficina ·
                servicio · repuestos
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          CONTACT MAIN
      ================================================== */}

      <section
        className={
          styles.contact
        }
        aria-labelledby="contact-channels-title"
      >
        <div className="morgillo-container">
          <div
            className={
              styles.contactGrid
            }
          >
            {/* =========================================
                LEFT
            ========================================== */}

            <div
              className={
                styles.contactInfo
              }
            >
              <div
                className={
                  styles.sectionEyebrow
                }
              >
                <i />

                <p>
                  Canales de atención
                </p>
              </div>


              <h2
                id="contact-channels-title"
              >
                Habla con el área
                <span>
                  {" "}
                  indicada.
                </span>
              </h2>


              <p
                className={
                  styles.contactIntro
                }
              >
                Utiliza el canal que
                mejor se adapte a tu
                consulta.
              </p>


              {/* =====================================
                  CHANNELS
              ====================================== */}

              <div
                className={
                  styles.channels
                }
              >
                {/* SALES */}

                <a
                  href={
                    telHref(
                      site.phone,
                    )
                  }
                  className={
                    styles.channel
                  }
                >
                  <div
                    className={
                      styles.channelIcon
                    }
                  >
                    <Phone
                      size={22}
                      strokeWidth={1.7}
                    />
                  </div>


                  <div
                    className={
                      styles.channelContent
                    }
                  >
                    <span>
                      Ventas
                    </span>

                    <strong>
                      {
                        site.phone
                      }
                    </strong>

                    <p>
                      Consultas
                      comerciales y
                      maquinaria.
                    </p>
                  </div>


                  <ArrowUpRight
                    size={19}
                    strokeWidth={1.8}
                  />
                </a>


                {/* OFFICE */}

                <a
                  href={
                    telHref(
                      site.office,
                    )
                  }
                  className={
                    styles.channel
                  }
                >
                  <div
                    className={
                      styles.channelIcon
                    }
                  >
                    <Building2
                      size={22}
                      strokeWidth={1.7}
                    />
                  </div>


                  <div
                    className={
                      styles.channelContent
                    }
                  >
                    <span>
                      Oficina
                    </span>

                    <strong>
                      {
                        site.office
                      }
                    </strong>

                    <p>
                      Atención general
                      Morgillo.
                    </p>
                  </div>


                  <ArrowUpRight
                    size={19}
                    strokeWidth={1.8}
                  />
                </a>


                {/* SERVICE */}

                <a
                  href={
                    telHref(
                      site.service,
                    )
                  }
                  className={
                    styles.channel
                  }
                >
                  <div
                    className={
                      styles.channelIcon
                    }
                  >
                    <Wrench
                      size={22}
                      strokeWidth={1.7}
                    />
                  </div>


                  <div
                    className={
                      styles.channelContent
                    }
                  >
                    <span>
                      Servicio
                    </span>

                    <strong>
                      {
                        site.service
                      }
                    </strong>

                    <p>
                      Consultas
                      relacionadas con
                      atención de
                      equipos.
                    </p>
                  </div>


                  <ArrowUpRight
                    size={19}
                    strokeWidth={1.8}
                  />
                </a>


                <a href="tel:+51942012195" className={styles.channel}>
                  <div className={styles.channelIcon}>
                    <Package size={22} strokeWidth={1.7} />
                  </div>
                  <div className={styles.channelContent}>
                    <span>Repuestos</span>
                    <strong>{partsPhone}</strong>
                    <p>Consultas y atención de repuestos.</p>
                  </div>
                  <ArrowUpRight size={19} strokeWidth={1.8} />
                </a>
                {/* EMAIL */}

                {site.email && (
                  <a
                    href={`mailto:${site.email}`}
                    className={
                      styles.channel
                    }
                  >
                    <div
                      className={
                        styles.channelIcon
                      }
                    >
                      <Mail
                        size={22}
                        strokeWidth={1.7}
                      />
                    </div>


                    <div
                      className={
                        styles.channelContent
                      }
                    >
                      <span>
                        Correo
                      </span>

                      <strong>
                        {
                          site.email
                        }
                      </strong>

                      <p>
                        Consultas por
                        correo
                        electrónico.
                      </p>
                    </div>


                    <ArrowUpRight
                      size={19}
                      strokeWidth={1.8}
                    />
                  </a>
                )}
              </div>
            </div>


            {/* =========================================
                FORM
            ========================================== */}

            <div
              className={
                styles.formColumn
              }
            >
              <ContactForm
                numbers={getContactNumbers(site)}
              />
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          LOCATION
      ================================================== */}

{/* LOCATION */}
<section
  className={styles.location}
  aria-labelledby="location-title"
>
  <div
    className={styles.locationGridBackground}
    aria-hidden="true"
  />

  <div className="morgillo-container">
    <div className={styles.locationGrid}>
      <div className={styles.locationHeading}>
        <div className={styles.sectionEyebrow}>
          <i />
          <p>Ubicación</p>
        </div>

        <h2 id="location-title">
          Visita
          <span> Morgillo.</span>
        </h2>

        <p className={styles.locationIntro}>
          Encuentra nuestra oficina principal
          y conoce las demás ubicaciones registradas
          de Morgillo en el Perú.
        </p>
      </div>

      <div className={styles.address}>
        <div className={styles.addressIcon}>
          <MapPin size={28} strokeWidth={1.6} />
        </div>

        <span>OFICINA PRINCIPAL · TARAPOTO</span>

        <h3>{site.address}</h3>

        <div className={styles.addressHours}>
          <Clock3 size={18} strokeWidth={1.8} />
          <p>{site.hours}</p>
        </div>

        <a
          href={mapHref}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapButton}
        >
          <span>Abrir en Google Maps</span>
          <ArrowUpRight size={19} strokeWidth={1.8} />
        </a>
      </div>
    </div>

    <div className={styles.branchesSection}>
      <div className={styles.branchesHeading}>
        <div className={styles.sectionEyebrow}>
          <i />
          <p>Presencia nacional</p>
        </div>

        <h3>Otras ubicaciones de Morgillo</h3>

        <p>
          Consulta las direcciones registradas
          de nuestros establecimientos.
          Confirma la atención antes de visitarnos.
        </p>
      </div>

      <div className={styles.branchesGrid}>
        {sedesMorgillo.map((sede) => (
          <article
            key={sede.nombre}
            className={styles.branchCard}
          >
            <div className={styles.branchTop}>
              <div className={styles.branchIcon}>
                <MapPin size={22} strokeWidth={1.7} />
              </div>
              <span>{sede.region}</span>
            </div>

            <h4>Morgillo {sede.nombre}</h4>

            <p>{sede.direccion}</p>

            <a
              href={googleMapsSearch(sede.direccion)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.branchLink}
              aria-label={`Buscar dirección de Morgillo ${sede.nombre} en Google Maps`}
            >
              Buscar en Google Maps
              <ArrowUpRight size={18} strokeWidth={1.8} />
            </a>
          </article>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* =================================================
          SOCIAL
      ================================================== */}

      {site.social?.length >
        0 && (
        <section
          className={
            styles.socialSection
          }
        >
          <div className="morgillo-container">
            <div
              className={
                styles.socialHeader
              }
            >
              <div>
                <h2>
                  También estamos en
                  nuestras redes.
                </h2>
              </div>


              <p>
                Sigue los canales
                oficiales publicados
                por Morgillo.
              </p>
            </div>


            <div
              className={
                styles.socialList
              }
            >
              {site.social.map(
                (
                  social,
                  index,
                ) => (
                  <a
                    key={
                      social.label
                    }
                    href={
                      social.href
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>


                    <strong>
                      {
                        social.label
                      }
                    </strong>


                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.8}
                    />
                  </a>
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}