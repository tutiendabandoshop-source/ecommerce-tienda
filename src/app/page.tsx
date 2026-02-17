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

  const products = newWithImage;
  const latestProduct = products.length > 0 ? products[products.length - 1] : null;
  const heroImageUrl = latestProduct?.imageUrl ?? "/hero-main.jpg";
  const heroImageAlt = latestProduct?.name ?? "Belleza natural, colección exclusiva";

  return (
    <div className="min-h-screen bg-primary">
      <Header />

      {/* Hero: móvil = capas (imagen retrato + texto con padding); desktop = grid 2 cols */}
      <section className="bg-[#FDFAF7] pt-0 pb-10 md:pt-10 md:pb-16 lg:pt-12 lg:pb-20 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-full">
          {/* Móvil: diseño por capas. Desktop: grid de 2 columnas */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-0 md:gap-10 lg:gap-16 md:items-center min-h-0">
            {/* Imagen: móvil = dominante arriba aspect-[4/5]; desktop = columna derecha */}
            <div className="order-1 md:order-2 relative flex justify-center md:justify-end w-full max-w-full">
              <div
                className="hidden md:block absolute -z-10 w-[120%] h-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8C1C0] opacity-30 blur-3xl"
                aria-hidden
              />
              <div className="group relative w-full max-w-full aspect-[4/5] sm:aspect-[4/5] md:aspect-[3/4] md:max-w-lg rounded-b-3xl md:rounded-[2rem] md:rounded-tr-[4rem] md:rounded-bl-[4rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(139,92,86,0.15)] md:shadow-[0_32px_64px_-12px_rgba(139,92,86,0.18)] animate-hero-float">
                <Image
                  src={heroImageUrl}
                  alt={heroImageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            {/* Texto + CTA: móvil = centrado, padding-top generoso; desktop = columna izquierda */}
            <div className="order-2 md:order-1 flex flex-col justify-center text-center md:text-left pt-10 sm:pt-12 md:pt-0 relative z-10">
              <div className="md:bg-transparent">
                {latestProduct && (
                  <span className="inline-block mb-2 rounded-full bg-[#E8C1C0]/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#CB997E]">
                    ¡Recién llegado!
                  </span>
                )}
                <h1 className="font-serif font-semibold text-[#2D2D2D] text-4xl sm:text-4xl md:text-6xl leading-tight md:leading-[1.15] mb-3 md:mb-5 max-w-xl mx-auto md:mx-0">
                  Belleza natural,<br className="hidden md:block" />
                  pensada para ti.
                </h1>
                <p className="font-sans text-[#5A5A5A] text-base md:text-lg leading-loose max-w-xl mx-auto md:mx-0 mb-5 md:mb-8">
                  Descubre una colección exclusiva para tu cuidado personal. Envío rápido y atención personalizada por WhatsApp.
                </p>
                <div className="flex flex-col items-center md:items-start">
                  <Link
                    href="/shop"
                    className="cta-brillar relative inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest text-white bg-[#CB997E] hover:bg-[#B58369] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 tap-scale overflow-hidden"
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

      {/* Beneficios: móvil = columna centrada (Compra Segura en centro visual); desktop = grid 3 cols */}
      <section className="py-8 md:py-16 lg:py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-5 lg:px-8 max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-12 justify-items-center">
            <div className="group w-full max-w-xs flex flex-col items-center rounded-2xl border border-white/70 bg-white/30 px-6 py-6 md:px-6 md:py-8 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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
            <div className="group w-full max-w-xs flex flex-col items-center rounded-2xl border border-white/70 bg-white/30 px-6 py-6 md:px-6 md:py-8 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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
            <div className="group w-full max-w-xs flex flex-col items-center rounded-2xl border border-white/70 bg-white/30 px-6 py-6 md:px-6 md:py-8 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
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

      {/* Lo mejor de Áurea – misma cuadrícula y ProductCard que Lo Nuevo */}
      <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 bg-gray-50/50 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-text-primary">
            Lo mejor de Áurea
          </h2>
          <Link
            href="/shop"
            className="text-[#CB997E] font-medium transition-colors duration-200 hover:underline underline-offset-2 hover:text-[#B58369] shrink-0 order-first sm:order-none"
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
            className="cta-brillar relative inline-flex items-center justify-center min-h-[48px] bg-[#CB997E] text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:bg-[#B58369] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] tap-scale overflow-hidden"
          >
            Ver colección
          </Link>
        </div>
      </section>
    </div>
  );
}
