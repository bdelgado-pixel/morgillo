import type {

  Metadata,

} from "next";



import Image from "next/image";



import Link from "next/link";



import {

  ArrowUpRight,

  CalendarDays,

} from "lucide-react";



import {

  getArticles,

} from "@/lib/content";



import styles from "./page.module.css";





export const metadata: Metadata = {

  title: "Novedades | Morgillo",



  description:

    "Conoce las novedades y publicaciones de Morgillo.",



  alternates: {

    canonical:

      "/novedades",

  },

};





function dateValue(

  value: string,

) {

  const time =

    new Date(

      value,

    ).getTime();





  return Number.isFinite(

    time,

  )

    ? time

    : 0;

}





function formatDate(

  value: string,

) {

  const date =

    new Date(

      value,

    );





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

      month: "long",

      year: "numeric",

      timeZone:

        "America/Lima",

    },

  ).format(

    date,

  );

}





export default async function NewsPage() {

  const articles =

    (

      await getArticles()

    )

      .filter(

        (article) =>

          article.published,

      )

      .sort(

        (

          a,

          b,

        ) =>

          dateValue(

            b.publishedAt,

          ) -

          dateValue(

            a.publishedAt,

          ),

      );





  const featured =

    articles[0];





  const remaining =

    articles.slice(

      1,

    );





  return (

    <main

      className={

        styles.page

      }

    >

      {/* =================================================

          HERO

      ================================================== */}



      <section

        className={

          styles.hero

        }

        aria-labelledby="news-title"

      >

        <div

          className={

            styles.heroGrid

          }

          aria-hidden="true"

        />



        <div

          className={

            styles.heroCircle

          }

          aria-hidden="true"

        />





        <div className="morgillo-container">

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

                Actualidad Morgillo

              </p>

            </div>





            <span

              className={

                styles.heroCode

              }

            >

              MRG / NEWS

            </span>

          </div>





          <div

            className={

              styles.heroContent

            }

          >

            <h1

              id="news-title"

            >

              Novedades para seguir

              <span>

                {" "}

                nuestra actividad.

              </span>

            </h1>





            <div

              className={

                styles.heroSide

              }

            >

              <p>

                Noticias, actividades y

                publicaciones

                compartidas por

                Morgillo.

              </p>





              <div

                className={

                  styles.heroStatus

                }

              >

                <span />



                <strong>

                  {

                    articles.length

                  }{" "}

                  {articles.length ===

                  1

                    ? "publicación"

                    : "publicaciones"}

                </strong>

              </div>

            </div>

          </div>





          <div

            className={

              styles.heroBottom

            }

          >

            <span />



            <p>

              Información publicada

              desde el CMS

            </p>

          </div>

        </div>

      </section>





      {/* =================================================

          CONTENT

      ================================================== */}



      <section

        className={

          styles.content

        }

      >

        <div className="morgillo-container">

          {featured ? (

            <>

              {/* =========================================

                  FEATURED

              ========================================== */}



              <article

                className={

                  styles.featured

                }

              >

                <Link

                  href={`/novedades/${featured.slug}`}

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

                      width={1600}

                      height={900}

                      sizes="(max-width: 900px) 100vw, 58vw"

                      className={

                        styles.featuredImage

                      }

                      priority

                    />

                  ) : (

                    <div

                      className={

                        styles.imageFallback

                      }

                      aria-hidden="true"

                    >

                      MRG

                    </div>

                  )}





                  <div

                    className={

                      styles.mediaGrid

                    }

                    aria-hidden="true"

                  />





                  <span

                    className={

                      styles.featuredBadge

                    }

                  >

                    Destacado

                  </span>

                </Link>





                <div

                  className={

                    styles.featuredContent

                  }

                >

                  <div

                    className={

                      styles.articleMeta

                    }

                  >

                    <CalendarDays

                      size={17}

                      strokeWidth={1.8}

                    />



                    <time

                      dateTime={

                        featured.publishedAt

                      }

                    >

                      {formatDate(

                        featured.publishedAt,

                      )}

                    </time>

                  </div>





                  <h2>

                    <Link

                      href={`/novedades/${featured.slug}`}

                    >

                      {

                        featured.title

                      }

                    </Link>

                  </h2>





                  <p>

                    {

                      featured.excerpt

                    }

                  </p>





                  <Link

                    href={`/novedades/${featured.slug}`}

                    className={

                      styles.readMore

                    }

                  >

                    Leer publicación



                    <ArrowUpRight

                      size={19}

                      strokeWidth={1.8}

                    />

                  </Link>

                </div>

              </article>





              {/* =========================================

                  ALL ARTICLES

              ========================================== */}



              {remaining.length >

                0 && (

                <div

                  className={

                    styles.archive

                  }

                >

                  <div

                    className={

                      styles.sectionHeader

                    }

                  >

                    <div>

                      <span>

                        02

                      </span>



                      <h2>

                        Más novedades.

                      </h2>

                    </div>





                    <p>

                      Explora las

                      publicaciones más

                      recientes de

                      Morgillo.

                    </p>

                  </div>





                  <div

                    className={

                      styles.articleGrid

                    }

                  >

                    {remaining.map(

                      (

                        article,

                        index,

                      ) => (

                        <article

                          key={

                            article.slug

                          }

                          className={

                            styles.card

                          }

                        >

                          <Link

                            href={`/novedades/${article.slug}`}

                            className={

                              styles.cardMedia

                            }

                          >

                            {article.image ? (

                              <Image

                                src={

                                  article.image

                                }

                                alt={

                                  article.title

                                }

                                width={1200}

                                height={760}

                                sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"

                              />

                            ) : (

                              <div

                                className={

                                  styles.cardFallback

                                }

                                aria-hidden="true"

                              >

                                MRG

                              </div>

                            )}





                            <span>

                              {String(

                                index +

                                  2,

                              ).padStart(

                                2,

                                "0",

                              )}

                            </span>

                          </Link>





                          <div

                            className={

                              styles.cardBody

                            }

                          >

                            <time

                              dateTime={

                                article.publishedAt

                              }

                            >

                              {formatDate(

                                article.publishedAt,

                              )}

                            </time>





                            <h3>

                              <Link

                                href={`/novedades/${article.slug}`}

                              >

                                {

                                  article.title

                                }

                              </Link>

                            </h3>





                            <p>

                              {

                                article.excerpt

                              }

                            </p>





                            <Link

                              href={`/novedades/${article.slug}`}

                              className={

                                styles.cardLink

                              }

                            >

                              Ver novedad



                              <ArrowUpRight

                                size={17}

                                strokeWidth={1.8}

                              />

                            </Link>

                          </div>

                        </article>

                      ),

                    )}

                  </div>

                </div>

              )}

            </>

          ) : (

            /* ===========================================

               EMPTY

            ============================================ */



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

                  Novedades

                </small>



                <h2>

                  Próximamente

                  compartiremos nuevas

                  publicaciones.

                </h2>



                <p>

                  Esta sección se

                  actualizará con el

                  contenido publicado

                  desde el CMS.

                </p>





                <Link

                  href="/contacto"

                >

                  Contactar Morgillo



                  <ArrowUpRight

                    size={18}

                    strokeWidth={1.8}

                  />

                </Link>

              </div>

            </div>

          )}

        </div>

      </section>

    </main>

  );

}