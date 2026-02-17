import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VariantsManager from './VariantsManager';
import AvailabilitySelector from './AvailabilitySelector';
import EditProductImagesSection from './EditProductImagesSection';
import SpecificationsManagerField from '@/components/admin/SpecificationsManagerField';

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      specifications: { orderBy: { order: 'asc' } },
    },
  });
  
  if (!product) {
    notFound();
  }
  
  return product;
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
}

async function updateProduct(formData: FormData) {
  'use server';
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const isPreOrder = formData.get('isPreOrder') === 'true';
  const preOrderDays = (formData.get('preOrderDays') as string) || null;
  const stockRaw = formData.get('stock') as string;
  const stock = !isPreOrder && stockRaw ? parseInt(stockRaw) : null;
  const categoryId = formData.get('categoryId') as string;
  const imagesJson = formData.get('imagesJson') as string | null;
  const imageUrl = formData.get('imageUrl') as string | null;
  const specificationsJson = formData.get('specificationsJson') as string | null;

  // Resolver array de imágenes: preferir imagesJson, sino imageUrl (1 imagen)
  let images: string[] = [];
  if (imagesJson && imagesJson.trim() !== '') {
    try {
      const parsed = JSON.parse(imagesJson) as unknown;
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
        images = parsed;
      }
    } catch {
      // Si falla el parse, usar imageUrl si existe
    }
  }
  if (images.length === 0 && imageUrl && imageUrl.trim() !== '') {
    images = [imageUrl];
  }

  let specifications: { key: string; value: string; order: number }[] = [];
  if (specificationsJson && specificationsJson.trim() !== '') {
    try {
      const parsed = JSON.parse(specificationsJson) as unknown;
      if (Array.isArray(parsed)) {
        specifications = parsed
          .filter(
            (s: unknown) =>
              s &&
              typeof s === 'object' &&
              'key' in s &&
              'value' in s &&
              typeof (s as { key: unknown }).key === 'string' &&
              typeof (s as { value: unknown }).value === 'string'
          )
          .map((s: any, i: number) => ({
            key: String(s.key),
            value: String(s.value),
            order: typeof s.order === 'number' ? s.order : i,
          }));
      }
    } catch {
      // ignorar JSON inválido
    }
  }

  // Generar slug automáticamente desde el nombre
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price,
      stock: isPreOrder ? null : stock,
      isPreOrder,
      preOrderDays: isPreOrder ? (preOrderDays?.trim() || null) : null,
      category: {
        connect: { id: categoryId }
      },
      images,
      specifications: {
        deleteMany: {},
        create: specifications.map((spec) => ({
          key: spec.key,
          value: spec.value,
          order: spec.order,
        })),
      },
    },
  });

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const categories = await getCategories();

  // ✅ Obtener la primera imagen del array (o null si está vacío)
  const currentImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-[#F8F4F1] rounded-lg transition-colors text-[#2D2D2D]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[#2D2D2D]">Editar Producto</h2>
            <p className="font-sans text-[#6B6B6B] mt-1">Actualiza la información de &quot;{product.name}&quot;</p>
          </div>
        </div>
      </div>

      <div className="bg-[#F8F4F1] border border-[#EDEDED] rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          {/* ✅ CORREGIDO: Usar currentImage en vez de product.imageUrl */}
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.name}
              className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-white border border-[#EDEDED] flex items-center justify-center">
              <svg className="w-10 h-10 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-sans font-semibold text-[#2D2D2D] text-lg">{product.name}</h3>
            <p className="font-sans text-[#6B6B6B] text-sm">{product.category.name}</p>
            <p className="font-sans text-[#CB997E] font-semibold mt-1">
              ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </p>
          </div>
          <div className="text-right">
            <p className="font-sans text-sm text-[#6B6B6B]">
              {product.isPreOrder ? 'Disponibilidad' : 'Stock actual'}
            </p>
            <p className="font-serif text-2xl font-semibold text-[#CB997E]">
              {product.isPreOrder
                ? `⏳ Sobre pedido${product.preOrderDays ? ` (${product.preOrderDays})` : ''}`
                : product.stock ?? 0}
            </p>
          </div>
        </div>
      </div>

      <form action={updateProduct} className="bg-white rounded-2xl shadow-sm border border-[#EDEDED] p-6 md:p-8 mb-8">
        <input type="hidden" name="id" value={product.id} />
        
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={product.name}
              className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 font-sans text-[#2D2D2D] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
              placeholder="Ej: iPhone 15 Pro"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              defaultValue={product.description || ''}
              className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 resize-none font-sans text-[#2D2D2D] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
              placeholder="Describe las características principales del producto..."
            />
          </div>

          {/* Especificaciones Técnicas */}
          <div className="mb-6">
            <SpecificationsManagerField
              name="specificationsJson"
              initialSpecifications={(product.specifications ?? []).map((s) => ({
                key: s.key,
                value: s.value,
                order: s.order,
              }))}
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block font-medium text-gray-700 mb-2">
              Precio Base (MXN) *
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-4 top-2.5 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="price"
                name="price"
                required
                step="0.01"
                min="0"
                defaultValue={product.price}
                className="w-full pl-8 pr-4 py-2 border border-[#EDEDED] rounded-lg font-sans text-[#2D2D2D] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Las variantes pueden tener precios diferentes
            </p>
          </div>

          {/* Disponibilidad: Stock o Sobre pedido */}
          <AvailabilitySelector
            defaultIsPreOrder={product.isPreOrder}
            defaultPreOrderDays={product.preOrderDays}
            defaultStock={product.stock}
          />

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={product.categoryId}
              className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 bg-white font-sans text-[#2D2D2D] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Imágenes del Producto (modal ImageStudio) */}
          <EditProductImagesSection initialImages={product.images ?? []} />

          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#EDEDED]">
            <button
              type="submit"
              className="flex-1 min-w-[140px] bg-[#CB997E] hover:bg-[#B8886E] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              Guardar Cambios
            </button>
            <Link
              href="/admin/products"
              className="flex-1 min-w-[140px] bg-[#F2E7E2] hover:bg-[#E8D9D2] text-[#CB997E] px-6 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-[#EDEDED] p-6 md:p-8">
        <VariantsManager productId={product.id} basePrice={product.price} />
      </div>

      <div className="mt-6 bg-[#F8F4F1] border border-[#EDEDED] rounded-2xl p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-[#CB997E] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="font-sans text-sm text-[#2D2D2D]">
            <p className="font-semibold mb-1">Importante</p>
            <p className="text-[#6B6B6B]">
              Los cambios afectarán la información visible en la tienda inmediatamente. Verifica que toda la información sea correcta antes de guardar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}