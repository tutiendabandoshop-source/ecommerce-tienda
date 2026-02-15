"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Plus, Minus, Trash2, Trash } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const WHATSAPP_PHONE = "5219516111552";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const router = useRouter();

  const handleProductClick = (productSlug: string) => {
    router.push(`/shop/${productSlug}`);
    onClose();
  };

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
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />
        </Transition.Child>

        {/* Drawer */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="h-6 w-6 text-primary shrink-0" />
                        <Dialog.Title className="text-xl font-bold text-secondary-dark">
                          Carrito
                        </Dialog.Title>
                        <span className="bg-primary text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                          {items.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {items.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowConfirmClear(true)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Vaciar carrito"
                            aria-label="Vaciar carrito"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={onClose}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                          aria-label="Cerrar carrito"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[280px] text-center">
                          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg font-medium mb-2">
                            Tu carrito está vacío
                          </p>
                          <p className="text-gray-400 text-sm">
                            Agrega productos para comenzar
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {items.map((item) => (
                            <div
                              key={`${item.id}-${item.variantId ?? "base"}`}
                              className="flex gap-4 bg-gray-50 rounded-lg p-4"
                            >
                              {/* Image - Clickeable */}
                              <button
                                type="button"
                                onClick={() => handleProductClick(item.slug)}
                                className="relative w-20 h-20 rounded-md overflow-hidden bg-white flex-shrink-0 hover:opacity-80 transition-opacity"
                                aria-label={`Ver ${item.name}`}
                              >
                                {item.imageUrl ? (
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ShoppingCart className="w-8 h-8" />
                                  </div>
                                )}
                              </button>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                {/* Name - Clickeable */}
                                <button
                                  type="button"
                                  onClick={() => handleProductClick(item.slug)}
                                  className="font-semibold text-secondary-dark text-sm line-clamp-2 mb-1 text-left w-full hover:text-primary transition-colors"
                                >
                                  {item.name}
                                  {item.variantDetails && (
                                    <span className="text-gray-500 font-normal"> ({item.variantDetails})</span>
                                  )}
                                </button>
                                <p className="text-primary font-bold text-lg mb-2">
                                  ${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                                </p>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-0 bg-white rounded-lg border border-gray-200">
                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                                      className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                                      aria-label="Disminuir cantidad"
                                    >
                                      <Minus className="h-4 w-4 text-gray-600" />
                                    </button>
                                    <span className="text-sm font-medium text-secondary-dark min-w-[28px] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                                      className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50"
                                      disabled={item.quantity >= item.stock}
                                      aria-label="Aumentar cantidad"
                                    >
                                      <Plus className="h-4 w-4 text-gray-600" />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.id, item.variantId)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    aria-label="Eliminar del carrito"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-600 font-medium">Subtotal</span>
                          <span className="text-2xl font-bold text-secondary-dark">
                            ${totalPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleCheckout}
                          className="w-full bg-whatsapp hover:bg-whatsapp/90 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
                        >
                          Contactar por WhatsApp
                        </button>

                        <button
                          type="button"
                          onClick={onClose}
                          className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition-colors"
                        >
                          Continuar comprando
                        </button>
                      </div>
                    )}

                    {/* Confirmation Modal */}
                    {showConfirmClear && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                          <h3 className="text-lg font-bold text-secondary-dark mb-2">
                            ¿Vaciar carrito?
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Se eliminarán todos los productos del carrito. Esta acción no se puede deshacer.
                          </p>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setShowConfirmClear(false)}
                              className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                clearCart();
                                setShowConfirmClear(false);
                              }}
                              className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                            >
                              Vaciar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
