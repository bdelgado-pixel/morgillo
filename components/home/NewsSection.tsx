import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpRight,
} from "lucide-react";

import type {
  Article,
} from "@/types/content";

import styles from "./NewsSection.module.css";


function formatDate(
  value: string,
) {
  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Actualidad";
  }


  return new Intl.DateTimeFormat(
    "es-PE",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(date);
}


export default function NewsSection({
  articles,
}: {
  articles: Article[];
}) {
  const visible =
    articles.slice(
      0,
      3,
    );


  const featured =
    visible[0];


  const secondary =
    visible.slice(
      1,
      3,
    );


  return (
    <section
      className={
        styles.section
      }
      aria-labelledby="news-title"
    >
      {/* =================================================
          BACKGROUND
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
                07
              </span>

              <span
                className={
                  styles.eyebrowLine
                }
              />

              <p>
                Novedades
              </p>
            </div>


            <h2
              id="news-title"
            >
              Actualidad que mantiene
              <span>
                {" "}
                tu operación informada.
              </span>
            </h2>
          </div>


          <div
            className={
              styles.headerSide
            }
          >
            <p>
              Noticias, lanzamientos,
              actividades y contenido
              relacionado con
              maquinaria y el trabajo
              de Morgillo.
            </p>


            <Link
              href="/novedades"
              className={
                styles.allLink
              }
            >
              Ver todas las novedades

              <ArrowUpRight
                size={19}
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>


        {/* =================================================
            CONTENT
        ================================================== */}

        {featured ? (
          <div
            className={
              styles.layout
            }
          >
            {/* =============================================
                FEATURED
            ============================================== */}

            <Link
              href={`/novedades/${featured.slug}`}
              className={
                styles.featured
              }
            >
              {/* =========================================
                  MEDIA
              ========================================== */}

              <div
                className={
                  styles.featuredMedia
                }
              >
                {featured.image ? (
                  <Image
                    src={
                      featured.image
                    }
                    alt={
                      featured.title
                    }
                    fill
                    sizes="
                      (max-width: 760px)
                        100vw,
                      (max-width: 1024px)
                        100vw,
                      65vw
                    "
                    className={
                      styles.featuredImage
                    }
                  />
                ) : (
                  <div
                    className={
                      styles.featuredFallback
                    }
                    aria-hidden="true"
                  >
                    <span>
                      N
                    </span>
                  </div>
                )}


                <div
                  className={
                    styles.featuredShade
                  }
                  aria-hidden="true"
                />

                <div
                  className={
                    styles.mediaGrid
                  }
                  aria-hidden="true"
                />


                <div
                  className={
                    styles.mediaTop
                  }
                >
                  <div>
                    <span />

                    <strong>
                      Destacado
                    </strong>
                  </div>


                  <span>
                    {formatDate(
                      featured.publishedAt,
                    )}
                  </span>
                </div>


                <div
                  className={
                    styles.mediaIndex
                  }
                  aria-hidden="true"
                >
                  01
                </div>
              </div>


              {/* =========================================
                  FEATURED BODY
              ========================================== */}

              <div
                className={
                  styles.featuredBody
                }
              >
                <div
                  className={
                    styles.articleMeta
                  }
                >
                  <span>
                    Actualidad Morgillo
                  </span>

                  <i />
                </div>


                <h3>
                  {
                    featured.title
                  }
                </h3>


                <p>
                  {
                    featured.excerpt
                  }
                </p>


                <div
                  className={
                    styles.featuredAction
                  }
                >
                  <span>
                    Leer novedad
                  </span>

                  <i />

                  <span
                    className={
                      styles.actionArrow
                    }
                  >
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.8}
                    />
                  </span>
                </div>
              </div>


              <div
                className={
                  styles.featuredAccent
                }
                aria-hidden="true"
              />
            </Link>


            {/* =============================================
                SECONDARY
            ============================================== */}

            {secondary.length >
              0 && (
              <div
                className={
                  styles.secondary
                }
              >
                {secondary.map(
                  (
                    article,
                    index,
                  ) => (
                    <Link
                      key={
                        article.slug
                      }
                      href={`/novedades/${article.slug}`}
                      className={
                        styles.card
                      }
                    >
                      <div
                        className={
                          styles.cardBackground
                        }
                        aria-hidden="true"
                      />


                      <div
                        className={
                          styles.cardTop
                        }
                      >
                        <div>
                          <span>
                            {String(
                              index + 2,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <i />
                        </div>


                        <span>
                          {formatDate(
                            article.publishedAt,
                          )}
                        </span>
                      </div>


                      {article.image && (
                        <div
                          className={
                            styles.cardMedia
                          }
                        >
                          <Image
                            src={
                              article.image
                            }
                            alt={
                              article.title
                            }
                            fill
                            sizes="
                              (max-width: 760px)
                                100vw,
                              (max-width: 1024px)
                                50vw,
                              35vw
                            "
                            className={
                              styles.cardImage
                            }
                          />
                        </div>
                      )}


                      <div
                        className={
                          styles.cardBody
                        }
                      >
                        <span
                          className={
                            styles.cardLabel
                          }
                        >
                          Novedades
                        </span>


                        <h3>
                          {
                            article.title
                          }
                        </h3>


                        <p>
                          {
                            article.excerpt
                          }
                        </p>
                      </div>


                      <div
                        className={
                          styles.cardFooter
                        }
                      >
                        <span>
                          Leer artículo
                        </span>

                        <span>
                          <ArrowUpRight
                            size={18}
                            strokeWidth={1.8}
                          />
                        </span>
                      </div>


                      <div
                        className={
                          styles.cardLine
                        }
                        aria-hidden="true"
                      />
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        ) : (
          /* =================================================
              EMPTY STATE
          ================================================== */

          <div
            className={
              styles.empty
            }
          >
            <div
              className={
                styles.emptyMark
              }
              aria-hidden="true"
            >
              <span>
                N
              </span>
            </div>


            <div
              className={
                styles.emptyContent
              }
            >
              <span>
                Actualidad Morgillo
              </span>

              <h3>
                Próximamente nuevas
                publicaciones.
              </h3>

              <p>
                Aquí compartiremos
                noticias, actividades
                y novedades
                relacionadas con
                nuestros equipos y
                servicios.
              </p>
            </div>
          </div>
        )}


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
              Noticias · equipos ·
              eventos · actividades
            </p>
          </div>


          <Link
            href="/novedades"
            className={
              styles.bottomLink
            }
          >
            Explorar novedades

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