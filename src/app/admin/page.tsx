export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { requireAuth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { Plus, ShoppingBag, DollarSign, TrendingDown, Package, Layers, AlertCircle } from 'lucide-react';

async function getStats() {
  const [productsCount, categoriesCount, pendingSales, totalSalesSum, totalExpensesSum] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.accountingSale.count({
      where: {
        OR: [{ status: 'parcial' }, { status: 'pendiente' }],
      },
    }),
    prisma.accountingSale.aggregate({ _sum: { amount: true } }),
    prisma.accountingExpense.aggregate({ _sum: { amount: true } }),
  ]);

  const totalBalance = (totalSalesSum._sum.amount ?? 0) - (totalExpensesSum._sum.amount ?? 0);

  return {
    productsCount,
    categoriesCount,
    pendingCount: pendingSales,
    totalBalance,
  };
}

export default async function AdminDashboard() {
  await requireAuth('/admin');

  const stats = await getStats();

  return (
    <div className="p-0 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-[#2D2D2D]">Dashboard</h1>
        <p className="text-sm font-sans text-[#6B6B6B] mt-1">Resumen general</p>
      </div>

      {/* Tarjetas de Métricas - Áurea */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#EDEDED] hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm font-semibold text-[#6B6B6B]">Productos</h3>
              <div className="p-2.5 bg-[#F2E7E2] rounded-lg">
                <Package className="w-5 h-5 text-[#CB997E]" />
              </div>
            </div>
            <p className="font-serif text-4xl font-semibold text-[#2D2D2D] mb-1">{stats.productsCount}</p>
            <p className="text-xs font-sans text-[#6B6B6B]">Total en catálogo</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#EDEDED] hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm font-semibold text-[#6B6B6B]">Categorías</h3>
              <div className="p-2.5 bg-[#F8F4F1] rounded-lg">
                <Layers className="w-5 h-5 text-[#CB997E]" />
              </div>
            </div>
            <p className="font-serif text-4xl font-semibold text-[#2D2D2D] mb-1">{stats.categoriesCount}</p>
            <p className="text-xs font-sans text-[#6B6B6B]">Activas</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#EDEDED] hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm font-semibold text-[#6B6B6B]">Pendientes</h3>
              <div className="p-2.5 bg-[#F5E0DC] rounded-lg">
                <AlertCircle className="w-5 h-5 text-[#B8886E]" />
              </div>
            </div>
            <p className="font-serif text-4xl font-semibold text-[#2D2D2D] mb-1">{stats.pendingCount}</p>
            <p className="text-xs font-sans text-[#6B6B6B]">Ventas por cobrar</p>
          </div>
        </div>
      </div>

      {/* Reporte Financiero - Áurea accent */}
      <Link href="/admin/contabilidad" className="block group mb-6">
        <div className="bg-[#CB997E] hover:bg-[#B8886E] rounded-2xl shadow-sm transition-all py-6 px-6 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/90 font-sans font-semibold text-base mb-1">Reporte Financiero</p>
            <h2 className="font-serif text-white text-4xl md:text-5xl font-semibold tracking-tight mb-1">
              ${stats.totalBalance.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-white/80 text-sm font-sans">Saldo total acumulado</p>
          </div>
        </div>
      </Link>

      {/* Acciones Rápidas */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-[#2D2D2D] mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Link
            href="/admin/contabilidad?tab=ventas"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 border border-[#EDEDED] border-l-4 border-l-[#CB997E]"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#F2E7E2] rounded-xl">
                <DollarSign className="w-5 h-5 text-[#CB997E]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-semibold text-base text-[#2D2D2D]">Contabilidad: Registrar Venta</h3>
                <p className="text-xs font-sans text-[#6B6B6B]">Ir a ventas</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/contabilidad?tab=gastos"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 border border-[#EDEDED] border-l-4 border-l-[#CB997E]"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#F8F4F1] rounded-xl">
                <TrendingDown className="w-5 h-5 text-[#CB997E]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-semibold text-base text-[#2D2D2D]">Contabilidad: Registrar Gasto</h3>
                <p className="text-xs font-sans text-[#6B6B6B]">Ir a gastos</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/products/new"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 border border-[#EDEDED] border-l-4 border-l-[#CB997E]"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#F2E7E2] rounded-xl">
                <Plus className="w-5 h-5 text-[#CB997E]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-semibold text-base text-[#2D2D2D]">Nuevo Producto</h3>
                <p className="text-xs font-sans text-[#6B6B6B]">Agregar al catálogo</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/products"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 border border-[#EDEDED] border-l-4 border-l-[#CB997E]"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#F8F4F1] rounded-xl">
                <ShoppingBag className="w-5 h-5 text-[#CB997E]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans font-semibold text-base text-[#2D2D2D]">Ver Productos</h3>
                <p className="text-xs font-sans text-[#6B6B6B]">Gestionar catálogo</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
