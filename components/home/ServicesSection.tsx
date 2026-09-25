"use client";

import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowUpRight,
  MessagesSquare,
  PackageCheck,
  Settings,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import styles from "./ServicesSection.module.css";

const services = [
  {
    number: "01",
    title: "Servicio técnico",
    description:
      "Soporte para mantener tus equipos trabajando y atender las necesidades de tu operación.",
    href: "/servicios/servicio-tecnico",
    icon: Wrench,
    label: "Soporte",
  },
  {
    number: "02",
    title: "Mantenimiento",
    description:
      "Atención y mantenimiento para conservar el rendimiento y la disponibilidad de tu maquinaria.",
    href: "/servicios/mantenimiento",
    icon: Settings,
    label: "Continuidad",
  },
  {
    number: "03",
    title: "Repuestos",
    description:
      "Encuentra los repuestos que necesitas para continuar con tus trabajos.",
    href: "/servicios/repuestos",
    icon: PackageCheck,
    label: "Disponibilidad",
  },
  {
    number: "04",
    title: "Asesoría",
    description:
      "Orientación para encontrar la maquinaria y solución adecuada para cada proyecto.",
    href: "/contacto",
    icon: MessagesSquare,
    label: "Decisión",
  },
];

function ServiceMachine({
  reducedMotion,
}: {
  reducedMotion: boolean | null;
}) {
  const pathAnimation = {
    initial: reducedMotion
      ? false
      : {
          pathLength: 0,
          opacity: 0,
        },

    whileInView: reducedMotion
      ? undefined
      : {
          pathLength: 1,
          opacity: 1,
        },

    viewport: {
      once: true,
      amount: 0.35,
    },
  };

  return (
    <svg
      viewBox="0 0 680 520"
      fill="none"
      className={styles.machine}
      aria-hidden="true"
    >
      {/* =====================================
          TECHNICAL GRID
      ====================================== */}

      <motion.path
        d="M80 85H600"
        className={styles.gridLine}
        {...pathAnimation}
        transition={{
          duration: 1.1,
        }}
      />

      <motion.path
        d="M80 435H600"
        className={styles.gridLine}
        {...pathAnimation}
        transition={{
          duration: 1.2,
          delay: 0.08,
        }}
      />

      <motion.path
        d="M122 55V462"
        className={styles.gridLine}
        {...pathAnimation}
        transition={{
          duration: 1.3,
          delay: 0.12,
        }}
      />

      <motion.path
        d="M558 55V462"
        className={styles.gridLine}
        {...pathAnimation}
        transition={{
          duration: 1.3,
          delay: 0.16,
        }}
      />

      {/* =====================================
          OUTER MECHANICAL RING
      ====================================== */}

      <motion.circle
        cx="340"
        cy="260"
        r="162"
        className={styles.ringOuter}
        initial={
          reducedMotion
            ? false
            : {
                pathLength: 0,
                opacity: 0,
              }
        }
        whileInView={
          reducedMotion
            ? undefined
            : {
                pathLength: 1,
                opacity: 1,
              }
        }
        viewport={{
          once: true,
          amount: 0.3,
        }}
        transition={{
          duration: 1.45,
          ease: "easeOut",
        }}
      />

      <motion.circle
        cx="340"
        cy="260"
        r="118"
        className={styles.ringSoft}
        initial={
          reducedMotion
            ? false
            : {
                pathLength: 0,
              }
        }
        whileInView={
          reducedMotion
            ? undefined
            : {
                pathLength: 1,
              }
        }
        viewport={{
          once: true,
        }}
        transition={{
          duration: 1.3,
          delay: 0.15,
        }}
      />

      {/* =====================================
          ROTATING GEAR
      ====================================== */}

      <motion.g
        className={styles.gear}
        style={{
          transformOrigin: "340px 260px",
        }}
        animate={
          reducedMotion
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({
          length: 12,
        }).map((_, index) => {
          const angle =
            index * 30;

          return (
            <rect
              key={angle}
              x="326"
              y="72"
              width="28"
              height="51"
              rx="3"
              transform={`rotate(${angle} 340 260)`}
              className={styles.gearTooth}
            />
          );
        })}

        <circle
          cx="340"
          cy="260"
          r="143"
          className={styles.gearCircle}
        />
      </motion.g>

      {/* =====================================
          CENTRAL HUB
      ====================================== */}

      <motion.circle
        cx="340"
        cy="260"
        r="78"
        className={styles.hub}
        initial={
          reducedMotion
            ? false
            : {
                scale: 0.75,
                opacity: 0,
              }
        }
        whileInView={
          reducedMotion
            ? undefined
            : {
                scale: 1,
                opacity: 1,
              }
        }
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.65,
          delay: 0.35,
          ease: [
            0.16,
            1,
            0.3,
            1,
          ],
        }}
      />

      <motion.circle
        cx="340"
        cy="260"
        r="29"
        className={styles.hubCore}
        initial={
          reducedMotion
            ? false
            : {
                scale: 0,
              }
        }
        whileInView={
          reducedMotion
            ? undefined
            : {
                scale: 1,
              }
        }
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.45,
          delay: 0.62,
        }}
      />

      {/* =====================================
          CONNECTIONS
      ====================================== */}

      <motion.path
        d="M54 260H177"
        className={styles.connection}
        {...pathAnimation}
        transition={{
          duration: 0.85,
          delay: 0.5,
        }}
      />

      <motion.path
        d="M503 260H626"
        className={styles.connection}
        {...pathAnimation}
        transition={{
          duration: 0.85,
          delay: 0.56,
        }}
      />

      <motion.path
        d="M340 38V98"
        className={styles.connection}
        {...pathAnimation}
        transition={{
          duration: 0.7,
          delay: 0.65,
        }}
      />

      <motion.path
        d="M340 422V482"
        className={styles.connection}
        {...pathAnimation}
        transition={{
          duration: 0.7,
          delay: 0.7,
        }}
      />

      {/* =====================================
          CONNECTION POINTS
      ====================================== */}

      {[
        [54, 260],
        [626, 260],
        [340, 38],
        [340, 482],
      ].map(([cx, cy], index) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="6"
          className={styles.point}
          initial={
            reducedMotion
              ? false
              : {
                  scale: 0,
                }
          }
          whileInView={
            reducedMotion
              ? undefined
              : {
                  scale: 1,
                }
          }
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.35,
            delay:
              0.75 +
              index * 0.08,
          }}
        />
      ))}

      {/* =====================================
          MEASUREMENT MARKS
      ====================================== */}

      <path
        d="M89 112H132M89 121H119M548 402H591M561 411H591"
        className={styles.measure}
      />
    </svg>
  );
}

export default function ServicesSection() {
  const reducedMotion =
    useReducedMotion();

  return (
    <section
      className={styles.section}
      aria-labelledby="services-title"
    >
      {/* =========================================
          BACKGROUND
      ========================================== */}

      <div
        className={styles.background}
        aria-hidden="true"
      >
        <span className={styles.number}>
          05
        </span>

        <span className={styles.lineOne} />
        <span className={styles.lineTwo} />
      </div>

      <div className="morgillo-container">
        {/* =========================================
            HEADER
        ========================================== */}

        <div className={styles.header}>
          <div className={styles.heading}>
            <div className={styles.eyebrow}>
              <span>05</span>

              <i />

              <p>
                Servicios
              </p>
            </div>

            <h2 id="services-title">
              El trabajo no termina
              <span>
                {" "}
                cuando entregamos la máquina.
              </span>
            </h2>
          </div>

          <div className={styles.headerAside}>
            <ShieldCheck
              size={22}
              strokeWidth={1.6}
            />

            <div>
              <strong>
                Respaldo Morgillo
              </strong>

              <p>
                Acompañamiento antes,
                durante y después de la
                compra.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            MAIN SERVICE HUB
        ========================================== */}

        <div className={styles.layout}>
          {/* =======================================
              TECHNICAL VISUAL
          ======================================== */}

          <motion.div
            className={styles.visual}
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    x: -30,
                  }
            }
            whileInView={
              reducedMotion
                ? undefined
                : {
                    opacity: 1,
                    x: 0,
                  }
            }
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.7,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          >
            <div className={styles.visualTop}>
              <div>
                <span />

                <strong>
                  CENTRO DE SOPORTE
                </strong>
              </div>

              <span>
                MRG / SVC
              </span>
            </div>

            <div className={styles.machineStage}>
              <ServiceMachine
                reducedMotion={
                  reducedMotion
                }
              />

              <div
                className={
                  styles.machineCenter
                }
              >
                <small>
                  MORGILLO
                </small>

                <strong>
                  SERVICE
                </strong>

                <span>
                  SYSTEM
                </span>
              </div>
            </div>

            <div className={styles.visualBottom}>
              <div>
                <span>01</span>

                <p>
                  Diagnóstico
                </p>
              </div>

              <div>
                <span>02</span>

                <p>
                  Atención
                </p>
              </div>

              <div>
                <span>03</span>

                <p>
                  Continuidad
                </p>
              </div>
            </div>

            <div
              className={styles.redCorner}
              aria-hidden="true"
            >
              <span>
                M
              </span>
            </div>
          </motion.div>

          {/* =======================================
              SERVICE LIST
          ======================================== */}

          <div className={styles.services}>
            {services.map(
              (service, index) => {
                const Icon =
                  service.icon;

                return (
                  <motion.article
                    key={
                      service.number
                    }
                    className={
                      styles.service
                    }
                    initial={
                      reducedMotion
                        ? false
                        : {
                            opacity: 0,
                            x: 30,
                          }
                    }
                    whileInView={
                      reducedMotion
                        ? undefined
                        : {
                            opacity: 1,
                            x: 0,
                          }
                    }
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.55,
                      delay:
                        index * 0.07,
                      ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                      ],
                    }}
                  >
                    <Link
                      href={service.href}
                      className={
                        styles.serviceLink
                      }
                    >
                      <span
                        className={
                          styles.serviceNumber
                        }
                      >
                        {
                          service.number
                        }
                      </span>

                      <div
                        className={
                          styles.serviceIcon
                        }
                      >
                        <Icon
                          size={23}
                          strokeWidth={
                            1.55
                          }
                        />
                      </div>

                      <div
                        className={
                          styles.serviceCopy
                        }
                      >
                        <span
                          className={
                            styles.serviceLabel
                          }
                        >
                          {
                            service.label
                          }
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

                      <span
                        className={
                          styles.serviceArrow
                        }
                      >
                        <ArrowUpRight
                          size={20}
                          strokeWidth={
                            1.7
                          }
                        />
                      </span>

                      <span
                        className={
                          styles.serviceProgress
                        }
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.article>
                );
              },
            )}
          </div>
        </div>

        {/* =========================================
            SECTOR BAND
        ========================================== */}

        <div className={styles.sectorBand}>
          <div className={styles.bandTitle}>
            <span />

            <strong>
              SOPORTE PARA CADA OPERACIÓN
            </strong>
          </div>

          <div className={styles.sectors}>
            <span
              className={
                styles.agriculture
              }
            >
              <i />
              Agricultura
            </span>

            <span
              className={
                styles.construction
              }
            >
              <i />
              Construcción
            </span>

            <span
              className={
                styles.implements
              }
            >
              <i />
              Implementos
            </span>
          </div>
        </div>

        {/* =========================================
            BOTTOM CTA
        ========================================== */}

        <div className={styles.bottom}>
          <div>
            <span />

            <strong>
              MORGILLO
            </strong>

            <p>
              Tu maquinaria tiene que seguir
              trabajando.
            </p>
          </div>

          <Link href="/servicios">
            Ver todos los servicios

            <ArrowUpRight
              size={16}
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}