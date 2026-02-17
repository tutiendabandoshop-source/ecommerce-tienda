import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Search, Package } from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";

/** Producto considerado "nuevo" si tiene menos de 7 días (mismo criterio que FeaturedProductCard). Solo lógica de servidor. */
function isNewProduct(createdAt: Date): boolean {
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysDiff = (Date.now() - createdAt.getTime()) / msPerDay;
  return daysDiff < 7;
}

export const metadata: Metadata = {
  title: "Tienda",
  description: "Explora el catálogo. Filtra por categoría y encuentra lo que buscas.",
};

export const revalidate = 300;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const where: { isActive: boolean; categoryId?: string; OR?: Array<{ name?: { contains: string; mode: "insensitive" }; description?: { contains: string; mode: "insensitive" } }> } = {
    isActive: true,
  };

  if (params.category) {
    where.categoryId = params.category;
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAtPrice: true,
      images: true,
      stock: true,
      isPreOrder: true,
      preOrderDays: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const productsWithImageUrl = products.map((product) => ({
    ...product,
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
    isNew: product.createdAt ? isNewProduct(product.createdAt) : false,
  }));

  const searchQuery = params.search ? `&search=${encodeURIComponent(params.search)}` : "";
  const shopBase = "/shop";

  return (
    <div className="min-h-screen bg-primary">
      <Header />

      <main className="container mx-auto max-w-7xl px-4 lg:px-8 py-6 lg:py-8">
        {/* Barra de búsqueda ALK: icono lupa izquierda, borde redondeado completo */}
        <div className="relative mb-6">
          <form action={shopBase} method="get" className="max-w-xl">
            {params.category && (
              <input type="hidden" name="category" value={params.category} />
            )}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
              <input
                type="text"
                name="search"
                placeholder="Buscar productos..."
                defaultValue={params.search}
                className="w-full pl-12 pr-4 py-2.5 rounded-full border border-border bg-card text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:ring-2 focus:ring-terracota/30 focus:border-terracota transition-all duration-200 min-h-[40px] text-sm"
              />
            </div>
          </form>
        </div>

        {/* Filtro de categorías (chips) ALK: Todas + categorías */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={params.search ? `${shopBase}?search=${encodeURIComponent(params.search)}` : shopBase}
            className={`min-h-[44px] px-4 py-2.5 rounded-full border text-sm font-medium transition-colors duration-200 ease-out tap-scale ${
              !params.category
                ? "bg-[#E8C1C0] text-white border-[#E8C1C0]"
                : "bg-card border-border text-text-secondary hover:border-[#E8C1C0] hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            Todas
          </Link>
          {categories.map((cat) => {
            const isSelected = params.category === cat.id;
            const href = params.search
              ? `${shopBase}?category=${cat.id}&search=${encodeURIComponent(params.search)}`
              : `${shopBase}?category=${cat.id}`;
            return (
              <Link
                key={cat.id}
                href={href}
                className={`min-h-[44px] px-4 py-2.5 rounded-full border text-sm font-medium transition-colors duration-200 ease-out tap-scale ${
                  isSelected
                    ? "bg-[#E8C1C0] text-white border-[#E8C1C0]"
                    : "bg-card border-border text-text-secondary hover:border-[#E8C1C0] hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Filtros activos y limpiar */}
        {(params.category || params.search) && (
          <div className="flex flex-wrap items-center gap-3 mb-6 pt-2 border-t border-border">
            <span className="text-sm font-semibold text-text-primary">Filtros:</span>
            {params.search && (
              <span className="bg-terracota/20 text-text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                {params.search}
              </span>
            )}
            {params.category && (
              <span className="bg-terracota text-text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                {categories.find((c) => c.id === params.category)?.name}
              </span>
            )}
            <Link
              href={shopBase}
              className="text-sm text-text-secondary hover:text-terracota font-medium underline underline-offset-2 transition-colors duration-200 min-h-[44px] inline-flex items-center py-2 tap-scale"
            >
              Limpiar filtros
            </Link>
          </div>
        )}

        {/* Contador */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-terracota/20 p-2 rounded-xl">
              <Package className="w-5 h-5 text-text-primary" />
            </div>
            <p className="text-text-primary font-medium">
              Mostrando <span className="font-bold text-terracota">{productsWithImageUrl.length}</span>{" "}
              {productsWithImageUrl.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>

        {/* Cuadrícula con ProductCard */}
        {productsWithImageUrl.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {productsWithImageUrl.map((product, index) => (
              <div
                key={product.id}
                className="animate-fadeIn h-full flex"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  stock={product.stock ?? 0}
                  isPreOrder={product.isPreOrder}
                  preOrderDays={product.preOrderDays}
                  compareAtPrice={product.compareAtPrice}
                  isNew={product.isNew}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl shadow-soft border border-border">
            <Package className="w-24 h-24 text-border mx-auto mb-6" />
            <h3 className="font-serif text-2xl font-semibold text-text-primary mb-3">
              No se encontraron productos
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Prueba con otros filtros o búsqueda.
            </p>
            <Link
              href={shopBase}
              className="inline-flex items-center min-h-[44px] bg-[#E8C1C0] text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 ease-out hover:bg-[#dfb3b2] hover:scale-[1.02] active:scale-[0.98] tap-scale"
            >
              Ver todos
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
