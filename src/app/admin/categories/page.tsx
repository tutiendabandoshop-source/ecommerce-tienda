export const dynamic = 'force-dynamic';

import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Trash2, FolderTree, Package } from "lucide-react";
import { revalidatePath } from "next/cache";

async function deleteCategory(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;

  const productsCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productsCount > 0) {
    return;
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const totalCategories = categories.length;
  const totalProducts = await prisma.product.count();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#2D2D2D]">Categorías</h1>
          <p className="font-sans text-[#6B6B6B] mt-1">Gestiona las categorías de productos</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-[#CB997E] hover:bg-[#B8886E] text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Categoría</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#EDEDED]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm text-[#6B6B6B]">Total Categorías</p>
              <p className="font-serif text-3xl font-semibold text-[#2D2D2D] mt-2">{totalCategories}</p>
            </div>
            <div className="bg-[#F2E7E2] p-3 rounded-lg">
              <FolderTree className="w-6 h-6 text-[#CB997E]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#EDEDED]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm text-[#6B6B6B]">Total Productos</p>
              <p className="font-serif text-3xl font-semibold text-[#2D2D2D] mt-2">{totalProducts}</p>
            </div>
            <div className="bg-[#F8F4F1] p-3 rounded-lg">
              <Package className="w-6 h-6 text-[#CB997E]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#EDEDED]">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm text-[#6B6B6B]">Promedio productos/categoría</p>
              <p className="font-serif text-3xl font-semibold text-[#2D2D2D] mt-2">
                {totalCategories > 0 ? Math.round(totalProducts / totalCategories) : 0}
              </p>
            </div>
            <div className="bg-[#F2E7E2] p-3 rounded-lg">
              <FolderTree className="w-6 h-6 text-[#CB997E]" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#EDEDED] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#F8F4F1] border-b border-[#EDEDED]">
              <th className="px-6 py-4 text-left font-serif font-semibold text-[#2D2D2D]">Nombre</th>
              <th className="px-6 py-4 text-left font-serif font-semibold text-[#2D2D2D]">Slug</th>
              <th className="px-6 py-4 text-left font-serif font-semibold text-[#2D2D2D]">Productos</th>
              <th className="px-6 py-4 text-left font-serif font-semibold text-[#2D2D2D]">Fecha creación</th>
              <th className="px-6 py-4 text-right font-serif font-semibold text-[#2D2D2D]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="bg-white border-b border-[#EDEDED] hover:bg-[#FDFAF7] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-[#F2E7E2] p-2 rounded-lg mr-3">
                      <FolderTree className="w-5 h-5 text-[#CB997E]" />
                    </div>
                    <span className="font-sans text-sm font-medium text-[#2D2D2D]">{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-sans text-sm text-[#6B6B6B] font-mono bg-[#F8F4F1] px-2 py-1 rounded">
                    {category.slug}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-sans font-medium bg-[#F2E7E2] text-[#CB997E]">
                    {category._count.products} productos
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-sans text-sm text-[#6B6B6B]">
                  {new Date(category.createdAt).toLocaleDateString("es-MX")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="inline-flex items-center justify-center w-9 h-9 bg-[#F2E7E2] hover:bg-[#E8D9D2] text-[#CB997E] rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <form action={deleteCategory} className="inline">
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        disabled={category._count.products > 0}
                        className="inline-flex items-center justify-center w-9 h-9 bg-[#F5E0DC] hover:bg-[#EDD4CF] text-[#9B6B6B] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          category._count.products > 0
                            ? "No se puede eliminar una categoría con productos"
                            : "Eliminar categoría"
                        }
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <FolderTree className="w-16 h-16 text-[#6B6B6B] mx-auto mb-4" />
            <p className="font-sans text-[#6B6B6B] text-lg">No hay categorías registradas</p>
            <Link
              href="/admin/categories/new"
              className="inline-block mt-2 font-sans font-semibold text-[#CB997E] hover:text-[#B8886E] transition-colors"
            >
              Crear primera categoría
            </Link>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}