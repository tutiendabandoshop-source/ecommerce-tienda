export const dynamic = "force-dynamic";

import { prisma } from "@/app/lib/prisma";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { Package, Shield, Truck, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Belleza que te acompaña. Descubre productos que realzan tu esencia diaria.",
};

export const revalidate = 60;

const productSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  images: true,
  stock: true,
  createdAt: true,
  isPreOrder: true,
  preOrderDays: true,
} as const;

async function getHomeData() {
  const newProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    select: productSelect,
  });

  // Lo mejor: productos distintos a los 4 más recientes (skip 4).
  let topProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    skip: 4,
    take: 4,
    select: productSelect,
  });

  // Asegurar al menos 4 productos: completar con newProducts o con cualquier activo.
  if (topProducts.length < 4) {
    const topIds = new Set(topProducts.map((p) => p.id));
    const fromNew = newProducts.filter((p) => !topIds.has(p.id));
    const needed = 4 - topProducts.length;
    const fillFromNew = fromNew.slice(0, needed);
    topProducts = [...topProducts, ...fillFromNew];
    for (const p of fillFromNew) topIds.add(p.id);

    if (topProducts.length < 4) {
      const extra = await prisma.product.findMany({
        where: {
          isActive: true,
          id: { notIn: [...topIds] },
        },
        orderBy: { createdAt: "desc" },
        take: 4 - topProducts.length,
        select: productSelect,
      });
      topProducts = [...topProducts, ...extra];
    }
  }

  return { newProducts, topProducts };
}

export default async function HomePage() {
  const { newProducts, topProducts } = await getHomeData();

  const newWithImage = newProducts.map((p) => ({
    ...p,
    imageUrl: p.images?.length ? p.images[0] : null,
    stock: p.stock ?? 0,
    createdAt: p.createdAt.toISOString(),
  }));

  const topWithImage = topProducts.map((p) => ({
    ...p,
    imageUrl: p.images?.length ? p.images[0] : null,
    stock: p.stock ?? 0,
    createdAt: p.createdAt.toISOString(),
  }));

  const heroImageUrl = "/hero-main.jpg";

  return (
    <div className="min-h-screen bg-primary">
      <Header />

      {/* Hero: móvil = imagen 60vh + texto superpuesto; desktop = grid 2 cols */}
      <section className="bg-[#FDFAF7] pt-0 pb-10 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 lg:gap-16 items-center min-h-0">
            {/* Imagen: móvil 60vh rounded-b only; desktop ratio y bordes orgánicos */}
            <div className="order-1 md:order-2 relative flex justify-center md:justify-end">
              <div
                className="hidden md:block absolute -z-10 w-[120%] h-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8C1C0] opacity-30 blur-3xl"
                aria-hidden
              />
              <div className="group relative w-full h-[60vh] min-h-[280px] rounded-b-3xl md:h-auto md:min-h-0 md:w-full md:max-w-lg md:aspect-[3/4] md:rounded-[2rem] md:rounded-tr-[4rem] md:rounded-bl-[4rem] overflow-hidden shadow-xl shadow-amber-900/10 md:animate-hero-float">
                <Image
                  src={heroImageUrl}
                  alt="Belleza natural, colección exclusiva"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            {/* Texto + CTA: móvil superpuesto con degradado, desktop normal */}
            <div className="order-2 md:order-1 flex flex-col justify-center text-center md:text-left -mt-4 md:mt-0 relative z-10">
              <div className="bg-gradient-to-t from-[#FDFAF7] via-[#FDFAF7]/90 to-transparent pt-8 pb-2 md:bg-transparent md:pt-0 md:pb-0">
                <h1 className="font-serif font-semibold text-[#2D2D2D] text-4xl md:text-6xl leading-tight md:leading-[1.15] mb-3 md:mb-5 max-w-xl mx-auto md:mx-0">
                  Belleza natural,<br className="hidden md:block" />
                  pensada para ti.
                </h1>
                <p className="font-sans text-[#5A5A5A] text-base md:text-lg leading-loose max-w-xl mx-auto md:mx-0 mb-5 md:mb-8">
                  Descubre una colección exclusiva para tu cuidado personal. Envío rápido y atención personalizada por WhatsApp.
                </p>
                <div className="flex flex-col items-center md:items-start">
                  <Link
                    href="/shop"
                    className="cta-brillar relative inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest text-white bg-[#E8C1C0] hover:bg-[#dfb3b2] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 tap-scale overflow-hidden"
                  >
                    Descubrir Colección
                  </Link>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8 md:mt-10 text-[#9A9A9A] text-sm font-sans">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#9A9A9A]" aria-hidden />
                      Envío Gratis
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#9A9A9A]" aria-hidden />
                      Compra Segura
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios: móvil = carrusel horizontal snap; desktop = grid */}
      <section className="py-8 md:py-16 lg:py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-5 lg:px-8">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 lg:gap-12 md:overflow-visible md:pb-0 scrollbar-hide">
            <div className="group flex-shrink-0 w-[280px] sm:w-[300px] md:flex-shrink md:w-auto snap-center flex flex-col items-center rounded-2xl border border-white/70 bg-white/30 px-4 py-5 md:px-6 md:py-8 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-3 md:mb-4 flex h-11 w-11 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#E8C1C0]/20 transition-transform duration-300 group-hover:rotate-6">
                <Package className="w-5 h-5 md:w-7 md:h-7 text-text-primary" />
              </div>
              <h3 className="font-serif text-base md:text-lg font-semibold text-text-primary mb-1 md:mb-2">
                Envío cuidado
              </h3>
              <p className="text-text-secondary text-xs md:text-sm leading-relaxed max-w-xs">
                Tu pedido empaquetado con mimo. Entrega directa o envío a domicilio.
              </p>
            </div>
            <div className="group flex-shrink-0 w-[280px] sm:w-[300px] md:flex-shrink md:w-auto snap-center flex flex-col items-center rounded-2xl border border-white/70 bg-white/30 px-4 py-5 md:px-6 md:py-8 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-3 md:mb-4 flex h-11 w-11 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#E8C1C0]/20 transition-transform duration-300 group-hover:rotate-6">
                <Shield className="w-5 h-5 md:w-7 md:h-7 text-text-primary" />
              </div>
              <h3 className="font-serif text-base md:text-lg font-semibold text-text-primary mb-1 md:mb-2">
                Compra segura
              </h3>
              <p className="text-text-secondary text-xs md:text-sm leading-relaxed max-w-xs">
                Datos protegidos. Compra con confianza vía WhatsApp.
              </p>
            </div>
            <div className="group flex-shrink-0 w-[280px] sm:w-[300px] md:flex-shrink md:w-auto snap-center flex flex-col items-center rounded-2xl border border-white/70 bg-white/30 px-4 py-5 md:px-6 md:py-8 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="mb-3 md:mb-4 flex h-11 w-11 md:h-14 md:w-14 items-center justify-center rounded-full bg-[#E8C1C0]/20 transition-transform duration-300 group-hover:rotate-6">
                <Truck className="w-5 h-5 md:w-7 md:h-7 text-text-primary" />
              </div>
              <h3 className="font-serif text-base md:text-lg font-semibold text-text-primary mb-1 md:mb-2">
                Entrega a tiempo
              </h3>
              <p className="text-text-secondary text-xs md:text-sm leading-relaxed max-w-xs">
                Envío sin costo desde $200. Entrega en 2-3 días.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lo Nuevo – cuadrícula idéntica a catálogo */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 border-t border-border">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-center text-text-primary mb-8">
          Lo Nuevo
        </h2>
        {newWithImage.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {newWithImage.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                imageUrl={product.imageUrl}
                stock={product.stock}
                isPreOrder={product.isPreOrder ?? false}
                preOrderDays={product.preOrderDays ?? null}
                isNew={index < 2}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-secondary text-lg py-8">
            Próximamente nuevos productos.
          </p>
        )}
      </section>

      {/* Lo Mejor de TuMarca – misma cuadrícula y ProductCard que Lo Nuevo */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 bg-gray-50/50 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-text-primary">
            Lo Mejor de TuMarca
          </h2>
          <Link
            href="/shop"
            className="text-secondary font-medium transition-colors duration-200 hover:underline underline-offset-2 shrink-0 order-first sm:order-none"
          >
            Ver todos los productos →
          </Link>
        </div>
        {topWithImage.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {topWithImage.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                imageUrl={product.imageUrl}
                stock={product.stock}
                isPreOrder={product.isPreOrder ?? false}
                preOrderDays={product.preOrderDays ?? null}
                isNew={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-secondary text-lg py-8">
            Próximamente más productos destacados.
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-primary border-t border-border">
        <div className="container mx-auto px-5 text-center">
          <h2 className="font-serif text-3xl md:text-6xl text-text-primary mb-4 tracking-wide">
            ¿Lista para brillar?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
            Explora la colección y encuentra lo que te hace sentir única.
          </p>
          <Link
            href="/shop"
            className="cta-brillar relative inline-flex items-center justify-center min-h-[48px] bg-[#E8C1C0] text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-200 ease-out hover:bg-[#dfb3b2] hover:scale-[1.02] active:scale-[0.98] tap-scale overflow-hidden"
          >
            Ver colección
          </Link>
        </div>
      </section>
    </div>
  );
}
