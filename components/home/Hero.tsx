"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  ArrowRight,
  MessageCircle,
} from "lucide-react";

import {
  whatsapp,
} from "@/data/site";

import HeroScene, {
  type HeroMachine3D,
} from "./HeroScene";

import styles from "./Hero.module.css";


type HeroMachine =
  HeroMachine3D & {
    brand: string;
    modelName: string;
    sector: string;

    title: string;
    highlight: string;

    description: string;

    href: string;
  };


const AUTO_CHANGE_MS =
  9000;


const machines: HeroMachine[] = [
  {
    id: "kubota",

    brand: "KUBOTA",

    modelName:
      "M108S",

    sector:
      "Agricultura",

    model:
      "/models/M108S.glb",

    accent:
      "#f36f21",

    sectorAccent:
      "#4f812d",

    targetSize:
      5,

    baseRotationY:
      -0.24,

    rotationSpeed:
      0.15,

    title:
      "Potencia para hacer avanzar",

    highlight:
      "el campo.",

    description:
      "Maquinaria agrícola preparada para acompañar el trabajo diario, con respaldo comercial, repuestos y servicio Morgillo.",

    href:
      "/maquinaria?categoria=agricola",
  },


  {
    id: "kobelco",

    brand:
      "KOBELCO",

    modelName:
      "SK210LC",

    sector:
      "Construcción",

    model:
      "/models/SK210LC.glb",

    accent:
      "#00a6c7",

    sectorAccent:
      "#d99a16",

    targetSize:
      5.25,

    baseRotationY:
      -0.2,

    rotationSpeed:
      0.13,

    title:
      "Precisión para mover",

    highlight:
      "cada proyecto.",

    description:
      "Equipos para excavación y movimiento de tierra pensados para operaciones que necesitan rendimiento, control y continuidad.",

    href:
      "/maquinaria?categoria=construccion",
  },


  {
    id: "bull",

    brand:
      "BULL",

    modelName:
      "HD100",

    sector:
      "Trabajo pesado",

    model:
      "/models/HD100.glb",

    accent:
      "#f0b400",

    sectorAccent:
      "#d99a16",

    targetSize:
      5.2,

    baseRotationY:
      -0.2,

    rotationSpeed:
      0.14,

    title:
      "Versatilidad para responder",

    highlight:
      "en obra.",

    description:
      "Maquinaria para construcción y trabajo pesado con la versatilidad necesaria para responder a diferentes tareas en una misma operación.",

    href:
      "/maquinaria?categoria=construccion",
  },
];


type HeroStyle =
  CSSProperties & {
    "--machine-accent":
      string;

    "--sector-accent":
      string;
  };


export default function Hero() {
  const reducedMotion =
    useReducedMotion();


  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(0);


  const [
    requestedIndex,
    setRequestedIndex,
  ] =
    useState(0);


  const [
    initialReady,
    setInitialReady,
  ] =
    useState(false);


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    progress,
    setProgress,
  ] =
    useState(0);


  const [
    cycleKey,
    setCycleKey,
  ] =
    useState(0);


  const current =
    machines[
      currentIndex
    ];


  const requested =
    machines[
      requestedIndex
    ];


  const style: HeroStyle = {
    "--machine-accent":
      current.accent,

    "--sector-accent":
      current.sectorAccent,
  };


  /* =====================================================
     AUTO CHANGE
  ====================================================== */

  useEffect(() => {
    if (
      reducedMotion
    ) {
      return;
    }


    if (
      !initialReady
    ) {
      return;
    }


    if (
      requestedIndex !==
      currentIndex
    ) {
      return;
    }


    const timer =
      window.setTimeout(
        () => {
          setRequestedIndex(
            (currentIndex +
              1) %
              machines.length,
          );
        },
        AUTO_CHANGE_MS,
      );


    return () =>
      window.clearTimeout(
        timer,
      );
  }, [
    currentIndex,
    requestedIndex,
    initialReady,
    reducedMotion,
    cycleKey,
  ]);


  /* =====================================================
     MODEL EVENTS
  ====================================================== */

  const handleLoading =
    useCallback(
      (id: string) => {
        if (
          id !==
          requested.id
        ) {
          return;
        }


        setLoading(
          true,
        );


        setProgress(
          0,
        );
      },
      [
        requested.id,
      ],
    );


  const handleProgress =
    useCallback(
      (
        id: string,
        value: number,
      ) => {
        if (
          id !==
          requested.id
        ) {
          return;
        }


        setProgress(
          value,
        );
      },
      [
        requested.id,
      ],
    );


  const handleReady =
    useCallback(
      (id: string) => {
        const index =
          machines.findIndex(
            (item) =>
              item.id === id,
          );


        if (
          index < 0
        ) {
          return;
        }


        setCurrentIndex(
          index,
        );


        setRequestedIndex(
          index,
        );


        setLoading(
          false,
        );


        setProgress(
          100,
        );


        setInitialReady(
          true,
        );


        setCycleKey(
          (value) =>
            value + 1,
        );
      },
      [],
    );


  /*
    ESTE ES EL MANEJO DE ERROR ORIGINAL.

    No hace rollback raro.
    No cambia índices.
    No vuelve a cargar modelos.
  */

  const handleError =
    useCallback(
      (id: string) => {
        console.error(
          `No se pudo cargar el modelo 3D: ${id}`,
        );


        setLoading(
          false,
        );
      },
      [],
    );


  /* =====================================================
     MANUAL SELECTION
  ====================================================== */

  function selectMachine(
    index: number,
  ) {
    setCycleKey(
      (value) =>
        value + 1,
    );


    if (
      index ===
        currentIndex &&
      requestedIndex ===
        currentIndex
    ) {
      return;
    }


    setRequestedIndex(
      index,
    );
  }


  return (
    <section
      className={
        styles.hero
      }
      style={
        style
      }
      aria-labelledby="hero-title"
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
        <div
          className={
            styles.grid
          }
        />


        <motion.div
          className={
            styles.machineGlow
          }

          animate={{
            background:
              `radial-gradient(
                circle,
                ${current.accent}33 0%,
                ${current.accent}10 38%,
                transparent 70%
              )`,
          }}

          transition={{
            duration: 0.8,
          }}
        />


        <div
          className={
            styles.sectorGlow
          }
        />


        <div
          className={
            styles.diagonal
          }
        />


        <div
          className={
            styles.terrain
          }
        >
          <i />
          <i />
          <i />
        </div>
      </div>


      <div
        className={
          styles.edge
        }
        aria-hidden="true"
      />


      <div className="morgillo-container">
        <div
          className={
            styles.layout
          }
        >
          {/* =============================================
              TEXT
          ============================================== */}

          <div
            className={
              styles.copy
            }
          >
            <div
              className={
                styles.eyebrow
              }
            >
              <span />

              <p>
                {current.sector}
                {" "}
                · Morgillo
              </p>
            </div>


            <AnimatePresence
              mode="wait"
            >
              <motion.div
                key={
                  current.id
                }

                initial={
                  reducedMotion
                    ? false
                    : {
                        opacity: 0,
                        y: 18,
                      }
                }

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                exit={
                  reducedMotion
                    ? undefined
                    : {
                        opacity: 0,
                        y: -12,
                      }
                }

                transition={{
                  duration: 0.48,

                  ease: [
                    0.16,
                    1,
                    0.3,
                    1,
                  ],
                }}
              >
                <h1 id="hero-title">
                  {
                    current.title
                  }

                  <span>
                    {" "}
                    {
                      current.highlight
                    }
                  </span>
                </h1>


                <p
                  className={
                    styles.description
                  }
                >
                  {
                    current.description
                  }
                </p>
              </motion.div>
            </AnimatePresence>


            {/* =========================================
                ACTIONS
            ========================================== */}

            <div
              className={
                styles.actions
              }
            >
              <Link
                href={
                  current.href
                }
                className={
                  styles.primary
                }
              >
                Ver equipos

                <ArrowRight
                  size={19}
                  strokeWidth={
                    1.9
                  }
                />
              </Link>


              <a
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.secondary
                }
              >
                <MessageCircle
                  size={19}
                  strokeWidth={
                    1.8
                  }
                />

                Hablar con un asesor
              </a>
            </div>


            {/* =========================================
                CURRENT MACHINE
            ========================================== */}

            <div
              className={
                styles.machineIdentity
              }
            >
              <span />

              <div>
                <small>
                  {
                    current.sector
                  }
                </small>

                <strong>
                  {
                    current.brand
                  }
                  {" "}
                  {
                    current.modelName
                  }
                </strong>
              </div>
            </div>
          </div>


          {/* =============================================
              3D
          ============================================== */}

          <motion.div
            className={
              styles.visual
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

            transition={{
              duration: 0.8,

              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
          >
            <HeroScene
              machine={
                requested
              }

              reducedMotion={
                reducedMotion
              }

              className={
                styles.canvas
              }

              onLoading={
                handleLoading
              }

              onProgress={
                handleProgress
              }

              onReady={
                handleReady
              }

              onError={
                handleError
              }
            />


            {/* =========================================
                MODEL STATUS
            ========================================== */}

            <div
              className={
                styles.status
              }
            >
              <span
                className={
                  loading
                    ? styles.loadingDot
                    : styles.readyDot
                }
              />


              <div>
                <small>
                  {loading
                    ? "Preparando modelo"
                    : "Modelo 3D activo"}
                </small>


                <strong>
                  {loading
                    ? `${requested.brand} ${requested.modelName}`
                    : `${current.brand} ${current.modelName}`}
                </strong>
              </div>


              {loading && (
                <b>
                  {progress}%
                </b>
              )}
            </div>


            {/* =========================================
                360
            ========================================== */}

            <div
              className={
                styles.rotation
              }
            >
              <strong>
                360°
              </strong>

              <span />

              <p>
                Visualización 3D
              </p>
            </div>
          </motion.div>
        </div>


        {/* =================================================
            BRAND SWITCHER
        ================================================== */}

        <div
          className={
            styles.switcher
          }
        >
          <div
            className={
              styles.switcherLabel
            }
          >
            <span />

            <strong>
              Explora nuestras marcas
            </strong>
          </div>


          <div
            className={
              styles.machineButtons
            }
          >
            {machines.map(
              (
                machine,
                index,
              ) => {
                const active =
                  index ===
                  currentIndex;


                const pending =
                  index ===
                    requestedIndex &&
                  requestedIndex !==
                    currentIndex;


                return (
                  <button
                    key={
                      machine.id
                    }

                    type="button"

                    onClick={() =>
                      selectMachine(
                        index,
                      )
                    }

                    className={
                      active
                        ? styles.machineButtonActive
                        : styles.machineButton
                    }

                    style={
                      {
                        "--brand":
                          machine.accent,
                      } as CSSProperties
                    }

                    aria-pressed={
                      active
                    }
                  >
                    <span
                      className={
                        styles.brandMark
                      }
                    />


                    <span
                      className={
                        styles.brandCopy
                      }
                    >
                      <small>
                        {
                          machine.sector
                        }
                      </small>

                      <strong>
                        {
                          machine.brand
                        }
                      </strong>
                    </span>


                    <span
                      className={
                        styles.modelName
                      }
                    >
                      {
                        machine.modelName
                      }
                    </span>


                    {active &&
                      !reducedMotion &&
                      requestedIndex ===
                        currentIndex && (
                        <motion.i
                          key={`${machine.id}-${cycleKey}`}

                          className={
                            styles.autoProgress
                          }

                          initial={{
                            scaleX: 0,
                          }}

                          animate={{
                            scaleX: 1,
                          }}

                          transition={{
                            duration:
                              AUTO_CHANGE_MS /
                              1000,

                            ease:
                              "linear",
                          }}
                        />
                      )}


                    {pending && (
                      <i
                        className={
                          styles.pending
                        }
                      />
                    )}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}