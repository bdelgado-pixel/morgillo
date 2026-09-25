"use client";

import Image from "next/image";
import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowUpRight,
  BadgeCheck,
  MapPinned,
  Wrench,
} from "lucide-react";

import styles from "./CompanySection.module.css";

const highlights = [
  {
    icon: BadgeCheck,
    title: "Selección",
    text: "Acompañamiento para encontrar el equipo adecuado según la operación.",
  },
  {
    icon: MapPinned,
    title: "Operación",
    text: "Atención desde Tarapoto para acompañar el trabajo en nuestra zona.",
  },
  {
    icon: Wrench,
    title: "Mantenimiento",
    text: "Servicio técnico, repuestos y soporte para mantener la maquinaria trabajando.",
  },
];

function TechnicalRoute({
  reducedMotion,
}: {
  reducedMotion: boolean | null;
}) {
  return (
    <svg
      viewBox="0 0 680 210"
      fill="none"
      className={styles.route}
      aria-hidden="true"
    >
      <motion.path
        d="
          M18 166
          C118 166 110 70 218 70
          C323 70 306 149 411 149
          C506 149 509 48 661 48
        "
        className={styles.routeMain}
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
          amount: 0.4,
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
      />

      <motion.path
        d="
          M18 186
          C118 186 132 102 229 102
          C326 102 333 177 427 177
          C533 177 541 82 661 82
        "
        className={styles.routeSoft}
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
          amount: 0.4,
        }}
        transition={{
          duration: 1.7,
          delay: 0.12,
          ease: "easeOut",
        }}
      />

      {[18, 218, 411, 661].map(
        (x, index) => (
          <motion.circle
            key={x}
            cx={x}
            cy={
              index === 0
                ? 166
                : index === 1
                  ? 70
                  : index === 2
                    ? 149
                    : 48
            }
            r="5"
            className={styles.routePoint}
            initial={
              reducedMotion
                ? false
                : {
                    scale: 0,
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
              duration: 0.35,
              delay:
                0.55 +
                index * 0.14,
            }}
          />
        ),
      )}
    </svg>
  );
}

export default function CompanySection() {
  const reducedMotion =
    useReducedMotion();

  return (
    <section
      id="empresa"
      className={styles.section}
      aria-labelledby="company-title"
    >
      {/* =========================================
          BACKGROUND
      ========================================== */}

      <div
        className={styles.background}
        aria-hidden="true"
      >
        <span className={styles.backgroundWord}>
          M
        </span>

        <span className={styles.backgroundLine} />
      </div>

      <div className="morgillo-container">
        {/* =========================================
            TOP HEADING
        ========================================== */}

        <div className={styles.top}>
          <div className={styles.eyebrow}>
            <span>04</span>

            <i />

            <p>
              Empresa
            </p>
          </div>

          <span className={styles.topCode}>
            MORGILLO / RESPALDO
          </span>
        </div>

        {/* =========================================
            EDITORIAL LAYOUT
        ========================================== */}

        <div className={styles.layout}>
          {/* =======================================
              COPY
          ======================================== */}

          <motion.div
            className={styles.copy}
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    y: 28,
                  }
            }
            whileInView={
              reducedMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.65,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          >
            <h2 id="company-title">
              Maquinaria que mueve
              <span>
                {" "}
                proyectos.
              </span>
            </h2>

            <p className={styles.lead}>
              En Morgillo trabajamos para ofrecer
              soluciones en maquinaria agrícola,
              construcción e implementos,
              acompañando a nuestros clientes
              desde la elección del equipo hasta
              su operación y mantenimiento.
            </p>

            <div className={styles.statement}>
              <span aria-hidden="true">
                M
              </span>

              <div>
                <small>
                  NUESTRA FORMA DE TRABAJAR
                </small>

                <p>
                  Equipo, asesoría y soporte
                  conectados dentro de una misma
                  operación.
                </p>
              </div>
            </div>

            <Link
              href="/empresa"
              className={styles.cta}
            >
              <span>
                Conoce Morgillo
              </span>

              <ArrowUpRight
                size={18}
                strokeWidth={1.8}
              />
            </Link>
          </motion.div>

          {/* =======================================
              VISUAL
          ======================================== */}

          <motion.div
            className={styles.visual}
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    x: 35,
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
              duration: 0.75,
              delay: 0.08,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          >
            <div className={styles.photo}>
              <Image
                src="/images/hero-morgillo.webp"
                alt="Maquinaria y operaciones Morgillo"
                fill
                sizes="
                  (max-width: 900px) 100vw,
                  55vw
                "
                className={styles.image}
              />

              <div
                className={styles.photoShade}
              />

              <div
                className={styles.photoIndex}
              >
                <span>
                  MRG
                </span>

                <strong>
                  04
                </strong>
              </div>

              <div
                className={styles.location}
              >
                <MapPinned
                  size={16}
                  strokeWidth={1.8}
                />

                <div>
                  <span>
                    Base de atención
                  </span>

                  <strong>
                    Tarapoto · San Martín
                  </strong>
                </div>
              </div>

              <div
                className={styles.redBlock}
                aria-hidden="true"
              >
                <span>
                  M
                </span>
              </div>
            </div>

            {/* =====================================
                TECHNICAL DRAWING
            ====================================== */}

            <div className={styles.technical}>
              <div className={styles.technicalTop}>
                <div>
                  <span />

                  <strong>
                    CONTINUIDAD OPERATIVA
                  </strong>
                </div>

                <small>
                  01 — 03
                </small>
              </div>

              <TechnicalRoute
                reducedMotion={
                  reducedMotion
                }
              />

              <div className={styles.routeLegend}>
                <span>
                  Selección
                </span>

                <span>
                  Operación
                </span>

                <span>
                  Soporte
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* =========================================
            PROCESS
        ========================================== */}

        <div className={styles.process}>
          {highlights.map(
            (item, index) => {
              const Icon =
                item.icon;

              return (
                <motion.article
                  key={item.title}
                  className={styles.processItem}
                  initial={
                    reducedMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 20,
                        }
                  }
                  whileInView={
                    reducedMotion
                      ? undefined
                      : {
                          opacity: 1,
                          y: 0,
                        }
                  }
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay:
                      index * 0.09,
                  }}
                >
                  <div
                    className={
                      styles.processNumber
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
                      styles.processIcon
                    }
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.55}
                    />
                  </div>

                  <div
                    className={
                      styles.processCopy
                    }
                  >
                    <h3>
                      {item.title}
                    </h3>

                    <p>
                      {item.text}
                    </p>
                  </div>

                  <span
                    className={
                      styles.processLine
                    }
                    aria-hidden="true"
                  />
                </motion.article>
              );
            },
          )}
        </div>

        {/* =========================================
            BOTTOM RAIL
        ========================================== */}

        <div className={styles.bottom}>
          <div>
            <span />

            <strong>
              MORGILLO
            </strong>

            <p>
              Maquinaria · Servicio · Respaldo
            </p>
          </div>

          <Link href="/contacto">
            Conversar con un asesor

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