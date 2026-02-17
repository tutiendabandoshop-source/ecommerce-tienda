"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, CheckCircle, ShoppingCart } from "lucide-react";

interface CartToastProps {
  show: boolean;
  productName: string;
  productImage: string | null;
  onClose: () => void;
  onViewCart: () => void;
}

export default function CartToast({
  show,
  productName,
  productImage,
  onClose,
  onViewCart,
}: CartToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-[100] transition-all duration-300 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-100 p-4 min-w-[300px] max-w-[360px] sm:min-w-[320px] sm:max-w-[380px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
            <span className="font-semibold text-secondary-dark">
              Agregado al carrito
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {productImage ? (
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-700 line-clamp-2 flex-1 min-w-0">
            {productName}
          </p>
        </div>

        {/* Action Button - paleta Áurea */}
        <button
          type="button"
          onClick={() => {
            onViewCart();
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="w-full bg-secondary-dark hover:bg-secondary-dark/90 text-white py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <ShoppingCart className="h-4 w-4" />
          Ver carrito
        </button>
      </div>
    </div>
  );
}
