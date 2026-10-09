import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  ArrowUpRight,
  Building2,
  Headphones,
  MapPin,
  MessageCircle,
  Wrench,
} from "lucide-react";

import {
  getBrands,
  getCategories,
  getServices,
  getSite,
} from "@/lib/content";

import {
  whatsapp,
} from "@/data/site";

import styles from "./page.module.css";


export const metadata: Metadata = {
  title: "Empresa | Morgillo",

  description:
    "Conoce Morgillo, nuestras marcas, categorías de maquinaria y servicios.",

  alternates: {
    canonical:
      "/empresa",
  },
};


export default async function CompanyPage() {
  const [
    site,
    brands,
    categories,
    services,
  ] =
    await Promise.all([
      getSite(),
      getBrands(),
      getCategories(),
      getServices(),
    ]);


  const whatsappHref =
    whatsapp(
      "Hola, quisiera información sobre Morgillo y sus soluciones de maquinaria.",
      site.whatsapp,
    );


  const phoneHref =
    `tel:+51${site.phone.replaceAll(
      " ",
      "",
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
        aria-labelledby="company-page-title"
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
          {/* =============================================
              TOP
          ============================================== */}

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
                Empresa
              </p>
            </div>


            <span
              className={
                styles.heroCode
              }
            >
              MRG / COMPANY
            </span>
          </div>


          {/* =============================================
              CONTENT
          ============================================== */}

          <div
            className={
              styles.heroContent
            }
          >
            <div
              className={
                styles.heroHeading
              }
            >
              <h1
                id="company-page-title"
              >
                {
                  site.companyTitle
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
                  site.companyDescription
                }
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

                Hablar con Morgillo
              </a>
            </div>
          </div>


          {/* =============================================
              DATA RAIL
          ============================================== */}

          <div
            className={
              styles.heroRail
            }
          >
            <div>
              <span>
                Categorías
              </span>

              <strong>
                {
                  categories.length
                }
              </strong>
            </div>


            <div>
              <span>
                Marcas
              </span>

              <strong>
                {
                  brands.length
                }
              </strong>
            </div>


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


            <div
              className={
                styles.heroRailText
              }
            >
              <span />

              <p>
                Maquinaria · soporte ·
                atención
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          ABOUT
      ================================================== */}

      <section
        className={
          styles.about
        }
        aria-labelledby="about-title"
      >
        <div className="morgillo-container">
          <div
            className={
              styles.aboutGrid
            }
          >
            <div
              className={
                styles.aboutHeading
              }
            >
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
                  Morgillo
                </p>
              </div>


              <h2
                id="about-title"
              >
                Maquinaria y respaldo
                <span>
                  {" "}
                  en un mismo lugar.
                </span>
              </h2>
            </div>


            <div
              className={
                styles.aboutCopy
              }
            >
              <div
                className={
                  styles.aboutLead
                }
              >
                <span />

                <p>
                  {
                    site.companyDescription
                  }
                </p>
              </div>


              <div
                className={
                  styles.aboutLinks
                }
              >
                <Link
                  href="/maquinaria"
                >
                  Explorar maquinaria

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.8}
                  />
                </Link>


                <Link
                  href="/servicios"
                >
                  Ver servicios

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.8}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          CATEGORIES
      ================================================== */}

      {categories.length >
        0 && (
        <section
          className={
            styles.categories
          }
          aria-labelledby="company-categories-title"
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
                    03
                  </span>

                  <i />

                  <p>
                    Operación
                  </p>
                </div>


                <h2
                  id="company-categories-title"
                >
                  Equipos para
                  diferentes
                  <span>
                    {" "}
                    tipos de trabajo.
                  </span>
                </h2>
              </div>


              <p>
                Explora las categorías
                de maquinaria
                publicadas actualmente
                por Morgillo.
              </p>
            </div>


            <div
              className={
                styles.categoryList
              }
            >
              {categories.map(
                (
                  category,
                  index,
                ) => (
                  <Link
                    key={
                      category.id
                    }
                    href={`/maquinaria?categoria=${category.id}`}
                    className={
                      styles.category
                    }
                  >
                    <span
                      className={
                        styles.categoryNumber
                      }
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>


                    <div
                      className={
                        styles.categoryContent
                      }
                    >
                      <span>
                        {
                          category.brand
                        }
                      </span>

                      <h3>
                        {
                          category.name
                        }
                      </h3>

                      <p>
                        {
                          category.description
                        }
                      </p>
                    </div>


                    <div
                      className={
                        styles.categoryArrow
                      }
                    >
                      <ArrowUpRight
                        size={21}
                        strokeWidth={1.8}
                      />
                    </div>


                    <span
                      className={
                        styles.categoryAccent
                      }
                      aria-hidden="true"
                    />
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      )}


      {/* =================================================
          BRANDS
      ================================================== */}

      {brands.length >
        0 && (
        <section
          className={
            styles.brands
          }
          aria-labelledby="company-brands-title"
        >
          <div
            className={
              styles.brandsBackground
            }
            aria-hidden="true"
          >
            <span />
            <span />
          </div>


          <div className="morgillo-container">
            <div
              className={
                styles.brandsHeader
              }
            >
              <div>
                <div
                  className={
                    styles.sectionEyebrowLight
                  }
                >
                  <span>
                    04
                  </span>

                  <i />

                  <p>
                    Marcas
                  </p>
                </div>


                <h2
                  id="company-brands-title"
                >
                  Marcas presentes en
                  <span>
                    {" "}
                    nuestro catálogo.
                  </span>
                </h2>
              </div>


              <Link
                href="/marcas"
              >
                Ver marcas

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.8}
                />
              </Link>
            </div>


            <div
              className={
                styles.brandList
              }
            >
              {brands.map(
                (
                  brand,
                  index,
                ) => (
                  <Link
                    key={
                      brand.id
                    }
                    href={`/marcas/${brand.id}`}
                    className={
                      styles.brand
                    }
                    data-brand={
                      brand.id.toLowerCase()
                    }
                  >
                    <div
                      className={
                        styles.brandTop
                      }
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <ArrowUpRight
                        size={20}
                        strokeWidth={1.8}
                      />
                    </div>


                    <div
                      className={
                        styles.brandContent
                      }
                    >
                      <span>
                        Marca
                      </span>

                      <h3>
                        {
                          brand.name
                        }
                      </h3>


                      {brand.description && (
                        <p>
                          {
                            brand.description
                          }
                        </p>
                      )}
                    </div>


                    <div
                      className={
                        styles.brandLine
                      }
                      aria-hidden="true"
                    />
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      )}


      {/* =================================================
          SERVICES
      ================================================== */}

      {services.length >
        0 && (
        <section
          className={
            styles.services
          }
          aria-labelledby="company-services-title"
        >
          <div className="morgillo-container">
            <div
              className={
                styles.servicesGrid
              }
            >
              <div
                className={
                  styles.servicesHeading
                }
              >
                <div
                  className={
                    styles.sectionEyebrow
                  }
                >
                  <span>
                    05
                  </span>

                  <i />

                  <p>
                    Servicios
                  </p>
                </div>


                <h2
                  id="company-services-title"
                >
                  El equipo no termina
                  <span>
                    {" "}
                    en la entrega.
                  </span>
                </h2>


                <p>
                  Conoce los servicios
                  que Morgillo mantiene
                  publicados para sus
                  clientes y equipos.
                </p>


                <Link
                  href="/servicios"
                  className={
                    styles.servicesLink
                  }
                >
                  Explorar servicios

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.8}
                  />
                </Link>
              </div>


              <div
                className={
                  styles.serviceList
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


                      <ArrowUpRight
                        size={19}
                        strokeWidth={1.8}
                      />
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* =================================================
          CONTACT INFO
      ================================================== */}

      <section
        className={
          styles.location
        }
        aria-labelledby="location-title"
      >
        <div className="morgillo-container">
          <div
            className={
              styles.locationHeader
            }
          >
            <div>
              <div
                className={
                  styles.sectionEyebrow
                }
              >
                <span>
                  06
                </span>

                <i />

                <p>
                  Contacto
                </p>
              </div>


              <h2
                id="location-title"
              >
                Encuentra a
                <span>
                  {" "}
                  Morgillo.
                </span>
              </h2>
            </div>


            <p>
              Información de atención
              publicada en nuestra
              configuración comercial.
            </p>
          </div>


          <div
            className={
              styles.contactGrid
            }
          >
            <div
              className={
                styles.contactItem
              }
            >
              <div
                className={
                  styles.contactIcon
                }
              >
                <MapPin
                  size={23}
                  strokeWidth={1.7}
                />
              </div>


              <div>
                <span>
                  Ubicación
                </span>

                <strong>
                  {
                    site.address
                  }
                </strong>
              </div>
            </div>


            <a
              href={
                phoneHref
              }
              className={
                styles.contactItem
              }
            >
              <div
                className={
                  styles.contactIcon
                }
              >
                <Headphones
                  size={23}
                  strokeWidth={1.7}
                />
              </div>


              <div>
                <span>
                  Ventas
                </span>

                <strong>
                  {
                    site.phone
                  }
                </strong>
              </div>
            </a>


            <div
              className={
                styles.contactItem
              }
            >
              <div
                className={
                  styles.contactIcon
                }
              >
                <Building2
                  size={23}
                  strokeWidth={1.7}
                />
              </div>


              <div>
                <span>
                  Oficina
                </span>

                <strong>
                  {
                    site.office
                  }
                </strong>
              </div>
            </div>


            <a
              href={`tel:+51${site.service.replaceAll(
                " ",
                "",
              )}`}
              className={
                styles.contactItem
              }
            >
              <div
                className={
                  styles.contactIcon
                }
              >
                <Wrench
                  size={23}
                  strokeWidth={1.7}
                />
              </div>


              <div>
                <span>
                  Servicio
                </span>

                <strong>
                  {
                    site.service
                  }
                </strong>
              </div>
            </a>
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
                Morgillo
              </span>

              <h2>
                Conversemos sobre tu
                próxima operación.
              </h2>
            </div>


            <div
              className={
                styles.ctaActions
              }
            >
              <a
                href={
                  whatsappHref
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle
                  size={19}
                  strokeWidth={1.8}
                />

                Hablar por WhatsApp

                <ArrowUpRight
                  size={19}
                  strokeWidth={1.8}
                />
              </a>


              <Link
                href="/contacto"
              >
                Ver contacto

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}