"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckSquare, Square, Check, RefreshCw, Filter,
  Users, AlertCircle, Phone, Mail, Calendar,
  DollarSign, Clock, Eye, Edit, Trash2, Search,
  Download, Upload, FileText, CheckCircle, XCircle,
  AlertTriangle, UserCheck, Send, Loader2, Mail as MailIcon,
  FileSignature, CreditCard, Coins, MessageCircle, UserCog, Palette, X
} from 'lucide-react'

interface Lead {
  id: string
  fullName: string
  email: string
  phone: string
  status: string
  lastReminderSentAt: string | null
  createdAt: string
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PENDING_DOCUMENTS', label: 'Pendiente Docs' },
  { value: 'CONTACTED', label: 'Contactado' },
  { value: 'APPROVED', label: 'Aprobado' }
]

export default function RemindersPage() {
  const router = useRouter()
  const [allLeads, setAllLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    let filtered = allLeads.filter(lead => lead.lastReminderSentAt !== null)

    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(lead => {
        const name = lead?.fullName?.toLowerCase() || ''
        const email = lead?.email?.toLowerCase() || ''
        const phone = lead?.phone?.toLowerCase() || ''
        return name.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower)
      })
    }

    if (statusFilter) {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    // Ordenar por último recordatorio (más reciente primero)
    filtered.sort((a, b) => {
      const aDate = a.lastReminderSentAt ? new Date(a.lastReminderSentAt) : new Date(0)
      const bDate = b.lastReminderSentAt ? new Date(b.lastReminderSentAt) : new Date(0)
      return bDate.getTime() - aDate.getTime()
    })

    setFilteredLeads(filtered)
  }, [allLeads, search, statusFilter])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/leads?limit=1000', {
        credentials: 'include'
      })

      if (response.status === 401 || response.status === 403) {
        console.log('🚫 Acceso denegado')
        return
      }

      const data = await response.json()

      if (data.success) {
        setAllLeads(data.data)
      } else {
        setError(data.error || 'Error al cargar leads')
      }
    } catch (error) {
      console.error('🔥 Error:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id))
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedLeads.length === 0) return

    // Verificar que todos los leads seleccionados tengan más de 7 días sin respuesta
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const invalidLeads = filteredLeads
      .filter(lead => selectedLeads.includes(lead.id))
      .filter(lead => {
        const lastReminder = lead.lastReminderSentAt ? new Date(lead.lastReminderSentAt) : null
        return !lastReminder || lastReminder > sevenDaysAgo
      })

    if (invalidLeads.length > 0) {
      alert(`❌ No se pueden eliminar leads con recordatorios enviados hace menos de 7 días.\n\nLeads inválidos: ${invalidLeads.length}`)
      return
    }

    if (!confirm(`¿Estás seguro de eliminar ${selectedLeads.length} leads? Esta acción no se puede deshacer.`)) return

    try {
      setActionLoading(true)

      const deletePromises = selectedLeads.map(leadId =>
        fetch(`/api/leads/${leadId}`, {
          method: 'DELETE',
          credentials: 'include'
        })
      )

      const results = await Promise.allSettled(deletePromises)
      const successful = results.filter(result => result.status === 'fulfilled').length
      const failed = results.length - successful

      if (successful > 0) {
        alert(`✅ ${successful} leads eliminados correctamente${failed > 0 ? `, ${failed} fallaron` : ''}`)
        fetchLeads()
        setSelectedLeads([])
      } else {
        alert('❌ Error al eliminar los leads')
      }
    } catch (error) {
      alert('❌ Error de conexión')
    } finally {
      setActionLoading(false)
    }
  }

  const exportToCSV = () => {
    const csvData = filteredLeads.map(lead => ({
      'Cliente': lead.fullName,
      'Email': lead.email,
      'Teléfono': lead.phone,
      'Estado': STATUS_OPTIONS.find(s => s.value === lead.status)?.label || lead.status,
      'Último Recordatorio': lead.lastReminderSentAt ? new Date(lead.lastReminderSentAt).toLocaleDateString('es-MX') : 'Nunca',
      'Días desde último': lead.lastReminderSentAt ? Math.floor((new Date().getTime() - new Date(lead.lastReminderSentAt).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'
    }))

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `recordatorios-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  const getDaysSinceLastReminder = (lastReminder: string | null) => {
    if (!lastReminder) return 'Nunca'
    const days = Math.floor((new Date().getTime() - new Date(lastReminder).getTime()) / (1000 * 60 * 60 * 24))
    return `${days} día${days !== 1 ? 's' : ''}`
  }

  const getStatusConfig = (status: string) => {
    const config: Record<string, { bg: string, text: string, icon: any, label: string }> = {
      'PENDING': { bg: '#fef3c7', text: '#92400e', icon: Clock, label: 'Pendiente' },
      'PENDING_DOCUMENTS': { bg: '#fef3c7', text: '#92400e', icon: Clock, label: 'Pendiente Docs' },
      'CONTACTED': { bg: '#dbeafe', text: '#1e40af', icon: Phone, label: 'Contactado' },
      'APPROVED': { bg: '#d1fae5', text: '#065f46', icon: CheckCircle, label: 'Aprobado' }
    }
    return config[status] || { bg: '#f3f4f6', text: '#374151', icon: AlertCircle, label: status }
  }

  const canDeleteLead = (lead: Lead) => {
    if (!lead.lastReminderSentAt) return false
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const lastReminder = new Date(lead.lastReminderSentAt)
    return lastReminder <= sevenDaysAgo
  }

  if (loading && allLeads.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-200 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Cargando recordatorios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-4 md:p-8 mb-4 md:mb-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl md:text-4xl font-bold">📊 Registro de Recordatorios</h1>
              <p className="text-green-100 text-xs md:text-lg">
                {filteredLeads.length} leads con recordatorios • {selectedLeads.length} seleccionados
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={fetchLeads}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
              <button
                onClick={() => router.push('/admin/leads')}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Leads</span>
              </button>
            </div>
          </div>
        </div>

        {/* Botón de filtros en móvil */}
        <div className="md:hidden mb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white rounded-xl shadow p-3 flex items-center justify-center gap-2 text-gray-700 font-medium"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
        </div>

        {/* Filtros */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-3`}>
          <div className="bg-white rounded-xl shadow p-3 md:p-4">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 md:py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2.5 md:py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="">Todos los estados</option>
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => { setSearch(''); setStatusFilter(''); }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 md:py-2 rounded-lg text-sm"
                >
                  Limpiar
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 md:py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </button>
                {selectedLeads.length > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2.5 md:py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Eliminar ({selectedLeads.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow overflow-hidden mt-3">
          {filteredLeads.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4 opacity-20">📧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No hay recordatorios</h3>
              <p className="text-gray-600 mb-6 text-sm">
                {search || statusFilter ? 'No se encontraron resultados con los filtros aplicados' : 'Aún no se han enviado recordatorios automáticos'}
              </p>
              <button
                onClick={fetchLeads}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Actualizar lista
              </button>
            </div>
          ) : (
            <>
              {/* Versión Desktop - Tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left w-8">
                        <button onClick={toggleSelectAll} className="flex items-center">
                          {selectedLeads.length === filteredLeads.length && filteredLeads.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-green-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Cliente</th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Email</th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Teléfono</th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Estado</th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Último recordatorio</th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Días desde último</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.map((lead) => {
                      const statusConfig = getStatusConfig(lead.status)
                      const StatusIcon = statusConfig.icon
                      const isSelected = selectedLeads.includes(lead.id)
                      const canDelete = canDeleteLead(lead)

                      return (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3">
                            <button
                              onClick={() => canDelete && toggleSelectLead(lead.id)}
                              className={`flex items-center ${!canDelete ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-green-600" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-300" />
                              )}
                            </button>
                          </td>
                          <td className="px-3 py-3 font-medium text-gray-900">{lead.fullName}</td>
                          <td className="px-3 py-3 text-gray-600">{lead.email}</td>
                          <td className="px-3 py-3 text-gray-600">{lead.phone}</td>
                          <td className="px-3 py-3">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {lead.lastReminderSentAt ? formatDate(lead.lastReminderSentAt) : 'Nunca'}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {getDaysSinceLastReminder(lead.lastReminderSentAt)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Versión Móvil - Cards */}
              <div className="md:hidden">
                <div className="p-4 space-y-3">
                  {filteredLeads.map((lead) => {
                    const statusConfig = getStatusConfig(lead.status)
                    const StatusIcon = statusConfig.icon
                    const isSelected = selectedLeads.includes(lead.id)
                    const canDelete = canDeleteLead(lead)

                    return (
                      <div key={lead.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => canDelete && toggleSelectLead(lead.id)}
                              className={`flex items-center ${!canDelete ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-green-600" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-300" />
                              )}
                            </button>
                            <div>
                              <h3 className="font-semibold text-gray-900">{lead.fullName}</h3>
                              <p className="text-sm text-gray-600">{lead.email}</p>
                            </div>
                          </div>
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Teléfono:</span>
                            <p className="font-medium">{lead.phone}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Último recordatorio:</span>
                            <p className="font-medium">
                              {lead.lastReminderSentAt ? formatDate(lead.lastReminderSentAt) : 'Nunca'}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Días desde último:</span>
                            <p className="font-medium">{getDaysSinceLastReminder(lead.lastReminderSentAt)}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}