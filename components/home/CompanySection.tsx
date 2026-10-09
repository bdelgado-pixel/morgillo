import Link from "next/link";

import {
  getSite,
} from "@/lib/content";

import styles from "./CompanySection.module.css";


function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}


function BuildingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
      <path d="M2 21h20" />
      <path d="M8 7h2" />
      <path d="M14 7h2" />
      <path d="M8 11h2" />
      <path d="M14 11h2" />
      <path d="M8 15h2" />
      <path d="M14 15h2" />
      <path d="M10 21v-3h4v3" />
    </svg>
  );
}


function MapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </svg>
  );
}


function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 20 6v5c0 5.2-3.3 8.5-8 10-4.7-1.5-8-4.8-8-10V6l8-3Z" />

      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}


const highlights = [
  {
    icon: BuildingIcon,

    number: "01",

    title: "Experiencia",

    description:
      "Conocimiento del sector y soluciones orientadas a las necesidades reales de nuestros clientes.",
  },

  {
    icon: MapIcon,

    number: "02",

    title: "Cobertura",

    description:
      "Atención desde Tarapoto para acompañar proyectos y operaciones en nuestra zona de trabajo.",
  },

  {
    icon: ShieldIcon,

    number: "03",

    title: "Respaldo",

    description:
      "Maquinaria, servicio técnico, repuestos y asesoría reunidos en un mismo lugar.",
  },
];


export default async function CompanySection() {
  const site =
    await getSite();


  return (
    <section
      id="empresa"
      className={
        styles.section
      }
      aria-labelledby="company-title"
    >
      {/* =================================================
          TECHNICAL BACKGROUND
      ================================================== */}

      <div
        className={
          styles.background
        }
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>


      <div className="morgillo-container">
        {/* =================================================
            INTRO
        ================================================== */}

        <div
          className={
            styles.intro
          }
        >
          <div
            className={
              styles.main
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
                04
              </span>

              <span
                className={
                  styles.eyebrowLine
                }
              />

              <p>
                Empresa
              </p>
            </div>


            <h2
              id="company-title"
            >
              {
                site.companyTitle
              }
            </h2>
          </div>


          <div
            className={
              styles.copy
            }
          >
            <div
              className={
                styles.copyLine
              }
              aria-hidden="true"
            />


            <div>
              <p>
                {
                  site.companyDescription
                }
              </p>


              <Link
                href="/empresa"
                className={
                  styles.companyLink
                }
              >
                <span>
                  Conoce Morgillo
                </span>

                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>


        {/* =================================================
            OPERATION STRIP
        ================================================== */}

        <div
          className={
            styles.sectors
          }
        >
          <div
            className={
              styles.sectorLead
            }
          >
            <span />

            <strong>
              Acompañamos tu operación
            </strong>
          </div>


          <div
            className={
              styles.sectorList
            }
          >
            <span>
              Agricultura
            </span>

            <i />

            <span>
              Construcción
            </span>

            <i />

            <span>
              Implementos
            </span>
          </div>
        </div>


        {/* =================================================
            HIGHLIGHTS
        ================================================== */}

        <div
          className={
            styles.highlights
          }
        >
          {highlights.map(
            (
              item,
            ) => {
              const Icon =
                item.icon;


              return (
                <article
                  key={
                    item.title
                  }
                  className={
                    styles.highlight
                  }
                >
                  {/* =====================================
                      TOP
                  ====================================== */}

                  <div
                    className={
                      styles.highlightTop
                    }
                  >
                    <span
                      className={
                        styles.highlightNumber
                      }
                    >
                      {
                        item.number
                      }
                    </span>


                    <div
                      className={
                        styles.icon
                      }
                    >
                      <Icon />
                    </div>
                  </div>


                  {/* =====================================
                      COPY
                  ====================================== */}

                  <div
                    className={
                      styles.highlightBody
                    }
                  >
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


                  <div
                    className={
                      styles.highlightLine
                    }
                    aria-hidden="true"
                  />
                </article>
              );
            },
          )}
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
              Maquinaria · servicio ·
              repuestos · asesoría
            </p>
          </div>


          <Link
            href="/empresa"
            className={
              styles.bottomLink
            }
          >
            Nuestra empresa

            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}