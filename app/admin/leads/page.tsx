"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckSquare, Square, Check, RefreshCw, Filter,
  Users, AlertCircle, Phone, Mail, Calendar,
  DollarSign, Clock, Eye, Edit, Trash2, Search,
  Download, Upload, FileText, CheckCircle, XCircle,
  AlertTriangle, UserCheck, Send, Mail as MailIcon,
  FileSignature, CreditCard, Coins
} from 'lucide-react'
import StatusManager from './StatusManager'

interface Lead {
  id: string
  fullName: string
  email: string
  phone: string
  estimatedAmount: number
  creditType: string
  status: string
  stage: string
  createdAt: string
  assignedTo?: {
    id: string
    name: string
    email: string
  }
}

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: '📋', color: '#6b7280', bg: '#f3f4f6', filter: () => true },
  { id: 'pending', name: 'Pendientes', icon: '⏳', color: '#f59e0b', bg: '#fef3c7', filter: (lead: Lead) => lead.status === 'PENDING' },
  { id: 'contacted', name: 'Contactados', icon: '📞', color: '#3b82f6', bg: '#dbeafe', filter: (lead: Lead) => lead.status === 'CONTACTED' },
  { id: 'documentation', name: 'Documentación', icon: '📄', color: '#8b5cf6', bg: '#ede9fe', filter: (lead: Lead) => lead.stage === 'DOCUMENTATION' || lead.status === 'UNDER_REVIEW' },
  { id: 'review', name: 'En Revisión', icon: '🔍', color: '#6366f1', bg: '#e0e7ff', filter: (lead: Lead) => lead.status === 'UNDER_REVIEW' },
  { id: 'approved', name: 'Aprobados', icon: '✅', color: '#10b981', bg: '#d1fae5', filter: (lead: Lead) => lead.status === 'APPROVED' },
  { id: 'rejected', name: 'Rechazados', icon: '❌', color: '#ef4444', bg: '#fee2e2', filter: (lead: Lead) => lead.status === 'REJECTED' }
]

export default function LeadsPage() {
  const router = useRouter()
  const [allLeads, setAllLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLeads, setTotalLeads] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)

  // DEBUG
  useEffect(() => {
    console.log('🔄 LeadsPage MOUNTED')
    console.log('📍 URL:', window.location.pathname)
    console.log('🍪 Cookies:', document.cookie)
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('🔄 fetchLeads...')

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/leads?${params}`, {
        credentials: 'include'
      })

      console.log('📥 Status:', response.status)

      if (response.status === 401 || response.status === 403) {
        console.log('🚫 Acceso denegado')
        return
      }

      const data = await response.json()
      console.log('📊 Data:', data)

      if (data.success) {
        setAllLeads(data.data)
        setTotalPages(data.pagination.pages)
        setTotalLeads(data.pagination.total)
        setSelectedLeads([])
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

  useEffect(() => {
    fetchLeads()
  }, [page, statusFilter])

  useEffect(() => {
    if (allLeads.length === 0) {
      setFilteredLeads([])
      return
    }
    const activeCat = CATEGORIES.find(cat => cat.id === activeCategory)
    if (!activeCat) {
      setFilteredLeads(allLeads)
      return
    }
    let filtered = allLeads.filter(activeCat.filter)
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(lead => {
        const name = lead?.fullName?.toLowerCase() || ''
        const email = lead?.email?.toLowerCase() || ''
        const phone = lead?.phone?.toLowerCase() || ''
        return name.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower)
      })
    }
    setFilteredLeads(filtered)
  }, [allLeads, activeCategory, search])

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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este lead?')) return
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        fetchLeads()
        setSelectedLeads(prev => prev.filter(leadId => leadId !== id))
      } else {
        alert(data.error || 'Error al eliminar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  // ✅ NUEVA FUNCIÓN: Enviar correo de aprobación
  const handleSendApprovalEmail = async (leadId: string) => {
    if (!confirm('¿Enviar correo de aprobación a este cliente?')) return
    
    setSendingEmail(leadId)
    try {
      const response = await fetch('/api/admin/send-approval-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
        credentials: 'include'
      })
      
      const data = await response.json()
      if (data.success) {
        alert('✅ Correo de aprobación enviado correctamente')
        fetchLeads() // Recargar para actualizar estado
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    } finally {
      setSendingEmail(null)
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const getStatusConfig = (status: string) => {
    const config: Record<string, { bg: string, text: string, icon: any, label: string }> = {
      'PENDING': { bg: '#fef3c7', text: '#92400e', icon: Clock, label: 'Pendiente' },
      'CONTACTED': { bg: '#dbeafe', text: '#1e40af', icon: Phone, label: 'Contactado' },
      'APPROVED': { bg: '#d1fae5', text: '#065f46', icon: CheckCircle, label: 'Aprobado' },
      'REJECTED': { bg: '#fee2e2', text: '#991b1b', icon: XCircle, label: 'Rechazado' },
      'UNDER_REVIEW': { bg: '#e0e7ff', text: '#3730a3', icon: AlertTriangle, label: 'En Revisión' }
    }
    return config[status] || { bg: '#f3f4f6', text: '#374151', icon: AlertCircle, label: status }
  }

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return allLeads.length
    const category = CATEGORIES.find(cat => cat.id === categoryId)
    if (!category) return 0
    return allLeads.filter(category.filter).length
  }

  const isSelectable = (lead: Lead) => {
    return !['APPROVED', 'REJECTED'].includes(lead.status)
  }

  if (loading && allLeads.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-200 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Cargando leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Gestión de Leads</h1>
              <p className="text-green-100 text-lg">
                {totalLeads} leads registrados • {selectedLeads.length} seleccionados
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchLeads}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
              <button
                onClick={() => router.push('/admin/leads/new')}
                className="bg-white text-green-600 px-6 py-2 rounded-lg hover:bg-green-50 transition-all flex items-center gap-2 font-semibold shadow-lg"
              >
                <span className="text-xl">+</span>
                Nuevo Lead
              </button>
            </div>
          </div>
        </div>

        {/* Categorías con diseño mejorado */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-green-500 rounded-full"></span>
            Categorías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((category) => {
              const count = getCategoryCount(category.id)
              const isActive = activeCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`group relative overflow-hidden rounded-xl p-5 transition-all duration-300 ${
                    isActive 
                      ? 'bg-white shadow-xl scale-105 ring-2 ring-green-500 ring-offset-2' 
                      : 'bg-white/80 hover:bg-white hover:shadow-lg hover:scale-102'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-bl-full"
                       style={{ backgroundColor: category.color }}></div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{category.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{count} {count === 1 ? 'lead' : 'leads'}</p>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Gestión Masiva */}
        {selectedLeads.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Gestión Masiva</h3>
                  <p className="text-gray-600">
                    {selectedLeads.length} {selectedLeads.length === 1 ? 'lead seleccionado' : 'leads seleccionados'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedLeads([])}
                  className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Limpiar selección
                </button>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-medium shadow-sm">
                  {selectedLeads.length} seleccionados
                </div>
              </div>
            </div>
            <div className="border-t border-blue-200 mt-4 pt-4">
              <StatusManager
                leadIds={selectedLeads}
                currentStatus={filteredLeads.length > 0 && selectedLeads.length > 0 
                  ? filteredLeads.find(l => selectedLeads.includes(l.id))?.status 
                  : undefined}
                onStatusChange={async (apiAction, notes) => {
                  setActionLoading(true)
                  try {
                    const response = await fetch('/api/leads/batch', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ leadIds: selectedLeads, action: apiAction, notes: notes || '' }),
                      credentials: 'include'
                    })
                    const data = await response.json()
                    if (data.success) {
                      alert(`✅ ${data.message}`)
                      await fetchLeads()
                      setSelectedLeads([])
                    } else {
                      alert(`❌ Error: ${data.error}`)
                    }
                  } catch (error) {
                    console.error('Error:', error)
                    alert('❌ Error al procesar el cambio de estado')
                  } finally {
                    setActionLoading(false)
                  }
                }}
                disabled={actionLoading}
              />
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendiente</option>
                <option value="CONTACTED">Contactado</option>
                <option value="UNDER_REVIEW">En Revisión</option>
                <option value="APPROVED">Aprobado</option>
                <option value="REJECTED">Rechazado</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchLeads}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-md"
              >
                <Filter className="w-4 h-4" />
                Filtrar
              </button>
              <button
                onClick={() => { setSearch(''); setStatusFilter(''); setActiveCategory('all'); setPage(1); }}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-all"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3 shadow-md">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {/* Tabla de Leads */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {filteredLeads.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-7xl mb-4 opacity-20">📋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No hay leads</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {search || statusFilter 
                  ? 'No se encontraron resultados con los filtros seleccionados'
                  : 'Comienza creando tu primer lead para verlo aquí'}
              </p>
              <button
                onClick={() => router.push('/admin/leads/new')}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg inline-flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Crear Primer Lead
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <button
                          onClick={toggleSelectAll}
                          className="flex items-center gap-2 text-gray-700 font-semibold text-sm hover:text-green-600 transition-colors"
                        >
                          {selectedLeads.length === filteredLeads.length && filteredLeads.length > 0 ? (
                            <CheckSquare className="w-5 h-5 text-green-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                          SEL
                        </button>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CLIENTE</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CONTACTO</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">MONTO</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ESTADO</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">FECHA</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredLeads.map((lead) => {
                      const statusConfig = getStatusConfig(lead.status)
                      const StatusIcon = statusConfig.icon
                      const isSelected = selectedLeads.includes(lead.id)
                      const isSelectableLead = isSelectable(lead)
                      
                      return (
                        <tr 
                          key={lead.id} 
                          className={`group transition-all ${
                            isSelected ? 'bg-green-50/50' : 'hover:bg-gray-50/80'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div
                              onClick={() => isSelectableLead && toggleSelectLead(lead.id)}
                              className={`flex items-center justify-center cursor-pointer ${
                                !isSelectableLead ? 'cursor-not-allowed opacity-40' : ''
                              }`}
                              title={!isSelectableLead ? 'Lead ya procesado' : isSelected ? 'Deseleccionar' : 'Seleccionar'}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-5 h-5 text-green-600" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm shadow-sm ${
                                isSelectableLead ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-800' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {lead?.fullName ? lead.fullName.charAt(0) : '?'}
                              </div>
                              <div>
                                <p className={`font-semibold text-gray-900 ${!isSelectableLead && 'opacity-60'}`}>
                                  {lead?.fullName || 'Nombre no disponible'}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                  {lead?.creditType === 'TRADITIONAL' ? 'Crédito Tradicional' : 'Crédito Cripto'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-gray-700 truncate max-w-[180px]">
                                  {lead?.email || 'Sin email'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-gray-600">
                                  {lead?.phone || 'Sin teléfono'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{formatCurrency(lead?.estimatedAmount || 0)}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {lead?.stage ? String(lead.stage).replace('_', ' ') : 'Sin etapa'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: statusConfig.bg }}
                              >
                                <StatusIcon className="w-4 h-4" style={{ color: statusConfig.text }} />
                              </div>
                              <span className="text-sm font-medium" style={{ color: statusConfig.text }}>
                                {statusConfig.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="w-3.5 h-3.5" />
                              <span className="text-sm">{formatDate(lead?.createdAt || '')}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                                  className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => router.push(`/admin/leads/${lead.id}/edit`)}
                                  className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(lead.id)}
                                  className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {/* ✅ NUEVOS BOTONES DE APROBACIÓN Y CONTRATOS */}
                              {lead.status === 'APPROVED' && (
                                <div className="flex gap-1 mt-1 pt-1 border-t border-gray-100">
                                  <button
                                    onClick={() => handleSendApprovalEmail(lead.id)}
                                    disabled={sendingEmail === lead.id}
                                    className="flex-1 p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs flex items-center justify-center gap-1"
                                    title="Enviar correo de aprobación"
                                  >
                                    {sendingEmail === lead.id ? (
                                      <div className="w-3 h-3 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <MailIcon className="w-3 h-3" />
                                    )}
                                    <span>Correo</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => window.open(`/api/contratos/tradicional/${lead.id}`, '_blank')}
                                    className="flex-1 p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs flex items-center justify-center gap-1"
                                    title="Contrato tradicional"
                                  >
                                    <FileSignature className="w-3 h-3" />
                                    <span>Tradicional</span>
                                  </button>
                                  
                                  {lead.creditType === 'CRYPTO' && (
                                    <button
                                      onClick={() => window.open(`/api/contratos/cripto/${lead.id}`, '_blank')}
                                      className="flex-1 p-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs flex items-center justify-center gap-1"
                                      title="Contrato cripto"
                                    >
                                      <Coins className="w-3 h-3" />
                                      <span>Cripto</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginación mejorada */}
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                <div className="text-gray-600 text-sm">
                  Mostrando <span className="font-semibold text-gray-900">1</span> a{' '}
                  <span className="font-semibold text-gray-900">{filteredLeads.length}</span> de{' '}
                  <span className="font-semibold text-gray-900">{totalLeads}</span> leads
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-sm'
                    }`}
                  >
                    ← Anterior
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                            page === pageNum 
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md' 
                              : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      page === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-sm'
                    }`}
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Estadísticas mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
                <p className="text-xs text-gray-500 mt-2">+{Math.floor(totalLeads * 0.15)} este mes</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm mb-1">Seleccionados</p>
                <p className="text-3xl font-bold text-blue-600">{selectedLeads.length}</p>
                <p className="text-xs text-gray-500 mt-2">Para acciones masivas</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckSquare className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm mb-1">Aprobados</p>
                <p className="text-3xl font-bold text-green-600">
                  {allLeads.filter(l => l.status === 'APPROVED').length}
                </p>
                <p className="text-xs text-gray-500 mt-2">Tasa de aprobación: {Math.round((allLeads.filter(l => l.status === 'APPROVED').length / allLeads.length) * 100) || 0}%</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm mb-1">Monto Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(allLeads.reduce((sum, lead) => sum + (lead?.estimatedAmount || 0), 0))}
                </p>
                <p className="text-xs text-gray-500 mt-2">Créditos solicitados</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}