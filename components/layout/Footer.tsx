"use client";

import Image from "next/image";
import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowUpRight,
  ChevronUp,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import {
  site,
  whatsapp,
} from "@/data/site";

import styles from "./Footer.module.css";


function phoneHref(value: string) {
  return `tel:${value.replace(
    /[^\d+]/g,
    "",
  )}`;
}


function FooterGraphic({
  reducedMotion,
}: {
  reducedMotion: boolean | null;
}) {
  const draw = {
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
      amount: 0.2,
    },
  };

  return (
    <svg
      viewBox="0 0 1100 360"
      fill="none"
      className={styles.graphic}
      aria-hidden="true"
    >
      {/* topographic contours */}

      <motion.path
        d="
          M-50 275
          C100 203 210 225 334 275
          C460 326 548 311 660 241
          C784 164 920 183 1155 282
        "
        className={styles.contour}
        {...draw}
        transition={{
          duration: 1.6,
          ease: "easeOut",
        }}
      />

      <motion.path
        d="
          M-50 309
          C110 244 221 258 345 304
          C475 352 566 337 678 276
          C805 205 934 218 1155 310
        "
        className={styles.contourSoft}
        {...draw}
        transition={{
          duration: 1.8,
          delay: 0.08,
          ease: "easeOut",
        }}
      />

      <motion.path
        d="
          M-50 235
          C91 158 205 180 325 230
          C448 281 532 267 648 190
          C767 111 917 135 1155 239
        "
        className={styles.contourSoft}
        {...draw}
        transition={{
          duration: 1.9,
          delay: 0.16,
          ease: "easeOut",
        }}
      />

      {/* operational route */}

      <motion.path
        d="
          M72 125
          H310
          C370 125 394 168 452 168
          H690
          C745 168 764 119 826 119
          H1038
        "
        className={styles.route}
        {...draw}
        transition={{
          duration: 1.45,
          delay: 0.32,
          ease: "easeOut",
        }}
      />

      {[72, 452, 826, 1038].map(
        (cx, index) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy={
              index === 0
                ? 125
                : index === 1
                  ? 168
                  : 119
            }
            r="5"
            className={
              index === 3
                ? styles.routeEnd
                : styles.routePoint
            }
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
                0.72 +
                index * 0.1,
            }}
          />
        ),
      )}

      {/* technical references */}

      <path
        d="
          M72 91H130
          M72 101H111

          M930 84H1027
          M970 94H1027
        "
        className={styles.measure}
      />
    </svg>
  );
}


export default function Footer() {
  const reducedMotion =
    useReducedMotion();

  const year =
    new Date().getFullYear();

  function backToTop() {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion
        ? "auto"
        : "smooth",
    });
  }

  return (
    <footer className={styles.footer}>
      {/* =====================================================
          COMMERCIAL CLOSING
      ====================================================== */}

      <section className={styles.closing}>
        <div
          className={styles.graphicWrap}
          aria-hidden="true"
        >
          <FooterGraphic
            reducedMotion={
              reducedMotion
            }
          />
        </div>

        <div className="morgillo-container">
          <div className={styles.closingGrid}>
            <motion.div
              className={styles.closingCopy}
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 24,
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
                amount: 0.3,
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
              <div className={styles.eyebrow}>
                <motion.span
                  initial={
                    reducedMotion
                      ? false
                      : {
                          scaleX: 0,
                        }
                  }
                  whileInView={
                    reducedMotion
                      ? undefined
                      : {
                          scaleX: 1,
                        }
                  }
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                />

                <p>
                  Maquinaria · Servicio · Respaldo
                </p>
              </div>

              <h2>
                Equipos para trabajar.
                <span>
                  {" "}
                  Respaldo para continuar.
                </span>
              </h2>
            </motion.div>

            <motion.div
              className={styles.closingAction}
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                      x: 20,
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
              }}
              transition={{
                duration: 0.6,
                delay: 0.12,
              }}
            >
              <p>
                Cuéntanos qué trabajo necesitas
                realizar y nuestro equipo te
                ayudará a encontrar una solución.
              </p>

              <a
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primary}
              >
                <MessageCircle
                  size={19}
                  strokeWidth={1.8}
                />

                <span>
                  Hablar con un asesor
                </span>

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.8}
                />
              </a>
            </motion.div>
          </div>
        </div>
      </section>


      {/* =====================================================
          CORPORATE FOOTER
      ====================================================== */}

      <section className={styles.main}>
        <div className="morgillo-container">
          <div className={styles.mainGrid}>
            {/* =============================================
                CORPORATE IDENTITY
            ============================================== */}

            <div className={styles.identity}>
              <Link
                href="/"
                className={styles.logo}
                aria-label="Morgillo - Inicio"
              >
                <Image
                  src="/images/logo-morgillo.webp"
                  alt="Morgillo"
                  width={360}
                  height={118}
                  className={styles.logoImage}
                />
              </Link>

              <p>
                Maquinaria agrícola y de
                construcción, implementos,
                repuestos y servicio para
                acompañar cada operación.
              </p>

              <div className={styles.sectorLine}>
                <span className={styles.agriculture}>
                  <i />
                  Agricultura
                </span>

                <span className={styles.construction}>
                  <i />
                  Construcción
                </span>

                <span className={styles.implements}>
                  <i />
                  Implementos
                </span>
              </div>
            </div>


            {/* =============================================
                MACHINERY
            ============================================== */}

            <nav
              className={styles.column}
              aria-label="Maquinaria"
            >
              <span className={styles.columnTitle}>
                Maquinaria
              </span>

              <Link href="/maquinaria">
                Catálogo
              </Link>

              <Link href="/maquinaria?categoria=agricola">
                Agrícola
              </Link>

              <Link href="/maquinaria?categoria=construccion">
                Construcción
              </Link>

              <Link href="/maquinaria?categoria=implementos">
                Implementos
              </Link>
            </nav>


            {/* =============================================
                COMPANY
            ============================================== */}

            <nav
              className={styles.column}
              aria-label="Empresa"
            >
              <span className={styles.columnTitle}>
                Morgillo
              </span>

              <Link href="/empresa">
                Empresa
              </Link>

              <Link href="/marcas">
                Marcas
              </Link>

              <Link href="/servicios">
                Servicios
              </Link>

              <Link href="/novedades">
                Novedades
              </Link>

              <Link href="/contacto">
                Contacto
              </Link>
            </nav>


            {/* =============================================
                CONTACT
            ============================================== */}

            <div className={styles.contact}>
              <span className={styles.columnTitle}>
                Atención
              </span>

              <a
                href={phoneHref(
                  site.phone,
                )}
              >
                <Phone
                  size={16}
                  strokeWidth={1.7}
                />

                <div>
                  <small>
                    Ventas
                  </small>

                  <strong>
                    {site.phone}
                  </strong>
                </div>
              </a>

              <div className={styles.location}>
                <MapPin
                  size={16}
                  strokeWidth={1.7}
                />

                <div>
                  <small>
                    Ubicación
                  </small>

                  <strong>
                    {site.address}
                  </strong>
                </div>
              </div>

              <a
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappText}
              >
                WhatsApp

                <ArrowUpRight
                  size={14}
                  strokeWidth={1.8}
                />
              </a>
            </div>
          </div>


          {/* =================================================
              MANUFACTURERS + SOCIAL
          ================================================== */}

          <div className={styles.meta}>
            <div className={styles.brands}>
              <span className={styles.metaTitle}>
                Marcas
              </span>

              <span className={styles.kubota}>
                <i />
                KUBOTA
              </span>

              <span className={styles.kobelco}>
                <i />
                KOBELCO
              </span>

              <span className={styles.bull}>
                <i />
                BULL
              </span>
            </div>

            <div className={styles.social}>
              {site.social.map(
                (item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.7}
                    />
                  </a>
                ),
              )}
            </div>
          </div>


          {/* =================================================
              BOTTOM
          ================================================== */}

          <div className={styles.bottom}>
            <div>
              <span>
                © {year} Morgillo
              </span>

              <span>
                Tarapoto · San Martín · Perú
              </span>
            </div>

            <button
              type="button"
              onClick={backToTop}
              className={styles.backTop}
              aria-label="Volver al inicio de la página"
            >
              Volver arriba

              <ChevronUp
                size={16}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      </section>
    </footer>
  );
}