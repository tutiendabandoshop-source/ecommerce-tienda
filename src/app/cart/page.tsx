"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Trash } from "lucide-react";
import { useState } from "react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const total = totalPrice;
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = "5219516111552";
    let messageText = "¡Hola Áurea! Me interesan estos productos de mi carrito:\n\n";

    items.forEach((item) => {
      const variantText = item.variantDetails ? ` (${item.variantDetails})` : "";
      const preOrderText = item.isPreOrder
        ? ` (⚠️ Sobre pedido: ${item.preOrderDays || "consultar"})`
        : "";
      messageText += `📦 *${item.name}*${variantText}${preOrderText}\n`;
      messageText += `   Cant: ${item.quantity} | $${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n\n`;
    });

    messageText += `💰 *Total:* $${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n\n`;
    messageText += "¿Están disponibles?";

    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-primary flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto max-w-7xl px-4 lg:px-8 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-[#E8C1C0]/20 p-6 rounded-2xl inline-block mb-6 shadow-soft">
              <ShoppingBag className="w-20 h-20 text-text-primary" />
            </div>
            <h1 className="font-serif text-3xl md:text-6xl font-semibold text-text-primary mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-text-secondary mb-8">Llénalo con productos que te acompañan</p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center min-h-[48px] bg-[#CB997E] text-white px-10 py-4 rounded-full font-semibold transition-all duration-300 hover:bg-[#B58369] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] tap-scale"
            >
              Explorar productos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-8">
        {/* Cabecera ALK: icono + título + contador + vaciar (estilo drawer expandido) */}
        <section className="border-b border-border pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#E8C1C0]/20 p-2.5 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-text-primary" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-5xl font-semibold text-text-primary">
                  Tu Carrito
                </h1>
                <p className="text-text-secondary font-sans text-sm mt-0.5">
                  {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu carrito
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              className="self-start sm:self-center flex items-center gap-2 min-h-[44px] rounded-full border border-border bg-card px-4 py-2.5 text-text-secondary transition-all duration-200 ease-out hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95 tap-scale font-medium text-sm"
              aria-label="Vaciar carrito"
            >
              <Trash className="h-4 w-4" />
              Vaciar carrito
            </button>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de items – estructura drawer expandida a página completa */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <article
                key={`${item.id}-${item.variantId || "base"}`}
                className="bg-card rounded-xl border border-border p-5 flex gap-4 shadow-soft animate-fadeIn transition-all duration-200 hover:shadow-md"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Link
                  href={item.variantId ? `/shop/${item.slug}?variant=${encodeURIComponent(item.variantId)}` : `/shop/${item.slug}`}
                  className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-card-border/30"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover h-full w-full"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-border">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={item.variantId ? `/shop/${item.slug}?variant=${encodeURIComponent(item.variantId)}` : `/shop/${item.slug}`} className="hover:underline underline-offset-1">
                    <h2 className="font-serif font-semibold text-text-primary line-clamp-2 hover:text-[#CB997E] transition-colors">
                      {item.name}
                    </h2>
                  </Link>
                  {item.variantDetails && (
                    <p className="font-sans text-sm text-text-secondary mt-0.5">{item.variantDetails}</p>
                  )}
                  {item.isPreOrder && (
                    <span className="inline-block mt-1 bg-warning/30 text-text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                      Sobre pedido {item.preOrderDays ? `(${item.preOrderDays} días)` : ""}
                    </span>
                  )}
                  <p className="font-sans text-sm font-bold text-text-primary mt-1">
                    ${item.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} c/u
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center rounded-full border border-border bg-card">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                        disabled={item.quantity <= 1}
                        className="min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-full text-text-primary transition-all duration-200 ease-out hover:bg-gray-100 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100 tap-scale"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="min-w-[28px] text-center text-sm font-medium text-text-primary tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                        disabled={item.quantity >= item.stock}
                        className="min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-full text-text-primary transition-all duration-200 ease-out hover:bg-gray-100 active:scale-95 disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100 tap-scale"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-sans font-bold text-text-primary">
                      ${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id, item.variantId)}
                      className="text-sm text-gray-500 transition-colors duration-200 hover:text-red-500 tap-scale py-1"
                      aria-label="Eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Resumen – bloque fijo (como footer del drawer) */}
          <aside className="lg:col-span-1">
            <div className="bg-[#FDFAF7] rounded-xl border border-border p-6 shadow-soft lg:sticky lg:top-24">
              <h2 className="font-serif text-xl font-semibold text-text-primary mb-4">
                Resumen del pedido
              </h2>

              <div className="flex justify-between items-baseline mb-6 py-3 border-b border-border">
                <span className="text-lg font-bold text-text-primary">Subtotal</span>
                <span className="font-sans text-xl font-bold text-text-primary">
                  ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                </span>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="cta-brillar relative w-full min-h-[52px] flex items-center justify-center gap-2 rounded-full bg-[#CB997E] text-white py-4 px-6 text-base font-semibold transition-all duration-300 hover:bg-[#B58369] hover:shadow-lg tap-scale overflow-hidden"
              >
                <WhatsAppIcon className="shrink-0 h-5 w-5" />
                Contactar por WhatsApp
              </button>

              <Link
                href="/shop"
                className="block w-full min-h-[44px] mt-4 text-center text-[#CB997E] font-medium text-sm py-3 underline underline-offset-2 hover:text-[#B58369] transition-colors duration-200"
              >
                Continuar comprando
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {/* Modal confirmar vaciar – mismo que CartDrawer */}
      {showConfirmClear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          aria-modal="true"
          role="dialog"
          aria-labelledby="confirm-clear-title"
        >
          <div className="w-full max-w-sm rounded-xl border border-border bg-[#FDFAF7] p-6 shadow-soft">
            <h3 id="confirm-clear-title" className="mb-2 font-serif text-lg font-semibold text-text-primary">
              ¿Vaciar carrito?
            </h3>
            <p className="mb-6 font-sans text-sm text-text-secondary">
              Se eliminarán todos los productos. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-border bg-primary px-4 py-2.5 font-medium text-text-primary transition-all duration-200 ease-out hover:bg-card-border active:scale-[0.98] tap-scale"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setShowConfirmClear(false);
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-red-500 px-4 py-2.5 font-medium text-white transition-all duration-200 ease-out hover:bg-red-600 active:scale-[0.98] tap-scale"
              >
                Vaciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
