import type {
  Metadata,
} from "next";

import {
  Suspense,
} from "react";

import {
  getBrands,
  getCategories,
  getProducts,
} from "@/lib/content";

import Catalog from "@/components/catalog/Catalog";

import styles from "./page.module.css";


export const metadata: Metadata = {
  title: "Maquinaria | Morgillo",

  description:
    "Explora maquinaria agrícola, de construcción e implementos disponibles en Morgillo.",

  alternates: {
    canonical:
      "/maquinaria",
  },
};


export default async function MachineryPage() {
  const [
    products,
    brands,
    categories,
  ] =
    await Promise.all([
      getProducts(),
      getBrands(),
      getCategories(),
    ]);


  return (
    <main
      className={
        styles.page
      }
    >
      {/* =================================================
          PAGE INTRO
      ================================================== */}

      <section
        className={
          styles.hero
        }
        aria-labelledby="catalog-title"
      >
        <div
          className={
            styles.heroGrid
          }
          aria-hidden="true"
        />

        <div className="morgillo-container">
          {/* =============================================
              TOP
          ============================================== */}

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
                Catálogo Morgillo
              </p>
            </div>


            <div
              className={
                styles.heroCode
              }
              aria-hidden="true"
            >
              MRG / MACHINERY
            </div>
          </div>


          {/* =============================================
              CONTENT
          ============================================== */}

          <div
            className={
              styles.heroContent
            }
          >
            <div
              className={
                styles.heroHeading
              }
            >
              <h1
                id="catalog-title"
              >
                Maquinaria para
                <span>
                  {" "}
                  hacer avanzar
                </span>
                {" "}
                cada operación.
              </h1>
            </div>


            <div
              className={
                styles.heroSide
              }
            >
              <p>
                Explora equipos para
                agricultura,
                construcción e
                implementos. Filtra por
                categoría, marca o busca
                directamente por nombre
                y modelo.
              </p>


              <div
                className={
                  styles.heroLine
                }
              >
                <span />

                <strong>
                  Catálogo conectado al
                  CMS
                </strong>
              </div>
            </div>
          </div>


          {/* =============================================
              DYNAMIC DATA
          ============================================== */}

          <div
            className={
              styles.stats
            }
          >
            <div
              className={
                styles.stat
              }
            >
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
                styles.stat
              }
            >
              <span>
                Categorías
              </span>

              <strong>
                {
                  categories.length
                }
              </strong>
            </div>


            <div
              className={
                styles.stat
              }
            >
              <span>
                Marcas
              </span>

              <strong>
                {
                  brands.length
                }
              </strong>
            </div>


            <div
              className={
                styles.statText
              }
            >
              <span />

              <p>
                Agricultura ·
                Construcción ·
                Implementos
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          CATALOG
      ================================================== */}

      <Suspense
        fallback={
          <CatalogLoading />
        }
      >
        <Catalog
          products={
            products
          }
          brands={
            brands
          }
          categories={
            categories
          }
        />
      </Suspense>
    </main>
  );
}


function CatalogLoading() {
  return (
    <section
      className={
        styles.loading
      }
    >
      <div className="morgillo-container">
        <div
          className={
            styles.loadingBar
          }
        >
          <span />

          <p>
            Preparando catálogo…
          </p>
        </div>
      </div>
    </section>
  );
}