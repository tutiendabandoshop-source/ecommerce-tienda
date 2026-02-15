"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface FeaturedProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number | null;
  createdAt: string;
  isPreOrder?: boolean;
  preOrderDays?: string | null;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NEW_PRODUCT_DAYS = 7;

function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return (now - created) / MS_PER_DAY < NEW_PRODUCT_DAYS;
}

export default function FeaturedProductCard({
  id,
  name,
  slug,
  price,
  imageUrl,
  stock,
  createdAt,
  isPreOrder = false,
  preOrderDays = null,
}: FeaturedProductCardProps) {
  const { addItem } = useCart();
  const imgRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const showNewBadge = isNewProduct(createdAt);
  const isAvailable = isPreOrder || (stock ?? 0) > 0;

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsInView(true);
      },
      { rootMargin: "50px", threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const handleWhatsAppRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const preOrderText = isPreOrder ? ` (⚠️ Sobre pedido: ${preOrderDays || "consultar"})` : "";
    const message =
      `Hola, me interesa el producto: *${name}*${preOrderText}\n\n` +
      `Precio: $${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n` +
      "¿Está disponible?";
    window.open(`https://wa.me/5219516111552?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div
      ref={imgRef}
      className="group flex-shrink-0 snap-center overflow-hidden rounded-[20px] border-2 border-gray-100 bg-white shadow-[0_2px_12px_rgba(38,70,83,0.08)] transition-all duration-500 hover-capable:hover:-translate-y-2 hover-capable:hover:scale-[1.02] hover-capable:hover:border-primary/20 hover-capable:hover:shadow-[0_12px_32px_rgba(255,87,34,0.18)] w-[240px] md:min-w-0 md:w-auto"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-bg-light to-gray-100 md:h-64">
        <Link href={`/shop/${slug}`} className="block h-full w-full">
          {imageUrl && isInView ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 ease-out hover-capable:group-hover:scale-110"
              sizes="(max-width: 768px) 240px, (max-width: 1024px) 50vw, 25vw"
              loading="lazy"
            />
          ) : imageUrl ? (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}
        </Link>

        <div className="absolute left-2 top-2 flex flex-col gap-1.5 pointer-events-none md:left-3 md:top-3 md:gap-2">
          {showNewBadge && (
            <span className="rounded-full bg-[#FF5722] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              NUEVO
            </span>
          )}
          {isPreOrder ? (
            <span className="rounded-full bg-orange-500/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              Sobre pedido
            </span>
          ) : (stock ?? 0) === 0 ? (
            <span className="rounded-full bg-accent-soft px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              Agotado
            </span>
          ) : (stock ?? 0) <= 5 ? (
            <span className="rounded-full bg-warning px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary-dark shadow-lg">
              Últimas {(stock ?? 0)}
            </span>
          ) : null}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none hover-capable:group-hover:opacity-100 hover-capable:group-hover:pointer-events-auto">
          <Link
            href={`/shop/${slug}`}
            className="pointer-events-auto translate-y-4 rounded-full bg-white p-3 text-secondary-dark shadow-xl transition-all duration-300 hover-capable:group-hover:translate-y-0 hover-capable:hover:bg-primary hover-capable:hover:text-white"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="p-3 md:p-5">
        <div className="mb-1 md:mb-2">
          <Link href={`/shop/${slug}`}>
            <h2 className="font-display min-h-[2rem] text-sm font-bold leading-tight text-secondary-dark line-clamp-2 transition-colors duration-300 md:min-h-[2.5rem] md:text-base lg:text-lg hover-capable:group-hover:text-primary">
              {name}
            </h2>
          </Link>
        </div>

        <div className="mt-1 flex flex-col gap-0.5 md:mt-2 md:gap-1">
          <div className="flex items-baseline gap-1">
            <span className="font-title text-lg tracking-tight text-secondary-dark md:text-xl lg:text-2xl">
              ${price.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] font-bold text-gray-400">MXN</span>
          </div>
          {isPreOrder ? (
            <div className="mb-2 flex items-center gap-1.5 md:mb-3">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-[11px] font-medium text-orange-600">
                Sobre pedido{preOrderDays ? ` (${preOrderDays})` : ""}
              </span>
            </div>
          ) : (stock ?? 0) > 0 ? (
            <div className="mb-2 flex items-center gap-1.5 md:mb-3">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2A9D8F]" />
              <span className="text-[11px] font-medium text-gray-500">{(stock ?? 0)} disponibles</span>
            </div>
          ) : null}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 md:mt-5 md:gap-3">
          <button
            onClick={handleWhatsAppRedirect}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-whatsapp py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(37,211,102,0.4)] transition-all duration-300 active:scale-95 md:min-h-[48px] md:py-3.5 md:text-base hover-capable:hover:scale-105 hover-capable:hover:bg-[#128C7E]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Hazlo Tuyo</span>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all duration-300 md:min-h-[48px] md:py-3 md:text-base ${
              isAdding
                ? "bg-action text-white"
                : "bg-gradient-to-r from-coral to-primary text-white shadow-[0_4px_14px_rgba(255,87,34,0.4)] active:scale-95 hover-capable:hover:from-primary hover-capable:hover:to-coral"
            } disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none`}
          >
            {isAdding ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Agregando...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>{!isAvailable ? "Agotado" : "Agregar"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
