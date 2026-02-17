"use client";

import ProductCard from "./ProductCard";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NEW_PRODUCT_DAYS = 7;

export function isNewProduct(createdAt: string): boolean {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return (now - created) / MS_PER_DAY < NEW_PRODUCT_DAYS;
}

interface FeaturedProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number | null;
  createdAt: string;
  isPreOrder?: boolean;
  preOrderDays?: string | null;
  compareAtPrice?: number | null;
  /** Si se pasa, se muestra este texto en el badge (ej. "Nuevo", "Destacado"). Si no, se muestra "Nuevo" cuando el producto es reciente (< 7 días). */
  badgeLabel?: string | null;
}

/** Wrapper que calcula isNew por fecha y delega todo el diseño a ProductCard (misma tarjeta en toda la tienda). */
export default function FeaturedProductCard({
  id,
  name,
  slug,
  price,
  imageUrl,
  stock,
  createdAt,
  isPreOrder = false,
  preOrderDays = null,
  compareAtPrice = null,
  badgeLabel = null,
}: FeaturedProductCardProps) {
  const isNew = isNewProduct(createdAt);
  const resolvedBadge = badgeLabel ?? (isNew ? "Nuevo" : null);

  return (
    <ProductCard
      id={id}
      name={name}
      slug={slug}
      price={price}
      imageUrl={imageUrl}
      stock={stock}
      isPreOrder={isPreOrder}
      preOrderDays={preOrderDays}
      compareAtPrice={compareAtPrice}
      isNew={isNew}
      badgeLabel={resolvedBadge}
    />
  );
}
