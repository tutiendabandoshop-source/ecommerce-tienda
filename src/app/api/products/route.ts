import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET /api/products - Listar todos los productos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const limit = searchParams.get('limit');
    const isActive = searchParams.get('isActive');

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    if (isActive === 'true') where.isActive = true;

    const products = await prisma.product.findMany({
      where,
      take: limit ? Math.min(parseInt(limit, 10) || 50, 50) : undefined,
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear producto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      specifications,
      name,
      slug,
      description,
      price,
      comparePrice,
      stock,
      isPreOrder,
      preOrderDays,
      imageUrl,
      images: imagesBody,
      categoryId,
    } = body;

    // Validaciones básicas
    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const preOrder = Boolean(isPreOrder);
    const specs = Array.isArray(specifications)
      ? specifications.map((s: { key?: string; value?: string; order?: number }) => ({
          key: String(s?.key ?? ''),
          value: String(s?.value ?? ''),
          order: typeof s?.order === 'number' ? s.order : 0,
        }))
      : [];

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        compareAtPrice: comparePrice ? parseFloat(comparePrice) : null,
        images: Array.isArray(imagesBody) && imagesBody.length > 0 ? imagesBody : imageUrl ? [imageUrl] : [],
        stock: preOrder ? null : (parseInt(stock) || 0),
        isPreOrder: preOrder,
        preOrderDays: preOrder ? (preOrderDays?.trim() || null) : null,
        categoryId,
        specifications: {
          create: specs,
        },
      },
      include: {
        category: true,
        variants: true,
        specifications: true,
      },
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}