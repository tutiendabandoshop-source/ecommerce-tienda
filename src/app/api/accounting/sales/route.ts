import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const sales = await prisma.accountingSale.findMany({
      include: {
        externalItem: true,  // Solo incluir externalItem (product no está definido en el modelo)
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: sales });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al listar ventas';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productId,
      variantId,
      externalItemId,
      quantity,
      amount,
      status = 'pagado',
      clientName,
      paymentDate
    } = body;

    const qty = Number(quantity);

    // Validaciones
    if (quantity == null || amount == null) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios: quantity, amount' },
        { status: 400 }
      );
    }

    if (!productId && !variantId && !externalItemId) {
      return NextResponse.json(
        { success: false, error: 'Debe indicar productId, variantId o externalItemId' },
        { status: 400 }
      );
    }

    // Validar status
    const validStatus = ['pagado', 'parcial', 'pendiente'].includes(status)
      ? status
      : 'pagado';

    let saleProductId: string | null = productId || null;

    // Si se envía variantId: validar stock (salvo "Sobre pedido"), descontar de la variante y usar su productId para la venta
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });

      if (!variant) {
        return NextResponse.json(
          { success: false, error: 'Variante no encontrada' },
          { status: 404 }
        );
      }

      saleProductId = variant.productId;
      const isPreOrder = variant.product.isPreOrder;

      if (!isPreOrder && variant.stock < qty) {
        return NextResponse.json(
          {
            success: false,
            error: `Stock insuficiente. La variante tiene ${variant.stock} unidad(es) y intentas vender ${qty}.`,
          },
          { status: 400 }
        );
      }

      if (!isPreOrder) {
        await prisma.productVariant.update({
          where: { id: variantId },
          data: { stock: variant.stock - qty },
        });
      }
    }

    // Si solo hay productId (sin variantId): validar y descontar del stock del producto base (salvo "Sobre pedido")
    if (productId && !variantId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (product && !product.isPreOrder && product.stock !== null) {
        if (product.stock < qty) {
          return NextResponse.json(
            {
              success: false,
              error: `Stock insuficiente. El producto tiene ${product.stock} unidad(es) y intentas vender ${qty}.`,
            },
            { status: 400 }
          );
        }
        await prisma.product.update({
          where: { id: productId },
          data: {
            stock: product.stock - qty,
          },
        });
      }
    }

    // Crear la venta
    const sale = await prisma.accountingSale.create({
      data: {
        productId: saleProductId,
        externalItemId: externalItemId || null,
        quantity: qty,
        amount: Number(amount),
        status: validStatus,
        clientName: clientName ? String(clientName) : null,
        paymentDate: paymentDate ? new Date(paymentDate) : null,
      },
      include: {
        externalItem: true,
      },
    });

    return NextResponse.json({ success: true, data: sale });
  } catch (error: unknown) {
    console.error('Error en POST /api/accounting/sales:', error);
    const message = error instanceof Error ? error.message : 'Error al crear venta';
    return NextResponse.json(
      {
        success: false,
        error: message,
        details: 'Verifica que los datos enviados sean correctos y que el producto exista'
      },
      { status: 500 }
    );
  }
}
