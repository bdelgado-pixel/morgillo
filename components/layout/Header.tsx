"use client";

import Image from "next/image";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {

  useEffect,

  useRef,

  useState,

} from "react";

import {

  navigation,

  site as siteConfig,

  whatsapp,

} from "@/data/site";

import ThemeToggle from "@/components/theme/ThemeToggle";

import type {

  Brand,

  CategoryItem,

  SiteSettings,

} from "@/types/content";

import styles from "./Header.module.css";

type MegaMenu =

  | "maquinaria"

  | "marcas"

  | null;

export default function Header({

  site,

  categories,

  brands,

}: {

  site: SiteSettings;

  categories: CategoryItem[];

  brands: Brand[];

}) {

  const pathname =

    usePathname();

  const [

    mobileOpen,

    setMobileOpen,

  ] = useState(false);

  const [

    megaMenu,

    setMegaMenu,

  ] = useState<MegaMenu>(

    null,

  );

  const headerRef =

    useRef<HTMLElement>(

      null,

    );

  const mobileButtonRef =

    useRef<HTMLButtonElement>(

      null,

    );

  /* =========================================================

     CLOSE MENUS

  ========================================================= */

  const closeMenus = () => {

    setMobileOpen(false);

    setMegaMenu(null);

  };

  /* =========================================================

     CLICK OUTSIDE + ESC

  ========================================================= */

  useEffect(() => {

    const handlePointerDown = (

      event: PointerEvent,

    ) => {

      if (

        headerRef.current &&

        !headerRef.current.contains(

          event.target as Node,

        )

      ) {

        closeMenus();

      }

    };

    const handleKeyDown = (

      event: KeyboardEvent,

    ) => {

      if (

        event.key ===

        "Escape"

      ) {

        closeMenus();

        mobileButtonRef.current?.focus();

      }

    };

    document.addEventListener(

      "pointerdown",

      handlePointerDown,

    );

    document.addEventListener(

      "keydown",

      handleKeyDown,

    );

    return () => {

      document.removeEventListener(

        "pointerdown",

        handlePointerDown,

      );

      document.removeEventListener(

        "keydown",

        handleKeyDown,

      );

    };

  }, []);

  /* =========================================================

     MOBILE SCROLL LOCK

  ========================================================= */

  useEffect(() => {

    document.body.style.overflow =

      mobileOpen

        ? "hidden"

        : "";

    return () => {

      document.body.style.overflow =

        "";

    };

  }, [mobileOpen]);

  /* =========================================================

     MEGA MENU

  ========================================================= */

  function toggleMegaMenu(

    menu:

      | "maquinaria"

      | "marcas",

  ) {

    setMegaMenu(

      (current) =>

        current === menu

          ? null

          : menu,

    );

    setMobileOpen(false);

  }

  /* =========================================================

     ACTIVE

  ========================================================= */

  function isActive(

    href: string,

  ) {

    if (

      href === "/"

    ) {

      return pathname === "/";

    }

    return pathname.startsWith(

      href,

    );

  }

  return (

    <header

      ref={headerRef}

      className={`${styles.root} morgillo-header`}

    >

      {/* =====================================================

          TOP BAR

      ====================================================== */}

      <div className="morgillo-header__topbar">

        <div className="morgillo-container morgillo-header__topbar-inner">

          <div className="morgillo-header__topbar-label">

            <span />

            <p>

              Maquinaria agrícola y de construcción

            </p>

          </div>

          <div className="morgillo-header__topbar-contact">

            <span>

              Ventas

            </span>

            <a

              href={`tel:+51${site.phone.replaceAll(

                " ",

                "",

              )}`}

            >

              {site.phone}

            </a>

          </div>

        </div>

      </div>

      {/* =====================================================

          MAIN HEADER

      ====================================================== */}

      <div className="morgillo-header__main">

        <div className="morgillo-container morgillo-header__row">

          {/* =================================================

              LOGO

          ================================================== */}

          <Link

            href="/"

            onClick={closeMenus}

            aria-label="Morgillo, inicio"

            className="morgillo-header__logo"

          >

            <Image

              src={

                site.logo ||

                "/images/logo-morgillo.webp"

              }

              alt="Morgillo"

              width={180}

              height={67}

              priority

              className="morgillo-header__logo-image"

            />

          </Link>

          {/* =================================================

              DESKTOP NAVIGATION

          ================================================== */}

          <nav

            aria-label="Navegación principal"

            className="morgillo-header__desktop-nav"

          >

            {/* INICIO */}

            <Link

              href="/"

              onClick={closeMenus}

              className={

                pathname === "/"

                  ? "morgillo-header__nav-link is-active"

                  : "morgillo-header__nav-link"

              }

              aria-current={

                pathname === "/"

                  ? "page"

                  : undefined

              }

            >

              Inicio

            </Link>

            {/* MAQUINARIA */}

            <button

              type="button"

              className={

                megaMenu ===

                "maquinaria"

                  ? "morgillo-header__nav-link morgillo-header__nav-button is-open"

                  : "morgillo-header__nav-link morgillo-header__nav-button"

              }

              aria-expanded={

                megaMenu ===

                "maquinaria"

              }

              aria-controls="morgillo-mega-menu"

              onClick={() =>

                toggleMegaMenu(

                  "maquinaria",

                )

              }

            >

              <span>

                Maquinaria

              </span>

              <ChevronIcon

                open={

                  megaMenu ===

                  "maquinaria"

                }

              />

            </button>

            {/* MARCAS */}

            <button

              type="button"

              className={

                megaMenu ===

                "marcas"

                  ? "morgillo-header__nav-link morgillo-header__nav-button is-open"

                  : "morgillo-header__nav-link morgillo-header__nav-button"

              }

              aria-expanded={

                megaMenu ===

                "marcas"

              }

              aria-controls="morgillo-mega-menu"

              onClick={() =>

                toggleMegaMenu(

                  "marcas",

                )

              }

            >

              <span>

                Marcas

              </span>

              <ChevronIcon

                open={

                  megaMenu ===

                  "marcas"

                }

              />

            </button>

            {/* RESTO DE NAVEGACIÓN */}

            {navigation.map(

              (item) => {

                const active =

                  isActive(

                    item.href,

                  );

                return (

                  <Link

                    key={

                      item.href

                    }

                    href={

                      item.href

                    }

                    onClick={

                      closeMenus

                    }

                    className={

                      active

                        ? "morgillo-header__nav-link is-active"

                        : "morgillo-header__nav-link"

                    }

                    aria-current={

                      active

                        ? "page"

                        : undefined

                    }

                  >

                    {item.label}

                  </Link>

                );

              },

            )}

            {/* =================================================

                WEBMAIL

                Es una opción más del menú principal.

            ================================================== */}

            <a

              href={

                siteConfig.webmail

              }

              target="_blank"

              rel="noopener noreferrer"

              className="morgillo-header__nav-link morgillo-header__webmail"

            >

              <span>

                Webmail

              </span>

              <span

                className="morgillo-header__webmail-arrow"

                aria-hidden="true"

              >

                ↗

              </span>

            </a>

          </nav>

          {/* =================================================

              ACTIONS

          ================================================== */}

          <div className="morgillo-header__actions">

            <div className="morgillo-header__theme">

              <ThemeToggle />

            </div>

            {/* WHATSAPP */}

            <a

              className="morgillo-header__whatsapp"

              href={whatsapp(

                undefined,

                site.whatsapp,

              )}

              target="_blank"

              rel="noopener noreferrer"

            >

              <WhatsAppIcon />

              <span>

                WhatsApp

              </span>

              <span

                className="morgillo-header__whatsapp-arrow"

                aria-hidden="true"

              >

                ↗

              </span>

            </a>

            {/* MOBILE TRIGGER */}

            <button

              ref={

                mobileButtonRef

              }

              type="button"

              className={

                mobileOpen

                  ? "morgillo-header__mobile-trigger is-open"

                  : "morgillo-header__mobile-trigger"

              }

              aria-label={

                mobileOpen

                  ? "Cerrar menú"

                  : "Abrir menú"

              }

              aria-expanded={

                mobileOpen

              }

              aria-controls="morgillo-mobile-navigation"

              onClick={() => {

                setMobileOpen(

                  (current) =>

                    !current,

                );

                setMegaMenu(

                  null,

                );

              }}

            >

              <span />

              <span />

              <span />

            </button>

          </div>

        </div>

      </div>

      {/* =====================================================

          MEGA MENU DESKTOP

      ====================================================== */}

      {megaMenu && (

        <div

          id="morgillo-mega-menu"

          className="morgillo-header__mega"

        >

          <div className="morgillo-container">

            <div className="morgillo-header__mega-top">

              <div>

                <span className="morgillo-header__mega-eyebrow">

                  {megaMenu ===

                  "maquinaria"

                    ? "Catálogo Morgillo"

                    : "Marcas"}

                </span>

                <h2>

                  {megaMenu ===

                  "maquinaria"

                    ? "Encuentra el equipo para tu trabajo."

                    : "Explora nuestras marcas de maquinaria."}

                </h2>

              </div>

              <Link

                href={

                  megaMenu ===

                  "maquinaria"

                    ? "/maquinaria"

                    : "/marcas"

                }

                onClick={closeMenus}

                className="morgillo-header__mega-all"

              >

                <span>

                  {megaMenu ===

                  "maquinaria"

                    ? "Ver todo el catálogo"

                    : "Ver todas las marcas"}

                </span>

                <span aria-hidden="true">

                  ↗

                </span>

              </Link>

            </div>

            <div className="morgillo-header__mega-grid">

              {megaMenu ===

              "maquinaria"

                ? categories.map(

                    (

                      category,

                      index,

                    ) => (

                      <Link

                        key={

                          category.id

                        }

                        href={`/maquinaria?categoria=${category.id}`}

                        onClick={

                          closeMenus

                        }

                        className="morgillo-header__mega-card"

                      >

                        <div className="morgillo-header__mega-card-number">

                          {String(

                            index + 1,

                          ).padStart(

                            2,

                            "0",

                          )}

                        </div>

                        <div className="morgillo-header__mega-card-content">

                          <span>

                            {

                              category.brand

                            }

                          </span>

                          <strong>

                            {

                              category.name

                            }

                          </strong>

                          <p>

                            {

                              category.description

                            }

                          </p>

                        </div>

                        <span

                          className="morgillo-header__mega-card-arrow"

                          aria-hidden="true"

                        >

                          ↗

                        </span>

                      </Link>

                    ),

                  )

                : brands.map(

                    (

                      brand,

                      index,

                    ) => (

                      <Link

                        key={

                          brand.id

                        }

                        href={`/marcas/${brand.id}`}

                        onClick={

                          closeMenus

                        }

                        className="morgillo-header__mega-card"

                      >

                        <div className="morgillo-header__mega-card-number">

                          {String(

                            index + 1,

                          ).padStart(

                            2,

                            "0",

                          )}

                        </div>

                        <div className="morgillo-header__mega-card-content">

                          <span>

                            Marca

                          </span>

                          <strong>

                            {

                              brand.name

                            }

                          </strong>

                          {brand.description && (

                            <p>

                              {

                                brand.description

                              }

                            </p>

                          )}

                        </div>

                        <span

                          className="morgillo-header__mega-card-arrow"

                          aria-hidden="true"

                        >

                          ↗

                        </span>

                      </Link>

                    ),

                  )}

            </div>

          </div>

        </div>

      )}

      {/* =====================================================

          MOBILE MENU

      ====================================================== */}

      <div

        className={

          mobileOpen

            ? "morgillo-mobile-menu is-open"

            : "morgillo-mobile-menu"

        }

        aria-hidden={

          !mobileOpen

        }

      >

        <div className="morgillo-mobile-menu__scroll">

          <nav

            id="morgillo-mobile-navigation"

            aria-label="Navegación móvil"

            className="morgillo-container morgillo-mobile-menu__nav"

          >

            <div className="morgillo-mobile-menu__top">

              <span>

                Menú

              </span>

              <span>

                Morgillo

              </span>

            </div>

            {/* INICIO */}

            <Link

              href="/"

              onClick={closeMenus}

              className="morgillo-mobile-menu__main-link"

            >

              <span>

                Inicio

              </span>

              <span aria-hidden="true">

                ↗

              </span>

            </Link>

            {/* =================================================

                MAQUINARIA

            ================================================== */}

            <details className="morgillo-mobile-menu__group">

              <summary>

                <span>

                  Maquinaria

                </span>

                <span aria-hidden="true">

                  +

                </span>

              </summary>

              <div className="morgillo-mobile-menu__submenu">

                <Link

                  href="/maquinaria"

                  onClick={

                    closeMenus

                  }

                >

                  <small>

                    00

                  </small>

                  <span>

                    Todo el catálogo

                  </span>

                </Link>

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

                      onClick={

                        closeMenus

                      }

                    >

                      <small>

                        {String(

                          index + 1,

                        ).padStart(

                          2,

                          "0",

                        )}

                      </small>

                      <span>

                        {

                          category.name

                        }

                      </span>

                      <em>

                        {

                          category.brand

                        }

                      </em>

                    </Link>

                  ),

                )}

              </div>

            </details>

            {/* =================================================

                MARCAS

            ================================================== */}

            <details className="morgillo-mobile-menu__group">

              <summary>

                <span>

                  Marcas

                </span>

                <span aria-hidden="true">

                  +

                </span>

              </summary>

              <div className="morgillo-mobile-menu__submenu">

                <Link

                  href="/marcas"

                  onClick={

                    closeMenus

                  }

                >

                  <small>

                    00

                  </small>

                  <span>

                    Todas las marcas

                  </span>

                </Link>

                {brands.map(

                  (

                    brand,

                    index,

                  ) => (

                    <Link

                      key={

                        brand.id

                      }

                      href={`/marcas/${brand.id}`}

                      onClick={

                        closeMenus

                      }

                    >

                      <small>

                        {String(

                          index + 1,

                        ).padStart(

                          2,

                          "0",

                        )}

                      </small>

                      <span>

                        {

                          brand.name

                        }

                      </span>

                    </Link>

                  ),

                )}

              </div>

            </details>

            {/* RESTO */}

            {navigation.map(

              (item) => (

                <Link

                  key={

                    item.href

                  }

                  href={

                    item.href

                  }

                  onClick={

                    closeMenus

                  }

                  className="morgillo-mobile-menu__main-link"

                >

                  <span>

                    {

                      item.label

                    }

                  </span>

                  <span aria-hidden="true">

                    ↗

                  </span>

                </Link>

              ),

            )}

            {/* =================================================

                WEBMAIL

                Misma jerarquía que las demás opciones.

            ================================================== */}

            <a

              href={

                siteConfig.webmail

              }

              target="_blank"

              rel="noopener noreferrer"

              className="morgillo-mobile-menu__main-link morgillo-mobile-menu__webmail-link"

            >

              <span>

                Webmail

              </span>

              <span aria-hidden="true">

                ↗

              </span>

            </a>

            {/* =================================================

                WHATSAPP

            ================================================== */}

            <a

              href={whatsapp(

                undefined,

                site.whatsapp,

              )}

              target="_blank"

              rel="noopener noreferrer"

              className="morgillo-mobile-menu__whatsapp"

            >

              <div>

                <WhatsAppIcon />

                <span>

                  <small>

                    ¿Necesitas asesoría?

                  </small>

                  <strong>

                    Hablar por WhatsApp

                  </strong>

                </span>

              </div>

              <span aria-hidden="true">

                ↗

              </span>

            </a>

            {/* =================================================

                PHONE

            ================================================== */}

            <div className="morgillo-mobile-menu__contact">

              <span>

                Ventas

              </span>

              <a

                href={`tel:+51${site.phone.replaceAll(

                  " ",

                  "",

                )}`}

              >

                {site.phone}

              </a>

            </div>

          </nav>

        </div>

      </div>

    </header>

  );

}

/* =========================================================

   CHEVRON

\========================================================= */

function ChevronIcon({

  open,

}: {

  open: boolean;

}) {

  return (

    <svg

      viewBox="0 0 20 20"

      fill="none"

      stroke="currentColor"

      strokeWidth="1.7"

      className={

        open

          ? "morgillo-chevron is-open"

          : "morgillo-chevron"

      }

      aria-hidden="true"

    >

      <path

        d="m6 8 4 4 4-4"

        strokeLinecap="round"

        strokeLinejoin="round"

      />

    </svg>

  );

}

/* =========================================================

   WHATSAPP ICON

\========================================================= */

function WhatsAppIcon() {

  return (

    <svg

      viewBox="0 0 24 24"

      fill="currentColor"

      aria-hidden="true"

    >

      <path

        d="M12.04 2a9.84 9.84 0 0 0-8.5 14.8L2 22l5.34-1.4A9.96 9.96 0 1 0 12.04 2Zm0 18.18a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.17.83.85-3.08-.2-.32a8.12 8.12 0 1 1 7 3.89Zm4.5-6.08c-.25-.12-1.46-.72-1.69-.8-.22-.09-.39-.13-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22a7.4 7.4 0 0 1-1.37-1.71c-.14-.25-.02-.38.1-.5.12-.12.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.84-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.06 0 1.22.88 2.39 1 2.55.13.17 1.74 2.66 4.22 3.73.59.26 1.05.41 1.41.53.59.19 1.13.16 1.55.1.48-.07 1.46-.59 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.1-.23-.16-.47-.28Z"

      />

    </svg>

  );

}
