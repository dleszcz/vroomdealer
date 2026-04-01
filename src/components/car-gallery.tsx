"use client";

import Image from "next/image";
import { useState } from "react";

interface CarGalleryProps {
  images: string[];
  alt: string;
}

export function CarGallery({ images, alt }: CarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="gallery__empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H9m-6-6h15m-6 0V6" />
        </svg>
        <p>Brak zdjęć</p>
      </div>
    );
  }

  return (
    <div className="gallery" id="car-gallery">
      {/* Main image */}
      <div className="gallery__main">
        <Image
          src={images[activeIndex]}
          alt={`${alt} — zdjęcie ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          style={{ objectFit: "cover" }}
          preload={activeIndex === 0}
          className="gallery__main-image"
        />
        {images.length > 1 && (
          <div className="gallery__counter">
            {activeIndex + 1} / {images.length}
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              className="gallery__nav gallery__nav--prev"
              onClick={() =>
                setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
              }
              aria-label="Poprzednie zdjęcie"
            >
              ‹
            </button>
            <button
              className="gallery__nav gallery__nav--next"
              onClick={() =>
                setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
              }
              aria-label="Następne zdjęcie"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="gallery__thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              className={`gallery__thumb ${i === activeIndex ? "gallery__thumb--active" : ""}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Zdjęcie ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} — miniatura ${i + 1}`}
                fill
                sizes="80px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
