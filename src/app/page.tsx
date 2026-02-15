export const dynamic = 'force-dynamic';

import { prisma } from "@/app/lib/prisma";
import Header from "@/components/Header";
import FeaturedProducts from "@/components/FeaturedProducts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description: "ONSET – Tu estilo, tu inicio. Descubre productos con energía. Envío rápido y seguro.",
};

export const revalidate = 60;

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    take: 8,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: true,
      stock: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const productsWithImageUrl = products.map((product) => ({
    ...product,
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
    stock: product.stock ?? 0, // Fix: convertir null a 0
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F7] via-white to-[#F0FDFA]">
      <Header />

      {/* Hero – Moderno, bold, mobile-first | 100dvh para móvil, sin franja blanca en desktop */}
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
        style={{
          minHeight: "100dvh",
          backgroundImage: productsWithImageUrl[0]?.imageUrl
            ? `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.45)), url(${productsWithImageUrl[0].imageUrl})`
            : "linear-gradient(135deg, #264653 0%, #1e3a47 50%, #2A9D8F 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-14 text-center sm:px-6 sm:py-16 lg:px-8">
          <div className="animate-fadeIn">
            <h1
              className="mb-5 font-bold leading-tight text-white drop-shadow-lg sm:mb-6"
              style={{
                fontSize: "clamp(2.5rem, 12vw, 4.5rem)",
                fontWeight: 700,
              }}
            >
              TU ESTILO
              <span className="block bg-gradient-to-r from-[#FF5722] via-[#E76F51] to-[#F4A261] bg-clip-text text-transparent">
                TU INICIO
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-base text-white/90 sm:mb-12 sm:text-lg md:text-xl">
              ONSET es donde empieza todo. Productos con actitud, envío rápido y precios que vibran.
            </p>
            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6">
              <Link
                href="/shop"
                className="group inline-flex min-h-[48px] min-w-[44px] items-center justify-center rounded-xl bg-[#FF5722] px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 active:scale-95 hover-capable:hover:bg-[#E64A19] hover-capable:hover:scale-105 hover-capable:hover:shadow-xl sm:px-10 sm:py-5 sm:text-lg"
              >
                <span>Explorar Productos</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 hover-capable:group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-8 text-base font-medium text-white/80 sm:mt-10">
              Envío gratis en compras +$500
            </p>
          </div>
        </div>
      </section>

      {/* Features – Plantel 42, Compra Segura, Envío desde $200 */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 - Plantel 42 */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-br from-primary to-primary/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-3xl filter drop-shadow-lg">
                    🎓
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-secondary-dark mb-3 group-hover:text-primary transition-colors duration-300">
                  Entrega en Plantel 42
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Entrega directa en Plantel 42 Huitzo. Sin costo de envío.
                </p>
              </div>
            </div>

            {/* Card 2 - Compra Segura */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-action/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-br from-action to-action/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <svg className="h-8 w-8 text-white filter drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-secondary-dark mb-3 group-hover:text-action transition-colors duration-300">
                  Compra Segura
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Datos protegidos. Compra con confianza vía WhatsApp.
                </p>
              </div>
            </div>

            {/* Card 3 - Envío Gratis */}
            <div className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="bg-gradient-to-br from-coral to-coral/80 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-3xl filter drop-shadow-lg">
                    🚚
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-secondary-dark mb-3 group-hover:text-coral transition-colors duration-300">
                  Envío Gratis desde $200
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Envío sin costo alrededor de Etla, Oaxaca. Entrega en 2-3 días.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados – fetch API, grid/swipe, badge NUEVO, lazy images */}
      <FeaturedProducts />

      {/* CTA – touch target, fonts mobile */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary-dark via-[#1e3a47] to-action py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,87,34,0.15)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <h2
            className="mb-6 font-title text-3xl font-bold tracking-wider text-white sm:text-4xl md:text-5xl"
            style={{ letterSpacing: "0.02em" }}
          >
            ¿LISTO PARA EMPEZAR?
          </h2>
          <p className="mb-10 text-base text-white/90 sm:mb-12 sm:text-lg">
            Explora la colección ONSET y encuentra tu estilo.
          </p>
          <Link
            href="/shop"
            className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-primary to-coral px-10 py-5 text-base font-bold text-white shadow-glow transition-all duration-300 active:scale-95 hover-capable:hover:scale-105 hover-capable:hover:shadow-hover sm:text-lg"
          >
            <span>Ir a la Tienda</span>
            <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </section>

    </div>
  );
}