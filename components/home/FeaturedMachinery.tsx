import Link from "next/link";

import {
  ArrowRight,
} from "lucide-react";

import type {
  Product,
} from "@/types/content";

import ProductCard from "@/components/catalog/ProductCard";

import styles from "./FeaturedMachinery.module.css";


export default function FeaturedMachinery({
  products,
}: {
  products: Product[];
}) {
  const featured =
    products
      .filter(
        (product) =>
          product.featured,
      )
      .slice(0, 3);


  if (
    featured.length === 0
  ) {
    return null;
  }


  return (
    <section
      className={
        styles.section
      }
      aria-labelledby="featured-machinery-title"
    >
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
                01
              </span>

              <span
                className={
                  styles.line
                }
              />

              <p>
                Maquinaria destacada
              </p>
            </div>


            <h2
              id="featured-machinery-title"
            >
              Equipos listos para
              <span>
                {" "}
                hacer avanzar
              </span>
              {" "}
              tu operación.
            </h2>
          </div>


          <div
            className={
              styles.intro
            }
          >
            <p>
              Explora una selección
              de maquinaria para
              agricultura,
              construcción y trabajo
              especializado.
            </p>


            <Link
              href="/maquinaria"
              className={
                styles.catalogLink
              }
            >
              <span>
                Ver todo el catálogo
              </span>

              <ArrowRight
                size={19}
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>


        {/* =================================================
            DIVIDER
        ================================================== */}

        <div
          className={
            styles.divider
          }
          aria-hidden="true"
        >
          <span />
        </div>


        {/* =================================================
            PRODUCTS
        ================================================== */}

        <div
          className={
            styles.grid
          }
        >
          {featured.map(
            (
              product,
              index,
            ) => (
              <div
                key={
                  product.id
                }
                className={
                  styles.item
                }
              >
                <div
                  className={
                    styles.itemTop
                  }
                >
                  <span>
                    Equipo destacado
                  </span>

                  <span>
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                    {" / "}
                    {String(
                      featured.length,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>
                </div>


                <ProductCard
                  product={
                    product
                  }
                />
              </div>
            ),
          )}
        </div>


        {/* =================================================
            MOBILE CTA
        ================================================== */}

        <Link
          href="/maquinaria"
          className={
            styles.mobileCta
          }
        >
          <span>
            Ver todo el catálogo
          </span>

          <ArrowRight
            size={20}
            strokeWidth={1.8}
          />
        </Link>
      </div>
    </section>
  );
}