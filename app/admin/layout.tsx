// app/admin/layout.tsx
"use client"

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Si ya está en login, no verificamos
    if (pathname === '/admin/login') {
      setIsAuthenticated(false)
      return
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-session', {
          credentials: 'include'
        })
        
        const data = await response.json()
        
        if (response.ok && data.authenticated) {
          setIsAuthenticated(true)
        } else {
          // No autenticado, redirigir a login
          router.push('/admin/login')
        }
      } catch (error) {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [pathname, router])

  // Mostrar loading mientras verifica
  if (isAuthenticated === null && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si es login, mostrar solo el contenido
  if (pathname === '/admin/login') {
    return children
  }

  // Si no está autenticado, no mostrar nada (ya redirigió)
  if (!isAuthenticated) {
    return null
  }

  // Menú de navegación
  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Leads', href: '/admin/leads' },
    { name: 'Tickets', href: '/admin/tickets' },
    { name: 'Documentos', href: '/admin/documents' },
    { name: 'Mensajes', href: '/admin/messages' },
    { name: 'Administradores', href: '/admin/users' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (simplificado) */}
      <aside className={`bg-white border-r fixed h-full z-50 transition-all ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className={`flex items-center gap-3 mb-8 ${
            sidebarOpen ? 'justify-start' : 'justify-center'
          }`}>
            <div className="w-10 h-10 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
              <img src="/logotipo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-bold text-gray-900">Caja Valladolid</div>
                <div className="text-sm text-gray-600">Admin Panel</div>
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isActive 
                      ? 'bg-green-50 text-green-800 border-l-4 border-green-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <span>{getIcon(item.name)}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={() => {
              fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
                .finally(() => {
                  window.location.href = '/admin/login'
                })
            }}
            className={`flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg mt-auto ${
              sidebarOpen ? 'justify-start' : 'justify-center'
            }`}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className={`flex-1 transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top bar */}
        <header className="bg-white border-b p-4 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
              <div className="w-5 h-5 flex flex-col justify-center">
                <div className={`h-0.5 bg-gray-600 mb-1 transition-all ${sidebarOpen ? 'w-4' : 'w-5'}`}></div>
                <div className="h-0.5 bg-gray-600 mb-1 w-5"></div>
                <div className={`h-0.5 bg-gray-600 transition-all ${sidebarOpen ? 'w-4' : 'w-5'}`}></div>
              </div>
            </button>
            <span className="text-lg font-semibold">{getPageTitle(pathname, navItems)}</span>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function getIcon(name: string) {
  const icons: Record<string, string> = {
    'Dashboard': '📊',
    'Leads': '👥',
    'Tickets': '🎫',
    'Documentos': '📄',
    'Mensajes': '💬',
    'Administradores': '👤',
  }
  return icons[name] || '📋'
}

function getPageTitle(pathname: string, navItems: any[]) {
  const item = navItems.find(item => pathname === item.href)
  return item ? item.name : 'Dashboard'
}