"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import type {
  Brand,
  CategoryItem,
  Product,
} from "@/types/content";

import ProductCard from "./ProductCard";

/* =============================================
   ICONS
============================================= */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

/* =============================================
   COMPONENT
============================================= */

export default function Catalog({
  products,
  brands,
  categories,
}: {
  products: Product[];
  brands: Brand[];
  categories: CategoryItem[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const category =
    params.get("categoria") ?? "";

  const brand =
    params.get("marca") ?? "";

  const q =
    params.get("q") ?? "";

  const [search, setSearch] =
    useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  function normalize(value: string) {
    return value
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .toLowerCase();
  }

  const normalizedQuery =
    normalize(q.trim());

  const results =
    products.filter((product) => {
      const matchesCategory =
        !category ||
        product.category ===
          category;

      const matchesBrand =
        !brand ||
        product.brandId === brand;

      const searchable =
        normalize(
          `${product.name} ${product.model} ${product.brandId}`,
        );

      const matchesSearch =
        !normalizedQuery ||
        searchable.includes(
          normalizedQuery,
        );

      return (
        matchesCategory &&
        matchesBrand &&
        matchesSearch
      );
    });

  const selectedCategory =
    categories.find(
      (item) =>
        item.id === category,
    );

  const selectedBrand =
    brands.find(
      (item) =>
        item.id === brand,
    );

  const hasFilters =
    Boolean(
      category ||
        brand ||
        q,
    );

  /* =============================================
     URL FILTERS
  ============================================== */

  function update(
    key: string,
    value: string,
  ) {
    const next =
      new URLSearchParams(
        params.toString(),
      );

    if (value) {
      next.set(
        key,
        value,
      );
    } else {
      next.delete(key);
    }

    router.replace(
      `${path}${
        next.size
          ? `?${next.toString()}`
          : ""
      }`,
      {
        scroll: false,
      },
    );
  }

  function handleSearch(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    update(
      "q",
      search.trim(),
    );
  }

  function clearFilters() {
    setSearch("");

    router.replace(
      path,
      {
        scroll: false,
      },
    );
  }

  /* =============================================
     UI
  ============================================== */

  return (
    <section
      className="morgillo-catalog"
      aria-labelledby="catalog-results-title"
    >
      <div className="morgillo-container">
        {/* =========================================
            FILTER HEADER
        ========================================== */}

        <div className="morgillo-catalog__heading">
          <div>
            <div className="morgillo-catalog__heading-label">
              <FilterIcon />

              <span>
                Encuentra tu equipo
              </span>
            </div>

            <h2>
              Filtra la maquinaria
              <span> según tu trabajo.</span>
            </h2>
          </div>

          <p>
            Busca por nombre o modelo y combina
            categoría y marca para encontrar
            rápidamente el equipo que necesitas.
          </p>
        </div>

        {/* =========================================
            FILTER PANEL
        ========================================== */}

        <div className="morgillo-catalog-filter">
          {/* CATEGORY */}

          <div className="morgillo-catalog-filter__categories">
            <div className="morgillo-catalog-filter__label">
              <span>
                01
              </span>

              <p>
                Categoría
              </p>
            </div>

            <div className="morgillo-catalog-filter__category-list">
              <button
                type="button"
                className={
                  !category
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  update(
                    "categoria",
                    "",
                  )
                }
              >
                Todos
              </button>

              {categories.map(
                (item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      category ===
                      item.id
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      update(
                        "categoria",
                        item.id,
                      )
                    }
                  >
                    {item.name}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* SEARCH / BRAND */}

          <form
            className="morgillo-catalog-filter__form"
            onSubmit={
              handleSearch
            }
          >
            <div className="morgillo-catalog-search">
              <label htmlFor="catalog-search">
                Buscar equipo
              </label>

              <div className="morgillo-catalog-search__control">
                <SearchIcon />

                <input
                  id="catalog-search"
                  type="search"
                  name="q"
                  placeholder="Ej. tractor, excavadora, modelo..."
                  value={search}
                  onChange={(
                    event,
                  ) =>
                    setSearch(
                      event.target
                        .value,
                    )
                  }
                />

                {search && (
                  <button
                    type="button"
                    aria-label="Limpiar búsqueda"
                    onClick={() => {
                      setSearch("");

                      if (q) {
                        update(
                          "q",
                          "",
                        );
                      }
                    }}
                    className="morgillo-catalog-search__clear"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            </div>

            <div className="morgillo-catalog-brand">
              <label htmlFor="catalog-brand">
                Marca
              </label>

              <div className="morgillo-catalog-brand__control">
                <select
                  id="catalog-brand"
                  name="marca"
                  value={brand}
                  onChange={(
                    event,
                  ) =>
                    update(
                      "marca",
                      event.target
                        .value,
                    )
                  }
                >
                  <option value="">
                    Todas las marcas
                  </option>

                  {brands.map(
                    (item) => (
                      <option
                        key={
                          item.id
                        }
                        value={
                          item.id
                        }
                      >
                        {
                          item.name
                        }
                      </option>
                    ),
                  )}
                </select>

                <span
                  aria-hidden="true"
                >
                  ↓
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="morgillo-catalog-filter__submit"
            >
              <span>
                Buscar
              </span>

              <span aria-hidden="true">
                →
              </span>
            </button>
          </form>
        </div>

        {/* =========================================
            ACTIVE FILTERS / COUNT
        ========================================== */}

        <div className="morgillo-catalog-results">
          <div>
            <span
              className="morgillo-catalog-results__marker"
              aria-hidden="true"
            />

            <p
              id="catalog-results-title"
              role="status"
              aria-live="polite"
            >
              <strong>
                {results.length}
              </strong>{" "}
              {results.length === 1
                ? "equipo encontrado"
                : "equipos encontrados"}
            </p>
          </div>

          <div className="morgillo-catalog-results__actions">
            {selectedCategory && (
              <button
                type="button"
                onClick={() =>
                  update(
                    "categoria",
                    "",
                  )
                }
                className="morgillo-catalog-results__chip"
              >
                <span>
                  {
                    selectedCategory.name
                  }
                </span>

                <CloseIcon />
              </button>
            )}

            {selectedBrand && (
              <button
                type="button"
                onClick={() =>
                  update(
                    "marca",
                    "",
                  )
                }
                className="morgillo-catalog-results__chip"
              >
                <span>
                  {
                    selectedBrand.name
                  }
                </span>

                <CloseIcon />
              </button>
            )}

            {q && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");

                  update(
                    "q",
                    "",
                  );
                }}
                className="morgillo-catalog-results__chip"
              >
                <span>
                  “{q}”
                </span>

                <CloseIcon />
              </button>
            )}

            {hasFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="morgillo-catalog-results__clear"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* =========================================
            DEMO NOTICE
        ========================================== */}

        {products.some(
          (product) =>
            product.mock,
        ) && (
          <div className="morgillo-catalog-notice">
            <span>
              Información
            </span>

            <p>
              Algunos equipos forman parte del
              catálogo de demostración. Modelos,
              especificaciones y disponibilidad
              pueden estar pendientes de
              confirmación.
            </p>
          </div>
        )}

        {/* =========================================
            PRODUCT GRID
        ========================================== */}

        {results.length > 0 && (
          <div className="morgillo-catalog__grid product-grid">
            {results.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ),
            )}
          </div>
        )}

        {/* =========================================
            EMPTY
        ========================================== */}

        {!results.length && (
          <div className="morgillo-catalog-empty">
            <div className="morgillo-catalog-empty__graphic">
              <span>
                00
              </span>

              <i
                aria-hidden="true"
              />
            </div>

            <div className="morgillo-catalog-empty__content">
              <span>
                Sin resultados
              </span>

              <h2>
                No encontramos equipos con esos
                filtros.
              </h2>

              <p>
                Prueba con otra categoría, otra
                marca o elimina la búsqueda para
                volver a ver todo el catálogo.
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
              >
                <span>
                  Ver todos los equipos
                </span>

                <span aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            BOTTOM
        ========================================== */}

        <div className="morgillo-catalog__bottom">
          <div>
            <span
              aria-hidden="true"
            />

            <strong>
              MORGILLO
            </strong>

            <p>
              Maquinaria para operaciones reales
            </p>
          </div>

          <span>
            Agricultura · Construcción · Trabajo pesado
          </span>
        </div>
      </div>
    </section>
  );
}