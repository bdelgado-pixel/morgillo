"use client";

import Image from "next/image";
import { useState } from "react";

import type { MediaAsset } from "@/types/content";

import styles from "./Gallery.module.css";

export default function Gallery({
  images,
}: {
  images: MediaAsset[];
}) {
  const validImages = images.filter((image) => image.kind === "image");
  const [selected, setSelected] = useState(0);

  const safeSelected = validImages.length
    ? Math.min(selected, validImages.length - 1)
    : 0;

  const asset = validImages[safeSelected];

  /* =========================================================
     EMPTY
  ========================================================= */

  if (!asset) {
    return (
      <div className={styles.empty}>
        <div aria-hidden="true">IMG</div>

        <span>Imagen pendiente</span>

        <p>La imagen del equipo podrá actualizarse desde el CMS.</p>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      {/* =================================================
          MAIN IMAGE
      ================================================== */}

      <div className={styles.stage}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.circle} aria-hidden="true" />

        <Image
          key={asset.id}
          src={asset.url}
          alt={asset.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 56vw"
          className={styles.image}
          preload={safeSelected === 0}
        />

        <div className={styles.top}>
          <div>
            <span />
            <strong>Vista del equipo</strong>
          </div>

          <span>
            {String(safeSelected + 1).padStart(2, "0")}
            {" / "}
            {String(validImages.length).padStart(2, "0")}
          </span>
        </div>

        <div className={styles.bottom}>
          <span>Imagen de producto</span>
          <span>Morgillo</span>
        </div>
      </div>

      {/* =================================================
          THUMBNAILS
      ================================================== */}

      {validImages.length > 1 && (
        <div
          className={styles.thumbnails}
          role="group"
          aria-label="Imágenes del producto"
        >
          {validImages.map((image, index) => {
            const active = index === safeSelected;

            return (
              <button
                key={image.id}
                type="button"
                aria-label={`Ver imagen ${index + 1} de ${validImages.length}`}
                aria-pressed={active}
                className={active ? styles.activeThumbnail : styles.thumbnail}
                onClick={() => setSelected(index)}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="110px"
                  className={styles.thumbnailImage}
                />

                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
