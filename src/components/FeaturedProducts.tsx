"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import FeaturedProductCard from "./FeaturedProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  stock: number | null;
  isPreOrder?: boolean;
  preOrderDays?: string | null;
  createdAt: string;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?limit=8&isActive=true");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Error al cargar productos");
        setProducts(json.data ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const productsWithImage = products.map((p) => ({
    ...p,
    imageUrl: p.images?.[0] ?? null,
  }));

  if (loading) {
    return (
      <section className="bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-12 animate-pulse text-center">
            <div className="mx-auto mb-4 h-8 w-32 rounded-full bg-border" />
            <div className="mx-auto mb-4 h-12 w-64 rounded bg-border" />
            <div className="mx-auto h-4 w-96 rounded bg-primary/50" />
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-primary/30">
                <div className="aspect-square rounded-t-xl bg-border" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-border" />
                  <div className="h-6 w-20 rounded bg-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <p className="text-text-secondary">No se pudieron cargar los productos. Intenta de nuevo.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card py-16 sm:py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-10 animate-fadeIn text-center sm:mb-12">
          <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-text-primary tracking-[0.2em] uppercase mb-2">
            Lo nuevo
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary tracking-wide mb-4">
            Lo mejor de TuMarca
          </h2>
          <p className="mx-auto max-w-2xl text-base text-text-secondary sm:text-lg">
            Productos elegidos para ti. Elige el tuyo.
          </p>
        </div>

        {productsWithImage.length > 0 ? (
          <>
            {/* Mobile: horizontal swipe – espaciado px-5 */}
            <div className="-mx-5 overflow-x-auto overscroll-x-contain px-5 pb-4 scrollbar-hide [scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch] md:mx-0 md:hidden md:overflow-visible md:px-0">
              <div className="flex gap-6">
                {productsWithImage.map((product) => (
                  <div key={product.id} className="shrink-0 [scroll-snap-align:start]">
                    <FeaturedProductCard
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      imageUrl={product.imageUrl}
                      stock={product.stock}
                      createdAt={product.createdAt}
                      isPreOrder={product.isPreOrder}
                      preOrderDays={product.preOrderDays}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tablet/Desktop: grid 2 cols tablet, 4 desktop */}
            <div className="hidden grid-cols-2 gap-6 md:grid lg:grid-cols-4 lg:gap-8">
              {productsWithImage.map((product) => (
                <FeaturedProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  stock={product.stock}
                  createdAt={product.createdAt}
                  isPreOrder={product.isPreOrder}
                  preOrderDays={product.preOrderDays}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center">
            <Package className="mx-auto mb-4 h-24 w-24 text-border" />
            <p className="text-lg text-text-secondary">No hay productos disponibles aún</p>
          </div>
        )}

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/shop"
            className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center rounded-full bg-secondary text-secondary-foreground px-8 py-4 text-base font-semibold transition-all duration-200 ease-out hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] tap-scale"
          >
            <span>Ver todos los productos</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
