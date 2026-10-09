import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
} from "lucide-react";

import type {
  Brand,
} from "@/types/content";

import styles from "./BrandsSection.module.css";


function getBrandClass(
  id: string,
) {
  const value =
    id.toLowerCase();

  if (
    value.includes("kubota")
  ) {
    return styles.kubota;
  }

  if (
    value.includes("kobelco")
  ) {
    return styles.kobelco;
  }

  if (
    value.includes("bull")
  ) {
    return styles.bull;
  }

  return styles.defaultBrand;
}


export default function BrandsSection({
  brands,
}: {
  brands: Brand[];
}) {
  if (
    brands.length === 0
  ) {
    return null;
  }


  return (
    <section
      className={
        styles.section
      }
      aria-labelledby="brands-title"
    >
      {/* ================================================
          DECORATION
      ================================================= */}

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
        {/* ================================================
            HEADER
        ================================================= */}

        <div
          className={
            styles.header
          }
        >
          <div>
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
                03
              </span>

              <span
                className={
                  styles.eyebrowLine
                }
              />

              <p>
                Marcas representadas
              </p>
            </div>


            <h2
              id="brands-title"
            >
              Marcas que respaldan
              <span>
                {" "}
                cada operación.
              </span>
            </h2>
          </div>


          <div
            className={
              styles.headerSide
            }
          >
            <p>
              Trabajamos con marcas
              especializadas en
              maquinaria para ofrecer
              soluciones orientadas al
              trabajo en campo y obra.
            </p>


            <Link
              href="/marcas"
              className={
                styles.allBrands
              }
            >
              Ver todas las marcas

              <ArrowUpRight
                size={19}
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>


        {/* ================================================
            BRAND GRID
        ================================================= */}

        <div
          className={
            styles.grid
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
                className={`${styles.brand} ${getBrandClass(
                  brand.id,
                )}`}
              >
                {/* ========================================
                    IMAGE
                ========================================= */}

                <Image
                  src={
                    brand.image
                  }
                  alt={
                    brand.name
                  }
                  fill
                  sizes="
                    (max-width: 720px)
                      100vw,
                    (max-width: 1050px)
                      50vw,
                    33vw
                  "
                  className={
                    styles.image
                  }
                />


                <div
                  className={
                    styles.imageShade
                  }
                  aria-hidden="true"
                />

                <div
                  className={
                    styles.technicalGrid
                  }
                  aria-hidden="true"
                />


                {/* ========================================
                    TOP
                ========================================= */}

                <div
                  className={
                    styles.top
                  }
                >
                  <div
                    className={
                      styles.topLabel
                    }
                  >
                    <span />

                    <strong>
                      Marca representada
                    </strong>
                  </div>


                  <span
                    className={
                      styles.index
                    }
                  >
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>
                </div>


                {/* ========================================
                    BIG WATERMARK
                ========================================= */}

                <div
                  className={
                    styles.watermark
                  }
                  aria-hidden="true"
                >
                  {
                    brand.name
                  }
                </div>


                {/* ========================================
                    CONTENT
                ========================================= */}

                <div
                  className={
                    styles.content
                  }
                >
                  <div
                    className={
                      styles.brandIdentity
                    }
                  >
                    <span />

                    <p>
                      Equipos y soluciones
                    </p>
                  </div>


                  <h3>
                    {
                      brand.name
                    }
                  </h3>


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
                      styles.action
                    }
                  >
                    <span>
                      Conocer marca
                    </span>

                    <i />

                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>


                {/* ========================================
                    BRAND ACCENT
                ========================================= */}

                <div
                  className={
                    styles.accent
                  }
                  aria-hidden="true"
                />
              </Link>
            ),
          )}
        </div>


        {/* ================================================
            FOOTER
        ================================================= */}

        <div
          className={
            styles.footer
          }
        >
          <div
            className={
              styles.footerCopy
            }
          >
            <span />

            <p>
              Maquinaria para
              agricultura,
              construcción y trabajo
              especializado.
            </p>
          </div>


          <Link
            href="/maquinaria"
            className={
              styles.catalogLink
            }
          >
            Explorar maquinaria

            <ArrowUpRight
              size={18}
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}