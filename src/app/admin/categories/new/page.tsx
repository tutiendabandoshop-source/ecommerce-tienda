"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generar slug automáticamente desde el nombre
  const handleNameChange = (value: string) => {
    setName(value);
    const generatedSlug = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, slug }),
      });

      if (response.ok) {
        router.push("/admin/categories");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.message || "Error al crear la categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la categoría");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="font-serif text-3xl font-semibold text-[#2D2D2D]">Nueva Categoría</h1>
        <p className="font-sans text-[#6B6B6B] mt-1">Crea una nueva categoría para organizar tus productos</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#EDEDED] p-6 md:p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-sans text-sm font-semibold text-[#2D2D2D] mb-2">
              Nombre de la categoría *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="Ejemplo: Electrónica, Ropa, Hogar..."
              className="w-full px-4 py-3 border border-[#EDEDED] rounded-lg focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E] font-sans text-[#2D2D2D] placeholder:text-[#6B6B6B]"
            />
            <p className="font-sans text-sm text-[#6B6B6B] mt-1">Este es el nombre que verán tus clientes</p>
          </div>
          <div>
            <label htmlFor="slug" className="block font-sans text-sm font-semibold text-[#2D2D2D] mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="electronica"
              className="w-full px-4 py-3 border border-[#EDEDED] rounded-lg focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E] font-mono text-sm text-[#2D2D2D]"
            />
            <p className="font-sans text-sm text-[#6B6B6B] mt-1">
              Se genera automáticamente, pero puedes editarlo. Solo letras minúsculas, números y guiones.
            </p>
            {slug && (
              <p className="font-sans text-sm text-[#CB997E] mt-2">
                Vista previa: <span className="font-mono">/shop?category={slug}</span>
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#EDEDED]">
            <button
              type="submit"
              disabled={isSubmitting || !name || !slug}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-[#CB997E] hover:bg-[#B8886E] text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Creando..." : "Crear Categoría"}</span>
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

      <div className="mt-6 bg-[#F8F4F1] border border-[#EDEDED] rounded-2xl p-4 max-w-2xl">
        <h3 className="font-serif font-semibold text-[#2D2D2D] mb-2">💡 Consejos</h3>
        <ul className="font-sans text-sm text-[#6B6B6B] space-y-1">
          <li>• Usa nombres cortos y descriptivos</li>
          <li>• El slug debe ser único y no se puede cambiar después</li>
          <li>• Las categorías ayudan a organizar tu catálogo de productos</li>
        </ul>
      </div>
    </div>
  );
}