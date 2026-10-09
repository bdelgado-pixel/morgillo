import Link from "next/link";

import {
  ArrowUpRight,
  Building2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Wrench,
} from "lucide-react";

import {
  getSite,
} from "@/lib/content";

import {
  whatsapp,
} from "@/data/site";

import styles from "./ContactSection.module.css";


export default async function ContactSection() {
  const site =
    await getSite();


  const whatsappHref =
    whatsapp(
      "Hola, quisiera información sobre maquinaria Morgillo.",
      site.whatsapp,
    );


  const mapHref =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      site.address,
    )}`;


  return (
    <section
      id="contacto"
      className={
        styles.section
      }
      aria-labelledby="contact-title"
    >
      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div
        className={
          styles.background
        }
        aria-hidden="true"
      >
        <span />
        <span />
      </div>


      <div className="morgillo-container">
        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className={
            styles.header
          }
        >
          <div
            className={
              styles.heading
            }
          >
            <div
              className={
                styles.eyebrow
              }
            >
              <span
                className={
                  styles.number
                }
              >
                08
              </span>

              <span
                className={
                  styles.eyebrowLine
                }
              />

              <p>
                Contacto
              </p>
            </div>


            <h2
              id="contact-title"
            >
              Hablemos de tu
              <span>
                {" "}
                próxima operación.
              </span>
            </h2>
          </div>


          <div
            className={
              styles.headerSide
            }
          >
            <p>
              Cuéntanos qué trabajo
              necesitas realizar.
              Nuestro equipo puede
              orientarte sobre
              maquinaria, repuestos y
              servicio.
            </p>


            <div
              className={
                styles.hours
              }
            >
              <Clock3
                size={19}
                strokeWidth={1.8}
              />

              <div>
                <span>
                  Horario de atención
                </span>

                <strong>
                  {site.hours}
                </strong>
              </div>
            </div>
          </div>
        </div>


        {/* =================================================
            MAIN GRID
        ================================================== */}

        <div
          className={
            styles.grid
          }
        >
          {/* =================================================
              WHATSAPP CTA
          ================================================== */}

          <div
            className={
              styles.cta
            }
          >
            <div
              className={
                styles.ctaGrid
              }
              aria-hidden="true"
            />

            <div
              className={
                styles.ctaCircle
              }
              aria-hidden="true"
            />

            <div
              className={
                styles.ctaTop
              }
            >
              <div>
                <span />

                <strong>
                  Atención comercial
                </strong>
              </div>

              <span>
                MRG / CONTACT
              </span>
            </div>


            <div
              className={
                styles.ctaContent
              }
            >
              <div
                className={
                  styles.whatsappIcon
                }
              >
                <MessageCircle
                  size={27}
                  strokeWidth={1.7}
                />
              </div>


              <p>
                ¿Buscas una máquina,
                repuesto o necesitas
                soporte?
              </p>


              <h3>
                Escríbenos.
                <span>
                  {" "}
                  Estamos listos para
                  ayudarte.
                </span>
              </h3>


              <a
                href={
                  whatsappHref
                }
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.whatsapp
                }
              >
                <span>
                  Consultar por
                  WhatsApp
                </span>

                <span>
                  <ArrowUpRight
                    size={21}
                    strokeWidth={1.8}
                  />
                </span>
              </a>
            </div>


            <div
              className={
                styles.ctaBottom
              }
            >
              <span>
                Maquinaria
              </span>

              <i />

              <span>
                Repuestos
              </span>

              <i />

              <span>
                Servicio
              </span>
            </div>
          </div>


          {/* =================================================
              CONTACT DETAILS
          ================================================== */}

          <div
            className={
              styles.details
            }
          >
            {/* =============================================
                SALES
            ============================================== */}

            <a
              href={`tel:+51${site.phone.replaceAll(
                " ",
                "",
              )}`}
              className={
                styles.detail
              }
            >
              <div
                className={
                  styles.detailIcon
                }
              >
                <Phone
                  size={22}
                  strokeWidth={1.7}
                />
              </div>


              <div
                className={
                  styles.detailContent
                }
              >
                <span>
                  Ventas
                </span>

                <strong>
                  {site.phone}
                </strong>

                <p>
                  Información comercial
                  y cotizaciones.
                </p>
              </div>


              <div
                className={
                  styles.detailArrow
                }
                aria-hidden="true"
              >
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.8}
                />
              </div>
            </a>


            {/* =============================================
                OFFICE
            ============================================== */}

            <a
              href={`tel:+51${site.office.replaceAll(
                " ",
                "",
              )}`}
              className={
                styles.detail
              }
            >
              <div
                className={
                  styles.detailIcon
                }
              >
                <Building2
                  size={22}
                  strokeWidth={1.7}
                />
              </div>


              <div
                className={
                  styles.detailContent
                }
              >
                <span>
                  Oficina
                </span>

                <strong>
                  {site.office}
                </strong>

                <p>
                  Atención general
                  Morgillo.
                </p>
              </div>


              <div
                className={
                  styles.detailArrow
                }
                aria-hidden="true"
              >
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.8}
                />
              </div>
            </a>


            {/* =============================================
                SERVICE
            ============================================== */}

            <a
              href={`tel:+51${site.service.replaceAll(
                " ",
                "",
              )}`}
              className={
                styles.detail
              }
            >
              <div
                className={
                  styles.detailIcon
                }
              >
                <Wrench
                  size={22}
                  strokeWidth={1.7}
                />
              </div>


              <div
                className={
                  styles.detailContent
                }
              >
                <span>
                  Servicio
                </span>

                <strong>
                  {site.service}
                </strong>

                <p>
                  Soporte y atención
                  para tus equipos.
                </p>
              </div>


              <div
                className={
                  styles.detailArrow
                }
                aria-hidden="true"
              >
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.8}
                />
              </div>
            </a>


            {/* =============================================
                EMAIL
            ============================================== */}

            {site.email && (
              <a
                href={`mailto:${site.email}`}
                className={
                  styles.detail
                }
              >
                <div
                  className={
                    styles.detailIcon
                  }
                >
                  <Mail
                    size={22}
                    strokeWidth={1.7}
                  />
                </div>


                <div
                  className={
                    styles.detailContent
                  }
                >
                  <span>
                    Correo
                  </span>

                  <strong>
                    {site.email}
                  </strong>

                  <p>
                    Escríbenos para
                    consultas generales.
                  </p>
                </div>


                <div
                  className={
                    styles.detailArrow
                  }
                  aria-hidden="true"
                >
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>
              </a>
            )}


            {/* =============================================
                LOCATION
            ============================================== */}

            <div
              className={
                styles.location
              }
            >
              <div
                className={
                  styles.locationTop
                }
              >
                <div
                  className={
                    styles.locationIcon
                  }
                >
                  <MapPin
                    size={23}
                    strokeWidth={1.7}
                  />
                </div>


                <div>
                  <span>
                    Visítanos
                  </span>

                  <strong>
                    {site.address}
                  </strong>
                </div>
              </div>


              <div
                className={
                  styles.locationMeta
                }
              >
                <Clock3
                  size={17}
                  strokeWidth={1.8}
                />

                <p>
                  {site.hours}
                </p>
              </div>


              <a
                href={
                  mapHref
                }
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.mapLink
                }
              >
                <span>
                  Ver ubicación en mapa
                </span>

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.8}
                />
              </a>
            </div>
          </div>
        </div>


        {/* =================================================
            BOTTOM
        ================================================== */}

        <div
          className={
            styles.bottom
          }
        >
          <div>
            <span />

            <p>
              Ventas · Servicio ·
              Repuestos · Asesoría
            </p>
          </div>


          <Link
            href="/contacto"
            className={
              styles.contactLink
            }
          >
            Ir a contacto

            <ArrowUpRight
              size={18}
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}