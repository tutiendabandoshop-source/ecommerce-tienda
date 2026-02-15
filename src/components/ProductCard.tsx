"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number | null;
  isPreOrder?: boolean;
  preOrderDays?: string | null;
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
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isAvailable = isPreOrder || (stock ?? 0) > 0;

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

  const stockText = isPreOrder
    ? "Sobre pedido"
    : (stock ?? 0) > 0
      ? `${stock} disponibles`
      : "Agotado";

  return (
    <div
      className="group relative flex flex-col h-full w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border-2 border-gray-100 hover:-translate-y-2 hover:scale-[1.02] duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen - proporción fija */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-bg-light to-gray-100 shrink-0">
        <Link href={`/shop/${slug}`} className="block w-full h-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className={`object-cover transition-transform duration-700 ease-out ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              sizes="(max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {isPreOrder ? (
            <span className="bg-orange-500/90 text-white px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Sobre pedido
            </span>
          ) : (stock ?? 0) === 0 ? (
            <span className="bg-accent-soft text-white px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Agotado
            </span>
          ) : (stock ?? 0) <= 5 ? (
            <span className="bg-warning text-secondary-dark px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Últimas {(stock ?? 0)}
            </span>
          ) : null}
        </div>
        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <Link
            href={`/shop/${slug}`}
            className="bg-white text-secondary-dark p-3 rounded-full shadow-xl hover:bg-primary hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pointer-events-auto"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Contenido - flex-grow para distribuir espacio */}
      <div className="p-3 flex flex-col flex-grow min-h-0">
        <Link href={`/shop/${slug}`} className="mb-2">
          <h3 className="font-semibold text-sm lg:text-base text-secondary-dark leading-tight line-clamp-2 h-10 lg:h-12 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
        </Link>

        <p className="text-lg lg:text-xl font-bold text-primary mb-1">
          ${price.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
          <span className="text-[10px] lg:text-xs font-bold text-gray-400">MXN</span>
        </p>

        <p className={`text-xs h-4 mb-3 flex items-center gap-1.5 ${isPreOrder ? "text-orange-600 font-medium" : (stock ?? 0) > 0 ? "text-gray-600" : "text-gray-500"}`}>
          {isPreOrder ? (
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
          ) : (stock ?? 0) > 0 ? (
            <span className="w-1.5 h-1.5 bg-[#2A9D8F] rounded-full animate-pulse shrink-0" />
          ) : null}
          {stockText}
        </p>

        {/* Botones - siempre al fondo con mt-auto */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={handleWhatsAppRedirect}
            className="w-full py-2 px-3 text-sm font-semibold flex items-center justify-center gap-2 rounded-lg bg-whatsapp text-white hover:bg-[#128C7E] transition-all duration-300 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAdding}
            className={`w-full py-2 px-3 text-sm font-semibold flex items-center justify-center gap-2 rounded-lg transition-all duration-300 active:scale-95 ${
              isAdding
                ? "bg-action text-white"
                : "bg-primary text-white hover:opacity-90"
            } disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed`}
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Agregando...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{!isAvailable ? "Agotado" : "Agregar"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
}