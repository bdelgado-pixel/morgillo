"use client";

import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowUpRight,
  Building2,
  Clock3,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import {
  site,
  whatsapp,
} from "@/data/site";

import styles from "./ContactSection.module.css";

function phoneHref(value: string) {
  return `tel:${value.replace(
    /[^\d+]/g,
    "",
  )}`;
}

const contactItems = [
  {
    label: "Ventas",
    value: site.phone,
    href: phoneHref(
      site.phone,
    ),
    icon: Phone,
    code: "VTA",
  },
  {
    label: "Oficina",
    value: site.office,
    href: phoneHref(
      site.office,
    ),
    icon: Building2,
    code: "OFC",
  },
  {
    label: "Servicio",
    value: site.service,
    href: phoneHref(
      site.service,
    ),
    icon: Wrench,
    code: "SVC",
  },
];

function ContactMapGraphic({
  reducedMotion,
}: {
  reducedMotion:
    | boolean
    | null;
}) {
  const pathAnimation = {
    initial: reducedMotion
      ? false
      : {
          pathLength: 0,
          opacity: 0,
        },

    whileInView:
      reducedMotion
        ? undefined
        : {
            pathLength: 1,
            opacity: 1,
          },

    viewport: {
      once: true,
      amount: 0.3,
    },
  };

  return (
    <svg
      viewBox="0 0 620 350"
      fill="none"
      className={styles.map}
      aria-hidden="true"
    >
      {/* secondary routes */}

      <motion.path
        d="
          M32 78
          C130 42 205 76 275 126
          C341 174 417 157 588 92
        "
        className={
          styles.routeSoft
        }
        {...pathAnimation}
        transition={{
          duration: 1.5,
        }}
      />

      <motion.path
        d="
          M20 253
          C122 210 207 217 293 266
          C378 314 484 291 603 221
        "
        className={
          styles.routeSoft
        }
        {...pathAnimation}
        transition={{
          duration: 1.6,
          delay: 0.1,
        }}
      />

      <motion.path
        d="
          M100 18
          C142 100 168 180 142 332
        "
        className={
          styles.routeSoft
        }
        {...pathAnimation}
        transition={{
          duration: 1.7,
          delay: 0.16,
        }}
      />

      {/* main route */}

      <motion.path
        d="
          M48 303
          C113 261 147 177 229 178
          C302 179 315 237 377 223
          C444 208 456 116 565 61
        "
        className={
          styles.routeMain
        }
        {...pathAnimation}
        transition={{
          duration: 1.7,
          delay: 0.25,
          ease: "easeOut",
        }}
      />

      {/* destination */}

      <motion.circle
        cx="377"
        cy="223"
        r="25"
        className={
          styles.destinationOuter
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
          duration: 0.5,
          delay: 0.85,
        }}
      />

      <motion.circle
        cx="377"
        cy="223"
        r="8"
        className={
          styles.destination
        }
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
          delay: 1,
        }}
      />

      {/* technical points */}

      {[
        [48, 303],
        [229, 178],
        [565, 61],
      ].map(
        (
          [cx, cy],
          index,
        ) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="5"
            className={
              styles.routePoint
            }
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
              duration: 0.3,
              delay:
                0.7 +
                index * 0.12,
            }}
          />
        ),
      )}
    </svg>
  );
}

export default function ContactSection() {
  const reducedMotion =
    useReducedMotion();

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
      {/* background */}

      <div
        className={
          styles.background
        }
        aria-hidden="true"
      >
        <span>
          08
        </span>

        <i />
      </div>

      <div className="morgillo-container">
        {/* =========================================
            HEADER
        ========================================== */}

        <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_.65fr] lg:gap-20">
          <div>
            <div
              className={
                styles.eyebrow
              }
            >
              <span>
                08
              </span>

              <i />

              <p>
                Contacto
              </p>
            </div>

            <h2
              id="contact-title"
              className={
                styles.title
              }
            >
              Tu próximo trabajo
              <span>
                {" "}
                empieza hablando.
              </span>
            </h2>
          </div>

          <div
            className={
              styles.intro
            }
          >
            <ShieldCheck
              size={23}
              strokeWidth={
                1.6
              }
            />

            <p>
              Cuéntanos qué
              necesitas realizar.
              Nuestro equipo puede
              orientarte sobre
              maquinaria, repuestos
              y servicio.
            </p>
          </div>
        </div>

        {/* =========================================
            MAIN GRID
        ========================================== */}

        <div
          className={
            styles.layout
          }
        >
          {/* =======================================
              COMMERCIAL PANEL
          ======================================== */}

          <motion.div
            className={
              styles.commercial
            }
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
              amount: 0.2,
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
            <div
              className={
                styles.commercialTop
              }
            >
              <span />

              <strong>
                ATENCIÓN COMERCIAL
              </strong>

              <small>
                MRG / 08
              </small>
            </div>

            <div
              className={
                styles.commercialBody
              }
            >
              <span
                className={
                  styles.miniLabel
                }
              >
                RESPUESTA DIRECTA
              </span>

              <h3>
                Hablemos sobre el
                equipo que necesita
                tu operación.
              </h3>

              <p>
                Escríbenos por
                WhatsApp para recibir
                orientación comercial
                y encontrar el punto
                de partida adecuado.
              </p>

              <a
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.whatsapp
                }
              >
                <span
                  className={
                    styles.whatsappIcon
                  }
                >
                  <MessageCircle
                    size={20}
                    strokeWidth={
                      1.8
                    }
                  />
                </span>

                <span>
                  <small>
                    CANAL DIRECTO
                  </small>

                  <strong>
                    Consultar por
                    WhatsApp
                  </strong>
                </span>

                <ArrowUpRight
                  size={19}
                  strokeWidth={
                    1.8
                  }
                />
              </a>

              <div
                className={
                  styles.commercialCode
                }
              >
                <span>
                  M
                </span>

                <div>
                  <small>
                    MORGILLO
                  </small>

                  <strong>
                    MAQUINARIA +
                    RESPALDO
                  </strong>
                </div>
              </div>
            </div>

            <div
              className={
                styles.commercialNumber
              }
              aria-hidden="true"
            >
              08
            </div>
          </motion.div>

          {/* =======================================
              CONTACT CHANNELS
          ======================================== */}

          <div
            className={
              styles.channels
            }
          >
            <div
              className={
                styles.channelsHeader
              }
            >
              <div>
                <span />

                <strong>
                  CANALES DE
                  ATENCIÓN
                </strong>
              </div>

              <small>
                01 — 03
              </small>
            </div>

            {contactItems.map(
              (
                item,
                index,
              ) => {
                const Icon =
                  item.icon;

                return (
                  <motion.a
                    key={
                      item.label
                    }
                    href={
                      item.href
                    }
                    className={
                      styles.channel
                    }
                    initial={
                      reducedMotion
                        ? false
                        : {
                            opacity: 0,
                            x: 24,
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
                      duration: 0.5,
                      delay:
                        index *
                        0.07,
                    }}
                  >
                    <span
                      className={
                        styles.channelNumber
                      }
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <span
                      className={
                        styles.channelIcon
                      }
                    >
                      <Icon
                        size={22}
                        strokeWidth={
                          1.55
                        }
                      />
                    </span>

                    <span
                      className={
                        styles.channelCopy
                      }
                    >
                      <small>
                        {
                          item.code
                        }
                      </small>

                      <strong>
                        {
                          item.label
                        }
                      </strong>

                      <span>
                        {
                          item.value
                        }
                      </span>
                    </span>

                    <ArrowUpRight
                      className={
                        styles.channelArrow
                      }
                      size={19}
                      strokeWidth={
                        1.7
                      }
                    />

                    <i
                      className={
                        styles.channelProgress
                      }
                    />
                  </motion.a>
                );
              },
            )}
          </div>
        </div>

        {/* =========================================
            LOCATION
        ========================================== */}

        <motion.div
          className={
            styles.location
          }
          initial={
            reducedMotion
              ? false
              : {
                  opacity: 0,
                  y: 25,
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
            amount: 0.15,
          }}
          transition={{
            duration: 0.65,
          }}
        >
          {/* map graphic */}

          <div
            className={
              styles.mapStage
            }
          >
            <div
              className={
                styles.mapTop
              }
            >
              <div>
                <MapPin
                  size={16}
                  strokeWidth={
                    1.8
                  }
                />

                <strong>
                  UBICACIÓN
                </strong>
              </div>

              <span>
                TARAPOTO / SAN
                MARTÍN
              </span>
            </div>

            <ContactMapGraphic
              reducedMotion={
                reducedMotion
              }
            />

            <div
              className={
                styles.mapPin
              }
            >
              <MapPin
                size={22}
                strokeWidth={
                  1.8
                }
              />

              <span>
                M
              </span>
            </div>
          </div>

          {/* location info */}

          <div
            className={
              styles.locationInfo
            }
          >
            <span
              className={
                styles.locationLabel
              }
            >
              VISÍTANOS
            </span>

            <h3>
              {site.address}
            </h3>

            <div
              className={
                styles.hours
              }
            >
              <Clock3
                size={19}
                strokeWidth={
                  1.6
                }
              />

              <div>
                <small>
                  Horario de
                  atención
                </small>

                <strong>
                  {site.hours}
                </strong>
              </div>
            </div>

            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className={
                styles.mapButton
              }
            >
              <Navigation
                size={17}
                strokeWidth={
                  1.8
                }
              />

              <span>
                Abrir ubicación
              </span>

              <ArrowUpRight
                size={17}
                strokeWidth={
                  1.8
                }
              />
            </a>
          </div>
        </motion.div>

        {/* =========================================
            BOTTOM
        ========================================== */}

        <div
          className={
            styles.bottom
          }
        >
          <div>
            <span />

            <strong>
              MORGILLO
            </strong>

            <p>
              Maquinaria · Repuestos
              · Servicio
            </p>
          </div>

          <Link href="/contacto">
            Página de contacto

            <ArrowUpRight
              size={16}
              strokeWidth={
                1.8
              }
            />
          </Link>
        </div>
      </div>
    </section>
  );
}