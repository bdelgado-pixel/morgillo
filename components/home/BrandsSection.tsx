"use client";

import Image from "next/image";
import Link from "next/link";

import clsx from "clsx";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowUpRight,
} from "lucide-react";

import type { Brand } from "@/types/content";

import styles from "./BrandsSection.module.css";

type Props = {
  brands: Brand[];
};

const brandMeta: Record<
  string,
  {
    label: string;
    code: string;
  }
> = {
  kubota: {
    label: "Agricultura",
    code: "KBT",
  },

  kobelco: {
    label: "Construcción",
    code: "KBL",
  },

  bull: {
    label: "Trabajo pesado",
    code: "BLL",
  },
};

export default function BrandsSection({
  brands,
}: Props) {
  const reduceMotion =
    useReducedMotion();

  return (
    <section
      className={styles.section}
      aria-labelledby="brands-title"
    >
      {/* =========================================
          BACKGROUND
      ========================================== */}

      <div
        className={styles.background}
        aria-hidden="true"
      >
        <span className={styles.number}>
          03
        </span>

        <span className={styles.lineOne} />
        <span className={styles.lineTwo} />

        <div className={styles.cross}>
          <span />
          <span />
        </div>
      </div>

      <div className="morgillo-container">
        {/* =========================================
            HEADER
        ========================================== */}

        <div className={styles.header}>
          <div className={styles.heading}>
            <div className={styles.eyebrow}>
              <span>03</span>

              <i />

              <p>
                Marcas
              </p>
            </div>

            <h2 id="brands-title">
              Marcas que acompañan
              <span>
                {" "}
                cada tipo de operación.
              </span>
            </h2>
          </div>

          <div className={styles.intro}>
            <span>
              MORGILLO / PORTAFOLIO
            </span>

            <p>
              Maquinaria y soluciones para
              agricultura, construcción y
              trabajo pesado, integradas dentro
              del respaldo Morgillo.
            </p>
          </div>
        </div>

        {/* =========================================
            BRAND INDEX
        ========================================== */}

        <div className={styles.brandIndex}>
          <div>
            <span className={styles.indexMark} />

            <strong>
              MORGILLO
            </strong>

            <p>
              Marcas del portafolio
            </p>
          </div>

          <div className={styles.indexBrands}>
            {brands.map((brand) => {
              const id =
                brand.id
                  .toLowerCase()
                  .trim();

              return (
                <span
                  key={brand.id}
                  className={clsx(
                    styles.indexBrand,
                    styles[
                      `index-${id}`
                    ],
                  )}
                >
                  <i />

                  {brand.name}
                </span>
              );
            })}
          </div>
        </div>

        {/* =========================================
            CARDS
        ========================================== */}

        <div className={styles.grid}>
          {brands.map(
            (brand, index) => {
              const id =
                brand.id
                  .toLowerCase()
                  .trim();

              const meta =
                brandMeta[id];

              return (
                <motion.article
                  key={brand.id}
                  className={clsx(
                    styles.card,
                    styles[
                      `brand-${id}`
                    ],
                  )}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 36,
                        }
                  }
                  whileInView={
                    reduceMotion
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
                    duration: 0.6,
                    delay:
                      index * 0.09,
                    ease: [
                      0.16,
                      1,
                      0.3,
                      1,
                    ],
                  }}
                >
                  <Link
                    href={`/marcas/${brand.id}`}
                    className={styles.link}
                  >
                    {/* ==========================
                        IMAGE STAGE
                    =========================== */}

                    <div
                      className={
                        styles.stage
                      }
                    >
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        sizes="
                          (max-width: 640px) 100vw,
                          (max-width: 960px) 50vw,
                          33vw
                        "
                        className={
                          styles.image
                        }
                      />

                      <div
                        className={
                          styles.imageOverlay
                        }
                      />

                      {/* technical rings */}

                      <div
                        className={
                          styles.rings
                        }
                        aria-hidden="true"
                      >
                        <span />
                        <span />
                        <span />
                      </div>

                      {/* index */}

                      <span
                        className={
                          styles.cardIndex
                        }
                      >
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      {/* code */}

                      <span
                        className={
                          styles.code
                        }
                      >
                        {meta?.code ??
                          "MRG"}
                      </span>

                      {/* moving accent */}

                      <motion.span
                        className={
                          styles.scanLine
                        }
                        aria-hidden="true"
                        initial={
                          reduceMotion
                            ? false
                            : {
                                scaleX:
                                  0.12,
                              }
                        }
                        whileInView={
                          reduceMotion
                            ? undefined
                            : {
                                scaleX: 1,
                              }
                        }
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 1,
                          delay:
                            0.3 +
                            index *
                              0.1,
                          ease: [
                            0.16,
                            1,
                            0.3,
                            1,
                          ],
                        }}
                      />
                    </div>

                    {/* ==========================
                        INFO
                    =========================== */}

                    <div
                      className={
                        styles.content
                      }
                    >
                      <div
                        className={
                          styles.contentTop
                        }
                      >
                        <span>
                          {meta?.label ??
                            "Maquinaria"}
                        </span>

                        <span
                          className={
                            styles.arrow
                          }
                        >
                          <ArrowUpRight
                            size={18}
                            strokeWidth={
                              1.7
                            }
                          />
                        </span>
                      </div>

                      <div
                        className={
                          styles.brandName
                        }
                      >
                        <span />

                        <h3>
                          {brand.name}
                        </h3>
                      </div>

                      <p
                        className={
                          styles.description
                        }
                      >
                        {
                          brand.description
                        }
                      </p>

                      <div
                        className={
                          styles.footer
                        }
                      >
                        <span>
                          Explorar marca
                        </span>

                        <i
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            },
          )}
        </div>

        {/* =========================================
            CLOSING
        ========================================== */}

        <div className={styles.closing}>
          <div>
            <span />

            <p>
              Maquinaria, soporte y soluciones
              para distintas operaciones.
            </p>
          </div>

          <Link href="/maquinaria">
            Explorar maquinaria

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