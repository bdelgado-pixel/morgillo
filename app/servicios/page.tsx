import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowUpRight,
  Check,
  MessageCircle,
} from "lucide-react";

import {
  getServices,
  getSite,
} from "@/lib/content";

import {
  whatsapp,
} from "@/data/site";

import styles from "./page.module.css";


export const metadata: Metadata = {
  title: "Servicios | Morgillo",

  description:
    "Conoce los servicios disponibles en Morgillo para acompañar tu maquinaria y operación.",

  alternates: {
    canonical:
      "/servicios",
  },
};


export default async function ServicesPage() {
  const [
    services,
    site,
  ] =
    await Promise.all([
      getServices(),
      getSite(),
    ]);


  const whatsappHref =
    whatsapp(
      "Hola, quisiera información sobre los servicios de Morgillo.",
      site.whatsapp,
    );


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
        aria-labelledby="services-title"
      >
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
              <span>
                01
              </span>

              <i />

              <p>
                Servicios Morgillo
              </p>
            </div>


            <span
              className={
                styles.heroCode
              }
            >
              MRG / SUPPORT
            </span>
          </div>


          <div
            className={
              styles.heroContent
            }
          >
            <div>
              <h1
                id="services-title"
              >
                Respaldo para mantener
                <span>
                  {" "}
                  tu operación
                </span>
                {" "}
                en movimiento.
              </h1>
            </div>


            <div
              className={
                styles.heroSide
              }
            >
              <p>
                Conoce los servicios
                disponibles y encuentra
                la atención adecuada
                para tu equipo y tus
                necesidades de
                operación.
              </p>


              <a
                href={
                  whatsappHref
                }
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.heroContact
                }
              >
                <MessageCircle
                  size={19}
                  strokeWidth={1.8}
                />

                Hablar con un asesor
              </a>
            </div>
          </div>


          <div
            className={
              styles.heroRail
            }
          >
            <div>
              <span>
                Servicios
              </span>

              <strong>
                {
                  services.length
                }
              </strong>
            </div>


            <p>
              Atención · asesoría ·
              continuidad operativa
            </p>
          </div>
        </div>
      </section>


      {/* =================================================
          SERVICES
      ================================================== */}

      <section
        className={
          styles.services
        }
        aria-labelledby="services-list-title"
      >
        <div className="morgillo-container">
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <div
                className={
                  styles.sectionEyebrow
                }
              >
                <span>
                  02
                </span>

                <i />

                <p>
                  Atención disponible
                </p>
              </div>


              <h2
                id="services-list-title"
              >
                Encuentra el servicio
                <span>
                  {" "}
                  que necesitas.
                </span>
              </h2>
            </div>


            <p>
              Cada servicio publicado
              aquí se administra desde
              el CMS de Morgillo.
            </p>
          </div>


          {services.length >
          0 ? (
            <div
              className={
                styles.list
              }
            >
              {services.map(
                (
                  service,
                  index,
                ) => (
                  <Link
                    key={
                      service.slug
                    }
                    href={`/servicios/${service.slug}`}
                    className={
                      styles.service
                    }
                  >
                    <div
                      className={
                        styles.serviceNumber
                      }
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </div>


                    <div
                      className={
                        styles.serviceMain
                      }
                    >
                      <span>
                        Servicio Morgillo
                      </span>

                      <h3>
                        {
                          service.title
                        }
                      </h3>

                      <p>
                        {
                          service.description
                        }
                      </p>
                    </div>


                    <div
                      className={
                        styles.serviceMeta
                      }
                    >
                      {service
                        .requirements
                        .length >
                        0 && (
                        <div>
                          <Check
                            size={17}
                            strokeWidth={2}
                          />

                          <span>
                            {
                              service
                                .requirements
                                .length
                            }{" "}
                            {service
                              .requirements
                              .length ===
                            1
                              ? "requisito"
                              : "requisitos"}
                          </span>
                        </div>
                      )}


                      <div
                        className={
                          styles.serviceArrow
                        }
                      >
                        <ArrowUpRight
                          size={21}
                          strokeWidth={1.8}
                        />
                      </div>
                    </div>


                    <span
                      className={
                        styles.serviceAccent
                      }
                      aria-hidden="true"
                    />
                  </Link>
                ),
              )}
            </div>
          ) : (
            <div
              className={
                styles.empty
              }
            >
              <span>
                00
              </span>

              <div>
                <small>
                  Servicios
                </small>

                <h3>
                  Estamos actualizando
                  esta sección.
                </h3>

                <p>
                  Puedes comunicarte
                  directamente con
                  nuestro equipo para
                  conocer la atención
                  disponible.
                </p>


                <a
                  href={
                    whatsappHref
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar por WhatsApp

                  <ArrowUpRight
                    size={18}
                  />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* =================================================
          PROCESS
      ================================================== */}

      <section
        className={
          styles.process
        }
      >
        <div className="morgillo-container">
          <div
            className={
              styles.processGrid
            }
          >
            <div
              className={
                styles.processHeading
              }
            >
              <div
                className={
                  styles.sectionEyebrow
                }
              >
                <span>
                  03
                </span>

                <i />

                <p>
                  Atención
                </p>
              </div>


              <h2>
                Cuéntanos qué
                <span>
                  {" "}
                  necesitas resolver.
                </span>
              </h2>
            </div>


            <div
              className={
                styles.steps
              }
            >
              <div>
                <span>
                  01
                </span>

                <strong>
                  Identifica tu
                  necesidad
                </strong>

                <p>
                  Selecciona el servicio
                  relacionado con tu
                  consulta.
                </p>
              </div>


              <div>
                <span>
                  02
                </span>

                <strong>
                  Revisa la información
                </strong>

                <p>
                  Consulta la
                  descripción y los
                  requisitos publicados.
                </p>
              </div>


              <div>
                <span>
                  03
                </span>

                <strong>
                  Contacta a Morgillo
                </strong>

                <p>
                  Comunícate con nuestro
                  equipo para continuar
                  con la atención.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          CTA
      ================================================== */}

      <section
        className={
          styles.cta
        }
      >
        <div className="morgillo-container">
          <div
            className={
              styles.ctaInner
            }
          >
            <div>
              <span>
                ¿No sabes qué servicio
                necesitas?
              </span>

              <h2>
                Nuestro equipo puede
                orientarte.
              </h2>
            </div>


            <a
              href={
                whatsappHref
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar ahora

              <ArrowUpRight
                size={20}
                strokeWidth={1.8}
              />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}