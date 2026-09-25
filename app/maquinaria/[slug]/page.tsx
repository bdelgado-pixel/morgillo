import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Category } from "@/types/content";

import {
  getBrands,
  getCategories,
  getProduct,
  getProducts,
  getSite,
} from "@/lib/content";

import { whatsapp } from "@/data/site";

import Gallery from "@/components/catalog/Gallery";
import ProductCard from "@/components/catalog/ProductCard";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const sectorContent = {
  agricola: {
    label: "Agricultura",
    eyebrow: "Trabajo en campo",
    description:
      "Maquinaria orientada a producción, preparación de terreno y operaciones agrícolas.",
  },

  construccion: {
    label: "Construcción",
    eyebrow: "Obra y movimiento de tierra",
    description:
      "Equipos preparados para excavación, carga, movimiento de tierra y trabajo exigente.",
  },

  implementos: {
    label: "Implementos",
    eyebrow: "Más capacidad para tu equipo",
    description:
      "Soluciones para ampliar las posibilidades de trabajo de tu maquinaria.",
  },
};

export async function generateMetadata({
  params,
}: Props) {
  const { slug } = await params;

  const product =
    await getProduct(slug);

  return {
    title:
      product?.name ??
      "Maquinaria",

    description:
      product?.description,

    robots: product?.mock
      ? {
          index: false,
          follow: true,
        }
      : undefined,

    alternates: {
      canonical:
        `/maquinaria/${slug}`,
    },
  };
}

export default async function Page({
  params,
}: Props) {
  const { slug } = await params;

  const categories =
    await getCategories();

  if (
    categories.some(
      (category) =>
        category.id === slug,
    )
  ) {
    redirect(
      `/maquinaria?categoria=${slug}`,
    );
  }

  const [
    product,
    site,
    brands,
    products,
  ] = await Promise.all([
    getProduct(slug),
    getSite(),
    getBrands(),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const category =
    categories.find(
      (item) =>
        item.id ===
        product.category,
    );

  const brand =
    brands.find(
      (item) =>
        item.id ===
        product.brandId,
    );

  const sector =
    sectorContent[
      product.category
    ];

  const brandClass =
    product.brandId
      ?.toLowerCase()
      .replace(
        /[^a-z0-9-_]/g,
        "-",
      ) || "generic";

  const related =
    products
      .filter(
        (item) =>
          item.id !==
            product.id &&
          item.category ===
            product.category,
      )
      .slice(0, 3);

  return (
    <main
      className={`
        morgillo-product-page
        is-${product.category}
        brand-${brandClass}
      `}
    >
      {/* =========================================
          SECTOR HERO
      ========================================== */}

      <section className="morgillo-product-sector">
        <div
          className="morgillo-product-sector__background"
          aria-hidden="true"
        >
          <span>
            M
          </span>

          <i />
        </div>

        <div className="morgillo-container">
          {/* BREADCRUMB */}

          <nav
            aria-label="Migas de pan"
            className="morgillo-product-breadcrumb"
          >
            <Link href="/">
              Inicio
            </Link>

            <span>
              /
            </span>

            <Link href="/maquinaria">
              Maquinaria
            </Link>

            <span>
              /
            </span>

            <Link href={`/maquinaria?categoria=${product.category}`}>
              {category?.name ?? sector.label}
            </Link>
            <span aria-hidden="true">/</span>
            <strong aria-current="page">{product.name}</strong>
          </nav>

          {/* SECTOR */}

          <div className="morgillo-product-sector__grid">
            <div className="morgillo-product-sector__copy">
              <div className="morgillo-product-sector__eyebrow">
                <span>
                  {category?.name ??
                    sector.label}
                </span>

                <i />

                <p>
                  {sector.eyebrow}
                </p>
              </div>

              <p className="morgillo-product-sector__title">
                {category?.name ?? sector.label}
              </p>

              <p>
                {
                  category?.description || sector.description
                }
              </p>
            </div>

            <div className="morgillo-product-sector__art">
              <CategoryVector
                category={
                  product.category
                }
              />
            </div>
          </div>

          {/* RAIL */}

          <div className="morgillo-product-sector__rail">
            <div>
              <span />

              <strong>
                MORGILLO
              </strong>

              <p>
                Maquinaria y soluciones
              </p>
            </div>

            <div>
              <span>
                {brand?.name ??
                  product.brandId.toUpperCase()}
              </span>

              <i />

              <span>
                {category?.name}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          PRODUCT
      ========================================== */}

      <section className="morgillo-product-detail">
        <div className="morgillo-container">
          {product.mock && (
            <div className="morgillo-product-demo">
              <span>
                Información
              </span>

              <p>
                Ficha de demostración.
                Imagen de referencia;
                modelo y
                especificaciones
                pendientes de
                confirmar.
              </p>
            </div>
          )}

          <div className="morgillo-product-detail__grid">
            {/* GALLERY */}

            <Gallery
              key={product.id}
              images={product.images}
              name={product.name}
            />

            {/* INFORMATION */}

            <div className="morgillo-product-info">
              <div className="morgillo-product-info__top">
                <div className="morgillo-product-brand">
                  <span />

                  <div>
                    <small>
                      Marca
                    </small>

                    <strong>
                      {brand?.name ??
                        (product.brandId.toUpperCase() || "Morgillo")}
                    </strong>
                  </div>
                </div>

                <span className="morgillo-product-info__category">
                  {category?.name}
                </span>
              </div>

              <div className="morgillo-product-info__title">
                <span>
                  Equipo / Modelo
                </span>

                <h1>
                  {product.name}
                </h1>

                {product.model && (
                  <p>
                    {product.model}
                  </p>
                )}
              </div>

              <p className="morgillo-product-info__description">
                {
                  product.description
                }
              </p>

              {/* QUICK SPECS */}

              {product.specifications
                .length > 0 && (
                <div className="morgillo-product-info__quick-specs">
                  {product.specifications
                    .slice(0, 3)
                    .map((spec, index) => (
                      <div
                        key={`${spec.label}-${index}`}
                      >
                        <span>
                          {
                            spec.label
                          }
                        </span>

                        <strong>
                          {
                            spec.value
                          }{" "}
                          {
                            spec.unit ??
                            ""
                          }
                        </strong>
                      </div>
                    ))}
                </div>
              )}

              {/* CTA */}

              <div className="morgillo-product-info__actions">
                <a
                  className="morgillo-product-info__primary"
                  href={whatsapp(
                    `Hola, quisiera información sobre ${product.name}${
                      product.mock
                        ? " (imagen de referencia del sitio)"
                        : ` ${product.model}`
                    }.`,
                    site.whatsapp,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    Consultar por WhatsApp
                  </span>

                  <span
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>

                <Link
                  href="/contacto"
                  className="morgillo-product-info__secondary"
                >
                  <span>
                    Contactar con ventas
                  </span>

                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </div>

              {/* TRUST */}

              <div className="morgillo-product-info__trust">
                <div>
                  <span />

                  <p>
                    Asesoría comercial
                  </p>
                </div>

                <div>
                  <span />

                  <p>
                    Servicio técnico
                  </p>
                </div>

                <div>
                  <span />

                  <p>
                    Respaldo Morgillo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SPECIFICATIONS
      ========================================== */}

      <section className="morgillo-product-specs">
        <div className="morgillo-container">
          <div className="morgillo-product-section-heading">
            <div>
              <span>
                01
              </span>

              <i />

              <p>
                Datos técnicos
              </p>
            </div>

            <h2>
              Especificaciones
              <span>
                {" "}
                para conocer el
                equipo.
              </span>
            </h2>
          </div>

          {product.specifications
            .length ? (
            <dl className="morgillo-product-spec-list">
              {product.specifications.map(
                (
                  specification,
                  index,
                ) => (
                  <div
                    key={`${specification.label}-${index}`}
                  >
                    <dt className="morgillo-product-spec-number" aria-hidden="true">
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </dt>

                    <dt>
                      {
                        specification.label
                      }
                    </dt>

                    <dd>
                      {
                        specification.value
                      }{" "}
                      {
                        specification.unit ??
                        ""
                      }
                    </dd>
                  </div>
                ),
              )}
            </dl>
          ) : (
            <div className="morgillo-product-spec-empty">
              <span>
                Información técnica
              </span>

              <p>
                Consulta las
                características del
                modelo disponible
                con nuestro equipo
                comercial.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          DOCUMENTS
      ========================================== */}

      <section className="morgillo-product-documents">
        <div className="morgillo-container">
          <div className="morgillo-product-documents__heading">
            <div>
              <span>
                02
              </span>

              <i />

              <p>
                Documentación
              </p>
            </div>

            <h2>
              Información para
              <span>
                {" "}
                tomar una mejor
                decisión.
              </span>
            </h2>
          </div>

          {product.documents
            .length ? (
            <div className="morgillo-product-documents__grid">
              {product.documents.map(
                (
                  document,
                  index,
                ) => (
                  <a
                    key={
                      document.id
                    }
                    href={
                      document.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="morgillo-product-document"
                  >
                    <div>
                      <span>
                        PDF
                      </span>

                      <small>
                        Documento{" "}
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </small>
                    </div>

                    <h3>
                      {
                        document.alt || `Documento ${index + 1}`
                      }
                    </h3>

                    <div className="morgillo-product-document__bottom">
                      <span>
                        Ver documento
                      </span>

                      <span>
                        ↗
                      </span>
                    </div>
                  </a>
                ),
              )}
            </div>
          ) : (
            <div className="morgillo-product-document-empty">
              <span>
                PDF
              </span>

              <div>
                <strong>
                  Ficha técnica
                  próximamente
                </strong>

                <p>
                  La documentación
                  estará disponible
                  cuando se confirme
                  el modelo.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          RELATED
      ========================================== */}

      {related.length > 0 && (
        <section className="morgillo-product-related">
          <div className="morgillo-container">
            <div className="morgillo-product-related__heading">
              <div>
                <span>
                  Más maquinaria
                </span>

                <h2>
                  También puedes
                  explorar.
                </h2>
              </div>

              <Link
                href={`/maquinaria?categoria=${product.category}`}
              >
                Ver categoría
                <span>
                  →
                </span>
              </Link>
            </div>

            <div className="product-grid morgillo-product-related__grid">
              {related.map(
                (item) => (
                  <ProductCard
                    key={
                      item.id
                    }
                    product={
                      item
                    }
                  />
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* =========================================
   CONTEXT VECTOR
========================================= */

function CategoryVector({
  category,
}: {
  category: Category;
}) {
  if (
    category === "agricola"
  ) {
    return (
      <svg
        viewBox="0 0 520 240"
        fill="none"
        aria-hidden="true"
        className="morgillo-sector-vector"
      >
        <path
          d="M0 194C108 132 220 132 332 194C397 229 457 228 520 194"
          className="vector-line vector-line--soft"
        />

        <path
          d="M0 213C111 154 220 154 332 213"
          className="vector-line vector-line--soft"
        />

        <path
          d="M260 188V89"
          className="vector-line"
        />

        <path
          d="M260 124C224 118 204 96 199 68C232 69 254 89 260 124Z"
          className="vector-fill"
        />

        <path
          d="M260 149C292 140 312 118 318 90C286 92 266 113 260 149Z"
          className="vector-fill"
        />

        <circle
          cx="260"
          cy="188"
          r="7"
          className="vector-dot"
        />
      </svg>
    );
  }

  if (
    category ===
    "construccion"
  ) {
    return (
      <svg
        viewBox="0 0 520 240"
        fill="none"
        aria-hidden="true"
        className="morgillo-sector-vector"
      >
        <path
          d="M88 185H432"
          className="vector-line vector-line--soft"
        />

        <path
          d="M176 177L212 116L306 79L358 95"
          className="vector-line"
        />

        <path
          d="M306 79L341 42"
          className="vector-line"
        />

        <path
          d="M341 42L402 88"
          className="vector-line"
        />

        <path
          d="M402 88L379 107"
          className="vector-line"
        />

        <rect
          x="156"
          y="154"
          width="121"
          height="31"
          rx="5"
          className="vector-fill"
        />

        <circle
          cx="185"
          cy="190"
          r="16"
          className="vector-line"
        />

        <circle
          cx="249"
          cy="190"
          r="16"
          className="vector-line"
        />

        <path
          d="M365 112L422 139L408 161L351 133Z"
          className="vector-fill"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 520 240"
      fill="none"
      aria-hidden="true"
      className="morgillo-sector-vector"
    >
      <circle
        cx="260"
        cy="120"
        r="65"
        className="vector-line"
      />

      <circle
        cx="260"
        cy="120"
        r="25"
        className="vector-line"
      />

      {Array.from({
        length: 8,
      }).map((_, index) => {
        const angle =
          (index * 45 *
            Math.PI) /
          180;

        const x =
          260 +
          Math.cos(angle) *
            91;

        const y =
          120 +
          Math.sin(angle) *
            91;

        return (
          <rect
            key={index}
            x={x - 10}
            y={y - 19}
            width="20"
            height="38"
            rx="3"
            transform={`rotate(${
              index * 45
            } ${x} ${y})`}
            className="vector-fill"
          />
        );
      })}

      <path
        d="M70 120H147M373 120H450"
        className="vector-line vector-line--soft"
      />
    </svg>
  );
}