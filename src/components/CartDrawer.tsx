"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Plus, Minus, Trash2, Trash } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const WHATSAPP_PHONE = "5219516111552";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleCheckout = () => {
    let messageText = "¡Hola! Me interesan estos productos de mi carrito:\n\n";
    items.forEach((item) => {
      const variantText = item.variantDetails ? ` (${item.variantDetails})` : "";
      const preOrderText = item.isPreOrder
        ? ` (⚠️ Sobre pedido: ${item.preOrderDays || "consultar"})`
        : "";
      messageText += `📦 *${item.name}*${variantText}${preOrderText}\n`;
      messageText += `   Cant: ${item.quantity} | $${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n\n`;
    });
    messageText += `💰 *Total:* $${totalPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN\n\n`;
    messageText += "¿Están disponibles?";

    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(messageText)}`, "_blank");
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/40"
            aria-hidden="true"
            onClick={onClose}
          />
        </Transition.Child>

        <div className="fixed inset-0 flex justify-end overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative flex h-full w-full max-w-full sm:max-w-md flex-col bg-[#FDFAF7] shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <h2 className="font-serif text-xl font-semibold text-text-primary">
                  Tu Carrito
                </h2>
                <div className="flex items-center gap-1">
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmClear(true)}
                      className="min-h-[44px] min-w-[44px] rounded-full p-2 flex items-center justify-center text-text-secondary transition-all duration-200 ease-out hover:bg-red-50 hover:text-red-500 active:scale-95 tap-scale"
                      title="Vaciar carrito"
                      aria-label="Vaciar carrito"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[44px] min-w-[44px] rounded-full p-2 flex items-center justify-center text-text-primary transition-all duration-200 ease-out hover:bg-primary active:scale-95 tap-scale"
                    aria-label="Cerrar carrito"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Lista de items: scroll independiente para que el footer quede siempre visible */}
              <div className="flex-1 min-h-0 space-y-6 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                    <ShoppingCart className="mb-3 h-12 w-12 text-border" />
                    <p className="text-text-secondary">Tu carrito está vacío</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.id}-${item.variantId ?? "base"}`}
                      className="flex gap-4 border-b border-border pb-6 last:border-0 last:pb-0"
                    >
                      <Link
                        href={item.variantId ? `/shop/${item.slug}?variant=${encodeURIComponent(item.variantId)}` : `/shop/${item.slug}`}
                        onClick={onClose}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-card-border/50 block"
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-border">
                            <ShoppingCart className="h-8 w-8" />
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={item.variantId ? `/shop/${item.slug}?variant=${encodeURIComponent(item.variantId)}` : `/shop/${item.slug}`}
                          onClick={onClose}
                          className="font-serif text-text-primary line-clamp-2 transition-colors duration-200 hover:text-[#c49a97] hover:underline underline-offset-1"
                        >
                          {item.name}
                          {item.variantDetails && (
                            <span className="font-sans text-text-secondary font-normal">
                              {" "}({item.variantDetails})
                            </span>
                          )}
                        </Link>
                        <p className="font-sans text-sm font-bold text-text-primary mt-0.5">
                          ${item.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} c/u
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="flex items-center rounded-full border border-border bg-card">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1, item.variantId)
                              }
                              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-text-primary transition-all duration-200 ease-out hover:bg-gray-100 active:scale-95 tap-scale"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[32px] text-center text-sm font-medium text-text-primary tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1, item.variantId)
                              }
                              disabled={item.quantity >= item.stock}
                              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-text-primary transition-all duration-200 ease-out hover:bg-gray-100 active:scale-95 disabled:opacity-50 disabled:hover:bg-transparent disabled:active:scale-100 tap-scale"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="font-sans font-bold text-text-primary">
                            ${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id, item.variantId)}
                            className="ml-auto shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm text-gray-500 transition-colors duration-200 hover:text-red-500 tap-scale py-2 px-2 -m-2"
                            aria-label="Eliminar del carrito"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer: sticky al fondo en móvil cuando la lista es larga */}
              {items.length > 0 && (
                <div className="flex-shrink-0 border-t border-border bg-[#FDFAF7] p-4 space-y-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
                  <div className="flex justify-between items-baseline text-text-primary">
                    <span className="text-lg font-bold">Subtotal</span>
                    <span className="text-xl font-bold">
                      ${totalPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="cta-brillar relative flex w-full min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#E8C1C0] text-white py-4 px-6 text-base font-semibold transition-all duration-200 hover:bg-[#dfb3b2] tap-scale overflow-hidden"
                  >
                    <WhatsAppIcon className="h-5 w-5 shrink-0" />
                    Contactar por WhatsApp
                  </button>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="flex w-full min-h-[48px] items-center justify-center py-3 px-4 text-center text-sm text-[#E8C1C0] font-medium underline underline-offset-2 hover:text-[#dfb3b2] transition-colors duration-200 tap-scale"
                  >
                    Continuar comprando
                  </Link>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>

        {/* Modal confirmar vaciar */}
        {showConfirmClear && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl border border-border bg-[#FDFAF7] p-6 shadow-soft">
              <h3 className="mb-2 text-lg font-bold text-text-primary">
                ¿Vaciar carrito?
              </h3>
              <p className="mb-6 text-sm text-text-secondary">
                Se eliminarán todos los productos. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(false)}
                  className="flex-1 min-h-[44px] rounded-xl border border-border bg-primary/50 px-4 py-2.5 font-medium text-text-primary transition-all duration-200 ease-out hover:bg-primary active:scale-[0.98] tap-scale"
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
      </Dialog>
    </Transition>
  );
}
