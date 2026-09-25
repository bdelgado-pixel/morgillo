import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
} from "lucide-react";

import type {
  Product,
} from "@/types/content";

import styles from "./ProductCard.module.css";


const categoryLabels = {
  agricola:
    "Agricultura",

  construccion:
    "Construcción",

  implementos:
    "Implementos",
} as const;


export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const image =
    product.images[0];


  const specifications =
    product.specifications.slice(
      0,
      2,
    );


  const brand =
    product.brandId?.trim()
      ? product.brandId.toUpperCase()
      : "MORGILLO";


  const category =
    categoryLabels[
      product.category
    ];


  return (
    <article
      className={
        styles.card
      }
      data-brand={
        product.brandId
          ?.toLowerCase()
      }
    >
      <Link
        href={`/maquinaria/${product.slug}`}
        className={
          styles.link
        }
        aria-label={`Ver detalles de ${product.name}`}
      >
        {/* =================================================
            IMAGE
        ================================================== */}

        <div
          className={
            styles.media
          }
        >
          <div
            className={
              styles.technicalGrid
            }
            aria-hidden="true"
          />

          <div
            className={
              styles.circle
            }
            aria-hidden="true"
          />


          {image ? (
            <Image
              src={
                image.url
              }
              alt={
                image.alt ||
                product.name
              }
              fill
              sizes="
                (max-width: 640px)
                  100vw,
                (max-width: 1024px)
                  50vw,
                33vw
              "
              className={
                styles.image
              }
            />
          ) : (
            <div
              className={
                styles.placeholder
              }
            >
              Imagen no disponible
            </div>
          )}


          {/* =============================================
              BRAND
          ============================================== */}

          <div
            className={
              styles.brand
            }
          >
            <span />

            <strong>
              {brand}
            </strong>
          </div>


          {/* =============================================
              ARROW
          ============================================== */}

          <div
            className={
              styles.floatingArrow
            }
            aria-hidden="true"
          >
            <ArrowUpRight
              size={20}
              strokeWidth={1.8}
            />
          </div>


          <div
            className={
              styles.mediaLine
            }
            aria-hidden="true"
          />
        </div>


        {/* =================================================
            BODY
        ================================================== */}

        <div
          className={
            styles.body
          }
        >
          <div
            className={
              styles.meta
            }
          >
            <span>
              {category}
            </span>

            {product.mock && (
              <span
                className={
                  styles.demo
                }
              >
                Demostración
              </span>
            )}
          </div>


          <h3
            className={
              styles.title
            }
          >
            {product.name}
          </h3>


          {product.model && (
            <p
              className={
                styles.model
              }
            >
              Modelo{" "}
              <strong>
                {product.model}
              </strong>
            </p>
          )}


          {/* =============================================
              SPECS
          ============================================== */}

          {specifications.length >
            0 && (
            <dl
              className={
                styles.specifications
              }
            >
              {specifications.map(
                (
                  specification,
                  index,
                ) => (
                  <div
                    key={`${specification.label}-${index}`}
                  >
                    <dt>
                      {
                        specification.label
                      }
                    </dt>

                    <dd>
                      {
                        specification.value
                      }

                      {specification.unit
                        ? ` ${specification.unit}`
                        : ""}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          )}


          {/* =============================================
              FOOTER
          ============================================== */}

          <div
            className={
              styles.footer
            }
          >
            <div>
              <span>
                Ver detalles
              </span>

              <i />
            </div>

            <ArrowUpRight
              size={19}
              strokeWidth={1.8}
            />
          </div>
        </div>
      </Link>
    </article>
  );
}