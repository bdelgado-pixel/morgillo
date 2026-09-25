"use client";

import Image from "next/image";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import {
  motion,
  useReducedMotion,
} from "motion/react";

import clsx from "clsx";

import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  X,
} from "lucide-react";

import type { Campaign } from "@/types/content";

import {
  campaignKey,
  isCampaignActive,
} from "@/lib/campaigns";

import styles from "./Campaigns.module.css";

type Props = {
  campaigns: Campaign[];
  placement: "home" | "popup";
};

function formatDate(value: string) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
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

export default function Campaigns({
  campaigns,
  placement,
}: Props) {
  const [
    campaign,
    setCampaign,
  ] =
    useState<Campaign | null>(
      null,
    );

  const dialog =
    useRef<HTMLDialogElement>(
      null,
    );

  const dismissed =
    useRef(
      new Set<string>(),
    );

  const presented =
    useRef(
      new Set<string>(),
    );

  const path =
    usePathname();

  const reduceMotion =
    useReducedMotion();

  /* =========================================
     CAMPAIGN LOGIC
  ========================================== */

  useEffect(() => {
    if (!campaigns.length) {
      return;
    }

    function seen(
      item: Campaign,
    ) {
      const key =
        campaignKey(item);

      if (
        dismissed.current.has(
          key,
        )
      ) {
        return true;
      }

      if (
        presented.current.has(
          key,
        )
      ) {
        return false;
      }

      try {
        if (
          item.frequency ===
          "session"
        ) {
          return Boolean(
            sessionStorage.getItem(
              key,
            ),
          );
        }

        if (
          item.frequency ===
          "day"
        ) {
          return (
            localStorage.getItem(
              key,
            ) ===
            new Date().toLocaleDateString(
              "en-CA",
            )
          );
        }
      } catch {
        /* storage unavailable */
      }

      return false;
    }

    function refresh() {
      const next =
        campaigns.find(
          (item) =>
            isCampaignActive(
              item,
              Date.now(),
            ) &&
            item.placements.includes(
              placement,
            ) &&
            (!item.paths.length ||
              item.paths.includes(
                path,
              )) &&
            (placement ===
              "home" ||
              !seen(item)),
        ) ?? null;

      if (
        next &&
        placement === "popup"
      ) {
        const key =
          campaignKey(next);

        presented.current.add(
          key,
        );

        try {
          if (
            next.frequency ===
            "session"
          ) {
            sessionStorage.setItem(
              key,
              "1",
            );
          }

          if (
            next.frequency ===
            "day"
          ) {
            localStorage.setItem(
              key,
              new Date().toLocaleDateString(
                "en-CA",
              ),
            );
          }
        } catch {
          /* storage unavailable */
        }
      }

      setCampaign(next);
    }

    const first =
      window.setTimeout(
        refresh,
        0,
      );

    const timer =
      window.setInterval(
        refresh,
        1000,
      );

    return () => {
      window.clearTimeout(
        first,
      );

      window.clearInterval(
        timer,
      );
    };
  }, [
    campaigns,
    placement,
    path,
  ]);

  /* =========================================
     POPUP
  ========================================== */

  useEffect(() => {
    if (
      placement !== "popup" ||
      !campaign
    ) {
      return;
    }

    const element =
      dialog.current;

    const previous =
      document.activeElement as
        | HTMLElement
        | null;

    if (
      element &&
      !element.open
    ) {
      element.showModal();
    }

    const overflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      if (element?.open) {
        element.close();
      }

      document.body.style.overflow =
        overflow;

      previous?.focus();
    };
  }, [
    campaign,
    placement,
  ]);

  function close() {
    if (campaign) {
      const key =
        campaignKey(
          campaign,
        );

      dismissed.current.add(
        key,
      );

      try {
        if (
          campaign.frequency ===
          "session"
        ) {
          sessionStorage.setItem(
            key,
            "1",
          );
        }

        if (
          campaign.frequency ===
          "day"
        ) {
          localStorage.setItem(
            key,
            new Date().toLocaleDateString(
              "en-CA",
            ),
          );
        }
      } catch {
        /* storage unavailable */
      }
    }

    setCampaign(null);
  }

  if (!campaign) {
    return null;
  }

  const startDate =
    formatDate(
      campaign.start,
    );

  const endDate =
    formatDate(
      campaign.end,
    );

  const titleId =
    `campaign-title-${placement}`;

  /* =========================================
     CAMPAIGN CONTENT
  ========================================== */

  const content = (
    <motion.div
      className={clsx(
        styles.campaign,
        placement === "popup" &&
          styles.popupCampaign,
      )}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y:
                placement ===
                "home"
                  ? 30
                  : 16,
              scale:
                placement ===
                "popup"
                  ? 0.985
                  : 1,
            }
      }
      whileInView={
        placement === "home" &&
        !reduceMotion
          ? {
              opacity: 1,
              y: 0,
            }
          : undefined
      }
      animate={
        placement === "popup" &&
        !reduceMotion
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
            }
          : undefined
      }
      viewport={{
        once: true,
        amount: 0.2,
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
      {/* =====================================
          VISUAL
      ====================================== */}

      <div
        className={
          styles.visual
        }
      >
        <Image
          src={
            campaign.desktopImage
          }
          alt={campaign.title}
          fill
          sizes={
            placement ===
            "popup"
              ? "(max-width: 768px) 100vw, 48vw"
              : "(max-width: 900px) 100vw, 54vw"
          }
          className={clsx(
            styles.image,
            styles.desktopImage,
          )}
        />

        <Image
          src={
            campaign.mobileImage ||
            campaign.desktopImage
          }
          alt={campaign.title}
          fill
          sizes="100vw"
          className={clsx(
            styles.image,
            styles.mobileImage,
          )}
        />

        <div
          className={
            styles.imageShade
          }
        />

        {/* red geometry */}

        <div
          className={
            styles.redGeometry
          }
          aria-hidden="true"
        >
          <span>
            M
          </span>
        </div>

        {/* campaign index */}

        <div
          className={
            styles.visualIndex
          }
        >
          <span>
            MRG
          </span>

          <i />

          <strong>
            CAMPAÑA
          </strong>
        </div>

        {/* bottom plate */}

        <div
          className={
            styles.visualPlate
          }
        >
          <div>
            <span />

            <strong>
              MORGILLO
            </strong>
          </div>

          <p>
            Campo · Obra ·
            Operación
          </p>
        </div>

        {/* technical lines */}

        <div
          className={
            styles.technicalLines
          }
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* =====================================
          CONTENT
      ====================================== */}

      <div
        className={
          styles.content
        }
      >
        <div
          className={
            styles.contentCode
          }
        >
          <span>
            06
          </span>

          <i />

          <p>
            Campañas Morgillo
          </p>
        </div>

        {campaign.subtitle && (
          <span
            className={
              styles.subtitle
            }
          >
            {
              campaign.subtitle
            }
          </span>
        )}

        <h2 id={titleId}>
          {
            campaign.title
          }
        </h2>

        <p
          className={
            styles.description
          }
        >
          {
            campaign.description
          }
        </p>

        {/* =================================
            META
        ================================== */}

        <div
          className={
            styles.meta
          }
        >
          {(startDate ||
            endDate) && (
            <div
              className={
                styles.metaItem
              }
            >
              <span
                className={
                  styles.metaIcon
                }
              >
                <CalendarDays
                  size={18}
                  strokeWidth={
                    1.7
                  }
                />
              </span>

              <div>
                <small>
                  Vigencia
                </small>

                <strong>
                  {startDate}

                  {startDate &&
                    endDate && (
                      <>
                        {" "}
                        —{" "}
                      </>
                    )}

                  {endDate}
                </strong>
              </div>
            </div>
          )}

          {campaign.place && (
            <div
              className={
                styles.metaItem
              }
            >
              <span
                className={
                  styles.metaIcon
                }
              >
                <MapPin
                  size={18}
                  strokeWidth={
                    1.7
                  }
                />
              </span>

              <div>
                <small>
                  Lugar
                </small>

                <strong>
                  {
                    campaign.place
                  }
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* =================================
            ACTION
        ================================== */}

        <div
          className={
            styles.actionArea
          }
        >
          <a
            href={
              campaign.href
            }
            onClick={
              placement ===
              "popup"
                ? close
                : undefined
            }
            className={
              styles.cta
            }
          >
            <span>
              {
                campaign.buttonText
              }
            </span>

            <ArrowUpRight
              size={18}
              strokeWidth={1.8}
            />
          </a>

          <div
            className={
              styles.actionMark
            }
            aria-hidden="true"
          >
            <span />

            <small>
              MRG / 06
            </small>
          </div>
        </div>
      </div>
    </motion.div>
  );

  /* =========================================
     HOME
  ========================================== */

  if (
    placement === "home"
  ) {
    return (
      <section
        className={
          styles.section
        }
        aria-labelledby={
          titleId
        }
      >
        <div
          className={
            styles.background
          }
          aria-hidden="true"
        >
          <span
            className={
              styles.backgroundNumber
            }
          >
            06
          </span>

          <span
            className={
              styles.backgroundLine
            }
          />
        </div>

        <div className="morgillo-container">
          <div
            className={
              styles.sectionTop
            }
          >
            <div>
              <span />

              <strong>
                CAMPAÑA ACTIVA
              </strong>
            </div>

            <span>
              MORGILLO /
              ACTUALIDAD
            </span>
          </div>

          {content}
        </div>
      </section>
    );
  }

  /* =========================================
     POPUP
  ========================================== */

  return (
    <dialog
      ref={dialog}
      aria-labelledby={
        titleId
      }
      className={
        styles.dialog
      }
      onCancel={(event) => {
        event.preventDefault();

        close();
      }}
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          close();
        }
      }}
    >
      <div
        className={
          styles.dialogShell
        }
      >
        <button
          autoFocus
          type="button"
          onClick={close}
          className={
            styles.close
          }
          aria-label="Cerrar campaña"
        >
          <X
            size={19}
            strokeWidth={1.8}
          />
        </button>

        {content}
      </div>
    </dialog>
  );
}