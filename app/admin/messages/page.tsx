"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mail, MessageSquare, CheckCircle, XCircle,
  RefreshCw, Filter, Search, Eye, Trash2,
  Archive, Send, Clock, User, Phone, Inbox
} from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: 'UNREAD' | 'READ' | 'ARCHIVED'
  readAt: string | null
  repliedAt: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export default function MessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({
    unread: 0,
    total: 0,
    archived: 0
  })

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/admin/messages?${params}`, {
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data)
        
        // Calcular estadísticas
        const unread = data.data.filter((m: Message) => m.status === 'UNREAD').length
        const archived = data.data.filter((m: Message) => m.status === 'ARCHIVED').length
        setStats({
          unread,
          archived,
          total: data.pagination?.total || data.data.length
        })
      } else {
        setError(data.error || 'Error al cargar mensajes')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [search, statusFilter])

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READ' }),
        credentials: 'include'
      })

      const data = await response.json()
      if (data.success) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleArchive = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' }),
        credentials: 'include'
      })

      const data = await response.json()
      if (data.success) {
        fetchMessages()
        if (selectedMessage?.id === messageId) {
          setShowModal(false)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (messageId: string) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return

    try {
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Mensaje eliminado')
        fetchMessages()
        if (selectedMessage?.id === messageId) {
          setShowModal(false)
        }
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    }
  }

  const handleReply = (email: string) => {
    window.open(`mailto:${email}`, '_blank')
  }

  const getStatusBadge = (status: string) => {
    const config = {
      'UNREAD': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Mail, text: 'No leído' },
      'READ': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Leído' },
      'ARCHIVED': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Archive, text: 'Archivado' }
    }
    return config[status as keyof typeof config] || config['UNREAD']
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora mismo'
    if (diffMins < 60) return `Hace ${diffMins} minutos`
    if (diffHours < 24) return `Hace ${diffHours} horas`
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mensajes...</p>
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
                <Inbox className="w-8 h-8 text-green-600" />
                Bandeja de Mensajes
              </h1>
              <p className="text-gray-600 mt-2">
                {stats.unread > 0 ? (
                  <span className="text-blue-600 font-medium">{stats.unread} mensajes sin leer</span>
                ) : (
                  'No hay mensajes nuevos'
                )}
              </p>
            </div>
            <button
              onClick={fetchMessages}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">No leídos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Total mensajes</p>
              <p className="text-2xl font-bold text-green-600">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-500">
              <p className="text-sm text-gray-600">Archivados</p>
              <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o mensaje..."
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
                <option value="UNREAD">No leídos</option>
                <option value="READ">Leídos</option>
                <option value="ARCHIVED">Archivados</option>
              </select>

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

        {/* Lista de mensajes */}
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Inbox className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bandeja vacía</h3>
            <p className="text-gray-600">
              No hay mensajes que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const statusBadge = getStatusBadge(message.status)
              const StatusIcon = statusBadge.icon

              return (
                <div
                  key={message.id}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer ${
                    message.status === 'UNREAD' ? 'border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedMessage(message)
                    setShowModal(true)
                    if (message.status === 'UNREAD') {
                      handleMarkAsRead(message.id)
                    }
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-gray-900">{message.name}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusBadge.text}
                          </span>
                          {message.subject && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {message.subject}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
                          <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {message.email}
                          </a>
                          {message.phone && (
                            <a href={`tel:${message.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {message.phone}
                            </a>
                          )}
                        </div>

                        <p className="text-gray-700 line-clamp-2 mb-3">
                          {message.message}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(message.createdAt)}
                          </span>
                          {message.ipAddress && message.ipAddress !== 'desconocida' && (
                            <span className="text-gray-400">
                              IP: {message.ipAddress}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal de detalle */}
        {showModal && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Detalle del mensaje</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-medium">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div>
                        <p className="text-sm text-gray-600">Teléfono</p>
                        <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                    {selectedMessage.subject && (
                      <div>
                        <p className="text-sm text-gray-600">Asunto</p>
                        <p className="font-medium">{selectedMessage.subject}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Recibido</p>
                      <p className="font-medium">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estado</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        selectedMessage.status === 'UNREAD' ? 'bg-blue-100 text-blue-800' :
                        selectedMessage.status === 'READ' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedMessage.status === 'UNREAD' ? 'No leído' :
                         selectedMessage.status === 'READ' ? 'Leído' : 'Archivado'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mensaje</p>
                    <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {selectedMessage.ipAddress && selectedMessage.ipAddress !== 'desconocida' && (
                    <div className="text-xs text-gray-500 border-t pt-4">
                      <p>IP: {selectedMessage.ipAddress}</p>
                      {selectedMessage.userAgent && (
                        <p className="mt-1 truncate" title={selectedMessage.userAgent}>
                          User Agent: {selectedMessage.userAgent.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleReply(selectedMessage.email)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Responder por Email
                    </button>
                    {selectedMessage.status !== 'ARCHIVED' && (
                      <button
                        onClick={() => handleArchive(selectedMessage.id)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
                      >
                        <Archive className="w-4 h-4" />
                        Archivar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}