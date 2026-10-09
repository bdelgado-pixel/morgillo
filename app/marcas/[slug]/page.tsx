import type {
  Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

import {
  getBrands,
  getCategories,
  getProducts,
  getSite,
} from "@/lib/content";

import {
  whatsapp,
} from "@/data/site";

import ProductCard from "@/components/catalog/ProductCard";

import styles from "./page.module.css";


type Props = {
  params: Promise<{
    slug: string;
  }>;
};


function normalize(
  value: string,
) {
  return value
    .trim()
    .toLowerCase();
}


/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    slug,
  } =
    await params;


  const brands =
    await getBrands();


  const brand =
    brands.find(
      (item) =>
        normalize(
          item.id,
        ) ===
        normalize(
          slug,
        ),
    );


  if (!brand) {
    return {
      title:
        "Marcas | Morgillo",
    };
  }


  return {
    title:
      `${brand.name} | Morgillo`,

    description:
      brand.description,

    alternates: {
      canonical:
        `/marcas/${brand.id}`,
    },
  };
}


/* =========================================================
   PAGE
========================================================= */

export default async function BrandPage({
  params,
}: Props) {
  const {
    slug,
  } =
    await params;


  const [
    brands,
    products,
    categories,
    site,
  ] =
    await Promise.all([
      getBrands(),
      getProducts(),
      getCategories(),
      getSite(),
    ]);


  const brand =
    brands.find(
      (item) =>
        normalize(
          item.id,
        ) ===
        normalize(
          slug,
        ),
    );


  if (!brand) {
    notFound();
  }


  const brandProducts =
    products.filter(
      (product) =>
        normalize(
          product.brandId,
        ) ===
        normalize(
          brand.id,
        ),
    );


  const categoryIds =
    Array.from(
      new Set(
        brandProducts.map(
          (product) =>
            product.category,
        ),
      ),
    );


  const brandCategories =
    categories.filter(
      (category) =>
        categoryIds.includes(
          category.id,
        ),
    );


  const whatsappHref =
    whatsapp(
      `Hola, quisiera información sobre los equipos ${brand.name} disponibles en Morgillo.`,
      site.whatsapp,
    );


  return (
    <main
      className={
        styles.page
      }
      data-brand={
        brand.id.toLowerCase()
      }
    >
      {/* =================================================
          TOP
      ================================================== */}

      <section
        className={
          styles.top
        }
      >
        <div className="morgillo-container">
          <div
            className={
              styles.topInner
            }
          >
            <nav
              aria-label="Migas de pan"
              className={
                styles.breadcrumb
              }
            >
              <Link href="/">
                Inicio
              </Link>

              <span>
                /
              </span>

              <Link href="/marcas">
                Marcas
              </Link>

              <span>
                /
              </span>

              <span
                aria-current="page"
              >
                {
                  brand.name
                }
              </span>
            </nav>


            <Link
              href="/marcas"
              className={
                styles.back
              }
            >
              <ArrowLeft
                size={17}
                strokeWidth={1.8}
              />

              Todas las marcas
            </Link>
          </div>
        </div>
      </section>


      {/* =================================================
          HERO
      ================================================== */}

      <section
        className={
          styles.hero
        }
        aria-labelledby="brand-title"
      >
        <div
          className={
            styles.heroGrid
          }
          aria-hidden="true"
        />


        <div className="morgillo-container">
          <div
            className={
              styles.heroLayout
            }
          >
            {/* =========================================
                CONTENT
            ========================================== */}

            <div
              className={
                styles.heroContent
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
                  Marca
                </p>
              </div>


              <h1
                id="brand-title"
              >
                {
                  brand.name
                }
              </h1>


              {brand.description && (
                <p
                  className={
                    styles.description
                  }
                >
                  {
                    brand.description
                  }
                </p>
              )}


              <div
                className={
                  styles.actions
                }
              >
                <Link
                  href={`/maquinaria?marca=${brand.id}`}
                  className={
                    styles.primaryAction
                  }
                >
                  Ver equipos

                  <ArrowUpRight
                    size={19}
                    strokeWidth={1.8}
                  />
                </Link>


                <a
                  href={
                    whatsappHref
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    styles.secondaryAction
                  }
                >
                  <MessageCircle
                    size={18}
                    strokeWidth={1.8}
                  />

                  Consultar
                </a>
              </div>
            </div>


            {/* =========================================
                IMAGE
            ========================================== */}

            <div
              className={
                styles.heroMedia
              }
            >
              <div
                className={
                  styles.mediaGrid
                }
                aria-hidden="true"
              />


              <div
                className={
                  styles.mediaCircle
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
                  priority
                  sizes="
                    (max-width: 1024px)
                      100vw,
                    50vw
                  "
                  className={
                    styles.image
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


              <div
                className={
                  styles.mediaTop
                }
              >
                <span />

                <strong>
                  {
                    brand.name
                  }
                </strong>
              </div>


              <div
                className={
                  styles.mediaBottom
                }
              >
                <span>
                  Catálogo Morgillo
                </span>

                <span>
                  MRG / BRAND
                </span>
              </div>
            </div>
          </div>


          {/* =============================================
              DATA RAIL
          ============================================== */}

          <div
            className={
              styles.rail
            }
          >
            <div>
              <span>
                Equipos
              </span>

              <strong>
                {
                  brandProducts.length
                }
              </strong>
            </div>


            <div>
              <span>
                Categorías
              </span>

              <strong>
                {
                  brandCategories.length
                }
              </strong>
            </div>


            <div
              className={
                styles.railText
              }
            >
              <span />

              <p>
                Información proveniente
                del catálogo publicado
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          CATEGORIES
      ================================================== */}

      {brandCategories.length >
        0 && (
        <section
          className={
            styles.categories
          }
          aria-labelledby="brand-categories-title"
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
                    Categorías
                  </p>
                </div>


                <h2
                  id="brand-categories-title"
                >
                  Equipos{" "}
                  {
                    brand.name
                  }
                  <span>
                    {" "}
                    por aplicación.
                  </span>
                </h2>
              </div>
            </div>


            <div
              className={
                styles.categoryList
              }
            >
              {brandCategories.map(
                (
                  category,
                  index,
                ) => {
                  const count =
                    brandProducts.filter(
                      (product) =>
                        product.category ===
                        category.id,
                    ).length;


                  return (
                    <Link
                      key={
                        category.id
                      }
                      href={`/maquinaria?categoria=${category.id}&marca=${brand.id}`}
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
                          Categoría
                        </small>

                        <strong>
                          {
                            category.name
                          }
                        </strong>
                      </div>


                      <p>
                        {count}{" "}
                        {count === 1
                          ? "equipo"
                          : "equipos"}
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
          PRODUCTS
      ================================================== */}

      <section
        className={
          styles.products
        }
        aria-labelledby="brand-products-title"
      >
        <div className="morgillo-container">
          <div
            className={
              styles.productsHeader
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
                  Maquinaria
                </p>
              </div>


              <h2
                id="brand-products-title"
              >
                Equipos publicados de
                <span>
                  {" "}
                  {
                    brand.name
                  }.
                </span>
              </h2>
            </div>


            {brandProducts.length >
              0 && (
              <Link
                href={`/maquinaria?marca=${brand.id}`}
              >
                Ver en catálogo

                <ArrowUpRight
                  size={18}
                  strokeWidth={1.8}
                />
              </Link>
            )}
          </div>


          {brandProducts.length >
          0 ? (
            <div
              className={
                styles.productGrid
              }
            >
              {brandProducts.map(
                (product) => (
                  <ProductCard
                    key={
                      product.id
                    }
                    product={
                      product
                    }
                  />
                ),
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
                <small>
                  Catálogo
                </small>

                <h3>
                  No hay equipos
                  publicados para esta
                  marca.
                </h3>

                <p>
                  Puedes consultar la
                  disponibilidad
                  directamente con
                  nuestro equipo.
                </p>


                <a
                  href={
                    whatsappHref
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar por
                  WhatsApp

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.8}
                  />
                </a>
              </div>
            </div>
          )}
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
                {
                  brand.name
                }
              </span>

              <h2>
                Consulta los equipos
                disponibles con
                Morgillo.
              </h2>
            </div>


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
          </div>
        </div>
      </section>
    </main>
  );
}