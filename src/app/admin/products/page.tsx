export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
}

async function deleteProduct(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-[#2D2D2D]">Productos</h2>
          <p className="font-sans text-[#6B6B6B] mt-1">Gestiona el catálogo</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#CB997E] hover:bg-[#B8886E] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CB997E] focus:ring-offset-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#EDEDED]">
          <p className="font-sans text-sm font-medium text-[#6B6B6B]">Total Productos</p>
          <p className="font-serif text-4xl font-semibold text-[#2D2D2D] mt-2">{products.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#EDEDED]">
          <p className="font-sans text-sm font-medium text-[#6B6B6B]">En Stock</p>
          <p className="font-serif text-4xl font-semibold text-[#2D2D2D] mt-2">
            {products.filter(p => p.stock !== null && p.stock > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#EDEDED]">
          <p className="font-sans text-sm font-medium text-[#6B6B6B]">Sin Stock</p>
          <p className="font-serif text-4xl font-semibold text-[#2D2D2D] mt-2">
            {products.filter(p => p.stock !== null && p.stock === 0).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-[#EDEDED] overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-[#6B6B6B] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="font-serif text-lg font-semibold text-[#2D2D2D] mb-2">No hay productos</h3>
            <p className="font-sans text-[#6B6B6B] mb-6">Crea tu primer producto</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-[#CB997E] hover:bg-[#B8886E] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Producto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-[#F8F4F1] border-b border-[#EDEDED]">
                  <th className="px-6 py-4 text-left font-serif font-semibold text-[#2D2D2D]">Producto</th>
                  <th className="px-6 py-4 text-left font-serif font-semibold text-[#2D2D2D]">Categoría</th>
                  <th className="px-6 py-4 text-left font-serif font-semibold text-[#2D2D2D]">Precio</th>
                  <th className="px-6 py-4 text-left font-serif font-semibold text-[#2D2D2D]">Stock</th>
                  <th className="px-6 py-4 text-left font-serif font-semibold text-[#2D2D2D]">Estado</th>
                  <th className="px-6 py-4 text-right font-serif font-semibold text-[#2D2D2D]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const productImage = product.images && product.images.length > 0 ? product.images[0] : null;
                  const stock = product.stock ?? 0;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-[#EDEDED] bg-white transition-colors hover:bg-[#FDFAF7]"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-[#EDEDED]"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#F8F4F1] flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="font-sans font-semibold text-[#2D2D2D]">{product.name}</p>
                            <p className="text-sm font-sans text-[#6B6B6B] line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#F2E7E2] text-[#CB997E]">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-sans font-semibold text-[#2D2D2D]">
                          ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-sans font-medium ${stock > 10 ? 'text-[#2D2D2D]' : stock > 0 ? 'text-amber-700' : 'text-[#6B6B6B]'}`}>
                          {product.isPreOrder ? (
                            <span className="text-amber-700">Sobre pedido</span>
                          ) : (
                            `${stock} unidades`
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {product.isPreOrder ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium bg-amber-50 text-amber-800">
                            Sobre pedido ({product.preOrderDays})
                          </span>
                        ) : stock > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#F2E7E2] text-[#CB997E]">
                            Disponible
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#F5E0DC] text-[#9B6B6B]">
                            Agotado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center justify-center w-9 h-9 bg-[#F2E7E2] hover:bg-[#E8D9D2] text-[#CB997E] rounded-lg transition-colors font-medium"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <form action={deleteProduct} className="inline">
                            <input type="hidden" name="id" value={product.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center justify-center w-9 h-9 bg-[#F5E0DC] hover:bg-[#EDD4CF] text-[#9B6B6B] rounded-lg transition-colors font-medium"
                              title="Eliminar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
