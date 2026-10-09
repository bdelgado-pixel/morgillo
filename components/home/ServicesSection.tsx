import Link from "next/link";

import {
  getServices,
} from "@/lib/content";

import styles from "./ServicesSection.module.css";


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


export default async function ServicesSection() {
  const services =
    await getServices();


  return (
    <section
      id="servicios"
      className={
        styles.section
      }
      aria-labelledby="services-title"
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
                05
              </span>

              <span
                className={
                  styles.eyebrowLine
                }
              />

              <p>
                Servicios
              </p>
            </div>


            <h2
              id="services-title"
            >
              Más que maquinaria.
              <span>
                {" "}
                Respaldo para seguir
                trabajando.
              </span>
            </h2>
          </div>


          <div
            className={
              styles.headerSide
            }
          >
            <p>
              Te acompañamos antes,
              durante y después de la
              compra para mantener tu
              operación en movimiento.
            </p>


            <Link
              href="/servicios"
              className={
                styles.headerLink
              }
            >
              Ver todos los servicios

              <ArrowIcon />
            </Link>
          </div>
        </div>


        {/* =================================================
            RAIL
        ================================================== */}

        <div
          className={
            styles.rail
          }
          aria-hidden="true"
        >
          <div>
            <span />

            <strong>
              Respaldo Morgillo
            </strong>
          </div>


          <p>
            Servicio · Repuestos ·
            Asesoría
          </p>
        </div>


        {/* =================================================
            SERVICES
        ================================================== */}

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
                  {/* =====================================
                      NUMBER
                  ====================================== */}

                  <div
                    className={
                      styles.serviceNumber
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

                    <i />
                  </div>


                  {/* =====================================
                      CONTENT
                  ====================================== */}

                  <div
                    className={
                      styles.serviceContent
                    }
                  >
                    <span
                      className={
                        styles.serviceLabel
                      }
                    >
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


                  {/* =====================================
                      ACTION
                  ====================================== */}

                  <div
                    className={
                      styles.action
                    }
                  >
                    <span>
                      Conocer servicio
                    </span>

                    <div
                      className={
                        styles.arrow
                      }
                      aria-hidden="true"
                    >
                      <ArrowIcon />
                    </div>
                  </div>


                  {/* =====================================
                      HOVER LINE
                  ====================================== */}

                  <div
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
            <div>
              <span>
                Servicios Morgillo
              </span>

              <h3>
                Estamos para ayudarte
                con tu operación.
              </h3>

              <p>
                Consulta con nuestro
                equipo sobre los
                servicios actualmente
                disponibles.
              </p>
            </div>


            <Link
              href="/contacto"
              className={
                styles.emptyLink
              }
            >
              Contactar equipo

              <ArrowIcon />
            </Link>
          </div>
        )}


        {/* =================================================
            BOTTOM
        ================================================== */}

        <div
          className={
            styles.bottom
          }
        >
          <div
            className={
              styles.bottomCopy
            }
          >
            <span />

            <p>
              Atención para maquinaria
              agrícola y de
              construcción.
            </p>
          </div>


          <Link
            href="/contacto"
            className={
              styles.contactLink
            }
          >
            Hablar con un asesor

            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}