'use server';

import { prisma } from '@/app/lib/prisma';

/**
 * Reset de contabilidad: borra todo el historial financiero y pedidos.
 * NO toca Product, Category ni ProductVariant (stock intacto).
 * Orden de borrado respetando FKs: OrderItem → Order → AccountingSale → AccountingExpense → AccountingExternalItem.
 */
export async function resetContabilidad(): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({});
      await tx.order.deleteMany({});
      await tx.accountingSale.deleteMany({});
      await tx.accountingExpense.deleteMany({});
      await tx.accountingExternalItem.deleteMany({});
    });
    return { success: true };
  } catch (err) {
    console.error('resetContabilidad error:', err);
    const message = err instanceof Error ? err.message : 'Error al resetear contabilidad';
    return { success: false, error: message };
  }
}
