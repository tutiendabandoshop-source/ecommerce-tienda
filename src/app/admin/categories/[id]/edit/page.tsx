"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, FolderTree } from "lucide-react";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string>("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [productsCount, setProductsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      setCategoryId(resolvedParams.id);
      loadCategory(resolvedParams.id);
    });
  }, [params]);

  const loadCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`);
      if (response.ok) {
        const data = await response.json();
        setName(data.name);
        setSlug(data.slug);
        setProductsCount(data._count.products);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar la categoría");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || "Error al actualizar la categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar la categoría");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="inline-flex items-center font-sans text-[#CB997E] hover:text-[#B8886E] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a categorías
        </Link>
        <h1 className="font-serif text-3xl font-semibold text-[#2D2D2D]">Editar Categoría</h1>
        <p className="font-sans text-[#6B6B6B] mt-1">Actualiza la información de la categoría</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-[#EDEDED] p-6 sticky top-8">
            <h3 className="font-serif font-semibold text-[#2D2D2D] mb-4">Vista Actual</h3>
            <div className="space-y-4">
              <div className="bg-[#F2E7E2] p-4 rounded-lg flex items-center space-x-3">
                <FolderTree className="w-8 h-8 text-[#CB997E]" />
                <div>
                  <p className="font-sans font-semibold text-[#2D2D2D]">{name}</p>
                  <p className="font-sans text-sm text-[#6B6B6B] font-mono">{slug}</p>
                </div>
              </div>
              <div className="font-sans text-sm text-[#6B6B6B]">
                <p><span className="font-semibold text-[#2D2D2D]">Productos:</span> {productsCount}</p>
                <p className="mt-2 text-xs">💡 El slug no se puede modificar para mantener la integridad de las URLs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-[#EDEDED] p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-sans text-sm font-semibold text-[#2D2D2D] mb-2">
                  Nombre de la categoría *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ejemplo: Electrónica, Ropa, Hogar..."
                  className="w-full px-4 py-3 border border-[#EDEDED] rounded-lg focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E] font-sans text-[#2D2D2D]"
                />
              </div>
              <div>
                <label htmlFor="slug" className="block font-sans text-sm font-semibold text-[#2D2D2D] mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  disabled
                  className="w-full px-4 py-3 border border-[#EDEDED] rounded-lg bg-[#F8F4F1] text-[#6B6B6B] font-mono text-sm cursor-not-allowed"
                />
                <p className="font-sans text-sm text-[#6B6B6B] mt-1">El slug no se puede modificar una vez creado</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#EDEDED]">
                <button
                  type="submit"
                  disabled={isSubmitting || !name}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-[#CB997E] hover:bg-[#B8886E] text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSubmitting ? "Guardando..." : "Guardar Cambios"}</span>
                </button>
                <Link
                  href="/admin/categories"
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-[#F2E7E2] text-[#CB997E] py-3 px-6 rounded-lg font-semibold hover:bg-[#E8D9D2] transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Cancelar</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
