import type {
  Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
} from "lucide-react";

import {
  getBrands,
  getProducts,
} from "@/lib/content";

import styles from "./page.module.css";


export const metadata: Metadata = {
  title: "Marcas | Morgillo",

  description:
    "Conoce las marcas presentes en el catálogo de maquinaria Morgillo.",

  alternates: {
    canonical: "/marcas",
  },
};


export default async function BrandsPage() {
  const [
    brands,
    products,
  ] =
    await Promise.all([
      getBrands(),
      getProducts(),
    ]);


  const primaryBrands =
    brands.filter(
      (brand) =>
        brand.primary !== false,
    );


  const secondaryBrands =
    brands.filter(
      (brand) =>
        brand.primary === false,
    );


  function productCount(
    brandId: string,
  ) {
    return products.filter(
      (product) =>
        product.brandId
          .toLowerCase() ===
        brandId.toLowerCase(),
    ).length;
  }


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
        aria-labelledby="brands-title"
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
                Marcas
              </p>
            </div>


            <span
              className={
                styles.heroCode
              }
            >
              MRG / BRANDS
            </span>
          </div>


          <div
            className={
              styles.heroContent
            }
          >
            <div>
              <h1
                id="brands-title"
              >
                Marcas para diferentes
                <span>
                  {" "}
                  tipos de operación.
                </span>
              </h1>
            </div>


            <div
              className={
                styles.heroSide
              }
            >
              <p>
                Explora las marcas
                publicadas actualmente
                en el catálogo Morgillo
                y conoce los equipos
                asociados a cada una.
              </p>


              <Link
                href="/maquinaria"
              >
                Ver todo el catálogo

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>


          <div
            className={
              styles.heroRail
            }
          >
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
                Principales
              </span>

              <strong>
                {
                  primaryBrands.length
                }
              </strong>
            </div>


            <div>
              <span>
                Equipos
              </span>

              <strong>
                {
                  products.length
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
                Maquinaria · marcas ·
                soluciones
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          PRIMARY BRANDS
      ================================================== */}

      <section
        className={
          styles.primary
        }
        aria-labelledby="primary-brands-title"
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
                  02
                </span>

                <i />

                <p>
                  Marcas principales
                </p>
              </div>


              <h2
                id="primary-brands-title"
              >
                Protagonistas de
                <span>
                  {" "}
                  nuestro catálogo.
                </span>
              </h2>
            </div>


            <p>
              Consulta los equipos
              publicados para cada
              marca directamente desde
              el catálogo.
            </p>
          </div>


          {primaryBrands.length >
          0 ? (
            <div
              className={
                styles.brandGrid
              }
            >
              {primaryBrands.map(
                (
                  brand,
                  index,
                ) => {
                  const count =
                    productCount(
                      brand.id,
                    );


                  return (
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
                      {/* IMAGE */}

                      <div
                        className={
                          styles.brandMedia
                        }
                      >
                        <div
                          className={
                            styles.brandMediaGrid
                          }
                          aria-hidden="true"
                        />


                        {brand.image ? (
                          <Image
                            src={
                              brand.image
                            }
                            alt={
                              brand.name
                            }
                            fill
                            sizes="
                              (max-width: 700px)
                                100vw,
                              (max-width: 1100px)
                                50vw,
                              33vw
                            "
                            className={
                              styles.brandImage
                            }
                          />
                        ) : (
                          <div
                            className={
                              styles.imageFallback
                            }
                          >
                            {
                              brand.name
                            }
                          </div>
                        )}


                        <span
                          className={
                            styles.brandIndex
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


                      {/* CONTENT */}

                      <div
                        className={
                          styles.brandBody
                        }
                      >
                        <div
                          className={
                            styles.brandMeta
                          }
                        >
                          <span>
                            Marca
                          </span>

                          <strong>
                            {count}{" "}
                            {count === 1
                              ? "equipo"
                              : "equipos"}
                          </strong>
                        </div>


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


                        <div
                          className={
                            styles.brandAction
                          }
                        >
                          <span>
                            Explorar marca
                          </span>

                          <ArrowUpRight
                            size={20}
                            strokeWidth={1.8}
                          />
                        </div>
                      </div>


                      <span
                        className={
                          styles.brandAccent
                        }
                        aria-hidden="true"
                      />
                    </Link>
                  );
                },
              )}
            </div>
          ) : (
            <div
              className={
                styles.empty
              }
            >
              <span>
                00
              </span>

              <div>
                <strong>
                  No hay marcas
                  principales
                  publicadas.
                </strong>

                <p>
                  La información puede
                  actualizarse desde el
                  CMS.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* =================================================
          SECONDARY BRANDS
      ================================================== */}

      {secondaryBrands.length >
        0 && (
        <section
          className={
            styles.secondary
          }
          aria-labelledby="secondary-brands-title"
        >
          <div className="morgillo-container">
            <div
              className={
                styles.secondaryHeader
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
                    Otras marcas
                  </p>
                </div>


                <h2
                  id="secondary-brands-title"
                >
                  Más opciones
                  <span>
                    {" "}
                    en catálogo.
                  </span>
                </h2>
              </div>
            </div>


            <div
              className={
                styles.secondaryList
              }
            >
              {secondaryBrands.map(
                (
                  brand,
                  index,
                ) => {
                  const count =
                    productCount(
                      brand.id,
                    );


                  return (
                    <Link
                      key={
                        brand.id
                      }
                      href={`/marcas/${brand.id}`}
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
                          Marca
                        </small>

                        <strong>
                          {
                            brand.name
                          }
                        </strong>
                      </div>


                      <p>
                        {count}{" "}
                        {count === 1
                          ? "equipo publicado"
                          : "equipos publicados"}
                      </p>


                      <ArrowUpRight
                        size={19}
                        strokeWidth={1.8}
                      />
                    </Link>
                  );
                },
              )}
            </div>
          </div>
        </section>
      )}


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
                Catálogo Morgillo
              </span>

              <h2>
                Encuentra el equipo
                adecuado para tu
                operación.
              </h2>
            </div>


            <Link
              href="/maquinaria"
            >
              Explorar maquinaria

              <ArrowUpRight
                size={20}
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}