"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import { FiHeart } from "react-icons/fi";
import { useState } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "@/components/CartDrawer";

export default function Header() {
  const { totalItems, isCartDrawerOpen, openCartDrawer, closeCartDrawer } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/shop", label: "Productos" },
  ];

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header className="bg-white border-b border-border px-4 py-3 sticky top-0 z-50 safe-area-inset-top">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-text-primary transition-colors duration-200 ease-out hover:text-secondary"
          aria-label="Ir a inicio"
        >
          <FiHeart className="w-6 h-6 text-secondary shrink-0" aria-hidden />
          <span className="font-serif text-2xl font-semibold">TuMarca</span>
        </Link>

        {/* Navegación escritorio */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 text-text-primary transition-all duration-200 ease-out hover:text-secondary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-secondary after:transition-all after:duration-200 after:ease-out hover:after:w-full ${
                pathname === link.href ? "font-semibold text-secondary after:w-full" : "after:w-0"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Carrito y menú móvil */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all duration-200 ease-out hover:bg-secondary/10 hover:text-secondary active:scale-95 tap-scale"
            aria-label="Carrito de compras"
          >
            <ShoppingCart className="w-6 h-6 text-text-primary" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-primary rounded-full transition-all duration-200 ease-out hover:bg-secondary/10 hover:text-secondary active:scale-95 tap-scale"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil (desplegable) con animación suave y área táctil 44px */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 border-t border-border py-2 animate-fadeIn">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`min-h-[44px] flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-out hover:bg-secondary/10 hover:text-secondary active:scale-[0.98] ${
                  pathname === link.href ? "text-secondary font-medium bg-secondary/5" : "text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <CartDrawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} />
    </header>
  );
}
