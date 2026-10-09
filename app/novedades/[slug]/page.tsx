import type {

  Metadata,

} from "next";



import Image from "next/image";



import Link from "next/link";



import {

  notFound,

} from "next/navigation";



import {

  ArrowLeft,

  ArrowUpRight,

  CalendarDays,

} from "lucide-react";



import {

  getArticles,

} from "@/lib/content";



import styles from "./page.module.css";





type Props = {

  params: Promise<{

    slug: string;

  }>;

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





/* =========================================================

   METADATA

\========================================================= */



export async function generateMetadata({

  params,

}: Props): Promise<Metadata> {

  const {

    slug,

  } =

    await params;





  const article =

    (

      await getArticles()

    ).find(

      (item) =>

        item.slug ===

          slug &&

        item.published,

    );





  if (!article) {

    return {

      title:

        "Novedades | Morgillo",

    };

  }





  return {

    title:

      `${article.title} | Morgillo`,



    description:

      article.excerpt,



    alternates: {

      canonical:

        `/novedades/${article.slug}`,

    },

  };

}





/* =========================================================

   PAGE

\========================================================= */



export default async function ArticlePage({

  params,

}: Props) {

  const {

    slug,

  } =

    await params;





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





  const article =

    articles.find(

      (item) =>

        item.slug ===

        slug,

    );





  if (!article) {

    notFound();

  }





  const related =

    articles

      .filter(

        (item) =>

          item.slug !==

          article.slug,

      )

      .slice(

        0,

        3,

      );





  return (

    <main

      className={

        styles.page

      }

    >

      {/* =================================================

          TOP

      ================================================== */}



      <section

        className={

          styles.top

        }

      >

        <div className="morgillo-container">

          <div

            className={

              styles.topInner

            }

          >

            <nav

              aria-label="Migas de pan"

              className={

                styles.breadcrumb

              }

            >

              <Link href="/">

                Inicio

              </Link>



              <span>

                /

              </span>



              <Link href="/novedades">

                Novedades

              </Link>



              <span>

                /

              </span>



              <span

                aria-current="page"

              >

                {

                  article.title

                }

              </span>

            </nav>





            <Link

              href="/novedades"

              className={

                styles.back

              }

            >

              <ArrowLeft

                size={17}

                strokeWidth={1.8}

              />



              Todas las novedades

            </Link>

          </div>

        </div>

      </section>





      {/* =================================================

          ARTICLE HEADER

      ================================================== */}



      <article>

        <header

          className={

            styles.hero

          }

        >

          <div

            className={

              styles.heroGrid

            }

            aria-hidden="true"

          />





          <div className="morgillo-container">

            <div

              className={

                styles.heroLayout

              }

            >

              <div

                className={

                  styles.heroMain

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

                    Novedades

                  </p>

                </div>





                <h1>

                  {

                    article.title

                  }

                </h1>

              </div>





              <div

                className={

                  styles.heroSide

                }

              >

                <div

                  className={

                    styles.date

                  }

                >

                  <CalendarDays

                    size={18}

                    strokeWidth={1.8}

                  />



                  <time

                    dateTime={

                      article.publishedAt

                    }

                  >

                    {formatDate(

                      article.publishedAt,

                    )}

                  </time>

                </div>





                <p>

                  {

                    article.excerpt

                  }

                </p>

              </div>

            </div>

          </div>

        </header>





        {/* =================================================

            IMAGE

        ================================================== */}



        {article.image && (

          <section

            className={

              styles.mediaSection

            }

          >

            <div className="morgillo-container">

              <div

                className={

                  styles.media

                }

              >

                <Image

                  src={

                    article.image

                  }

                  alt={

                    article.title

                  }

                  width={1800}

                  height={1050}

                  sizes="(max-width: 900px) 100vw, 1200px"

                  priority

                />





                <div

                  className={

                    styles.mediaGrid

                  }

                  aria-hidden="true"

                />





                <div

                  className={

                    styles.mediaBottom

                  }

                >

                  <span>

                    Morgillo

                  </span>



                  <span>

                    Actualidad

                  </span>

                </div>

              </div>

            </div>

          </section>

        )}





        {/* =================================================

            BODY

        ================================================== */}



        <section

          className={

            styles.bodySection

          }

        >

          <div className="morgillo-container">

            <div

              className={

                styles.bodyGrid

              }

            >

              <aside

                className={

                  styles.side

                }

              >

                <span>

                  02

                </span>



                <div>

                  <strong>

                    Publicación

                  </strong>



                  <p>

                    {

                      formatDate(

                        article.publishedAt,

                      )

                    }

                  </p>

                </div>

              </aside>





              <div

                className={

                  styles.body

                }

              >

                <p

                  className={

                    styles.lead

                  }

                >

                  {

                    article.excerpt

                  }

                </p>





                <div

                  className={

                    styles.articleText

                  }

                >

                  {

                    article.body

                  }

                </div>





                <div

                  className={

                    styles.articleEnd

                  }

                  aria-hidden="true"

                >

                  <span />

                  <span />

                </div>

              </div>

            </div>

          </div>

        </section>

      </article>





      {/* =================================================

          RELATED

      ================================================== */}



      {related.length >

        0 && (

        <section

          className={

            styles.related

          }

          aria-labelledby="related-news-title"

        >

          <div className="morgillo-container">

            <div

              className={

                styles.relatedHeader

              }

            >

              <div>

                <span>

                  03

                </span>



                <h2

                  id="related-news-title"

                >

                  Más novedades.

                </h2>

              </div>





              <Link

                href="/novedades"

              >

                Ver todas



                <ArrowUpRight

                  size={18}

                  strokeWidth={1.8}

                />

              </Link>

            </div>





            <div

              className={

                styles.relatedGrid

              }

            >

              {related.map(

                (

                  item,

                  index,

                ) => (

                  <article

                    key={

                      item.slug

                    }

                    className={

                      styles.relatedCard

                    }

                  >

                    <Link

                      href={`/novedades/${item.slug}`}

                      className={

                        styles.relatedMedia

                      }

                    >

                      {item.image ? (

                        <Image

                          src={

                            item.image

                          }

                          alt={

                            item.title

                          }

                          width={1200}

                          height={760}

                          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"

                        />

                      ) : (

                        <div

                          className={

                            styles.relatedFallback

                          }

                          aria-hidden="true"

                        >

                          MRG

                        </div>

                      )}





                      <span>

                        {String(

                          index + 1,

                        ).padStart(

                          2,

                          "0",

                        )}

                      </span>

                    </Link>





                    <div

                      className={

                        styles.relatedBody

                      }

                    >

                      <time

                        dateTime={

                          item.publishedAt

                        }

                      >

                        {formatDate(

                          item.publishedAt,

                        )}

                      </time>





                      <h3>

                        <Link

                          href={`/novedades/${item.slug}`}

                        >

                          {

                            item.title

                          }

                        </Link>

                      </h3>





                      <p>

                        {

                          item.excerpt

                        }

                      </p>





                      <Link

                        href={`/novedades/${item.slug}`}

                        className={

                          styles.relatedLink

                        }

                      >

                        Leer



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

        </section>

      )}

    </main>

  );

}