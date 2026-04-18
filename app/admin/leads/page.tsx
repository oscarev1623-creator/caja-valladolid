"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckSquare, Square, Check, RefreshCw, Filter,
  Users, AlertCircle, Phone, Mail, Calendar,
  DollarSign, Clock, Eye, Edit, Trash2, Search,
  Download, Upload, FileText, CheckCircle, XCircle,
  AlertTriangle, UserCheck, Send, Mail as MailIcon,
  FileSignature, CreditCard, Coins, MessageCircle, UserCog, Palette, X
} from 'lucide-react'

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
  message?: string
  assignedTo?: {
    id: string
    name: string
    email: string
    color?: string
  }
}

const COLOR_PRESETS = [
  { name: 'Azul', bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800', dot: 'bg-blue-500', value: 'blue' },
  { name: 'Rosa', bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-800', dot: 'bg-pink-500', value: 'pink' },
  { name: 'Verde', bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', dot: 'bg-green-500', value: 'green' },
  { name: 'Morado', bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800', dot: 'bg-purple-500', value: 'purple' },
  { name: 'Naranja', bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', dot: 'bg-orange-500', value: 'orange' },
  { name: 'Amarillo', bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800', dot: 'bg-yellow-500', value: 'yellow' },
  { name: 'Gris', bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-800', dot: 'bg-gray-500', value: 'gray' },
  { name: 'Rojo', bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', dot: 'bg-red-500', value: 'red' },
  { name: 'Cian', bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-800', dot: 'bg-cyan-500', value: 'cyan' },
  { name: 'Lima', bg: 'bg-lime-50', border: 'border-lime-300', text: 'text-lime-800', dot: 'bg-lime-500', value: 'lime' }
]

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: '📋', color: '#6b7280', bg: '#f3f4f6', filter: () => true },
  { id: 'pending', name: 'Pendientes', icon: '⏳', color: '#f59e0b', bg: '#fef3c7', filter: (lead: Lead) => lead.status === 'PENDING' || lead.status === 'PENDING_DOCUMENTS' },
  { id: 'contacted', name: 'Contactados', icon: '📞', color: '#3b82f6', bg: '#dbeafe', filter: (lead: Lead) => lead.status === 'CONTACTED' },
  { id: 'documentation', name: 'Documentación', icon: '📄', color: '#8b5cf6', bg: '#ede9fe', filter: (lead: Lead) => lead.stage === 'DOCUMENTATION' || lead.status === 'UNDER_REVIEW' },
  { id: 'review', name: 'En Revisión', icon: '🔍', color: '#6366f1', bg: '#e0e7ff', filter: (lead: Lead) => lead.status === 'UNDER_REVIEW' },
  { id: 'approved', name: 'Aprobados', icon: '✅', color: '#10b981', bg: '#d1fae5', filter: (lead: Lead) => lead.status === 'APPROVED' },
  { id: 'rejected', name: 'Rechazados', icon: '❌', color: '#ef4444', bg: '#fee2e2', filter: (lead: Lead) => lead.status === 'REJECTED' }
]

const QUICK_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'CONTACTED', label: 'Contactado', color: 'bg-blue-100 text-blue-800' },
  { value: 'UNDER_REVIEW', label: 'En Revisión', color: 'bg-purple-100 text-purple-800' },
  { value: 'APPROVED', label: 'Aprobado', color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Rechazado', color: 'bg-red-100 text-red-800' }
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
  //const [page, setPage] = useState(1)
  //const [totalPages, setTotalPages] = useState(1)
  const [totalLeads, setTotalLeads] = useState(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)
  const [leadColors, setLeadColors] = useState<Record<string, string>>({})
  
  // NUEVO: Filtro por asesor
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all')
  const [agents, setAgents] = useState<any[]>([])

  function getAgentColor(color: string | undefined) {
    const colors: Record<string, string> = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      pink: '#ec4899',
      orange: '#f97316',
      yellow: '#eab308',
      red: '#ef4444',
      cyan: '#06b6d4',
      lime: '#84cc16'
    }
    return colors[color || 'green'] || '#10b981'
  }

  // Cargar asesores para el filtro
  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/admin/agents')
      const data = await res.json()
      if (data.success) {
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  // Cargar colores guardados
  useEffect(() => {
    const saved = localStorage.getItem('lead_colors')
    if (saved) {
      setLeadColors(JSON.parse(saved))
    }
  }, [])

  // Guardar color de un lead específico
  const saveLeadColor = (leadId: string, colorValue: string) => {
    const newColors = { ...leadColors, [leadId]: colorValue }
    setLeadColors(newColors)
    localStorage.setItem('lead_colors', JSON.stringify(newColors))
    setShowColorPicker(null)
  }

  // Quitar color de un lead
  const removeLeadColor = (leadId: string) => {
    const newColors = { ...leadColors }
    delete newColors[leadId]
    setLeadColors(newColors)
    localStorage.setItem('lead_colors', JSON.stringify(newColors))
    setShowColorPicker(null)
  }

  // Resetear todos los colores
  const resetAllColors = () => {
    if (confirm('⚠️ Esta acción solo reseteará los colores visuales de los leads en tu pantalla. Los leads y toda su información permanecerán intactos. ¿Deseas continuar?')) {
      setLeadColors({})
      localStorage.removeItem('lead_colors')
      setShowColorPicker(null)
      alert('✅ Colores reseteados correctamente. Los leads siguen siendo los mismos.')
    }
  }

  // Obtener estilo según el color asignado al lead
  const getLeadStyle = (leadId: string) => {
    const colorValue = leadColors[leadId]
    const preset = COLOR_PRESETS.find(c => c.value === colorValue)
    return preset || COLOR_PRESETS[0]
  }

  const getUniqueAssignees = () => {
    const assignees = new Map<string, { name: string; email: string }>()
    allLeads.forEach(lead => {
      if (lead.assignedTo && !assignees.has(lead.assignedTo.email)) {
        assignees.set(lead.assignedTo.email, {
          name: lead.assignedTo.name,
          email: lead.assignedTo.email
        })
      }
    })
    return Array.from(assignees.values())
  }

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
  limit: '1000',  // ✅ Cargar hasta 1000 leads de una vez
  ...(search && { search }),
  ...(statusFilter && { status: statusFilter })
})

      const response = await fetch(`/api/leads?${params}`, {
        credentials: 'include'
      })

      if (response.status === 401 || response.status === 403) {
        console.log('🚫 Acceso denegado')
        return
      }

      const data = await response.json()

      if (data.success) {
        setAllLeads(data.data)
        //setTotalPages(data.pagination.pages)
        //setTotalLeads(data.pagination.total)
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
}, [statusFilter])  // ✅ Ya no depende de page

  // Aplicar filtros (incluyendo el de asesor)
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
    // NUEVO: Filtro por asesor
    if (selectedAgentFilter !== 'all') {
      filtered = filtered.filter(lead => lead.assignedTo?.id === selectedAgentFilter)
    }
    setFilteredLeads(filtered)
  }, [allLeads, activeCategory, search, selectedAgentFilter])

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

  const handleQuickStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingStatus(leadId)
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        fetchLeads()
      } else {
        alert('Error al actualizar estado')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setUpdatingStatus(null)
    }
  }

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
        fetchLeads()
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

  const assignees = getUniqueAssignees()

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-6 md:p-8 mb-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">Gestión de Leads</h1>
              <p className="text-green-100 text-sm md:text-lg">
                {totalLeads} leads registrados • {selectedLeads.length} seleccionados
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchLeads}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
              <button
                onClick={() => router.push('/admin/leads/new')}
                className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-all flex items-center gap-2 font-semibold shadow-lg text-sm"
              >
                <span className="text-lg">+</span>
                Nuevo Lead
              </button>
            </div>
          </div>
        </div>

        {/* NUEVO: Filtro por asesor */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrar por asesor:</span>
            </div>
            {selectedAgentFilter !== 'all' && (
              <button
                onClick={() => setSelectedAgentFilter('all')}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Limpiar filtro
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAgentFilter('all')}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedAgentFilter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Todos ({allLeads.length})
              </div>
            </button>
            {agents.map((agent) => {
              const agentLeads = allLeads.filter(l => l.assignedTo?.id === agent.id)
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentFilter(agent.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedAgentFilter === agent.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {agent.name} ({agentLeads.length})
                </button>
              )
            })}
          </div>
        </div>

        {/* Filtros compactos */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="CONTACTED">Contactado</option>
              <option value="UNDER_REVIEW">En Revisión</option>
              <option value="APPROVED">Aprobado</option>
              <option value="REJECTED">Rechazado</option>
            </select>
            <button
              onClick={fetchLeads}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
            <button
              onClick={() => { setSearch(''); setStatusFilter(''); setActiveCategory('all'); fetchLeads(); }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4 opacity-20">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No hay leads</h3>
              <p className="text-gray-600 mb-6 text-sm">
                {search || statusFilter || selectedAgentFilter !== 'all' ? 'No se encontraron resultados' : 'Comienza creando tu primer lead'}
              </p>
              <button
                onClick={() => router.push('/admin/leads/new')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                + Crear Primer Lead
              </button>
            </div>
          ) : (
            <>
              {/* Versión Desktop - Tabla SIN columna de colores y más compacta */}
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
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Contacto</th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Monto</th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Estado</th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Fecha</th>
                      <th className="px-3 py-3 text-left font-semibold text-gray-600 text-xs uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.map((lead) => {
                      const statusConfig = getStatusConfig(lead.status)
                      const StatusIcon = statusConfig.icon
                      const isSelected = selectedLeads.includes(lead.id)
                      const isSelectableLead = isSelectable(lead)
                      
                      return (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3">
                            <div
                              onClick={() => isSelectableLead && toggleSelectLead(lead.id)}
                              className={`cursor-pointer ${!isSelectableLead ? 'opacity-40 cursor-not-allowed' : ''}`}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-green-600" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold text-sm">
                                {lead.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{lead.fullName}</p>
                                <p className="text-xs text-gray-500 capitalize">{lead.creditType === 'TRADITIONAL' ? 'Tradicional' : 'Cripto'}</p>
                                {lead.assignedTo && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <div 
                                      className="w-2 h-2 rounded-full" 
                                      style={{ backgroundColor: getAgentColor(lead.assignedTo.color) }}
                                    />
                                    <p className="text-xs text-gray-400 flex items-center gap-1">
                                      <UserCog className="w-3 h-3" />
                                      {lead.assignedTo.name}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-700 truncate max-w-[140px]">{lead.email}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-600">{lead.phone}</span>
                              </div>
                              <button
                                onClick={() => {
                                  router.push(`/admin/chat?leadId=${lead.id}&email=${encodeURIComponent(lead.email)}&name=${encodeURIComponent(lead.fullName)}&phone=${encodeURIComponent(lead.phone)}`)
                                }}
                                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Chat</span>
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                              {formatCurrency(lead.estimatedAmount)}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {lead.stage?.replace('_', ' ') || 'Sin etapa'}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: statusConfig.bg }}>
                                  <StatusIcon className="w-3 h-3" style={{ color: statusConfig.text }} />
                                </div>
                                <span className="text-xs font-medium" style={{ color: statusConfig.text }}>
                                  {statusConfig.label}
                                </span>
                              </div>
                              {isSelectableLead && (
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleQuickStatusChange(lead.id, e.target.value)}
                                  disabled={updatingStatus === lead.id}
                                  className="text-xs px-2 py-0.5 rounded border border-gray-200 bg-white focus:ring-1 focus:ring-green-500"
                                >
                                  {QUICK_STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(lead.createdAt)}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => router.push(`/admin/leads/${lead.id}`)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => router.push(`/admin/leads/${lead.id}/edit`)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(lead.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {lead.status === 'APPROVED' && (
                              <div className="flex gap-1 mt-2">
                                <button
                                  onClick={() => handleSendApprovalEmail(lead.id)}
                                  disabled={sendingEmail === lead.id}
                                  className="flex-1 p-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                                >
                                  {sendingEmail === lead.id ? '...' : 'Correo'}
                                </button>
                                <button
                                  onClick={() => window.open(`/api/contratos/tradicional/${lead.id}`, '_blank')}
                                  className="flex-1 p-1 bg-blue-100 text-blue-700 rounded text-xs"
                                >
                                  Contrato
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Versión Móvil */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredLeads.map((lead) => {
                  const statusConfig = getStatusConfig(lead.status)
                  const StatusIcon = statusConfig.icon
                  
                  return (
                    <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold">
                            {lead.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{lead.fullName}</p>
                            <p className="text-xs text-gray-500">{lead.creditType === 'TRADITIONAL' ? 'Tradicional' : 'Cripto'}</p>
                            {lead.assignedTo && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: getAgentColor(lead.assignedTo.color) }}
                                />
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <UserCog className="w-3 h-3" />
                                  {lead.assignedTo.name}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSelectLead(lead.id)}
                          className="p-1"
                        >
                          {selectedLeads.includes(lead.id) ? (
                            <CheckSquare className="w-5 h-5 text-green-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{lead.phone}</span>
                        </div>
                        <button
                          onClick={() => {
                            router.push(`/admin/chat?leadId=${lead.id}&email=${encodeURIComponent(lead.email)}&name=${encodeURIComponent(lead.fullName)}&phone=${encodeURIComponent(lead.phone)}`)
                          }}
                          className="flex items-center gap-1 text-purple-600"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat
                        </button>
                        <div className="flex justify-between items-center pt-2">
                          <div>
                            <p className="text-xs text-gray-500">Monto</p>
                            <p className="font-semibold text-gray-900">{formatCurrency(lead.estimatedAmount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Estado</p>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Fecha</p>
                            <p className="text-sm">{formatDate(lead.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => router.push(`/admin/leads/${lead.id}`)}
                            className="flex-1 p-2 text-blue-600 bg-blue-50 rounded-lg text-center text-sm"
                          >
                            Ver detalles
                          </button>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-2 text-red-600 bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {lead.status === 'APPROVED' && (
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => handleSendApprovalEmail(lead.id)}
                              disabled={sendingEmail === lead.id}
                              className="flex-1 p-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                            >
                              {sendingEmail === lead.id ? 'Enviando...' : 'Enviar Correo'}
                            </button>
                            <button
                              onClick={() => window.open(`/api/contratos/tradicional/${lead.id}`, '_blank')}
                              className="flex-1 p-2 bg-blue-100 text-blue-700 rounded text-sm"
                            >
                              Contrato
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Paginación */}
{/* Contador simple sin paginación */}
<div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center bg-gray-50 text-sm">
  <div className="text-gray-600 text-xs">
    Mostrando {filteredLeads.length} de {totalLeads} leads
  </div>
  <div className="text-xs text-gray-400">
    {selectedLeads.length > 0 && `${selectedLeads.length} seleccionados`}
  </div>
</div>
            </>
          )}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-white rounded-xl p-3 shadow">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">{totalLeads}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow">
            <p className="text-xs text-gray-500">Pendientes</p>
            <p className="text-xl font-bold text-yellow-600">{allLeads.filter(l => l.status === 'PENDING').length}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow">
            <p className="text-xs text-gray-500">Aprobados</p>
            <p className="text-xl font-bold text-green-600">{allLeads.filter(l => l.status === 'APPROVED').length}</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow">
            <p className="text-xs text-gray-500">Monto Total</p>
            <p className="text-sm font-bold text-gray-900 truncate">{formatCurrency(allLeads.reduce((sum, l) => sum + l.estimatedAmount, 0))}</p>
          </div>
        </div>
      </div>
    </div>
  )
}