"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, Plus, Filter, Download, 
  Edit, Eye, Trash2, User, Phone, Mail,
  ChevronLeft, ChevronRight, AlertCircle
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
  assignedTo?: {
    id: string
    name: string
    email: string
  }
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Filtros y paginación
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalLeads, setTotalLeads] = useState(0)

  // Cargar leads
  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError('')
      
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/leads?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setLeads(data.data)
        setTotalPages(data.pagination.pages)
        setTotalLeads(data.pagination.total)
      } else {
        setError(data.error || 'Error al cargar leads')
      }
    } catch (error) {
      setError('Error de conexión')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [page, statusFilter])

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  // Eliminar lead
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este lead?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        fetchLeads() // Recargar lista
      } else {
        alert(data.error || 'Error al eliminar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX')
  }

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  // Obtener color según status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING_CONTACT': return { bg: '#fef3c7', text: '#92400e' }
    case 'CONTACTED': return { bg: '#dbeafe', text: '#1e40af' }
    case 'IN_PROCESS': return { bg: '#e0e7ff', text: '#3730a3' }
    case 'APPROVED': return { bg: '#d1fae5', text: '#065f46' }
    case 'REJECTED': return { bg: '#fee2e2', text: '#991b1b' }
    default: return { bg: '#f3f4f6', text: '#374151' }
  }
}

  // Obtener texto de status en español
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING_CONTACT': 'Pendiente Contacto',
    'CONTACTED': 'Contactado', 
    'IN_PROCESS': 'En Proceso',
    'APPROVED': 'Aprobado',
    'REJECTED': 'Rechazado'
  }
  return statusMap[status] || status
}

  if (loading && leads.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600">Cargando leads...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Leads</h1>
              <p className="text-gray-600 mt-2">
                Total: {totalLeads} leads • Página {page} de {totalPages}
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/leads/new')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Lead
            </button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Filtro por status */}
              <div>
<select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  style={{
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    background: 'white'
  }}
>
  <option value="">Todos los estados</option>
  <option value="PENDING_CONTACT">Pendiente Contacto</option>
  <option value="CONTACTED">Contactado</option>
  <option value="IN_PROCESS">En Proceso</option>
  <option value="APPROVED">Aprobado</option>
  <option value="REJECTED">Rechazado</option>
</select>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button
                  onClick={fetchLeads}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  Filtrar
                </button>
                <button
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('')
                    setPage(1)
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Tabla de leads */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {leads.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay leads</h3>
              <p className="text-gray-600 mb-6">
                {search || statusFilter 
                  ? 'No se encontraron resultados para tu búsqueda' 
                  : 'Aún no hay leads registrados. Crea el primero.'}
              </p>
              <button
                onClick={() => router.push('/admin/leads/new')}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Crear Primer Lead
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        {/* Nombre */}
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-green-800 font-medium">
                                {lead.fullName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{lead.fullName}</div>
                              <div className="text-sm text-gray-500 capitalize">{lead.creditType.toLowerCase()}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contacto */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{lead.phone}</span>
                            </div>
                          </div>
                        </td>

                        {/* Monto */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(lead.estimatedAmount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.stage.replace('_', ' ')}
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {getStatusText(lead.status)}
                          </span>
                        </td>

                        {/* Fecha */}
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(lead.createdAt)}
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/admin/leads/${lead.id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/leads/${lead.id}/edit`)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(page - 1) * 10 + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(page * 10, totalLeads)}</span> de{' '}
                    <span className="font-medium">{totalLeads}</span> leads
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Anterior
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg ${page === pageNum 
                              ? 'bg-green-600 text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      {totalPages > 5 && (
                        <>
                          <span className="px-2">...</span>
                          <button
                            onClick={() => setPage(totalPages)}
                            className={`w-10 h-10 rounded-lg ${page === totalPages 
                              ? 'bg-green-600 text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-2"
                    >
                      Siguiente
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {leads.filter(l => l.status === 'PENDING').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprobados</p>
                <p className="text-2xl font-bold text-green-600">
                  {leads.filter(l => l.status === 'APPROVED').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(leads.reduce((sum, lead) => sum + lead.estimatedAmount, 0))}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}