'use client';

import { useState, useCallback, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { ChevronUp, ChevronDown, X, Upload, Star, Trash2, Eye, Image as ImageIcon, Loader2 } from 'lucide-react';

// ========================================
// TIPOS
// ========================================
export interface ImageData {
  id: string;
  url: string;
  file?: File;
  isUploading?: boolean;
  uploadProgress?: number;
  isPrimary?: boolean;
}

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageData[];
  onSave: (images: ImageData[]) => Promise<void>;
  maxImages?: number;
  title?: string;
}

// ========================================
// COMPONENTE: TARJETA DE IMAGEN
// ========================================
function ImageCard({
  image,
  images,
  onDelete,
  onSetPrimary,
  onView,
  onMoveUp,
  onMoveDown,
}: {
  image: ImageData;
  images: ImageData[];
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onView: (url: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  const currentIndex = images.findIndex((img) => img.id === image.id);
  const isLast = currentIndex === images.length - 1;

  return (
    <div className="relative group bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#FF5722] transition-all duration-200 aspect-square">
      {/* Imagen */}
      <div className="w-full h-full relative">
        {image.url ? (
          <img
            src={image.url}
            alt="Producto"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Badge "Principal" */}
      {image.isPrimary && (
        <div className="absolute top-2 left-2 bg-[#FF5722] text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1 z-10">
          <Star className="w-3 h-3 fill-white" />
          PRINCIPAL
        </div>
      )}

      {/* Progress bar si está subiendo */}
      {image.isUploading && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
          <div className="w-3/4 bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#FF5722] h-2 rounded-full transition-all duration-300"
              style={{ width: `${image.uploadProgress || 0}%` }}
            />
          </div>
          <p className="text-white text-xs mt-2">{image.uploadProgress || 0}%</p>
        </div>
      )}

      {/* Botones de acción (solo visible en hover si no está subiendo) */}
      {!image.isUploading && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              {/* Botones de reordenar */}
              <div className="flex flex-col gap-1">
                {!image.isPrimary && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveUp(image.id);
                    }}
                    className="p-1.5 bg-white/90 hover:bg-white rounded transition-colors"
                    title="Mover arriba"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                )}
                {!isLast && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveDown(image.id);
                    }}
                    className="p-1.5 bg-white/90 hover:bg-white rounded transition-colors"
                    title="Mover abajo"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                )}
              </div>

              {/* Botón: Ver fullscreen */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(image.url);
                }}
                className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                title="Ver imagen completa"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>

              {/* Botón: Marcar como principal */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetPrimary(image.id);
                }}
                className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors"
                title="Marcar como principal"
              >
                <Star
                  className={`w-4 h-4 ${
                    image.isPrimary ? 'fill-[#FF5722] text-[#FF5722]' : 'text-gray-700'
                  }`}
                />
              </button>
            </div>

            {/* Botón: Eliminar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
              className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              title="Eliminar imagen"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL: MODAL
// ========================================
export default function ImageStudioModal({
  isOpen,
  onClose,
  images: initialImages,
  onSave,
  maxImages = 8,
  title = 'Gestionar Imágenes',
}: ImageStudioModalProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronizar con initialImages al abrir el modal
  useEffect(() => {
    if (isOpen) {
      setImages(initialImages);
      setFullscreenImage(null);
    }
  }, [isOpen, initialImages]);

  // ========================================
  // FUNCIÓN: SUBIR IMAGEN A CLOUDINARY (progress real con XHR)
  // ========================================
  const uploadImage = useCallback((file: File, imageId: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, uploadProgress: percentComplete } : img
          )
        );
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId
                ? {
                    ...img,
                    url: data.url,
                    isUploading: false,
                    uploadProgress: 100,
                  }
                : img
            )
          );
          setTimeout(() => {
            setImages((prev) =>
              prev.map((img) =>
                img.id === imageId ? { ...img, uploadProgress: 0 } : img
              )
            );
          }, 1000);
        } catch {
          setImages((prev) => prev.filter((img) => img.id !== imageId));
          alert('Error al procesar la respuesta');
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          alert(err.error || 'Error al subir');
        } catch {
          alert(xhr.responseText || 'Error al subir');
        }
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    });

    xhr.addEventListener('error', () => {
      alert('Error de red');
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  }, []);

  // ========================================
  // DROPZONE: DRAG & DROP (con compresión si > 1MB)
  // ========================================
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remainingSlots = maxImages - images.length;

      let filesToAdd = acceptedFiles;
      if (acceptedFiles.length > remainingSlots) {
        alert(`Solo puedes agregar ${remainingSlots} imagen(es) más. Máximo ${maxImages} imágenes.`);
        filesToAdd = acceptedFiles.slice(0, remainingSlots);
      }

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      const hadNoImages = images.length === 0;
      let isFirstInBatch = true;
      const baseId = Date.now();

      for (let idx = 0; idx < filesToAdd.length; idx++) {
        const file = filesToAdd[idx];
        if (file.size > MAX_FILE_SIZE) {
          alert(`La imagen "${file.name}" es demasiado grande. Máximo 5MB.`);
          continue;
        }

        // Comprimir imagen si es > 1MB
        let processedFile: File = file;
        if (file.size > 1024 * 1024) {
          try {
            processedFile = await imageCompression(file, {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            });
          } catch (error) {
            console.error('Error al comprimir:', error);
            // Si falla compresión, usar archivo original
          }
        }

        const imageId = `img-${baseId}-${idx}`;
        const preview = URL.createObjectURL(processedFile);

        const newImage: ImageData = {
          id: imageId,
          url: preview,
          file: processedFile,
          isUploading: true,
          uploadProgress: 0,
          isPrimary: hadNoImages && isFirstInBatch,
        };
        isFirstInBatch = false;

        setImages((prev) => [...prev, newImage]);

        uploadImage(processedFile, imageId);
      }
    },
    [images.length, maxImages, uploadImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    multiple: true,
    disabled: images.length >= maxImages,
  });

  // ========================================
  // HANDLERS
  // ========================================
  const handleMoveUp = (id: string) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      if (index <= 0) return prev;

      const newOrder = [...prev];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];

      return newOrder.map((img, idx) => ({
        ...img,
        isPrimary: idx === 0,
      }));
    });
  };

  const handleMoveDown = (id: string) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      if (index === -1 || index === prev.length - 1) return prev;

      const newOrder = [...prev];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];

      return newOrder.map((img, idx) => ({
        ...img,
        isPrimary: idx === 0,
      }));
    });
  };

  const handleSetPrimary = (id: string) => {
    setImages((prev) => {
      const targetIndex = prev.findIndex((img) => img.id === id);
      if (targetIndex === -1) return prev;

      const newOrder = [...prev];
      const [item] = newOrder.splice(targetIndex, 1);
      newOrder.unshift(item);
      return newOrder.map((img, idx) => ({
        ...img,
        isPrimary: idx === 0,
      }));
    });
  };

  const handleDelete = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.url.startsWith('blob:')) URL.revokeObjectURL(img.url);
      const filtered = prev.filter((img) => img.id !== id);
      // Si eliminamos la principal, la primera se vuelve principal
      return filtered.map((img, idx) => ({
        ...img,
        isPrimary: idx === 0,
      }));
    });
    if (fullscreenImage) {
      const current = images.find((i) => i.url === fullscreenImage);
      if (current?.id === id) setFullscreenImage(null);
    }
  };

  const handleSave = async () => {
    // Validar que no haya imágenes subiendo
    if (images.some((img) => img.isUploading)) {
      alert('Espera a que todas las imágenes terminen de subir');
      return;
    }

    // Validar que haya al menos 1 imagen
    if (images.length === 0) {
      alert('Debes agregar al menos 1 imagen');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(images);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar las imágenes');
    } finally {
      setIsSaving(false);
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <>
      {/* Modal principal */}
      <Transition show={isOpen} as="div">
        <Dialog onClose={onClose} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          {/* Modal content */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      {title}
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      {images.length} / {maxImages} imágenes • Usa ↑ ↓ para reordenar
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8">
                  {/* Dropzone */}
                  {images.length < maxImages && (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-xl p-8 mb-6 transition-all duration-200 cursor-pointer ${
                        isDragActive
                          ? 'border-[#FF5722] bg-orange-50'
                          : 'border-gray-300 hover:border-[#FF5722] hover:bg-gray-50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-1">
                          {isDragActive ? '¡Suelta aquí!' : 'Arrastra imágenes o haz click'}
                        </p>
                        <p className="text-sm text-gray-500">
                          JPG, PNG, WebP • Máximo 5MB por imagen
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Grid de imágenes */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <ImageCard
                          key={image.id}
                          image={image}
                          images={images}
                          onDelete={handleDelete}
                          onSetPrimary={handleSetPrimary}
                          onView={setFullscreenImage}
                          onMoveUp={handleMoveUp}
                          onMoveDown={handleMoveDown}
                        />
                      ))}
                    </div>
                  )}

                  {images.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                      <p>Aún no has agregado imágenes</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={onClose}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors font-medium text-gray-700 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || images.some((img) => img.isUploading) || images.length === 0}
                    className="px-8 py-2.5 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white font-medium transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Imágenes'
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Modal fullscreen preview */}
      {fullscreenImage && (
        <Dialog open={true} onClose={() => setFullscreenImage(null)} className="relative z-[60]">
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="relative max-w-7xl max-h-[90vh]">
              <button
                onClick={() => setFullscreenImage(null)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <img
                src={fullscreenImage}
                alt="Vista completa"
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </>
  );
}
