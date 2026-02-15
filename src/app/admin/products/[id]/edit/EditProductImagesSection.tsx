'use client';

import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import ImageStudioModal, { ImageData } from '@/components/admin/ImageStudioModal';

interface EditProductImagesSectionProps {
  initialImages: string[];
}

export default function EditProductImagesSection({ initialImages }: EditProductImagesSectionProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioImages, setStudioImages] = useState<ImageData[]>([]);

  // Sincronizar con initialImages cuando cambien (ej. navegación)
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const openModal = () => {
    setStudioImages(
      images.map((url, i) => ({
        id: `existing-${i}-${url.slice(-12)}`,
        url,
        isPrimary: i === 0,
      }))
    );
    setStudioOpen(true);
  };

  return (
    <>
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Imágenes del Producto
        </label>

        <button
          type="button"
          onClick={openModal}
          className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-orange-500/30 flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Gestionar Imágenes ({images.length})
        </button>

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {images.slice(0, 4).map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Imagen ${idx + 1}`}
                className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
              />
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          {images.length === 0
            ? 'Aún no has agregado imágenes. Máximo 8 imágenes.'
            : `${images.length}/8 imágenes • La primera es la principal`}
        </p>

        {/* Envía el array al server action como JSON */}
        <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />
      </div>

      <ImageStudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        images={studioImages}
        onSave={async (savedImages) => {
          const urls = savedImages.map((img) => img.url);
          setImages(urls);
          setStudioImages(savedImages);
        }}
        maxImages={8}
        title="Imágenes del Producto"
      />
    </>
  );
}
