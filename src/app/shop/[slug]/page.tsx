import { notFound } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import Header from '@/components/Header';

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: {
      slug,
      isActive: true,
    },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      },
      specifications: { orderBy: { order: 'asc' } },
    },
  });

  if (!product) {
    notFound();
  }

  return product;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Transformar el producto: images (galería), imageUrl (primera para carrito/OG)
  const transformedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    comparePrice: product.compareAtPrice,
    stock: product.stock ?? 0,
    isPreOrder: product.isPreOrder,
    preOrderDays: product.preOrderDays,
    images: product.images ?? [],
    imageUrl: product.images && product.images.length > 0 ? product.images[0] : null,
    category: {
      id: product.category.id,
      name: product.category.name,
    },
    variants: product.variants.map(variant => ({
      id: variant.id,
      color: variant.color,
      size: variant.size,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      imageUrl: variant.imageUrl,
      images: variant.images ?? [],
    })),
    specifications: (product.specifications ?? []).map((s) => ({
      id: s.id,
      key: s.key,
      value: s.value,
      order: s.order,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F7] via-white to-bg-light w-full max-w-full overflow-x-hidden">
      <Header />
      
      <main className="max-w-7xl mx-auto w-full max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailClient product={transformedProduct} />
      </main>
    </div>
  );
}

// ✅ Generar metadata dinámica
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  try {
    const product = await getProduct(slug);
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

    return {
      title: `${product.name} | Áurea`,
      description: product.description || `Compra ${product.name} en Áurea`,
      openGraph: imageUrl ? {
        images: [imageUrl],
      } : undefined,
    };
  } catch {
    return {
      title: 'Producto no encontrado | Áurea',
    };
  }
}