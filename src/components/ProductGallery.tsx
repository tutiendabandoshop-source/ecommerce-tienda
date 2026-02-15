'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">Sin imágenes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Swiper
        modules={[Navigation, Pagination, Thumbs, FreeMode]}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active bg-[#FF5722]',
        }}
        navigation={images.length > 1}
        className="rounded-xl overflow-hidden aspect-square product-gallery-main"
        loop={images.length > 1}
        spaceBetween={10}
      >
        {images.map((url, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={url}
              alt={`${productName} - Imagen ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          className="thumbnails-swiper"
        >
          {images.map((url, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full aspect-square object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-[#FF5722] transition-all"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
