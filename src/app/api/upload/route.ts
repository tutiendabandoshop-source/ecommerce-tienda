import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// ========================================
// CONFIGURACIÓN DE CLOUDINARY
// ========================================
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // 120 segundos
});

// Configuración de App Router
export const maxDuration = 120; // 120 segundos máximo

// ========================================
// FUNCIÓN: GENERAR URLS OPTIMIZADAS
// ========================================
function generateOptimizedUrls(publicId: string) {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  return {
    // URL original optimizada (para galería principal)
    original: `${baseUrl}/f_auto,q_auto:best,dpr_auto,w_1200,c_limit/${publicId}`,
    
    // Thumbnail pequeño (para grid de productos)
    thumbnail: `${baseUrl}/f_auto,q_auto:good,dpr_auto,w_400,h_400,c_fill,g_auto/${publicId}`,
    
    // Medium (para cards de producto)
    medium: `${baseUrl}/f_auto,q_auto:best,dpr_auto,w_800,c_limit/${publicId}`,
    
    // Large (para modal fullscreen)
    large: `${baseUrl}/f_auto,q_auto:best,dpr_auto,w_1600,c_limit/${publicId}`,
    
    // Placeholder borroso (LQIP - Low Quality Image Placeholder)
    placeholder: `${baseUrl}/f_auto,q_auto:low,w_50,e_blur:1000/${publicId}`,
  };
}

// ========================================
// ENDPOINT: POST /api/upload
// ========================================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // ========================================
    // VALIDACIONES
    // ========================================
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo JPG, PNG o WebP.' },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'La imagen es demasiado grande. Máximo 5MB.' },
        { status: 400 }
      );
    }

    // ========================================
    // CONVERTIR A BASE64
    // ========================================
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    // ========================================
    // SUBIR A CLOUDINARY CON TRANSFORMACIONES PREMIUM
    // ========================================
    const result = await cloudinary.uploader.upload(base64File, {
      folder: 'ecommerce-whatsapp-school',
      resource_type: 'auto',
      
      // TRANSFORMACIONES PREMIUM
      transformation: [
        // Limitar tamaño máximo (optimiza almacenamiento)
        { width: 1600, height: 1600, crop: 'limit' },
        
        // Calidad automática MÁXIMA
        { quality: 'auto:best' },
        
        // Formato automático (WebP cuando el navegador lo soporte)
        { fetch_format: 'auto' },
        
        // Enfoque automático en caras/objetos importantes
        { gravity: 'auto' },
      ],
      
      // Configuración adicional
      timeout: 90000,
      
      // Generar metadatos útiles
      colors: true, // Extraer paleta de colores
      phash: true,  // Hash perceptual para detección de duplicados
    });

    console.log('✅ Imagen subida exitosamente:', result.secure_url);

    // ========================================
    // GENERAR URLS OPTIMIZADAS
    // ========================================
    const optimizedUrls = generateOptimizedUrls(result.public_id);

    // ========================================
    // RESPUESTA CON URLS OPTIMIZADAS
    // ========================================
    return NextResponse.json(
      {
        // URL principal (la más usada)
        url: optimizedUrls.original,
        
        // Public ID (necesario para transformaciones dinámicas)
        public_id: result.public_id,
        
        // URLs adicionales para diferentes contextos
        urls: optimizedUrls,
        
        // Metadatos útiles
        width: result.width,
        height: result.height,
        format: result.format,
        
        // Colores dominantes (útil para placeholders)
        colors: result.colors,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('❌ Error al subir imagen:', error);
    
    // Manejar errores específicos de Cloudinary
    if (
      (error as { error?: { http_code?: number } }).error?.http_code === 499 ||
      (error as { name?: string }).name === 'TimeoutError'
    ) {
      return NextResponse.json(
        { 
          error: 'La subida tardó demasiado. Por favor, intenta con una imagen más pequeña o revisa tu conexión.' 
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Error al subir la imagen: ' + ((error as Error).message || 'Error desconocido') 
      },
      { status: 500 }
    );
  }
}
