'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Clock, Minus, Plus, ShoppingCart, X, Star, Truck, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import ProductGallery from '@/components/ProductGallery';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

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
  category: { id: string; name: string };
  variants: Variant[];
  specifications?: ProductSpec[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const hasVariants = product.variants && product.variants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(false);

  // Si se llega desde el carrito con ?variant=id, preseleccionar esa variante
  useEffect(() => {
    const variantId = searchParams.get('variant');
    if (!variantId || !hasVariants || !product.variants?.length) return;
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) setSelectedVariant(variant);
  }, [searchParams, hasVariants, product.variants]);

  const colors = hasVariants
    ? Array.from(new Set(product.variants.filter((v) => v.color).map((v) => v.color)))
    : [];
  const sizes = hasVariants
    ? Array.from(new Set(product.variants.filter((v) => v.size).map((v) => v.size)))
    : [];

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentStock = selectedVariant?.stock ?? product.stock ?? 0;
  const currentImage =
    selectedVariant?.imageUrl ||
    (selectedVariant?.images?.length ? selectedVariant.images[0] : null) ||
    product.imageUrl;
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
    if (selectedVariant?.id === variant.id) setSelectedVariant(null);
    else setSelectedVariant(variant);
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
      `Hola Áurea, me interesa el producto: *${product.name}*${preOrderText}${variantDetails}\n\n` +
      `Precio: $${currentPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n` +
      `Cantidad: ${quantity}\n\n¿Está disponible?`;
    window.open(`https://wa.me/5219516111552?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 min-w-0">
        {/* Galería: min-w-0 evita que el grid desborde en móvil */}
        <div className="min-w-0 w-full h-fit md:sticky md:top-24">
          <ProductGallery images={galleryImages} productName={galleryProductName} />
        </div>

        {/* Información */}
        <div className="min-w-0 w-full">
          <Link
            href={`/shop?category=${product.category.id}`}
            className="text-xs font-semibold uppercase tracking-widest text-text-secondary hover:text-secondary transition-colors duration-200 tap-scale"
          >
            {product.category.name}
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-text-primary mb-2 mt-1">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-sans text-4xl font-bold text-text-primary">
              ${currentPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
            {product.comparePrice != null && product.comparePrice > currentPrice && (
              <span className="text-text-secondary line-through text-lg">
                ${product.comparePrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Stock badge */}
          {isPreOrder ? (
            <div className="inline-flex items-center gap-2 bg-warning/30 text-text-primary px-4 py-2 rounded-xl text-sm font-medium mb-6">
              Sobre pedido{product.preOrderDays ? ` (${product.preOrderDays})` : ''}
            </div>
          ) : displayStock > 0 ? (
            displayStock <= 5 ? (
              <div className="inline-flex items-center gap-2 bg-warning/20 border border-warning/50 text-text-primary px-4 py-2 rounded-xl text-sm font-medium mb-6">
                Últimas {displayStock} unidades
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-text-secondary text-sm mb-6">
                {displayStock} disponibles
              </div>
            )
          ) : (
            <div className="inline-flex items-center gap-2 bg-card-border/50 text-text-secondary px-4 py-2 rounded-xl text-sm font-medium mb-6">
              Agotado
            </div>
          )}

          {/* Badges: minimalistas, no tipo botón */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-transparent px-2.5 py-1 text-xs text-gray-500">
              <Star className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden /> Alta calidad
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-transparent px-2.5 py-1 text-xs text-gray-500">
              <Truck className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden /> Envío rápido
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-transparent px-2.5 py-1 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5 text-gray-400 shrink-0" aria-hidden /> Pago seguro
            </span>
          </div>

          {/* Selectores de variante (color / talla) - lógica de la tienda */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-text-primary mb-2">
                Color: {selectedVariant?.color ?? 'Elegir'}
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
                      className={`min-h-[44px] px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ease-out tap-scale ${
                        isSelected
                          ? 'border-terracota bg-terracota/10 text-terracota'
                          : 'border-border bg-card text-text-primary hover:border-terracota/50 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {color}
                      {isSelected && <X className="w-3.5 h-3.5 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <p className="text-xs text-text-secondary mt-1.5">Clic de nuevo para volver al original</p>
              )}
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-text-primary mb-2">
                Talla: {selectedVariant?.size ?? 'Elegir'}
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
                      className={`min-h-[44px] px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ease-out tap-scale ${
                        isSelected
? 'border-terracota bg-terracota/10 text-terracota'
                            : variant && variant.stock > 0
                            ? 'border-border bg-card text-text-primary hover:border-terracota/50 hover:scale-[1.02] active:scale-[0.98]'
                            : 'border-border bg-primary/50 text-text-secondary cursor-not-allowed'
                      }`}
                    >
                      {size}
                      {isSelected && <X className="w-3.5 h-3.5 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
              {selectedVariant && (
                <p className="text-xs text-text-secondary mt-1.5">Clic de nuevo para volver al original</p>
              )}
            </div>
          )}

          {/* Cantidad: botones circulares con borde, hover gris */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-sans font-medium">Cantidad:</span>
            {canAddToCart && (
              <div className="flex items-center border border-border rounded-full bg-card">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="min-w-[44px] min-h-[44px] w-10 h-10 rounded-full flex items-center justify-center border border-transparent hover:bg-gray-100 transition-all duration-200 ease-out active:scale-95 tap-scale"
                  aria-label="Reducir cantidad"
                >
                  <Minus className="w-4 h-4" strokeWidth={2.5} />
                </button>
                <span className="w-12 text-center font-medium tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(isPreOrder ? 999 : currentStock, quantity + 1))
                  }
                  disabled={!isPreOrder && quantity >= currentStock}
                  className="min-w-[44px] min-h-[44px] w-10 h-10 rounded-full flex items-center justify-center border border-transparent hover:bg-gray-100 transition-all duration-200 ease-out active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:scale-100 tap-scale"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>

          {/* Botones: rounded-full, 44px mínimo, texto que no se rompa */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart || isAdding}
              className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-full bg-[#CB997E] text-white text-sm sm:text-base font-semibold whitespace-nowrap transition-all duration-300 hover:bg-[#B58369] hover:shadow-lg active:scale-[0.98] disabled:bg-border disabled:text-text-secondary disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-95 tap-scale px-6"
            >
              {isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span>¡Agregado!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 shrink-0" />
                  <span>{!canAddToCart ? 'Agotado' : 'Agregar al Carrito'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleWhatsAppRedirect}
              className="flex-1 min-h-[48px] flex items-center justify-center gap-2 rounded-full border-2 border-[#CB997E] bg-transparent text-[#CB997E] text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-300 hover:bg-[#CB997E]/10 tap-scale px-6"
            >
              <WhatsAppIcon className="w-5 h-5 shrink-0" />
              <span>Consultar por WhatsApp</span>
            </button>
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <h3 className="font-serif text-lg text-text-primary mb-2">Descripción</h3>
            <p className="text-text-secondary leading-relaxed">
              {product.description || 'Producto de calidad. Consulta disponibilidad por WhatsApp.'}
            </p>
          </div>

          {/* Especificaciones (acordeón - lógica de la tienda) */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <button
                type="button"
                onClick={() => setSpecsOpen((o) => !o)}
                className="w-full min-h-[44px] flex items-center justify-between text-left px-4 py-3 hover:bg-primary/30 transition-all duration-200 ease-out active:bg-primary/40 tap-scale"
                aria-expanded={specsOpen}
              >
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                  Especificaciones
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-text-secondary shrink-0 transition-transform duration-200 ease-out ${specsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {specsOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-border">
                  <dl className="space-y-0">
                    {[...product.specifications]
                      .sort((a, b) => a.order - b.order)
                      .map((spec) => (
                        <div key={spec.id} className="flex items-baseline gap-2 py-2">
                          <dt className="text-xs uppercase font-semibold text-text-secondary shrink-0">{spec.key}</dt>
                          <span className="flex-grow border-b border-dotted border-border mx-2 mb-1 min-w-[8px]" />
                          <dd className="text-sm font-medium text-text-primary text-right shrink-0">{spec.value}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}
            </div>
          )}

          {/* Información de entrega */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 mt-8">
            <h3 className="font-serif text-lg text-text-primary mb-3">Información de entrega</h3>
            <div className="space-y-3 text-sm text-text-secondary">
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-terracota shrink-0" aria-hidden /> Entrega en Plantel 42 Huitzo sin costo
              </p>
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-terracota shrink-0" aria-hidden /> Envío gratis alrededor de Etla, Oaxaca a partir de $200 MXN
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-terracota shrink-0" aria-hidden /> Tiempo estimado: 2-3 días hábiles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
