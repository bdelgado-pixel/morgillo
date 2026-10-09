import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  ArrowLeft,
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


type Props = {
  params: Promise<{
    slug: string;
  }>;
};


export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    slug,
  } =
    await params;


  const services =
    await getServices();


  const service =
    services.find(
      (item) =>
        item.slug ===
        slug,
    );


  if (!service) {
    return {
      title:
        "Servicios | Morgillo",
    };
  }


  return {
    title: `${service.title} | Morgillo`,

    description:
      service.description,

    alternates: {
      canonical:
        `/servicios/${service.slug}`,
    },
  };
}


export default async function ServicePage({
  params,
}: Props) {
  const {
    slug,
  } =
    await params;


  const [
    services,
    site,
  ] =
    await Promise.all([
      getServices(),
      getSite(),
    ]);


  const service =
    services.find(
      (item) =>
        item.slug ===
        slug,
    );


  if (!service) {
    notFound();
  }


  const related =
    services
      .filter(
        (item) =>
          item.slug !==
          service.slug,
      )
      .slice(
        0,
        3,
      );


  const whatsappHref =
    whatsapp(
      `Hola, quisiera información sobre el servicio "${service.title}" de Morgillo.`,
      site.whatsapp,
    );


  return (
    <main
      className={
        styles.page
      }
    >
      {/* =================================================
          TOP
      ================================================== */}

      <section
        className={
          styles.top
        }
      >
        <div className="morgillo-container">
          <div
            className={
              styles.topInner
            }
          >
            <nav
              aria-label="Migas de pan"
              className={
                styles.breadcrumb
              }
            >
              <Link href="/">
                Inicio
              </Link>

              <span>
                /
              </span>

              <Link href="/servicios">
                Servicios
              </Link>

              <span>
                /
              </span>

              <span
                aria-current="page"
              >
                {
                  service.title
                }
              </span>
            </nav>


            <Link
              href="/servicios"
              className={
                styles.back
              }
            >
              <ArrowLeft
                size={17}
              />

              Todos los servicios
            </Link>
          </div>
        </div>
      </section>


      {/* =================================================
          HERO
      ================================================== */}

      <section
        className={
          styles.hero
        }
      >
        <div
          className={
            styles.grid
          }
          aria-hidden="true"
        />

        <div className="morgillo-container">
          <div
            className={
              styles.heroLayout
            }
          >
            <div
              className={
                styles.heroMain
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
                  Servicio Morgillo
                </p>
              </div>


              <h1>
                {
                  service.title
                }
              </h1>
            </div>


            <div
              className={
                styles.heroSide
              }
            >
              <p>
                {
                  service.description
                }
              </p>


              <a
                href={
                  whatsappHref
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle
                  size={19}
                />

                Consultar servicio
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          REQUIREMENTS
      ================================================== */}

      <section
        className={
          styles.requirements
        }
        aria-labelledby="requirements-title"
      >
        <div className="morgillo-container">
          <div
            className={
              styles.requirementsGrid
            }
          >
            <div
              className={
                styles.requirementsHeading
              }
            >
              <div
                className={
                  styles.eyebrow
                }
              >
                <span>
                  02
                </span>

                <i />

                <p>
                  Información
                </p>
              </div>


              <h2
                id="requirements-title"
              >
                Requisitos e
                <span>
                  {" "}
                  información
                  necesaria.
                </span>
              </h2>


              <p>
                Revisa los requisitos
                publicados para este
                servicio antes de
                comunicarte con nuestro
                equipo.
              </p>
            </div>


            {service
              .requirements
              .length >
            0 ? (
              <ol
                className={
                  styles.requirementList
                }
              >
                {service.requirements.map(
                  (
                    requirement,
                    index,
                  ) => (
                    <li
                      key={`${requirement}-${index}`}
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>


                      <div>
                        <Check
                          size={18}
                          strokeWidth={2}
                        />

                        <p>
                          {
                            requirement
                          }
                        </p>
                      </div>
                    </li>
                  ),
                )}
              </ol>
            ) : (
              <div
                className={
                  styles.noRequirements
                }
              >
                <span />

                <div>
                  <strong>
                    No hay requisitos
                    publicados.
                  </strong>

                  <p>
                    Consulta directamente
                    con Morgillo para
                    conocer la
                    información necesaria
                    para este servicio.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* =================================================
          CONTACT CTA
      ================================================== */}

      <section
        className={
          styles.contact
        }
      >
        <div className="morgillo-container">
          <div
            className={
              styles.contactInner
            }
          >
            <div>
              <span>
                Siguiente paso
              </span>

              <h2>
                Consulta este servicio
                con nuestro equipo.
              </h2>
            </div>


            <a
              href={
                whatsappHref
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Hablar por WhatsApp

              <ArrowUpRight
                size={20}
              />
            </a>
          </div>
        </div>
      </section>


      {/* =================================================
          RELATED
      ================================================== */}

      {related.length >
        0 && (
        <section
          className={
            styles.related
          }
        >
          <div className="morgillo-container">
            <div
              className={
                styles.relatedHeader
              }
            >
              <div>
                <span>
                  03
                </span>

                <h2>
                  Otros servicios.
                </h2>
              </div>


              <Link href="/servicios">
                Ver todos

                <ArrowUpRight
                  size={18}
                />
              </Link>
            </div>


            <div
              className={
                styles.relatedList
              }
            >
              {related.map(
                (
                  item,
                  index,
                ) => (
                  <Link
                    key={
                      item.slug
                    }
                    href={`/servicios/${item.slug}`}
                  >
                    <span>
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <div>
                      <small>
                        Servicio
                      </small>

                      <h3>
                        {
                          item.title
                        }
                      </h3>

                      <p>
                        {
                          item.description
                        }
                      </p>
                    </div>

                    <ArrowUpRight
                      size={20}
                    />
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}