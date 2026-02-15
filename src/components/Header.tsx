"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Package, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";

export default function Header() {
  const { items, totalItems, isCartDrawerOpen, openCartDrawer, closeCartDrawer } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Inicio", icon: Zap },
    { href: "/shop", label: "Productos", icon: Package },
  ];

  return (
    <header className="sticky top-0 z-50 bg-secondary-dark/95 backdrop-blur-sm border-b border-white/10 min-h-[56px] lg:min-h-[64px] safe-area-inset-top">
      <nav className="container mx-auto px-5 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
        {/* Logo ONSET – compacto */}
        <Link
          href="/"
          className="flex items-center space-x-2 lg:space-x-3"
          aria-label="Ir a inicio"
        >
          <div className="bg-primary p-2 lg:p-2.5 rounded-lg">
            <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
          </div>
          <div>
            <span className="block text-white font-bold text-lg lg:text-xl" style={{ letterSpacing: "0.15em" }}>
              ONSET
            </span>
            <span className="block text-primary text-[10px] lg:text-xs uppercase tracking-wider">
              Tu estilo, tu inicio
            </span>
          </div>
        </Link>

        {/* Navegación Desktop */}
        <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-coral text-white shadow-glow"
                      : "text-white/90 hover-capable:hover:bg-white/10 hover-capable:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
        </div>

        {/* Carrito – abre drawer */}
        <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={openCartDrawer}
              className="relative p-2 lg:p-2.5 bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-soft text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl p-3 text-white transition-all duration-300 hover-capable:hover:bg-white/10 md:hidden"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>
      </nav>

      {/* Menú Móvil – enlaces min 44px altura */}
      {isMenuOpen && (
        <div className="animate-slideDown border-t border-white/20 bg-secondary-dark/98 backdrop-blur-md md:hidden">
          <nav className="space-y-2 px-5 py-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex min-h-[48px] items-center gap-4 rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-coral text-white shadow-glow"
                      : "text-white/90 active:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <CartDrawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} />
    </header>
  );
}
