"use client";

import {

  FormEvent,
  useMemo,

  useState,

} from "react";

import {

  usePathname,

  useRouter,

  useSearchParams,

} from "next/navigation";

import {

  Search,

  SlidersHorizontal,

  X,

} from "lucide-react";

import type {

  Brand,

  CategoryItem,

  Product,

} from "@/types/content";

import ProductCard from "./ProductCard";

import styles from "./Catalog.module.css";

function normalize(

  value: string,

) {

  return value

    .normalize("NFD")

    .replace(

      /[\u0300-\u036f]/g,

      "",

    )

    .toLowerCase()

    .trim();

}

export default function Catalog({

  products,

  brands,

  categories,

}: {

  products: Product[];

  brands: Brand[];

  categories: CategoryItem[];

}) {

  const router =

    useRouter();

  const pathname =

    usePathname();

  const searchParams =

    useSearchParams();

  const category =

    searchParams.get(

      "categoria",

    ) ?? "";

  const brand =

    searchParams.get(

      "marca",

    ) ?? "";

  const query =

    searchParams.get(

      "q",

    ) ?? "";

  const [

    searchDraft,

    setSearchDraft,

  ] = useState(() => ({

    source: query,

    value: query,

  }));

  const search =

    searchDraft.source === query

      ? searchDraft.value

      : query;

  function setSearch(

    value: string,

  ) {

    setSearchDraft({

      source: query,

      value,

    });

  }

  /* =========================================================

     HELPERS

  ========================================================= */

  function replaceParams(

    changes: Record<

      string,

      string

    >,

  ) {

    const next =

      new URLSearchParams(

        searchParams.toString(),

      );

    Object.entries(

      changes,

    ).forEach(

      ([

        key,

        value,

      ]) => {

        const clean =

          value.trim();

        if (clean) {

          next.set(

            key,

            clean,

          );

        } else {

          next.delete(

            key,

          );

        }

      },

    );

    const value =

      next.toString();

    router.replace(

      value

        ? `${pathname}?${value}`

        : pathname,

      {

        scroll: false,

      },

    );

  }

  function submitSearch(

    event: FormEvent<HTMLFormElement>,

  ) {

    event.preventDefault();

    replaceParams({

      q: search,

    });

  }

  function clearFilters() {

    setSearch("");

    router.replace(

      pathname,

      {

        scroll: false,

      },

    );

  }

  /* =========================================================

     FILTER

  ========================================================= */

  const results =

    useMemo(() => {

      const normalizedQuery =

        normalize(query);

      return products.filter(

        (product) => {

          const matchesCategory =

            !category ||

            product.category ===

              category;

          const matchesBrand =

            !brand ||

            normalize(

              product.brandId,

            ) ===

              normalize(

                brand,

              );

          const brandName =

            brands.find(

              (item) =>

                normalize(

                  item.id,

                ) ===

                normalize(

                  product.brandId,

                ),

            )?.name ?? "";

          const haystack =

            normalize(

              [

                product.name,

                product.model,

                product.brandId,

                brandName,

                product.description,

              ].join(" "),

            );

          const matchesQuery =

            !normalizedQuery ||

            haystack.includes(

              normalizedQuery,

            );

          return (

            matchesCategory &&

            matchesBrand &&

            matchesQuery

          );

        },

      );

    }, [

      products,

      brands,

      category,

      brand,

      query,

    ]);

  const hasFilters =

    Boolean(

      category ||

        brand ||

        query,

    );

  const activeCategory =

    categories.find(

      (item) =>

        item.id ===

        category,

    );

  const activeBrand =

    brands.find(

      (item) =>

        normalize(

          item.id,

        ) ===

        normalize(

          brand,

        ),

    );

  return (

    <section

      className={

        styles.section

      }

      aria-label="Catálogo de maquinaria"

    >

      <div className="morgillo-container">

        {/* =================================================

            SEARCH

        ================================================== */}

        <form

          className={

            styles.searchBar

          }

          onSubmit={

            submitSearch

          }

        >

          <label

            htmlFor="catalog-search"

            className={

              styles.searchLabel

            }

          >

            Buscar equipo

          </label>

          <div

            className={

              styles.searchField

            }

          >

            <Search

              size={21}

              strokeWidth={1.8}

              aria-hidden="true"

            />

            <input

              id="catalog-search"

              name="q"

              type="search"

              value={

                search

              }

              onChange={(

                event,

              ) =>

                setSearch(

                  event.target

                    .value,

                )

              }

              placeholder="Ej. tractor, excavadora, M108S…"

              autoComplete="off"

            />

            {search && (

              <button

                type="button"

                className={

                  styles.clearSearch

                }

                aria-label="Limpiar búsqueda"

                onClick={() => {

                  setSearch("");

                  if (query) {

                    replaceParams({

                      q: "",

                    });

                  }

                }}

              >

                <X

                  size={18}

                  strokeWidth={1.8}

                />

              </button>

            )}

          </div>

          <button

            type="submit"

            className={

              styles.searchButton

            }

          >

            Buscar

          </button>

        </form>

        {/* =================================================

            FILTER HEADER

        ================================================== */}

        <div

          className={

            styles.filterHeader

          }

        >

          <div>

            <SlidersHorizontal

              size={18}

              strokeWidth={1.8}

            />

            <span>

              Filtrar catálogo

            </span>

          </div>

          {hasFilters && (

            <button

              type="button"

              className={

                styles.clearAll

              }

              onClick={

                clearFilters

              }

            >

              <X

                size={16}

                strokeWidth={1.8}

              />

              Limpiar filtros

            </button>

          )}

        </div>

        {/* =================================================

            CATEGORY FILTER

        ================================================== */}

        <div

          className={

            styles.filterGroup

          }

        >

          <div

            className={

              styles.filterTitle

            }

          >

            <span>

              01

            </span>

            <strong>

              Categoría

            </strong>

          </div>

          <div

            className={

              styles.options

            }

          >

            <button

              type="button"

              aria-pressed={

                !category

              }

              className={

                !category

                  ? styles.activeOption

                  : styles.option

              }

              onClick={() =>

                replaceParams({

                  categoria:

                    "",

                })

              }

            >

              Todas

            </button>

            {categories.map(

              (item) => {

                const active =

                  category ===

                  item.id;

                return (

                  <button

                    key={

                      item.id

                    }

                    type="button"

                    aria-pressed={

                      active

                    }

                    className={

                      active

                        ? styles.activeOption

                        : styles.option

                    }

                    onClick={() =>

                      replaceParams({

                        categoria:

                          item.id,

                      })

                    }

                  >

                    {

                      item.name

                    }

                  </button>

                );

              },

            )}

          </div>

        </div>

        {/* =================================================

            BRAND FILTER

        ================================================== */}

        {brands.length >

          0 && (

          <div

            className={

              styles.filterGroup

            }

          >

            <div

              className={

                styles.filterTitle

              }

            >

              <span>

                02

              </span>

              <strong>

                Marca

              </strong>

            </div>

            <div

              className={

                styles.options

              }

            >

              <button

                type="button"

                aria-pressed={

                  !brand

                }

                className={

                  !brand

                    ? styles.activeOption

                    : styles.option

                }

                onClick={() =>

                  replaceParams({

                    marca: "",

                  })

                }

              >

                Todas

              </button>

              {brands.map(

                (item) => {

                  const active =

                    normalize(

                      brand,

                    ) ===

                    normalize(

                      item.id,

                    );

                  return (

                    <button

                      key={

                        item.id

                      }

                      type="button"

                      aria-pressed={

                        active

                      }

                      className={

                        active

                          ? styles.activeOption

                          : styles.option

                      }

                      onClick={() =>

                        replaceParams({

                          marca:

                            item.id,

                        })

                      }

                    >

                      {

                        item.name

                      }

                    </button>

                  );

                },

              )}

            </div>

          </div>

        )}

        {/* =================================================

            RESULTS BAR

        ================================================== */}

        <div

          className={

            styles.resultsBar

          }

        >

          <div

            className={

              styles.resultCount

            }

          >

            <strong

              role="status"

              aria-live="polite"

            >

              {

                results.length

              }

            </strong>

            <span>

              {results.length ===

              1

                ? "equipo encontrado"

                : "equipos encontrados"}

            </span>

          </div>

          <div

            className={

              styles.activeFilters

            }

          >

            {activeCategory && (

              <button

                type="button"

                onClick={() =>

                  replaceParams({

                    categoria:

                      "",

                  })

                }

              >

                {

                  activeCategory.name

                }

                <X

                  size={14}

                />

              </button>

            )}

            {activeBrand && (

              <button

                type="button"

                onClick={() =>

                  replaceParams({

                    marca: "",

                  })

                }

              >

                {

                  activeBrand.name

                }

                <X

                  size={14}

                />

              </button>

            )}

            {query && (

              <button

                type="button"

                onClick={() => {

                  setSearch("");

                  replaceParams({

                    q: "",

                  });

                }}

              >

                “{query}”

                <X

                  size={14}

                />

              </button>

            )}

          </div>

        </div>

        {/* =================================================

            MOCK NOTICE

        ================================================== */}

        {products.some(

          (product) =>

            product.mock,

        ) && (

          <div

            className={

              styles.notice

            }

          >

            <span />

            <p>

              Algunos equipos utilizan

              información de

              demostración. La

              disponibilidad y ficha

              final pueden actualizarse

              desde el CMS.

            </p>

          </div>

        )}

        {/* =================================================

            GRID

        ================================================== */}

        {results.length >

        0 ? (

          <div

            className={

              styles.grid

            }

          >

            {results.map(

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

            <div

              aria-hidden="true"

              className={

                styles.emptyNumber

              }

            >

              00

            </div>

            <div

              className={

                styles.emptyContent

              }

            >

              <span>

                Sin resultados

              </span>

              <h2>

                No encontramos equipos

                con esos filtros.

              </h2>

              <p>

                Prueba con otra

                categoría, otra marca o

                elimina la búsqueda

                actual.

              </p>

              <button

                type="button"

                onClick={

                  clearFilters

                }

              >

                Ver todos los equipos

              </button>

            </div>

          </div>

        )}

      </div>

    </section>

  );

}
