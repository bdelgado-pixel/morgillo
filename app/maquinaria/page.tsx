import { Suspense } from "react";

import Catalog from "@/components/catalog/Catalog";
import {
  getBrands,
  getCategories,
  getProducts,
} from "@/lib/content";

export const metadata = {
  title: "Maquinaria",
  description:
    "Explora maquinaria agrícola, construcción e implementos.",
  alternates: {
    canonical: "/maquinaria",
  },
};

export default async function Page() {
  const [products, brands, categories] =
    await Promise.all([
      getProducts(),
      getBrands(),
      getCategories(),
    ]);

  return (
    <>
      {/* =============================================
          HERO CATÁLOGO
      ============================================== */}

      <section className="morgillo-catalog-hero">
        <div
          className="morgillo-catalog-hero__background"
          aria-hidden="true"
        >
          <span>M</span>
          <i />
        </div>

        <div className="morgillo-container">
          <div className="morgillo-catalog-hero__eyebrow">
            <span>Catálogo</span>

            <i aria-hidden="true" />

            <p>Maquinaria y equipos</p>
          </div>

          <div className="morgillo-catalog-hero__grid">
            <div className="morgillo-catalog-hero__content">
              <h1>
                Equipos para
                <span> producir, construir y avanzar.</span>
              </h1>

              <p>
                Encuentra maquinaria para agricultura,
                construcción, movimiento de tierra e
                implementos según las necesidades de tu
                operación.
              </p>
            </div>

            <div className="morgillo-catalog-hero__stats">
              <div>
                <strong>{products.length}</strong>

                <span>
                  Equipos en catálogo
                </span>
              </div>

              <div>
                <strong>{categories.length}</strong>

                <span>
                  Categorías
                </span>
              </div>

              <div>
                <strong>{brands.length}</strong>

                <span>
                  Marcas
                </span>
              </div>
            </div>
          </div>

          {/* =========================================
              CATEGORY RAIL
          ========================================== */}

          <div className="morgillo-catalog-hero__rail">
            <div>
              <span aria-hidden="true" />

              <strong>MORGILLO</strong>

              <p>
                Soluciones para tu operación
              </p>
            </div>

            <div className="morgillo-catalog-hero__categories">
              {categories.map((category) => (
                <span key={category.id}>
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          CATÁLOGO
      ============================================== */}

      <Suspense
        fallback={
          <div className="morgillo-catalog-loading">
            <div className="morgillo-container">
              <span />

              <p>
                Cargando catálogo…
              </p>
            </div>
          </div>
        }
      >
        <Catalog
          products={products}
          brands={brands}
          categories={categories}
        />
      </Suspense>
    </>
  );
}