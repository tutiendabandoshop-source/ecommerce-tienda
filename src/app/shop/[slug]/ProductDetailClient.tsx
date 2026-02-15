'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import ProductGallery from '@/components/ProductGallery';

interface Variant {
  id: string;
  color: string | null;
  size: string | null;
  sku: string | null;
  price: number | null;
  stock: number;
  imageUrl: string | null;
  images: string[];
}

interface ProductSpec {
  id: string;
  key: string;
  value: string;
  order: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  stock: number;
  isPreOrder?: boolean;
  preOrderDays?: string | null;
  images: string[];
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
  };
  variants: Variant[];
  specifications?: ProductSpec[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasVariants = product.variants && product.variants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);

  const colors = hasVariants
    ? Array.from(
        new Set(product.variants.filter((v) => v.color).map((v) => v.color))
      )
    : [];

  const sizes = hasVariants
    ? Array.from(
        new Set(product.variants.filter((v) => v.size).map((v) => v.size))
      )
    : [];

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock ?? product.stock ?? 0;
  const currentImage = selectedVariant?.imageUrl || product.imageUrl;
  const baseImages =
    selectedVariant && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.images ?? [];
  const galleryImages =
    baseImages.length > 0 ? baseImages : currentImage ? [currentImage] : [];
  const galleryProductName =
    selectedVariant
      ? `${product.name}${selectedVariant.color ? ` - ${selectedVariant.color}` : ''}${selectedVariant.size ? ` - ${selectedVariant.size}` : ''}`
      : product.name;

  const hasVariantWithStock = Boolean(selectedVariant && selectedVariant.stock > 0);
  const isPreOrder = hasVariantWithStock ? false : (product.isPreOrder ?? false);
  const stockForDisplay = hasVariantWithStock ? currentStock : (product.stock ?? 0);
  const displayStock = hasVariantWithStock ? currentStock : stockForDisplay;
  const canAddToCart = isPreOrder || currentStock > 0;

  const handleVariantClick = (variant: Variant) => {
    if (selectedVariant?.id === variant.id) {
      setSelectedVariant(null);
    } else {
      setSelectedVariant(variant);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPrice,
        imageUrl: currentImage,
        stock: isPreOrder ? 999 : currentStock,
        variantId: selectedVariant?.id,
        variantDetails: selectedVariant
          ? `${selectedVariant.color || ''}${selectedVariant.color && selectedVariant.size ? ' - ' : ''}${selectedVariant.size || ''}`.trim()
          : undefined,
        isPreOrder,
        preOrderDays: product.preOrderDays,
      },
      quantity
    );
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWhatsAppRedirect = () => {
    const preOrderText = isPreOrder
      ? ` (⚠️ Sobre pedido: ${product.preOrderDays || "consultar"})`
      : "";
    const variantDetails = selectedVariant
      ? `, Variante: ${selectedVariant.color || ''}${selectedVariant.color && selectedVariant.size ? ' - ' : ''}${selectedVariant.size || ''}`.trim()
      : '';
    const message =
      `Hola, me interesa el producto: *${product.name}*${preOrderText}${variantDetails}\n\n` +
      `Precio: $${currentPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n` +
      `Cantidad: ${quantity}\n\n¿Está disponible?`;
    window.open(`https://wa.me/5219516111552?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* COLUMNA IZQUIERDA: Galería (sticky en desktop) */}
        <div className="h-fit md:sticky md:top-24">
          <ProductGallery
            images={galleryImages}
            productName={galleryProductName}
          />
        </div>

        {/* COLUMNA DERECHA: Info del producto */}
        <div className="space-y-8">
          {/* Category Badge */}
          <div>
            <Link
              href={`/shop?category=${product.category.id}`}
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-colors"
            >
              {product.category.name}
            </Link>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-tight text-gray-900">
            {product.name}
          </h1>

          {/* Stock Badge */}
          {isPreOrder ? (
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-700 px-4 py-2.5 rounded-xl font-bold">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
              Sobre pedido{product.preOrderDays ? ` (${product.preOrderDays})` : ''}
            </div>
          ) : displayStock > 0 ? (
            displayStock <= 5 ? (
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="font-bold text-sm">
                  ¡Últimas {displayStock} unidades!
                </span>
              </div>
            ) : displayStock <= 15 ? (
              <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2.5 rounded-xl">
                <span className="font-semibold text-sm">
                  Solo quedan {displayStock} disponibles
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-action/10 border border-action/20 text-action px-4 py-2.5 rounded-xl">
                <span className="font-medium text-sm">
                  ✓ {displayStock} disponibles
                </span>
              </div>
            )
          ) : (
            <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-xl">
              <span className="font-semibold text-sm">Agotado</span>
            </div>
          )}

          {/* Precio */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#FF5722]">
              ${currentPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
            {product.comparePrice && product.comparePrice > currentPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${product.comparePrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Selectores de variante */}
          {colors.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Color: {selectedVariant?.color || 'Original'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  const isSelected = selectedVariant?.color === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => variant && handleVariantClick(variant)}
                      className={`px-4 py-2 border-2 rounded-xl font-bold transition-all duration-200 ring-offset-2 ${
                        isSelected
                          ? 'border-[#FF5722] bg-[#FF5722]/10 text-[#FF5722] ring-2 ring-[#FF5722]'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {color}
                      {isSelected && <X className="w-4 h-4 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  Clic de nuevo para volver al original
                </p>
              )}
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Talla: {selectedVariant?.size || 'Original'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const variant = product.variants.find(
                    (v) =>
                      v.size === size &&
                      (!selectedVariant?.color || v.color === selectedVariant.color)
                  );
                  const isSelected = selectedVariant?.size === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => variant && handleVariantClick(variant)}
                      disabled={!variant || variant.stock === 0}
                      className={`px-4 py-2 border-2 rounded-xl font-bold transition-all duration-200 ring-offset-2 ${
                        isSelected
                          ? 'border-[#FF5722] bg-[#FF5722]/10 text-[#FF5722] ring-2 ring-[#FF5722]'
                          : variant && variant.stock > 0
                          ? 'border-gray-300 hover:border-gray-400 text-gray-700'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {size}
                      {isSelected && <X className="w-4 h-4 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <p className="text-xs text-gray-500 mt-2 font-medium">
                  Clic de nuevo para volver al original
                </p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Descripción */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
              Descripción
            </h2>
            <p className="text-[14px] sm:text-sm text-gray-500 leading-relaxed">
              {product.description || 'Producto de calidad disponible en ONSET.'}
            </p>
          </div>

          {/* Especificaciones Técnicas (accordion) */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setSpecsOpen((o) => !o)}
                className="w-full flex items-center justify-between text-left px-4 py-3 bg-white hover:bg-gray-50/50 transition-colors"
                aria-expanded={specsOpen}
              >
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Especificaciones Técnicas
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${specsOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              {specsOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                  <dl className="space-y-0">
                    {[...product.specifications]
                      .sort((a, b) => a.order - b.order)
                      .map((spec) => (
                        <div
                          key={spec.id}
                          className="flex items-baseline gap-2 py-2"
                        >
                          <dt className="text-[10px] uppercase font-bold text-gray-400 shrink-0">
                            {spec.key}
                          </dt>
                          <span className="flex-grow border-b border-dotted border-gray-200 mx-2 mb-1 shrink min-w-[8px] border-b-[1px]" aria-hidden />
                          <dd className="text-sm font-medium text-gray-900 text-right shrink-0">
                            {spec.value}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}
            </div>
          )}

          {/* Badges de confianza (vivos, con hover) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="group flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-orange-100">
              <div className="bg-gradient-to-br from-[#2A9D8F] to-[#2A9D8F]/80 text-white p-2 rounded-xl shrink-0 transition-all duration-300 group-hover:from-[#34b5a5] group-hover:to-[#2A9D8F]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">Premium</p>
                <p className="text-gray-500 text-xs leading-tight">Alta calidad</p>
              </div>
            </div>

            <div className="group flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-orange-100">
              <div className="bg-gradient-to-br from-[#FF5722] to-[#FF5722]/80 text-white p-2 rounded-xl shrink-0 transition-all duration-300 group-hover:from-[#ff7043] group-hover:to-[#FF5722]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">Rápido</p>
                <p className="text-gray-500 text-xs leading-tight">2-3 días</p>
              </div>
            </div>

            <div className="group flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-orange-100">
              <div className="bg-gradient-to-br from-[#25D366] to-[#25D366]/80 text-white p-2 rounded-xl shrink-0 transition-all duration-300 group-hover:from-[#34e077] group-hover:to-[#25D366]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">Seguro</p>
                <p className="text-gray-500 text-xs leading-tight">Pago directo</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Cantidad + Botones (cantidad minimalista con Lucide) */}
          <div className="space-y-3">
            {canAddToCart && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">Cantidad</span>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <span className="text-sm font-medium text-gray-900 min-w-[1.75rem] text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(Math.min(isPreOrder ? 999 : currentStock, quantity + 1))
                    }
                    disabled={!isPreOrder && quantity >= currentStock}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )}

            {/* Botones de acción (Carrito con shine + 3D) */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative overflow-hidden rounded-xl">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart || isAdding}
                  className="relative w-full bg-[#FF5722] hover:bg-[#E64A19] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-bold tracking-tight transition-all duration-200 shadow-[0_4px_0_0_#BF360C] hover:scale-[1.02] active:shadow-none active:translate-y-[4px] flex items-center justify-center gap-3 disabled:hover:scale-100 disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_0_#9ca3af] z-10 overflow-hidden"
                >
                  {canAddToCart && !isAdding && (
                    <span
                      className="absolute inset-y-0 left-0 w-[40%] z-0 pointer-events-none animate-btn-shine bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      aria-hidden
                    />
                  )}
                  <ShoppingCart className="h-5 w-5 relative z-[1]" />
                  <span className="relative z-[1]">
                    {!canAddToCart ? 'Agotado' : isAdding ? '¡Agregado!' : 'Agregar al Carrito'}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 px-6 rounded-xl font-bold tracking-tight transition-all duration-200 shadow-[0_4px_0_0_#075E54] hover:scale-[1.02] active:shadow-none active:translate-y-[4px] flex items-center justify-center gap-3 shrink-0"
              >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
                Consultar por WhatsApp
              </button>
            </div>

            {/* Trust badges compactos */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
              <span className="flex items-center gap-1">🔒 Compra segura</span>
              <span>•</span>
              <span className="flex items-center gap-1">⚡ Respuesta rápida</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Información de entrega */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
              <span className="opacity-60">📦</span> Información de Entrega
            </h3>

            <div className="space-y-3">
              {/* Plantel 42 Huitzo — glassmorphism + icono flotante */}
              <div className="bg-teal-50/30 border border-gray-100 border-l-4 border-l-[#2A9D8F] rounded-r-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                <div className="flex items-start gap-3">
                  <span className="text-base opacity-80 animate-float-soft shrink-0" aria-hidden>🎓</span>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm mb-0.5">
                      Entrega en Plantel 42 Huitzo
                    </p>
                    <p className="text-xs text-gray-600">
                      Entrega directa en la escuela • Sin costo de envío
                    </p>
                  </div>
                </div>
              </div>

              {/* Etla, Oaxaca — glassmorphism + icono flotante */}
              <div className="bg-orange-50/30 border border-gray-100 border-l-4 border-l-[#FF5722] rounded-r-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                <div className="flex items-start gap-3">
                  <span className="text-base opacity-80 animate-float-soft shrink-0" aria-hidden>🚚</span>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm mb-0.5">
                      Envío gratis alrededor de Etla, Oaxaca
                    </p>
                    <p className="text-xs text-gray-600">
                      En compras desde <span className="font-semibold text-[#FF5722]">$200 MXN</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Tiempo de entrega */}
              <div className="bg-gray-50/50 border border-gray-100 border-l-4 border-l-gray-300 rounded-r-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                <div className="flex items-start gap-3">
                  <span className="text-base opacity-60 shrink-0" aria-hidden>⏱️</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm mb-0.5">
                      Entrega estimada: 2-3 días hábiles
                    </p>
                    <p className="text-xs text-gray-600">
                      Entregas express disponibles por WhatsApp
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
