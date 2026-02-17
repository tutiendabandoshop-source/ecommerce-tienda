'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-card-border/50 rounded-xl flex items-center justify-center">
        <p className="text-text-secondary">Sin imágenes</p>
      </div>
    );
  }

  const mainImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Imagen principal grande */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-card-border/30 group">
        <Image
          src={mainImage}
          alt={`${productName} - Imagen ${selectedIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Miniaturas debajo (si hay más de una) - táctiles: 72x72 en móvil */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide [-webkit-overflow-scrolling:touch]">
          {images.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative shrink-0 w-[72px] h-[72px] sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ease-out tap-scale ${
                selectedIndex === idx
                  ? 'border-terracota ring-2 ring-terracota/30 scale-[1.02]'
                  : 'border-border hover:border-terracota/50 active:scale-95'
              }`}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <Image
                src={url}
                alt={`Miniatura ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
