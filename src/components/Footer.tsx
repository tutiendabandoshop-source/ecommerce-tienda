"use client";

import Link from "next/link";
import { Zap, Mail, MessageCircle } from "lucide-react";

const EMAIL = "mailto:aaroneli874@gmail.com";
const WHATSAPP_URL = "https://wa.me/529516111552";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-r from-secondary-dark via-[#1e3a47] to-secondary-dark py-12 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-10 md:mb-8 md:grid-cols-3 md:gap-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-gradient-to-br from-primary to-coral p-2.5 transition-transform duration-300 hover-capable:hover:scale-105">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="font-title text-xl tracking-wider sm:text-2xl">ONSET</span>
            </div>
            <p className="text-base text-white/70 sm:text-sm">
              Tu estilo, tu inicio. Energía y impacto.
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-display text-lg font-bold sm:text-base">Enlaces</h3>
            <ul className="space-y-3 text-base text-white/70 sm:space-y-2 sm:text-sm">
              <li>
                <Link href="/" className="flex min-h-[48px] items-center transition-colors duration-200 hover-capable:hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/shop" className="flex min-h-[48px] items-center transition-colors duration-200 hover-capable:hover:text-primary">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/cart" className="flex min-h-[48px] items-center transition-colors duration-200 hover-capable:hover:text-primary">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-display text-lg font-bold sm:text-base">Contacto</h3>
            <ul className="space-y-4 text-base text-white/70 sm:space-y-3 sm:text-sm">
              <li>
                <a
                  href={EMAIL}
                  className="group inline-flex min-h-[44px] items-center gap-3 py-2 text-white/90 transition-colors duration-200 hover-capable:hover:text-primary"
                >
                  <span className="flex min-h-[44px] min-w-[44px] items-center justify-center">
                    <Mail className="h-5 w-5 sm:h-4 sm:w-4 transition-transform duration-200 hover-capable:group-hover:scale-110" />
                  </span>
                  <span className="break-all">aaroneli874@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[44px] items-center gap-3 py-2 text-white/90 transition-colors duration-200 hover-capable:hover:text-whatsapp"
                >
                  <span className="flex min-h-[44px] min-w-[44px] items-center justify-center">
                    <MessageCircle className="h-5 w-5 transition-transform duration-200 sm:h-4 sm:w-4 hover-capable:group-hover:scale-110" />
                  </span>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-base text-white/70 sm:text-sm">
            © {new Date().getFullYear()} ONSET. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
