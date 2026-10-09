import type {

  Metadata,

} from "next";

import Image from "next/image";

import Link from "next/link";

import {

  ArrowUpRight,

  CalendarDays,

  MapPin,

} from "lucide-react";

import {

  getContent,

} from "@/lib/content";

import type {

  Event,

} from "@/types/content";

import styles from "./page.module.css";

export const metadata: Metadata = {

  title: "Eventos | Morgillo",

  description:

    "Conoce los eventos y actividades publicados por Morgillo.",

  alternates: {

    canonical: "/eventos",

  },

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

      month: "short",

      year: "numeric",

      timeZone:

        "America/Lima",

    },

  ).format(

    date,

  );

}

function formatRange(

  start: string,

  end: string,

) {

  const startDate =

    new Date(

      start,

    );

  const endDate =

    new Date(

      end,

    );

  if (

    Number.isNaN(

      startDate.getTime(),

    ) ||

    Number.isNaN(

      endDate.getTime(),

    )

  ) {

    return "Fecha por confirmar";

  }

  const formatter =

    new Intl.DateTimeFormat(

      "es-PE",

      {

        day: "2-digit",

        month: "short",

        year: "numeric",

        timeZone:

          "America/Lima",

      },

    );

  return `${formatter.format(

    startDate,

  )} — ${formatter.format(

    endDate,

  )}`;

}

export default async function EventsPage() {

  const content =

    await getContent();

  const now =

    toTime(

      content.serverNow,

    );

  const events =

    content.events

      .filter(

        (event) =>

          event.published,

      )

      .sort(

        (

          a,

          b,

        ) => {

          const statusA =

            getStatus(

              a,

              now,

            );

          const statusB =

            getStatus(

              b,

              now,

            );

          const priority: Record<

            EventStatus,

            number

          > = {

            live: 0,

            upcoming: 1,

            past: 2,

          };

          if (

            priority[

              statusA

            ] !==

            priority[

              statusB

            ]

          ) {

            return (

              priority[

                statusA

              ] -

              priority[

                statusB

              ]

            );

          }

          if (

            statusA ===

            "past"

          ) {

            return (

              toTime(

                b.start,

              ) -

              toTime(

                a.start,

              )

            );

          }

          return (

            toTime(

              a.start,

            ) -

            toTime(

              b.start,

            )

          );

        },

      );

  const activeCount =

    events.filter(

      (event) =>

        getStatus(

          event,

          now,

        ) ===

        "live",

    ).length;

  const upcomingCount =

    events.filter(

      (event) =>

        getStatus(

          event,

          now,

        ) ===

        "upcoming",

    ).length;

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

        aria-labelledby="events-title"

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

                Eventos Morgillo

              </p>

            </div>

            <span

              className={

                styles.heroCode

              }

            >

              MRG / EVENTS

            </span>

          </div>

          <div

            className={

              styles.heroContent

            }

          >

            <div>

              <h1

                id="events-title"

              >

                Encuentros,

                actividades y

                <span>

                  {" "}

                  eventos Morgillo.

                </span>

              </h1>

            </div>

            <div

              className={

                styles.heroSide

              }

            >

              <p>

                Consulta las actividades

                publicadas y revisa sus

                fechas, ubicación e

                información antes de

                participar.

              </p>

              <div

                className={

                  styles.heroStatus

                }

              >

                <span />

                <strong>

                  {

                    events.length

                  }{" "}

                  {events.length === 1

                    ? "evento publicado"

                    : "eventos publicados"}

                </strong>

              </div>

            </div>

          </div>

          <div

            className={

              styles.heroRail

            }

          >

            <div>

              <span>

                En curso

              </span>

              <strong>

                {

                  activeCount

                }

              </strong>

            </div>

            <div>

              <span>

                Próximos

              </span>

              <strong>

                {

                  upcomingCount

                }

              </strong>

            </div>

            <div>

              <span>

                Total

              </span>

              <strong>

                {

                  events.length

                }

              </strong>

            </div>

            <div

              className={

                styles.heroRailText

              }

            >

              <span />

              <p>

                Fechas calculadas desde

                el CMS

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================

          EVENTS

      ================================================== */}

      <section

        className={

          styles.events

        }

        aria-labelledby="event-list-title"

      >

        <div className="morgillo-container">

          <div

            className={

              styles.sectionHeader

            }

          >

            <div>

              <span>

                02

              </span>

              <h2

                id="event-list-title"

              >

                Agenda

                <span>

                  {" "}

                  publicada.

                </span>

              </h2>

            </div>

            <p>

              Los estados se actualizan

              de acuerdo con la fecha

              de inicio y finalización

              de cada evento.

            </p>

          </div>

          {events.length >

          0 ? (

            <div

              className={

                styles.eventList

              }

            >

              {events.map(

                (

                  event,

                  index,

                ) => {

                  const status =

                    getStatus(

                      event,

                      now,

                    );

                  return (

                    <article

                      key={

                        event.slug

                      }

                      className={

                        styles.event

                      }

                      data-status={

                        status

                      }

                    >

                      {/* =================================

                          MEDIA

                      ================================== */}

                      <Link

                        href={`/eventos/${event.slug}`}

                        className={

                          styles.media

                        }

                      >

                        {event.image ? (

                          <Image

                            src={

                              event.image

                            }

                            alt={

                              event.title

                            }

                            width={1600}

                            height={900}

                            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"

                            priority={

                              index === 0

                            }

                          />

                        ) : (

                          <div

                            className={

                              styles.mediaFallback

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

                            styles.index

                          }

                        >

                          {String(

                            index + 1,

                          ).padStart(

                            2,

                            "0",

                          )}

                        </span>

                        <span

                          className={

                            styles.status

                          }

                        >

                          {statusLabel(

                            status,

                          )}

                        </span>

                      </Link>

                      {/* =================================

                          CONTENT

                      ================================== */}

                      <div

                        className={

                          styles.eventContent

                        }

                      >

                        <div

                          className={

                            styles.meta

                          }

                        >

                          <div>

                            <CalendarDays

                              size={17}

                              strokeWidth={1.8}

                            />

                            <span>

                              {formatRange(

                                event.start,

                                event.end,

                              )}

                            </span>

                          </div>

                          {event.place && (

                            <div>

                              <MapPin

                                size={17}

                                strokeWidth={1.8}

                              />

                              <span>

                                {

                                  event.place

                                }

                              </span>

                            </div>

                          )}

                        </div>

                        <h3>

                          <Link

                            href={`/eventos/${event.slug}`}

                          >

                            {

                              event.title

                            }

                          </Link>

                        </h3>

                        <p>

                          {

                            event.excerpt

                          }

                        </p>

                        <div

                          className={

                            styles.eventBottom

                          }

                        >

                          <span>

                            Publicado{" "}

                            {formatDate(

                              event.publishedAt,

                            )}

                          </span>

                          <Link

                            href={`/eventos/${event.slug}`}

                          >

                            Ver evento

                            <ArrowUpRight

                              size={18}

                              strokeWidth={1.8}

                            />

                          </Link>

                        </div>

                      </div>

                    </article>

                  );

                },

              )}

            </div>

          ) : (

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

                  Eventos

                </small>

                <h3>

                  No hay eventos

                  publicados en este

                  momento.

                </h3>

                <p>

                  Cuando se publique una

                  nueva actividad

                  aparecerá

                  automáticamente en

                  esta sección.

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
