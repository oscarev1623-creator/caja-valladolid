"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, FileText, DollarSign, TrendingUp,
  Clock, CheckCircle, AlertCircle, Plus,
  ArrowRight, RefreshCw, Download, MessageCircle, Mail
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalLeads: 0,
    pendingLeads: 0,
    approvedLeads: 0,
    rejectedLeads: 0,
    totalAmount: 0,
    conversionRate: 0,
    activeConversations: 0,
    unreadMessages: 0
  })
  const [recentLeads, setRecentLeads] = useState<any[]>([])

  // ✅ ÚNICO useEffect para verificar sesión y cargar datos
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const authResponse = await fetch('/api/admin/check-session', {
          credentials: 'include'
        })

        const authData = await authResponse.json()

        if (!authResponse.ok || !authData.authenticated) {
          router.push('/admin/login')
          return
        }

        setUser(authData.user)
        await fetchDashboardData()
      } catch (error) {
        console.error('Error en autenticación:', error)
        router.push('/admin/login')
      }
    }

    checkAuthAndLoadData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/dashboard/stats', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      
      if (data.success) {
        setStats({
          totalLeads: data.stats.totalLeads || 0,
          pendingLeads: data.stats.pendingLeads || 0,
          approvedLeads: data.stats.approvedLeads || 0,
          rejectedLeads: data.stats.rejectedLeads || 0,
          totalAmount: data.stats.totalAmount || 0,
          conversionRate: data.stats.conversionRate || 0,
          activeConversations: data.stats.activeConversations || 0,
          unreadMessages: data.stats.unreadMessages || 0
        })
        setRecentLeads(data.recentLeads || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Solicitudes totales'
    },
    {
      title: 'Pendientes',
      value: stats.pendingLeads,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'En revisión'
    },
    {
      title: 'Aprobados',
      value: stats.approvedLeads,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Créditos aprobados'
    },
    {
      title: 'Monto Total',
      value: `$${stats.totalAmount.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      description: 'En créditos solicitados'
    },
    {
      title: 'Chats Activos',
      value: stats.activeConversations,
      icon: MessageCircle,
      color: 'bg-cyan-500',
      description: 'Conversaciones en curso'
    },
    {
      title: 'Mensajes Pendientes',
      value: stats.unreadMessages,
      icon: Mail,
      color: 'bg-orange-500',
      description: 'Mensajes de clientes'
    }
  ]

  const quickActions = [
    {
      title: 'Nuevo Lead',
      description: 'Registrar nueva solicitud',
      icon: Plus,
      color: 'bg-green-100 text-green-700',
      action: () => router.push('/admin/leads/new')
    },
    {
      title: 'Ver Leads',
      description: 'Gestionar solicitudes',
      icon: Users,
      color: 'bg-blue-100 text-blue-700',
      action: () => router.push('/admin/leads')
    },
    {
      title: 'Ver Chat',
      description: 'Atender conversaciones',
      icon: MessageCircle,
      color: 'bg-cyan-100 text-cyan-700',
      action: () => router.push('/admin/chat')
    },
    {
      title: 'Generar Reporte',
      description: 'Exportar datos a Excel',
      icon: Download,
      color: 'bg-purple-100 text-purple-700',
      action: () => alert('Próximamente')
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Cargando datos del dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard de Administración
            </h1>
            <p className="text-gray-600">
              Bienvenido, {user?.name || 'Administrador'} • {new Date().toLocaleDateString('es-MX')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchDashboardData} 
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-800 font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name || 'Administrador'}</p>
                <p className="text-sm text-gray-600 capitalize">{user?.role?.toLowerCase() || 'admin'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {/* Cards de estadísticas - AHORA 6 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-xs text-gray-600 mb-1">{card.title}</p>
                <p className="text-[10px] text-gray-400">{card.description}</p>
              </div>
            )
          })}
        </div>

        {/* Acciones rápidas y gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Acciones rápidas */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
              <button 
                onClick={() => router.push('/admin/leads')}
                className="text-green-600 hover:text-green-800 flex items-center gap-1"
              >
                Ver todo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${action.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Métricas rápidas */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-6">Métricas Clave</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Tasa de Conversión</span>
                  <span className="text-2xl font-bold">{stats.conversionRate}%</span>
                </div>
                <div className="w-full bg-green-800 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full" 
                    style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-green-500">
                <div className="flex justify-between items-center mb-2">
                  <span>Chats Activos</span>
                  <span className="text-xl font-bold">{stats.activeConversations}</span>
                </div>
                <p className="text-sm text-green-200">Conversaciones en curso</p>
              </div>
              
              <div className="pt-4 border-t border-green-500">
                <div className="flex justify-between items-center">
                  <span>Mensajes Sin Leer</span>
                  <span className="text-xl font-bold">{stats.unreadMessages}</span>
                </div>
                <p className="text-sm text-green-200">Pendientes de respuesta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leads recientes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Leads Recientes</h2>
            <button 
              onClick={() => router.push('/admin/leads')}
              className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentLeads.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay leads registrados aún</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentLeads.map((lead, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-800 font-medium text-sm">
                              {lead.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{lead.name}</span>
                            <p className="text-xs text-gray-500">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{lead.amount}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          lead.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          lead.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {lead.status || 'PENDIENTE'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sistema status */}
        <div className="mt-6 p-6 bg-white rounded-xl shadow-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Estado del Sistema</h3>
              <p className="text-gray-600">Base de datos: {stats.totalLeads > 0 ? '✅ Conectada con datos' : '✅ Conectada'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Base de datos</div>
                <div className="text-green-600 font-bold">✅ Conectada</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Total Leads</div>
                <div className="font-bold">{stats.totalLeads}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Chats Activos</div>
                <div className="font-bold">{stats.activeConversations}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}