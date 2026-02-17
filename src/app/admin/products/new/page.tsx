'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import ImageStudioModal, { ImageData } from '@/components/admin/ImageStudioModal';
import SpecificationsManager from '@/components/admin/SpecificationsManager';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioImages, setStudioImages] = useState<ImageData[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    comparePrice: '',
    stock: '',
    isPreOrder: false,
    preOrderDaysStart: 3,
    preOrderDaysEnd: 5,
    images: [] as string[],
    categoryId: '',
    specifications: [] as { key: string; value: string; order: number }[],
  });

  // Cargar categorías
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error al cargar categorías:', error));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generar slug desde el nombre
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice
          ? parseFloat(formData.comparePrice)
          : null,
        stock: formData.isPreOrder ? null : parseInt(formData.stock) || 0,
        isPreOrder: formData.isPreOrder,
        preOrderDays: formData.isPreOrder
          ? `${formData.preOrderDaysStart} a ${formData.preOrderDaysEnd} días`
          : null,
        specifications: formData.specifications,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el producto');
      }
  
      const result = await response.json();
      
      // ✅ CORRECCIÓN: Verificar estructura del response
      if (!result.success || !result.data || !result.data.id) {
        throw new Error('Respuesta inválida del servidor');
      }
  
      // ✅ Redirigir a edición con el ID correcto
      alert('✅ Producto creado. Ahora puedes agregar variantes (colores, tallas, etc.)');
      router.push(`/admin/products/${result.data.id}/edit`);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al crear el producto');
      setLoading(false);
    }
  };

  return (
    <div className="p-0">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-[#2D2D2D]">Nuevo Producto</h1>
        <p className="font-sans text-[#6B6B6B] mt-1">Completa el formulario para agregar un nuevo producto</p>
      </div>

      <div className="bg-[#F8F4F1] border border-[#EDEDED] rounded-2xl p-4 mb-6 max-w-2xl">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-[#CB997E] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="font-sans text-sm text-[#2D2D2D]">
            <p className="font-semibold mb-1">💡 ¿Tienes variantes?</p>
            <p className="text-[#6B6B6B]">
              Después de crear el producto podrás agregar <strong>colores, tallas y otras variantes</strong> con precios y stock independientes.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[#EDEDED] p-6 max-w-2xl">
        <div className="mb-4">
          <label className="block font-sans font-medium text-[#2D2D2D] mb-2">Nombre del Producto *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 font-sans text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
            placeholder="Ej: Vestido de Seda"
          />
        </div>
        <div className="mb-4">
          <label className="block font-sans font-medium text-[#2D2D2D] mb-2">Slug (URL amigable) *</label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 font-sans text-[#2D2D2D] placeholder:text-[#6B6B6B] bg-[#F8F4F1] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
            placeholder="Se genera automáticamente"
          />
          <p className="font-sans text-xs text-[#6B6B6B] mt-1">URL: /shop/{formData.slug || 'slug-del-producto'}</p>
        </div>
        <div className="mb-4">
          <label className="block font-sans font-medium text-[#2D2D2D] mb-2">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 font-sans text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
            placeholder="Descripción detallada del producto..."
          />
        </div>

        {/* Especificaciones Técnicas */}
        <div className="mb-6">
          <SpecificationsManager
            specifications={formData.specifications}
            onChange={(specs) =>
              setFormData((prev) => ({ ...prev, specifications: specs }))
            }
          />
        </div>

        <div className="mb-4">
          <label className="block font-sans font-medium text-[#2D2D2D] mb-2">Categoría *</label>
          <select
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleInputChange}
            className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 font-sans text-[#2D2D2D] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-sans font-medium text-[#2D2D2D] mb-2">Precio Base *</label>
            <input
              type="number"
              name="price"
              required
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 font-sans text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
              placeholder="0.00"
            />
            <p className="font-sans text-xs text-[#6B6B6B] mt-1">Puedes ajustar por variante después</p>
          </div>
          <div>
            <label className="block font-sans font-medium text-[#2D2D2D] mb-2">Precio Comparativo</label>
            <input
              type="number"
              name="comparePrice"
              step="0.01"
              min="0"
              value={formData.comparePrice}
              onChange={handleInputChange}
              className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 font-sans text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-sans font-medium text-[#2D2D2D] mb-2">Disponibilidad</label>
          <div className="flex items-center gap-4 mb-3">
            <label className="flex items-center gap-2 font-sans text-[#2D2D2D]">
              <input
                type="radio"
                checked={!formData.isPreOrder}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isPreOrder: false,
                    preOrderDaysStart: 3,
                    preOrderDaysEnd: 5,
                  }))
                }
                className="h-4 w-4 text-[#CB997E]"
              />
              <span>Stock normal</span>
            </label>
            <label className="flex items-center gap-2 font-sans text-[#2D2D2D]">
              <input
                type="radio"
                checked={formData.isPreOrder}
                onChange={() => setFormData((prev) => ({ ...prev, isPreOrder: true }))}
                className="h-4 w-4 text-[#CB997E]"
              />
              <span>Sobre pedido</span>
            </label>
          </div>

          {formData.isPreOrder ? (
            <div>
              <label className="block font-sans text-sm font-medium text-[#2D2D2D] mb-1">Días de entrega estimados</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-[#EDEDED] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#CB997E]">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        preOrderDaysStart: Math.max(1, prev.preOrderDaysStart - 1),
                      }))
                    }
                    className="px-2 py-1.5 bg-[#F8F4F1] hover:bg-[#F2E7E2] text-[#2D2D2D] font-semibold"
                  >
                    ↓
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={formData.preOrderDaysStart}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preOrderDaysStart: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className="w-12 text-center border-none focus:ring-0 py-1.5 font-sans text-[#2D2D2D]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, preOrderDaysStart: prev.preOrderDaysStart + 1 }))
                    }
                    className="px-2 py-1.5 bg-[#F8F4F1] hover:bg-[#F2E7E2] text-[#2D2D2D] font-semibold"
                  >
                    ↑
                  </button>
                </div>
                <span className="font-sans text-[#6B6B6B] font-medium">a</span>
                <div className="flex items-center border border-[#EDEDED] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#CB997E]">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        preOrderDaysEnd: Math.max(
                          prev.preOrderDaysStart + 1,
                          prev.preOrderDaysEnd - 1
                        ),
                      }))
                    }
                    className="px-2 py-1.5 bg-[#F8F4F1] hover:bg-[#F2E7E2] text-[#2D2D2D] font-semibold"
                  >
                    ↓
                  </button>
                  <input
                    type="number"
                    min={formData.preOrderDaysStart + 1}
                    value={formData.preOrderDaysEnd}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        preOrderDaysEnd: Math.max(
                          prev.preOrderDaysStart + 1,
                          parseInt(e.target.value) || prev.preOrderDaysStart + 1
                        ),
                      }))
                    }
                    className="w-12 text-center border-none focus:ring-0 py-1.5 font-sans text-[#2D2D2D]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, preOrderDaysEnd: prev.preOrderDaysEnd + 1 }))
                    }
                    className="px-2 py-1.5 bg-[#F8F4F1] hover:bg-[#F2E7E2] text-[#2D2D2D] font-semibold"
                  >
                    ↑
                  </button>
                </div>
                <span className="font-sans text-[#6B6B6B] font-medium">días</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block font-sans text-sm font-medium text-[#2D2D2D] mb-1">Stock Base *</label>
              <input
                type="number"
                name="stock"
                required={!formData.isPreOrder}
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full border border-[#EDEDED] rounded-lg px-4 py-2 font-sans text-[#2D2D2D] placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-[#CB997E] focus:border-[#CB997E]"
                placeholder="0"
              />
              <p className="font-sans text-xs text-[#6B6B6B] mt-1">El stock de variantes es independiente</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-sans font-medium text-[#2D2D2D] mb-2">Imágenes del Producto</label>
          <button
            type="button"
            onClick={() => {
              setStudioImages(
                formData.images.map((url, i) => ({
                  id: `existing-${i}-${url.slice(-12)}`,
                  url,
                  isPrimary: i === 0,
                }))
              );
              setStudioOpen(true);
            }}
            className="bg-[#CB997E] hover:bg-[#B8886E] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Gestionar Imágenes ({formData.images.length})
          </button>

          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {formData.images.slice(0, 4).map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Imagen ${idx + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border border-[#EDEDED]"
                />
              ))}
            </div>
          )}

          <p className="font-sans text-xs text-[#6B6B6B] mt-2">
            {formData.images.length === 0
              ? 'Aún no has agregado imágenes. Máximo 8 imágenes.'
              : `${formData.images.length}/8 imágenes • La primera es la principal`}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 min-w-[160px] bg-[#CB997E] hover:bg-[#B8886E] text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando...' : 'Crear Producto y Agregar Variantes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            disabled={loading}
            className="px-6 py-3 bg-[#F2E7E2] text-[#CB997E] rounded-lg hover:bg-[#E8D9D2] transition disabled:opacity-50 font-sans font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Modal de Gestión de Imágenes */}
      <ImageStudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        images={studioImages}
        onSave={async (images) => {
          const urls = images.map((img) => img.url);
          setFormData((prev) => ({ ...prev, images: urls }));
          setStudioImages(images);
        }}
        maxImages={8}
        title="Imágenes del Producto"
      />
    </div>
  );
}