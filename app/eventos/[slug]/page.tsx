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

  Clock3,

  MapPin,

} from "lucide-react";

import {

  getContent,

} from "@/lib/content";

import type {

  Event,

} from "@/types/content";

import styles from "./page.module.css";

type Props = {

  params: Promise<{

    slug: string;

  }>;

};

type EventStatus =

  | "live"

  | "upcoming"

  | "past";

function toTime(

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

function getStatus(

  event: Event,

  now: number,

): EventStatus {

  const start =

    toTime(

      event.start,

    );

  const end =

    toTime(

      event.end,

    );

  if (

    start <= now &&

    end >= now

  ) {

    return "live";

  }

  if (

    start > now

  ) {

    return "upcoming";

  }

  return "past";

}

function statusLabel(

  status: EventStatus,

) {

  if (

    status === "live"

  ) {

    return "En curso";

  }

  if (

    status === "upcoming"

  ) {

    return "Próximo";

  }

  return "Finalizado";

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

    return "Fecha por confirmar";

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

function formatTime(

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

    return "";

  }

  return new Intl.DateTimeFormat(

    "es-PE",

    {

      hour: "2-digit",

      minute: "2-digit",

      hour12: false,

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

  const content =

    await getContent();

  const event =

    content.events.find(

      (item) =>

        item.slug ===

          slug &&

        item.published,

    );

  if (!event) {

    return {

      title:

        "Eventos | Morgillo",

    };

  }

  return {

    title:

      `${event.title} | Morgillo`,

    description:

      event.excerpt,

    alternates: {

      canonical:

        `/eventos/${event.slug}`,

    },

  };

}

/* =========================================================

   PAGE

\========================================================= */

export default async function EventPage({

  params,

}: Props) {

  const {

    slug,

  } =

    await params;

  const content =

    await getContent();

  const now =

    toTime(

      content.serverNow,

    );

  const events =

    content.events.filter(

      (event) =>

        event.published,

    );

  const event =

    events.find(

      (item) =>

        item.slug ===

        slug,

    );

  if (!event) {

    notFound();

  }

  const status =

    getStatus(

      event,

      now,

    );

  const related =

    events

      .filter(

        (item) =>

          item.slug !==

          event.slug,

      )

      .sort(

        (

          a,

          b,

        ) =>

          Math.abs(

            toTime(

              a.start,

            ) - now,

          ) -

          Math.abs(

            toTime(

              b.start,

            ) - now,

          ),

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

      data-status={

        status

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

              <Link href="/eventos">

                Eventos

              </Link>

              <span>

                /

              </span>

              <span

                aria-current="page"

              >

                {

                  event.title

                }

              </span>

            </nav>

            <Link

              href="/eventos"

              className={

                styles.back

              }

            >

              <ArrowLeft

                size={17}

                strokeWidth={1.8}

              />

              Todos los eventos

            </Link>

          </div>

        </div>

      </section>

      {/* =================================================

          HERO

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

                    Evento Morgillo

                  </p>

                </div>

                <div

                  className={

                    styles.status

                  }

                >

                  <span />

                  <strong>

                    {statusLabel(

                      status,

                    )}

                  </strong>

                </div>

                <h1>

                  {

                    event.title

                  }

                </h1>

              </div>

              <div

                className={

                  styles.heroSide

                }

              >

                <p>

                  {

                    event.excerpt

                  }

                </p>

                <div

                  className={

                    styles.quickInfo

                  }

                >

                  <div>

                    <CalendarDays

                      size={18}

                      strokeWidth={1.8}

                    />

                    <div>

                      <span>

                        Inicio

                      </span>

                      <strong>

                        {formatDate(

                          event.start,

                        )}

                      </strong>

                      {formatTime(

                        event.start,

                      ) && (

                        <small>

                          {formatTime(

                            event.start,

                          )}

                        </small>

                      )}

                    </div>

                  </div>

                  <div>

                    <CalendarDays

                      size={18}

                      strokeWidth={1.8}

                    />

                    <div>

                      <span>

                        Fin

                      </span>

                      <strong>

                        {formatDate(

                          event.end,

                        )}

                      </strong>

                      {formatTime(

                        event.end,

                      ) && (

                        <small>

                          {formatTime(

                            event.end,

                          )}

                        </small>

                      )}

                    </div>

                  </div>

                  {event.place && (

                    <div>

                      <MapPin

                        size={18}

                        strokeWidth={1.8}

                      />

                      <div>

                        <span>

                          Lugar

                        </span>

                        <strong>

                          {

                            event.place

                          }

                        </strong>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>

        </header>

        {/* =================================================

            IMAGE

        ================================================== */}

        {event.image && (

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

                    event.image

                  }

                  alt={

                    event.title

                  }

                  width={1800}

                  height={1000}

                  sizes="(max-width: 1200px) 100vw, 1180px"

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

                    {

                      event.place ||

                      "Morgillo"

                    }

                  </span>

                  <span>

                    {statusLabel(

                      status,

                    )}

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

                    Información

                  </strong>

                  <p>

                    Evento publicado por

                    Morgillo

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

                    event.excerpt

                  }

                </p>

                <div

                  className={

                    styles.articleText

                  }

                >

                  {

                    event.body

                  }

                </div>

                <div

                  className={

                    styles.eventData

                  }

                >

                  <div>

                    <CalendarDays

                      size={20}

                      strokeWidth={1.7}

                    />

                    <div>

                      <span>

                        Fecha de inicio

                      </span>

                      <strong>

                        {formatDate(

                          event.start,

                        )}

                      </strong>

                    </div>

                  </div>

                  <div>

                    <Clock3

                      size={20}

                      strokeWidth={1.7}

                    />

                    <div>

                      <span>

                        Hora

                      </span>

                      <strong>

                        {formatTime(

                          event.start,

                        ) ||

                          "Por confirmar"}

                      </strong>

                    </div>

                  </div>

                  {event.place && (

                    <div>

                      <MapPin

                        size={20}

                        strokeWidth={1.7}

                      />

                      <div>

                        <span>

                          Lugar

                        </span>

                        <strong>

                          {

                            event.place

                          }

                        </strong>

                      </div>

                    </div>

                  )}

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

          aria-labelledby="related-events-title"

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

                  id="related-events-title"

                >

                  Otros eventos.

                </h2>

              </div>

              <Link

                href="/eventos"

              >

                Ver agenda

                <ArrowUpRight

                  size={18}

                  strokeWidth={1.8}

                />

              </Link>

            </div>

            <div

              className={

                styles.relatedList

              }

            >

              {related.map(

                (

                  item,

                  index,

                ) => {

                  const itemStatus =

                    getStatus(

                      item,

                      now,

                    );

                  return (

                    <Link

                      key={

                        item.slug

                      }

                      href={`/eventos/${item.slug}`}

                    >

                      <span>

                        {String(

                          index + 1,

                        ).padStart(

                          2,

                          "0",

                        )}

                      </span>

                      <div>

                        <small>

                          {statusLabel(

                            itemStatus,

                          )}

                        </small>

                        <h3>

                          {

                            item.title

                          }

                        </h3>

                        <p>

                          {

                            item.excerpt

                          }

                        </p>

                      </div>

                      <div

                        className={

                          styles.relatedDate

                        }

                      >

                        {formatDate(

                          item.start,

                        )}

                      </div>

                      <ArrowUpRight

                        size={20}

                        strokeWidth={1.8}

                      />

                    </Link>

                  );

                },

              )}

            </div>

          </div>

        </section>

      )}

    </main>

  );

}
