import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
} from "lucide-react";

import {
  categories,
} from "@/data/site";

import styles from "./Categories.module.css";


function getSectorClass(
  id: string,
) {
  if (id === "agricola") {
    return styles.agriculture;
  }

  if (id === "construccion") {
    return styles.construction;
  }

  return styles.implements;
}


export default function Categories() {
  return (
    <section
      className={
        styles.section
      }
      aria-labelledby="categories-title"
    >
      {/* =================================================
          BACKGROUND DECORATION
      ================================================== */}

      <div
        className={
          styles.background
        }
        aria-hidden="true"
      >
        <span />
        <span />
      </div>


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
                02
              </span>

              <span
                className={
                  styles.eyebrowLine
                }
              />

              <p>
                Líneas de maquinaria
              </p>
            </div>


            <h2
              id="categories-title"
            >
              Encuentra el equipo
              <span>
                {" "}
                para tu trabajo.
              </span>
            </h2>
          </div>


          <div
            className={
              styles.intro
            }
          >
            <p>
              Explora nuestras líneas
              para agricultura,
              construcción e
              implementos y encuentra
              la maquinaria adecuada
              para cada operación.
            </p>

            <div
              className={
                styles.introMeta
              }
              aria-hidden="true"
            >
              <span />

              <strong>
                03 líneas principales
              </strong>
            </div>
          </div>
        </div>


        {/* =================================================
            CATEGORIES
        ================================================== */}

        <div
          className={
            styles.grid
          }
        >
          {categories.map(
            (
              category,
              index,
            ) => (
              <Link
                key={
                  category.id
                }
                href={`/maquinaria?categoria=${category.id}`}
                className={`${styles.category} ${getSectorClass(
                  category.id,
                )}`}
              >
                {/* =========================================
                    IMAGE
                ========================================== */}

                <div
                  className={
                    styles.media
                  }
                >
                  <Image
                    src={
                      category.image
                    }
                    alt={
                      category.name
                    }
                    fill
                    sizes="
                      (max-width: 700px)
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
                      styles.overlay
                    }
                  />

                  <div
                    className={
                      styles.gridPattern
                    }
                    aria-hidden="true"
                  />

                  <div
                    className={
                      styles.sectorLine
                    }
                    aria-hidden="true"
                  />
                </div>


                {/* =========================================
                    TOP
                ========================================== */}

                <div
                  className={
                    styles.top
                  }
                >
                  <div
                    className={
                      styles.index
                    }
                  >
                    <span>
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <i />
                  </div>


                  <div
                    className={
                      styles.arrow
                    }
                    aria-hidden="true"
                  >
                    <ArrowUpRight
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>


                {/* =========================================
                    CONTENT
                ========================================== */}

                <div
                  className={
                    styles.content
                  }
                >
                  <div
                    className={
                      styles.brand
                    }
                  >
                    <span />

                    <strong>
                      {
                        category.brand
                      }
                    </strong>
                  </div>


                  <h3>
                    {
                      category.name
                    }
                  </h3>


                  <p>
                    {
                      category.description
                    }
                  </p>


                  <div
                    className={
                      styles.footer
                    }
                  >
                    <strong>
                      Explorar línea
                    </strong>

                    <span>
                      Ver maquinaria
                    </span>
                  </div>
                </div>
              </Link>
            ),
          )}
        </div>


        {/* =================================================
            BOTTOM
        ================================================== */}

        <div
          className={
            styles.bottom
          }
        >
          <div>
            <span />

            <p>
              Agricultura ·
              Construcción ·
              Implementos
            </p>
          </div>


          <Link
            href="/maquinaria"
            className={
              styles.allLink
            }
          >
            Ver toda la maquinaria

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