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
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowRight,
  ChevronDown,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";

import clsx from "clsx";

import {
  categories,
  navigation,
  site,
  whatsapp,
} from "@/data/site";

import ThemeToggle from "@/components/theme/ThemeToggle";

import styles from "./Header.module.css";


type MegaMenu =
  | "maquinaria"
  | "marcas"
  | null;


const brands = [
  {
    id: "kubota",
    name: "Kubota",
    area: "Agricultura",
  },
  {
    id: "kobelco",
    name: "Kobelco",
    area: "Construcción",
  },
  {
    id: "bull",
    name: "BULL",
    area: "Trabajo pesado",
  },
];


function phoneHref(
  value: string,
) {
  return `tel:${value.replace(
    /[^\d+]/g,
    "",
  )}`;
}


export default function Header() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [megaMenu, setMegaMenu] =
    useState<MegaMenu>(null);

  const [mobileGroup, setMobileGroup] =
    useState<MegaMenu>(null);

  const [scrolled, setScrolled] =
    useState(false);

  const root =
    useRef<HTMLElement>(null);

  const mobileButton =
    useRef<HTMLButtonElement>(null);

  const pathname =
    usePathname();

  const reducedMotion =
    useReducedMotion();


  function closeMenus() {
    setMobileOpen(false);
    setMegaMenu(null);
    setMobileGroup(null);
  }


  function toggleMega(
    menu: Exclude<
      MegaMenu,
      null
    >,
  ) {
    setMegaMenu(
      (current) =>
        current === menu
          ? null
          : menu,
    );

    setMobileOpen(false);
  }


  function active(
    href: string,
  ) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(
      href,
    );
  }


  /* =====================================================
     CLOSE / ESCAPE
  ====================================================== */

  useEffect(() => {
    function pointer(
      event: PointerEvent,
    ) {
      if (
        root.current &&
        !root.current.contains(
          event.target as Node,
        )
      ) {
        setMegaMenu(null);
      }
    }

    function keyboard(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
      ) {
        closeMenus();

        mobileButton.current?.focus();
      }
    }

    document.addEventListener(
      "pointerdown",
      pointer,
    );

    document.addEventListener(
      "keydown",
      keyboard,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        pointer,
      );

      document.removeEventListener(
        "keydown",
        keyboard,
      );
    };
  }, []);


  /* =====================================================
     ROUTE CHANGE
  ====================================================== */

  useEffect(() => {
    closeMenus();
  }, [pathname]);


  /* =====================================================
     MOBILE SCROLL LOCK
  ====================================================== */

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const oldOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        oldOverflow;
    };
  }, [mobileOpen]);


  /* =====================================================
     HEADER SCROLL STATE
  ====================================================== */

  useEffect(() => {
    function update() {
      setScrolled(
        window.scrollY > 20,
      );
    }

    update();

    window.addEventListener(
      "scroll",
      update,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        update,
      );
    };
  }, []);


  return (
    <header
      ref={root}
      className={clsx(
        styles.header,
        scrolled &&
          styles.scrolled,
      )}
    >
      {/* =================================================
          TOP BAR
      ================================================== */}

      <div
        className={
          styles.topbar
        }
      >
        <div
          className={clsx(
            "morgillo-container",
            styles.topbarInner,
          )}
        >
          <div
            className={
              styles.topbarLabel
            }
          >
            <span />

            <p>
              Maquinaria para campo,
              obra y operación
            </p>
          </div>

          <div
            className={
              styles.topbarRight
            }
          >
            <span>
              Tarapoto · San Martín
            </span>

            <i />

            <a
              href={phoneHref(
                site.phone,
              )}
            >
              <Phone
                size={12}
                strokeWidth={1.7}
              />

              Ventas {site.phone}
            </a>
          </div>
        </div>
      </div>


      {/* =================================================
          MAIN
      ================================================== */}

      <div
        className={
          styles.main
        }
      >
        <div
          className={clsx(
            "morgillo-container",
            styles.row,
          )}
        >
          {/* LOGO */}

          <Link
            href="/"
            aria-label="Morgillo, inicio"
            onClick={closeMenus}
            className={
              styles.logo
            }
          >
            <Image
              src="/images/logo-morgillo.webp"
              alt="Morgillo"
              width={220}
              height={82}
              priority
              className={
                styles.logoImage
              }
            />
          </Link>


          {/* =============================================
              DESKTOP NAV
          ============================================== */}

          <nav
            className={
              styles.desktopNav
            }
            aria-label="Navegación principal"
          >
            <Link
              href="/"
              onClick={closeMenus}
              className={clsx(
                styles.navLink,
                active("/") &&
                  styles.active,
              )}
              aria-current={
                active("/")
                  ? "page"
                  : undefined
              }
            >
              Inicio
            </Link>


            {/* MAQUINARIA */}

            <button
              type="button"
              className={clsx(
                styles.navLink,
                styles.navButton,
                active(
                  "/maquinaria",
                ) &&
                  styles.active,
              )}
              aria-expanded={
                megaMenu ===
                "maquinaria"
              }
              aria-controls="morgillo-mega-menu"
              onClick={() =>
                toggleMega(
                  "maquinaria",
                )
              }
            >
              Maquinaria

              <ChevronDown
                size={14}
                strokeWidth={1.8}
                className={clsx(
                  styles.chevron,
                  megaMenu ===
                    "maquinaria" &&
                    styles.chevronOpen,
                )}
              />
            </button>


            {/* MARCAS */}

            <button
              type="button"
              className={clsx(
                styles.navLink,
                styles.navButton,
                active("/marcas") &&
                  styles.active,
              )}
              aria-expanded={
                megaMenu ===
                "marcas"
              }
              aria-controls="morgillo-mega-menu"
              onClick={() =>
                toggleMega(
                  "marcas",
                )
              }
            >
              Marcas

              <ChevronDown
                size={14}
                strokeWidth={1.8}
                className={clsx(
                  styles.chevron,
                  megaMenu ===
                    "marcas" &&
                    styles.chevronOpen,
                )}
              />
            </button>


            {/* NORMAL NAV */}

            {navigation.map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className={clsx(
                    styles.navLink,
                    active(
                      item.href,
                    ) &&
                      styles.active,
                  )}
                  aria-current={
                    active(
                      item.href,
                    )
                      ? "page"
                      : undefined
                  }
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>


          {/* =============================================
              ACTIONS
          ============================================== */}

          <div
            className={
              styles.actions
            }
          >
            <div
              className={
                styles.theme
              }
            >
              <ThemeToggle />
            </div>

            <a
              href={whatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              className={
                styles.whatsapp
              }
            >
              <MessageCircle
                size={17}
                strokeWidth={1.8}
              />

              <span>
                WhatsApp
              </span>

              <ArrowRight
                size={15}
                strokeWidth={1.8}
              />
            </a>


            {/* MOBILE TRIGGER */}

            <button
              ref={mobileButton}
              type="button"
              className={
                styles.mobileTrigger
              }
              aria-expanded={
                mobileOpen
              }
              aria-controls="morgillo-mobile-navigation"
              aria-label={
                mobileOpen
                  ? "Cerrar menú"
                  : "Abrir menú"
              }
              onClick={() => {
                setMobileOpen(
                  (current) =>
                    !current,
                );

                setMegaMenu(null);
              }}
            >
              {mobileOpen ? (
                <X
                  size={21}
                  strokeWidth={1.8}
                />
              ) : (
                <Menu
                  size={22}
                  strokeWidth={1.8}
                />
              )}
            </button>
          </div>
        </div>
      </div>


      {/* =================================================
          MEGA MENU
      ================================================== */}

      <AnimatePresence>
        {megaMenu && (
          <motion.div
            id="morgillo-mega-menu"
            className={
              styles.mega
            }
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    y: -8,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -6,
            }}
            transition={{
              duration: 0.22,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          >
            <div className="morgillo-container">
              <div
                className={
                  styles.megaGrid
                }
              >
                {/* INTRO */}

                <div
                  className={
                    styles.megaIntro
                  }
                >
                  <span>
                    {megaMenu ===
                    "maquinaria"
                      ? "CATÁLOGO"
                      : "MARCAS"}
                  </span>

                  <h2>
                    {megaMenu ===
                    "maquinaria"
                      ? "Encuentra el equipo para tu trabajo."
                      : "Marcas para cada tipo de operación."}
                  </h2>

                  <Link
                    href={
                      megaMenu ===
                      "maquinaria"
                        ? "/maquinaria"
                        : "/marcas"
                    }
                    onClick={
                      closeMenus
                    }
                  >
                    {megaMenu ===
                    "maquinaria"
                      ? "Ver catálogo completo"
                      : "Ver todas las marcas"}

                    <ArrowRight
                      size={16}
                      strokeWidth={
                        1.8
                      }
                    />
                  </Link>
                </div>


                {/* ITEMS */}

                <div
                  className={
                    styles.megaItems
                  }
                >
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
                            className={
                              styles.megaItem
                            }
                          >
                            <span
                              className={
                                styles.megaNumber
                              }
                            >
                              {String(
                                index +
                                  1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <div>
                              <small>
                                {
                                  category.brand
                                }
                              </small>

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

                            <ArrowRight
                              size={18}
                              strokeWidth={
                                1.7
                              }
                            />
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
                            className={clsx(
                              styles.megaItem,
                              styles[
                                `brand-${brand.id}`
                              ],
                            )}
                          >
                            <span
                              className={
                                styles.megaNumber
                              }
                            >
                              {String(
                                index +
                                  1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <div>
                              <small>
                                {
                                  brand.area
                                }
                              </small>

                              <strong>
                                {
                                  brand.name
                                }
                              </strong>

                              <p>
                                Explorar equipos y
                                soluciones de la
                                marca.
                              </p>
                            </div>

                            <ArrowRight
                              size={18}
                              strokeWidth={
                                1.7
                              }
                            />
                          </Link>
                        ),
                      )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* =================================================
          MOBILE NAV
      ================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="morgillo-mobile-navigation"
            className={
              styles.mobilePanel
            }
            initial={
              reducedMotion
                ? false
                : {
                    opacity: 0,
                    x: 25,
                  }
            }
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 20,
            }}
            transition={{
              duration: 0.28,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          >
            <div
              className={clsx(
                "morgillo-container",
                styles.mobileInner,
              )}
            >
              <div
                className={
                  styles.mobileTop
                }
              >
                <span>
                  Navegación
                </span>

                <small>
                  MRG / MENU
                </small>
              </div>


              <nav
                className={
                  styles.mobileNav
                }
                aria-label="Navegación móvil"
              >
                <Link
                  href="/"
                  onClick={
                    closeMenus
                  }
                >
                  <span>
                    01
                  </span>

                  Inicio

                  <ArrowRight
                    size={17}
                  />
                </Link>


                {/* MOBILE MACHINERY */}

                <div
                  className={
                    styles.mobileGroup
                  }
                >
                  <button
                    type="button"
                    aria-expanded={
                      mobileGroup ===
                      "maquinaria"
                    }
                    onClick={() =>
                      setMobileGroup(
                        (
                          current,
                        ) =>
                          current ===
                          "maquinaria"
                            ? null
                            : "maquinaria",
                      )
                    }
                  >
                    <span>
                      02
                    </span>

                    Maquinaria

                    <ChevronDown
                      size={17}
                      className={clsx(
                        mobileGroup ===
                          "maquinaria" &&
                          styles.mobileChevronOpen,
                      )}
                    />
                  </button>

                  <AnimatePresence
                    initial={false}
                  >
                    {mobileGroup ===
                      "maquinaria" && (
                      <motion.div
                        className={
                          styles.mobileChildren
                        }
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height:
                            "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                      >
                        <Link
                          href="/maquinaria"
                          onClick={
                            closeMenus
                          }
                        >
                          Todo el catálogo
                        </Link>

                        {categories.map(
                          (
                            category,
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
                              {
                                category.name
                              }

                              <small>
                                {
                                  category.brand
                                }
                              </small>
                            </Link>
                          ),
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>


                {/* MOBILE BRANDS */}

                <div
                  className={
                    styles.mobileGroup
                  }
                >
                  <button
                    type="button"
                    aria-expanded={
                      mobileGroup ===
                      "marcas"
                    }
                    onClick={() =>
                      setMobileGroup(
                        (
                          current,
                        ) =>
                          current ===
                          "marcas"
                            ? null
                            : "marcas",
                      )
                    }
                  >
                    <span>
                      03
                    </span>

                    Marcas

                    <ChevronDown
                      size={17}
                      className={clsx(
                        mobileGroup ===
                          "marcas" &&
                          styles.mobileChevronOpen,
                      )}
                    />
                  </button>

                  <AnimatePresence
                    initial={false}
                  >
                    {mobileGroup ===
                      "marcas" && (
                      <motion.div
                        className={
                          styles.mobileChildren
                        }
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height:
                            "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                      >
                        {brands.map(
                          (
                            brand,
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
                              {
                                brand.name
                              }

                              <small>
                                {
                                  brand.area
                                }
                              </small>
                            </Link>
                          ),
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>


                {navigation.map(
                  (
                    item,
                    index,
                  ) => (
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
                    >
                      <span>
                        {String(
                          index +
                            4,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      {
                        item.label
                      }

                      <ArrowRight
                        size={17}
                      />
                    </Link>
                  ),
                )}
              </nav>


              <div
                className={
                  styles.mobileFooter
                }
              >
                <a
                  href={whatsapp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    styles.mobileWhatsapp
                  }
                >
                  <MessageCircle
                    size={18}
                    strokeWidth={
                      1.8
                    }
                  />

                  Consultar por
                  WhatsApp

                  <ArrowRight
                    size={17}
                  />
                </a>

                <div>
                  <span>
                    Morgillo
                  </span>

                  <small>
                    Tarapoto · San
                    Martín
                  </small>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}