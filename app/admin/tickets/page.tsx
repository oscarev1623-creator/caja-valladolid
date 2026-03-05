"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Ticket, Clock, CheckCircle, XCircle, AlertCircle,
  RefreshCw, Filter, Search, Eye, Copy, Send,
  User, Calendar, Link as LinkIcon,
  Mail, Phone, Trash2
} from 'lucide-react'

interface Ticket {
  id: string
  ticketNumber: string
  status: string
  priority: string
  uniqueToken: string
  linkUrl: string
  expiresAt: string
  createdAt: string
  lead: {
    id: string
    fullName: string
    email: string
    phone: string
  }
  createdBy: {
    id: string
    name: string
    email: string
  }
}

export default function TicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/admin/tickets?${params}`, {
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setTickets(data.data)
      } else {
        setError(data.error || 'Error al cargar tickets')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [search, statusFilter])

  const handleDelete = async (ticketId: string) => {
    if (!confirm('¿Estás seguro de eliminar este ticket? Esta acción no se puede deshacer.')) return

    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Ticket eliminado correctamente')
        fetchTickets()
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error eliminando ticket:', error)
      alert('❌ Error de conexión')
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, text: string }> = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, text: 'Pendiente' },
      'COMPLETED': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Completado' },
      'EXPIRED': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, text: 'Expirado' },
      'SENT': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Send, text: 'Enviado' }
    }
    return config[status] || config['PENDING']
  }

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { color: string, text: string }> = {
      'HIGH': { color: 'bg-red-100 text-red-800', text: 'Alta' },
      'MEDIUM': { color: 'bg-yellow-100 text-yellow-800', text: 'Media' },
      'LOW': { color: 'bg-green-100 text-green-800', text: 'Baja' }
    }
    return config[priority] || config['MEDIUM']
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('✅ Enlace copiado')
  }

  const resendTicket = async (ticketId: string) => {
    if (!confirm('¿Reenviar este ticket? Se generará un nuevo enlace.')) return
    
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}/resend`, {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      
      if (data.success) {
        alert('✅ Ticket reenviado correctamente')
        fetchTickets()
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Cargando tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Ticket className="w-8 h-8 text-green-600" />
                Gestión de Tickets
              </h1>
              <p className="text-gray-600 mt-2">
                Total: {tickets.length} tickets generados
              </p>
            </div>
            <button
              onClick={fetchTickets}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>

          {/* Filtros */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por lead, email o teléfono..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendiente</option>
                <option value="SENT">Enviado</option>
                <option value="COMPLETED">Completado</option>
                <option value="EXPIRED">Expirado</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('')
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Tickets */}
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Ticket className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay tickets aún</h3>
            <p className="text-gray-600 mb-6">
              Los tickets se generan automáticamente cuando envías un enlace de documentación a un lead.
            </p>
            <button
              onClick={() => router.push('/admin/leads')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Ir a Leads
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const statusBadge = getStatusBadge(ticket.status)
              const StatusIcon = statusBadge.icon
              const priorityBadge = getPriorityBadge(ticket.priority)
              const isExpired = new Date(ticket.expiresAt) < new Date()

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-l-4"
                  style={{
                    borderLeftColor: isExpired ? '#ef4444' : '#10b981'
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Información principal */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          {ticket.ticketNumber}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusBadge.text}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${priorityBadge.color}`}>
                          {priorityBadge.text}
                        </span>
                      </div>

                      {/* Datos del lead */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{ticket.lead.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${ticket.lead.email}`} className="text-blue-600 hover:underline">
                            {ticket.lead.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <a href={`tel:${ticket.lead.phone}`} className="text-blue-600 hover:underline">
                            {ticket.lead.phone}
                          </a>
                        </div>
                      </div>

                      {/* Fechas */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Creado: {formatDate(ticket.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expira: {formatDate(ticket.expiresAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Por: {ticket.createdBy?.name || 'Sistema'}
                        </span>
                      </div>

                      {/* Link */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <LinkIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-xs text-gray-600 flex-1 truncate">
                            {ticket.linkUrl}
                          </span>
                          <button
                            onClick={() => copyToClipboard(ticket.linkUrl)}
                            className="p-1 text-gray-500 hover:text-blue-600 transition"
                            title="Copiar enlace"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-row md:flex-col gap-2">
                      <button
                        onClick={() => router.push(`/admin/leads/${ticket.lead.id}`)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Ver lead
                      </button>
                      <button
                        onClick={() => resendTicket(ticket.id)}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center justify-center gap-2 text-sm"
                        disabled={isExpired}
                      >
                        <Send className="w-4 h-4" />
                        Reenviar
                      </button>
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-2 text-sm"
                        title="Eliminar ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Estado de expiración */}
                  {isExpired && (
                    <div className="mt-4 p-2 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Este ticket ha expirado. Genera uno nuevo para el lead.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}