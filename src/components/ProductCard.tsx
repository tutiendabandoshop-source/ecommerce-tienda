"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number | null;
  isPreOrder?: boolean;
  preOrderDays?: string | null;
  /** Si true, muestra badge "Nuevo". */
  isNew?: boolean;
  /** Si se pasa, se muestra este texto en el badge (ej. "Nuevo", "Destacado"). Si no, con isNew se muestra "Nuevo". */
  badgeLabel?: string | null;
  /** Precio anterior para mostrar tachado (opcional). */
  compareAtPrice?: number | null;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  imageUrl,
  stock,
  isPreOrder = false,
  preOrderDays = null,
  isNew = false,
  badgeLabel = null,
  compareAtPrice = null,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const mainImage = imageUrl ?? "/placeholder.jpg";
  const hasStock = (stock ?? 0) > 0;
  const isAvailable = isPreOrder || hasStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem({
      id,
      name,
      slug,
      price,
      imageUrl,
      stock: isPreOrder ? 999 : (stock ?? 0),
      isPreOrder,
      preOrderDays,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const preOrderText = isPreOrder ? ` (⚠️ Sobre pedido: ${preOrderDays || "consultar"})` : "";
    const message =
      `Hola Áurea, me interesa el producto: *${name}*${preOrderText}\n\n` +
      `Precio: $${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n` +
      "¿Está disponible?";
    window.open(`https://wa.me/5219516111552?text=${encodeURIComponent(message)}`, "_blank");
  };

  const stockLabel =
    isPreOrder ? "Sobre pedido" : hasStock ? "Disponible" : "Agotado";
  const stockDotClass = isPreOrder
    ? "bg-warning"
    : hasStock
      ? "bg-success"
      : "bg-border";

  const showBadge = isNew || badgeLabel;
  const badgeText = badgeLabel ?? (isNew ? "Nuevo" : "");

  return (
    <div className="group product-card relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative aspect-square shrink-0 overflow-hidden">
        <Link href={`/shop/${slug}`} className="block h-full w-full">
          {imageUrl ? (
            <Image
              src={mainImage}
              alt={name}
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}
        </Link>
        {showBadge && badgeText && (
          <span
            className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10 rounded-full bg-[#E8C1C0]/20 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-[#CB997E] shadow-sm"
            aria-hidden
          >
            {badgeText}
          </span>
        )}
        {/* Móvil: botón WhatsApp flotante en esquina de la imagen */}
        <button
          type="button"
          onClick={handleWhatsApp}
          className="sm:hidden absolute bottom-2 right-2 z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#CB997E] bg-white/95 shadow-md backdrop-blur-sm text-[#CB997E] transition-all duration-300 hover:bg-[#CB997E]/10 tap-scale"
          aria-label="Consultar por WhatsApp"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col min-h-0 p-3 sm:p-4">
        <div className="flex-1 min-h-[72px] sm:min-h-[80px]">
          <Link href={`/shop/${slug}`}>
            <h3 className="font-serif text-base sm:text-xl text-[#2D2D2D] line-clamp-2 transition-colors duration-200 hover:text-[#c49a97]">
              {name}
            </h3>
          </Link>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-1 sm:gap-2">
            <div className="flex flex-col gap-0.5">
              {compareAtPrice != null && compareAtPrice > price && (
                <span className="font-sans text-xs sm:text-sm font-medium text-gray-500 line-through">
                  ${compareAtPrice.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
              <p className="font-sans text-base sm:text-lg font-bold text-[#2D2D2D]">
                ${price.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-500">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${stockDotClass}`}
                aria-hidden
              />
              {stockLabel}
            </span>
          </div>
        </div>

        {/* Móvil: solo Agregar full width. Desktop: dos botones */}
        <div className="mt-auto pt-2 sm:pt-3 flex flex-col sm:grid sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="hidden sm:flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border-2 border-[#CB997E] bg-transparent py-2 text-[#CB997E] text-sm font-medium transition-all duration-300 hover:bg-[#CB997E]/10 tap-scale"
            aria-label="Consultar por WhatsApp"
          >
            <WhatsAppIcon className="h-5 w-5 shrink-0" />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#CB997E] py-2.5 sm:py-2 text-white text-sm font-semibold transition-all duration-300 hover:bg-[#B58369] hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 tap-scale"
          >
            {isAdding ? (
              <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <ShoppingCart className="h-5 w-5 shrink-0" />
            )}
            <span>{!isAvailable ? "Agotado" : isAdding ? "..." : "Agregar"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
