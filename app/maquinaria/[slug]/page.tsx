import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  FileText,
  MessageCircle,
} from "lucide-react";

import {
  getBrands,
  getCategories,
  getProduct,
  getProducts,
  getSite,
} from "@/lib/content";

import {
  whatsapp,
} from "@/data/site";

import Gallery from "@/components/catalog/Gallery";
import ProductCard from "@/components/catalog/ProductCard";

import styles from "./page.module.css";


type Props = {
  params: Promise<{
    slug: string;
  }>;
};


/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    slug,
  } =
    await params;


  const product =
    await getProduct(
      slug,
    );


  if (!product) {
    return {
      title:
        "Maquinaria | Morgillo",
    };
  }


  return {
    title: `${product.name} | Morgillo`,

    description:
      product.description,

    robots:
      product.mock
        ? {
            index: false,
            follow: true,
          }
        : undefined,

    alternates: {
      canonical:
        `/maquinaria/${product.slug}`,
    },
  };
}


/* =========================================================
   PAGE
========================================================= */

export default async function ProductPage({
  params,
}: Props) {
  const {
    slug,
  } =
    await params;


  const [
    product,
    products,
    categories,
    brands,
    site,
  ] =
    await Promise.all([
      getProduct(
        slug,
      ),

      getProducts(),

      getCategories(),

      getBrands(),

      getSite(),
    ]);


  /* =======================================================
     LEGACY CATEGORY URL

     /maquinaria/agricola
     ↓
     /maquinaria?categoria=agricola
  ======================================================= */

  if (
    categories.some(
      (category) =>
        category.id ===
        slug,
    )
  ) {
    redirect(
      `/maquinaria?categoria=${slug}`,
    );
  }


  if (!product) {
    notFound();
  }


  /* =======================================================
     CONTENT
  ======================================================= */

  const category =
    categories.find(
      (item) =>
        item.id ===
        product.category,
    );


  const brand =
    brands.find(
      (item) =>
        item.id
          .toLowerCase() ===
        product.brandId
          .toLowerCase(),
    );


  const documents =
    product.documents.filter(
      (document) =>
        document.kind ===
        "pdf",
    );


  const related =
    products
      .filter(
        (item) =>
          item.id !==
            product.id &&
          item.category ===
            product.category,
      )
      .slice(
        0,
        3,
      );


  const brandLabel =
    brand?.name ||
    product.brandId ||
    "Morgillo";


  const categoryLabel =
    category?.name ||
    product.category;


  const whatsappHref =
    whatsapp(
      `Hola, quisiera información sobre ${product.name}${
        product.model
          ? ` ${product.model}`
          : ""
      }.`,
      site.whatsapp,
    );


  return (
    <main
      className={
        styles.page
      }
    >
      {/* =================================================
          TOP / BREADCRUMB
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
              <Link
                href="/"
              >
                Inicio
              </Link>

              <span>
                /
              </span>

              <Link
                href="/maquinaria"
              >
                Maquinaria
              </Link>

              <span>
                /
              </span>

              <span
                aria-current="page"
              >
                {
                  product.name
                }
              </span>
            </nav>


            <Link
              href="/maquinaria"
              className={
                styles.back
              }
            >
              <ArrowLeft
                size={17}
                strokeWidth={1.8}
              />

              Volver al catálogo
            </Link>
          </div>
        </div>
      </section>


      {/* =================================================
          MOCK NOTICE
      ================================================== */}

      {product.mock && (
        <section
          className={
            styles.demoSection
          }
        >
          <div className="morgillo-container">
            <div
              className={
                styles.demo
              }
            >
              <span />

              <p>
                Esta ficha utiliza
                información de
                demostración. Los datos
                definitivos pueden ser
                actualizados desde el
                CMS.
              </p>
            </div>
          </div>
        </section>
      )}


      {/* =================================================
          PRODUCT HERO
      ================================================== */}

      <section
        className={
          styles.product
        }
      >
        <div className="morgillo-container">
          <div
            className={
              styles.productGrid
            }
          >
            {/* =============================================
                GALLERY
            ============================================== */}

            <div
              className={
                styles.galleryColumn
              }
            >
              <Gallery
                images={
                  product.images
                }
              />
            </div>


            {/* =============================================
                INFORMATION
            ============================================== */}

            <div
              className={
                styles.info
              }
              data-brand={
                product.brandId.toLowerCase()
              }
            >
              <div
                className={
                  styles.infoTop
                }
              >
                <div
                  className={
                    styles.brand
                  }
                >
                  <span />

                  <strong>
                    {
                      brandLabel
                    }
                  </strong>
                </div>


                <span
                  className={
                    styles.code
                  }
                >
                  MRG / EQUIPMENT
                </span>
              </div>


              <div
                className={
                  styles.heading
                }
              >
                <p>
                  {
                    categoryLabel
                  }
                </p>


                <h1>
                  {
                    product.name
                  }
                </h1>


                {product.model && (
                  <div
                    className={
                      styles.model
                    }
                  >
                    <span>
                      Modelo
                    </span>

                    <strong>
                      {
                        product.model
                      }
                    </strong>
                  </div>
                )}
              </div>


              <p
                className={
                  styles.description
                }
              >
                {
                  product.description
                }
              </p>


              {/* =========================================
                  QUICK DATA
              ========================================== */}

              <dl
                className={
                  styles.quickData
                }
              >
                <div>
                  <dt>
                    Marca
                  </dt>

                  <dd>
                    {
                      brandLabel
                    }
                  </dd>
                </div>


                <div>
                  <dt>
                    Categoría
                  </dt>

                  <dd>
                    {
                      categoryLabel
                    }
                  </dd>
                </div>


                <div>
                  <dt>
                    Especificaciones
                  </dt>

                  <dd>
                    {
                      product
                        .specifications
                        .length
                    }
                  </dd>
                </div>
              </dl>


              {/* =========================================
                  CTA
              ========================================== */}

              <div
                className={
                  styles.actions
                }
              >
                <a
                  href={
                    whatsappHref
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    styles.primaryAction
                  }
                >
                  <div>
                    <MessageCircle
                      size={20}
                      strokeWidth={1.8}
                    />

                    <span>
                      Consultar este
                      equipo
                    </span>
                  </div>


                  <span
                    className={
                      styles.primaryArrow
                    }
                  >
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.8}
                    />
                  </span>
                </a>


                <Link
                  href="/contacto"
                  className={
                    styles.secondaryAction
                  }
                >
                  Otros canales de
                  contacto

                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.8}
                  />
                </Link>
              </div>


              {/* =========================================
                  SUPPORT
              ========================================== */}

              <div
                className={
                  styles.support
                }
              >
                <span />

                <p>
                  Asesoría · repuestos ·
                  servicio técnico
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          SPECIFICATIONS
      ================================================== */}

      <section
        className={
          styles.specifications
        }
        aria-labelledby="specifications-title"
      >
        <div className="morgillo-container">
          <div
            className={
              styles.sectionHeader
            }
          >
            <div>
              <div
                className={
                  styles.sectionEyebrow
                }
              >
                <span>
                  01
                </span>

                <i />

                <p>
                  Datos técnicos
                </p>
              </div>


              <h2
                id="specifications-title"
              >
                Especificaciones
                <span>
                  {" "}
                  técnicas.
                </span>
              </h2>
            </div>


            <p>
              Consulta las
              características
              disponibles para este
              equipo.
            </p>
          </div>


          {product
            .specifications
            .length >
          0 ? (
            <dl
              className={
                styles.specList
              }
            >
              {product.specifications.map(
                (
                  specification,
                  index,
                ) => (
                  <div
                    key={`${specification.label}-${index}`}
                  >
                    <span
                      className={
                        styles.specNumber
                      }
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>


                    <dt>
                      {
                        specification.label
                      }
                    </dt>


                    <dd>
                      {
                        specification.value
                      }

                      {specification.unit
                        ? ` ${specification.unit}`
                        : ""}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          ) : (
            <div
              className={
                styles.emptySpecs
              }
            >
              <span />

              <div>
                <strong>
                  Información técnica
                  disponible bajo
                  consulta.
                </strong>

                <p>
                  Nuestro equipo puede
                  brindarte las
                  características del
                  modelo y ayudarte a
                  validar si se adapta a
                  tu operación.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* =================================================
          DOCUMENTS
      ================================================== */}

      <section
        className={
          styles.documents
        }
        aria-labelledby="documents-title"
      >
        <div className="morgillo-container">
          <div
            className={
              styles.documentsGrid
            }
          >
            <div
              className={
                styles.documentsIntro
              }
            >
              <div
                className={
                  styles.sectionEyebrow
                }
              >
                <span>
                  02
                </span>

                <i />

                <p>
                  Documentación
                </p>
              </div>


              <h2
                id="documents-title"
              >
                Información para
                <span>
                  {" "}
                  revisar con detalle.
                </span>
              </h2>


              <p>
                Descarga la
                documentación técnica
                que haya sido publicada
                para este equipo.
              </p>
            </div>


            <div
              className={
                styles.documentList
              }
            >
              {documents.length >
              0 ? (
                documents.map(
                  (
                    document,
                    index,
                  ) => (
                    <a
                      key={
                        document.id
                      }
                      href={
                        document.url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        styles.document
                      }
                    >
                      <span
                        className={
                          styles.documentNumber
                        }
                      >
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>


                      <div
                        className={
                          styles.documentIcon
                        }
                      >
                        <FileText
                          size={22}
                          strokeWidth={1.7}
                        />
                      </div>


                      <div
                        className={
                          styles.documentInfo
                        }
                      >
                        <span>
                          Documento PDF
                        </span>

                        <strong>
                          {
                            document.alt ||
                            "Ficha técnica"
                          }
                        </strong>
                      </div>


                      <div
                        className={
                          styles.download
                        }
                      >
                        <Download
                          size={19}
                          strokeWidth={1.8}
                        />
                      </div>
                    </a>
                  ),
                )
              ) : (
                <div
                  className={
                    styles.noDocuments
                  }
                >
                  <FileText
                    size={27}
                    strokeWidth={1.6}
                  />

                  <div>
                    <strong>
                      Documentación
                      pendiente.
                    </strong>

                    <p>
                      Consulta la ficha
                      técnica con un
                      asesor Morgillo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          COMMERCIAL CTA
      ================================================== */}

      <section
        className={
          styles.commercial
        }
      >
        <div className="morgillo-container">
          <div
            className={
              styles.commercialInner
            }
          >
            <div>
              <span>
                ¿Este equipo puede
                funcionar para tu
                operación?
              </span>

              <h2>
                Conversemos sobre lo
                que necesitas hacer.
              </h2>
            </div>


            <a
              href={
                whatsappHref
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar disponibilidad

              <ArrowUpRight
                size={20}
                strokeWidth={1.8}
              />
            </a>
          </div>
        </div>
      </section>


      {/* =================================================
          RELATED
      ================================================== */}

      {related.length >
        0 && (
        <section
          className={
            styles.related
          }
          aria-labelledby="related-title"
        >
          <div className="morgillo-container">
            <div
              className={
                styles.relatedHeader
              }
            >
              <div>
                <div
                  className={
                    styles.sectionEyebrow
                  }
                >
                  <span>
                    03
                  </span>

                  <i />

                  <p>
                    También puedes
                    explorar
                  </p>
                </div>


                <h2
                  id="related-title"
                >
                  Más equipos de
                  <span>
                    {" "}
                    {
                      categoryLabel
                    }.
                  </span>
                </h2>
              </div>


              <Link
                href={`/maquinaria?categoria=${product.category}`}
              >
                Ver categoría

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
                (item) => (
                  <ProductCard
                    key={
                      item.id
                    }
                    product={
                      item
                    }
                  />
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}