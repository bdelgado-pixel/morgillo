"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { MediaAsset } from "@/types/content";

export default function Gallery({ images, name = "Equipo Morgillo" }: {
  images: MediaAsset[];
  name?: string;
}) {
  const [selected, setSelected] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = selected < images.length ? selected : 0;
  const asset = images[current];

  function select(index: number, focus = false) {
    if (!images.length) return;
    const next = (index + images.length) % images.length;
    setSelected(next);
    if (focus) thumbs.current[next]?.focus({ preventScroll: true });
    thumbs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  }

  if (!asset) {
    return <div className="morgillo-gallery morgillo-gallery--empty">
      <span>Imagen pendiente</span><strong>MORGILLO</strong>
      <p>{name}</p>
    </div>;
  }

  return (
    <section className="morgillo-gallery" aria-label={`Imágenes de ${name}`}>
      <div className="morgillo-gallery__main"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchCancel={() => { touchStart.current = null; }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - start.x;
          const dy = touch.clientY - start.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) select(current + (dx < 0 ? 1 : -1));
        }}>
        <Image src={asset.url} alt={asset.alt || name} fill
          sizes="(max-width: 900px) calc(100vw - 32px), (max-width: 1440px) 54vw, 760px"
          className="morgillo-gallery__image" priority={current === 0} />
        <span className="morgillo-gallery__brand-accent" aria-hidden="true" />
      </div>
      <div className="morgillo-gallery__toolbar">
        <p className="morgillo-gallery__counter" aria-live="polite" aria-atomic="true">
          <strong>{String(current + 1).padStart(2, "0")}</strong>
          <span>/ {String(images.length).padStart(2, "0")}</span>
          <span>Galería del equipo</span>
        </p>
        {images.length > 1 && <div className="morgillo-gallery__arrows">
          <button type="button" onClick={() => select(current - 1)} aria-label="Imagen anterior">←</button>
          <button type="button" onClick={() => select(current + 1)} aria-label="Siguiente imagen">→</button>
        </div>}
      </div>
      {images.length > 1 && <div className="morgillo-gallery__thumbs" aria-label="Seleccionar imagen">
        {images.map((image, index) => (
          <button key={`${image.id}-${index}`} ref={(element) => { thumbs.current[index] = element; }}
            type="button" aria-label={`Ver imagen ${index + 1}: ${image.alt || name}`}
            aria-pressed={current === index} onClick={() => select(index)}
            onKeyDown={(event) => {
              const target = event.key === "ArrowLeft" ? index - 1 : event.key === "ArrowRight" ? index + 1 : event.key === "Home" ? 0 : event.key === "End" ? images.length - 1 : null;
              if (target !== null) { event.preventDefault(); select(target, true); }
            }} className={current === index ? "is-active" : ""}>
            <Image src={image.url} alt="" fill sizes="96px" className="morgillo-gallery__thumb-image" />
          </button>
        ))}
      </div>}
    </section>
  );
}
