"use client";

import Image from "next/image";
import Link from "next/link";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Newspaper,
} from "lucide-react";

import type { Article } from "@/types/content";

import styles from "./NewsSection.module.css";

type Props = {
  articles: Article[];
};

function formatDate(value: string) {
  const date = new Date(value);

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
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  )
    .format(date)
    .replace(".", "");
}

function ArticlePlaceholder() {
  return (
    <div
      className={styles.placeholder}
      aria-hidden="true"
    >
      <div className={styles.placeholderGrid} />

      <Newspaper
        size={38}
        strokeWidth={1.15}
      />

      <strong>
        MORGILLO
      </strong>

      <span>
        ACTUALIDAD
      </span>
    </div>
  );
}

export default function NewsSection({
  articles,
}: Props) {
  const reducedMotion =
    useReducedMotion();

  const visible =
    articles.slice(0, 3);

  const featured =
    visible[0];

  const secondary =
    visible.slice(1);

  return (
    <section
      className={styles.section}
      aria-labelledby="news-title"
    >
      {/* =========================================
          BACKGROUND
      ========================================== */}

      <div
        className={styles.background}
        aria-hidden="true"
      >
        <span>
          07
        </span>

        <i />
      </div>

      <div className="morgillo-container">
        {/* =========================================
            HEADER
        ========================================== */}

        <div className={styles.header}>
          <div className={styles.heading}>
            <div className={styles.eyebrow}>
              <span>
                07
              </span>

              <i />

              <p>
                Actualidad
              </p>
            </div>

            <h2 id="news-title">
              Lo que está pasando
              <span>
                {" "}
                en Morgillo.
              </span>
            </h2>
          </div>

          <div className={styles.headerAside}>
            <p>
              Noticias, novedades,
              actividades y contenido
              relacionado con nuestros
              equipos y operaciones.
            </p>

            <Link
              href="/novedades"
              className={styles.allNews}
            >
              Ver todas las novedades

              <ArrowRight
                size={17}
                strokeWidth={1.8}
              />
            </Link>
          </div>
        </div>

        {/* =========================================
            EMPTY
        ========================================== */}

        {!featured && (
          <div className={styles.empty}>
            <div>
              <Newspaper
                size={28}
                strokeWidth={1.4}
              />
            </div>

            <span>
              Actualidad Morgillo
            </span>

            <h3>
              Próximamente compartiremos
              nuevas historias.
            </h3>

            <p>
              Aquí encontrarás noticias,
              actividades y novedades
              relacionadas con nuestros
              equipos.
            </p>
          </div>
        )}

        {/* =========================================
            NEWS LAYOUT
        ========================================== */}

        {featured && (
          <div className={styles.layout}>
            {/* =====================================
                FEATURED
            ====================================== */}

            <motion.article
              className={styles.featured}
              initial={
                reducedMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 28,
                    }
              }
              whileInView={
                reducedMotion
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              viewport={{
                once: true,
                amount: 0.18,
              }}
              transition={{
                duration: 0.65,
                ease: [
                  0.16,
                  1,
                  0.3,
                  1,
                ],
              }}
            >
              <Link
                href={`/novedades/${featured.slug}`}
                className={styles.featuredLink}
              >
                {/* ===============================
                    IMAGE
                ================================ */}

                <div className={styles.featuredMedia}>
                  {featured.image ? (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      sizes="
                        (max-width: 900px) 100vw,
                        62vw
                      "
                      className={styles.image}
                    />
                  ) : (
                    <ArticlePlaceholder />
                  )}

                  <div
                    className={styles.mediaShade}
                  />

                  <span className={styles.featuredIndex}>
                    01
                  </span>

                  <span className={styles.featuredTag}>
                    Historia destacada
                  </span>

                  <div
                    className={styles.redGeometry}
                    aria-hidden="true"
                  >
                    <span>
                      M
                    </span>
                  </div>
                </div>

                {/* ===============================
                    FEATURED COPY
                ================================ */}

                <div className={styles.featuredContent}>
                  <div className={styles.meta}>
                    <span>
                      <CalendarDays
                        size={15}
                        strokeWidth={1.7}
                      />

                      {formatDate(
                        featured.publishedAt,
                      )}
                    </span>

                    <span>
                      MRG / NEWS
                    </span>
                  </div>

                  <h3>
                    {featured.title}
                  </h3>

                  <p>
                    {featured.excerpt}
                  </p>

                  <div className={styles.read}>
                    <span>
                      Leer noticia
                    </span>

                    <span className={styles.readIcon}>
                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>

            {/* =====================================
                SECONDARY
            ====================================== */}

            <div className={styles.secondary}>
              <div className={styles.secondaryHeader}>
                <div>
                  <span />

                  <strong>
                    MÁS ACTUALIDAD
                  </strong>
                </div>

                <small>
                  02 — 03
                </small>
              </div>

              {secondary.map(
                (article, index) => (
                  <motion.article
                    key={article.slug}
                    className={styles.secondaryArticle}
                    initial={
                      reducedMotion
                        ? false
                        : {
                            opacity: 0,
                            x: 24,
                          }
                    }
                    whileInView={
                      reducedMotion
                        ? undefined
                        : {
                            opacity: 1,
                            x: 0,
                          }
                    }
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.52,
                      delay:
                        index *
                        0.08,
                      ease: [
                        0.16,
                        1,
                        0.3,
                        1,
                      ],
                    }}
                  >
                    <Link
                      href={`/novedades/${article.slug}`}
                      className={styles.secondaryLink}
                    >
                      <div className={styles.secondaryMedia}>
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="
                              (max-width: 640px) 38vw,
                              260px
                            "
                            className={styles.image}
                          />
                        ) : (
                          <ArticlePlaceholder />
                        )}

                        <span>
                          {String(
                            index + 2,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>
                      </div>

                      <div className={styles.secondaryCopy}>
                        <div className={styles.secondaryMeta}>
                          <CalendarDays
                            size={13}
                            strokeWidth={1.7}
                          />

                          <span>
                            {formatDate(
                              article.publishedAt,
                            )}
                          </span>
                        </div>

                        <h3>
                          {article.title}
                        </h3>

                        <p>
                          {article.excerpt}
                        </p>

                        <div className={styles.secondaryAction}>
                          <span>
                            Leer más
                          </span>

                          <ArrowUpRight
                            size={16}
                            strokeWidth={1.8}
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ),
              )}

              {/* =================================
                  FILL IF ONLY ONE ARTICLE
              ================================== */}

              {secondary.length === 0 && (
                <div className={styles.waiting}>
                  <span>
                    02
                  </span>

                  <div>
                    <strong>
                      Más historias próximamente
                    </strong>

                    <p>
                      Seguiremos compartiendo
                      novedades desde Morgillo.
                    </p>
                  </div>
                </div>
              )}

              {/* =================================
                  LINK
              ================================== */}

              <Link
                href="/novedades"
                className={styles.secondaryFooter}
              >
                <div>
                  <span />

                  <strong>
                    MORGILLO
                  </strong>
                </div>

                <span>
                  Explorar actualidad
                </span>

                <ArrowRight
                  size={17}
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================
            BOTTOM RAIL
        ========================================== */}

        {featured && (
          <div className={styles.bottom}>
            <div>
              <span />

              <strong>
                ACTUALIDAD MORGILLO
              </strong>

              <p>
                Equipos · Operaciones · Actividades
              </p>
            </div>

            <Link href="/novedades">
              Todas las noticias

              <ArrowUpRight
                size={16}
                strokeWidth={1.8}
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}