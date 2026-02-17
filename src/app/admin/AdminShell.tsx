'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type AdminShellProps = {
  authenticated: boolean;
  children: React.ReactNode;
  logoutAction: () => void;
};

function NavLink({
  href,
  active,
  collapsed,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  collapsed: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 border-l-4 transition-all duration-200 ease-in-out ${
        active
          ? 'bg-[#F2E7E2] border-[#CB997E] text-[#CB997E] font-semibold'
          : 'border-transparent text-[#6B6B6B] hover:bg-[#F8F4F1] hover:text-[#2D2D2D]'
      }`}
    >
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </span>
      <span className={`whitespace-nowrap transition-all duration-300 font-medium ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
        {label}
      </span>
    </Link>
  );
}

export default function AdminShell({ authenticated, children, logoutAction }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!authenticated) {
    return <>{children}</>;
  }

  const sidebarWidth = sidebarCollapsed ? 'w-[70px]' : 'w-[220px]';

  return (
    <div className="min-h-screen bg-[#FDFAF7]">
      {/* Overlay móvil: oculta sidebar al hacer click fuera */}
      <div
        className={`fixed inset-0 z-10 bg-black/30 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-white border-r border-[#EDEDED] text-[#2D2D2D] transition-all duration-300 ease-in-out ${sidebarWidth} ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className={`flex items-center shrink-0 border-b border-[#EDEDED] transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'justify-center p-3' : 'gap-3 p-4'}`}>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="flex-shrink-0 p-2 rounded-lg bg-[#F8F4F1] hover:bg-[#F2E7E2] text-[#2D2D2D] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#CB997E] focus:ring-offset-2"
            aria-label={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </button>
          <span
            className={`font-serif text-xl font-semibold text-[#2D2D2D] truncate whitespace-nowrap transition-all duration-300 ease-in-out ${
              sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden min-w-0 ml-0' : 'opacity-100 ml-0'
            }`}
          >
            Áurea Admin
          </span>
        </div>

        <nav className="mt-6 flex-1 overflow-hidden">
          <NavLink
            href="/admin"
            active={pathname === '/admin'}
            collapsed={sidebarCollapsed}
            label="Dashboard"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
          />
          <NavLink
            href="/admin/products"
            active={pathname.startsWith('/admin/products')}
            collapsed={sidebarCollapsed}
            label="Productos"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <NavLink
            href="/admin/categories"
            active={pathname.startsWith('/admin/categories')}
            collapsed={sidebarCollapsed}
            label="Categorías"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />
          <NavLink
            href="/admin/contabilidad"
            active={pathname.startsWith('/admin/contabilidad')}
            collapsed={sidebarCollapsed}
            label="Contabilidad"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </nav>

        <div className="p-4 border-t border-[#EDEDED] shrink-0">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#CB997E] hover:bg-[#B8886E] text-white rounded-lg transition-all duration-200 font-semibold shadow-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className={`whitespace-nowrap transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                Cerrar Sesión
              </span>
            </button>
          </form>
          <Link
            href="/"
            className="mt-2 flex items-center justify-center gap-2 text-sm text-[#6B6B6B] hover:text-[#CB997E] transition-colors font-medium"
            title="Volver a la tienda"
          >
            {sidebarCollapsed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            ) : (
              <span>← Volver a tienda</span>
            )}
          </Link>
        </div>
      </aside>

      <div className={`transition-all duration-300 ease-in-out ml-0 ${sidebarCollapsed ? 'md:ml-[70px]' : 'md:ml-[220px]'}`}>
        <header className="sticky top-0 z-10 h-[70px] px-4 md:px-8 py-4 flex items-center justify-between bg-white border-b border-[#EDEDED] shadow-sm">
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg bg-[#F8F4F1] hover:bg-[#F2E7E2] text-[#2D2D2D]"
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 md:flex-none">
            <h1 className="font-serif text-2xl font-semibold text-[#2D2D2D]">Áurea Admin</h1>
            <p className="text-sm font-sans text-[#6B6B6B]">Panel de gestión</p>
          </div>
        </header>
        <main className="p-4 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-70px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
