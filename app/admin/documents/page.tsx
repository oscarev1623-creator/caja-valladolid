"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText, Download, Eye, Filter, Search,
  RefreshCw, User, Calendar, Clock, Trash2
} from 'lucide-react'

interface Document {
  id: string
  filename: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedAt: string
  lead: {
    id: string
    fullName: string
    email: string
    phone: string
  }
  uploadedBy: {
    id: string
    name: string
    email: string
  }
}

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterLead, setFilterLead] = useState('')
  const [leads, setLeads] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filterLead) params.append('leadId', filterLead)

      const response = await fetch(`/api/admin/documents?${params}`, {
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setDocuments(data.data)
        setFilteredDocuments(data.data)
      } else {
        setError(data.error || 'Error al cargar documentos')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads?limit=100', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setLeads(data.data)
      }
    } catch (error) {
      console.error('Error cargando leads:', error)
    }
  }

  useEffect(() => {
    fetchDocuments()
    fetchLeads()
  }, [])

  useEffect(() => {
    let filtered = [...documents]
    
    if (search.trim()) {
      const lower = search.toLowerCase()
      filtered = filtered.filter(d => 
        d.filename.toLowerCase().includes(lower) ||
        d.lead.fullName.toLowerCase().includes(lower) ||
        d.lead.email.toLowerCase().includes(lower)
      )
    }
    
    if (filterLead) {
      filtered = filtered.filter(d => d.lead.id === filterLead)
    }
    
    setFilteredDocuments(filtered)
  }, [search, filterLead, documents])

  const handleDelete = async (documentId: string) => {
    if (!confirm('¿Estás seguro de eliminar este documento?')) return

    try {
      const response = await fetch(`/api/admin/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Documento eliminado')
        fetchDocuments()
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase() || ''
    if (type.includes('pdf')) return '📄'
    if (type.includes('image')) return '🖼️'
    if (type.includes('word') || type.includes('doc')) return '📝'
    if (type.includes('excel') || type.includes('sheet')) return '📊'
    return '📁'
  }

  if (loading && documents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Cargando documentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                Documentos Global
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Total: {documents.length} documentos
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={fetchDocuments}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-4 bg-white rounded-xl shadow-sm p-3 md:p-4`}>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por archivo o lead..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <select
                value={filterLead}
                onChange={(e) => setFilterLead(e.target.value)}
                className="px-4 py-2.5 border rounded-lg text-sm bg-white"
              >
                <option value="">Todos los leads</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.fullName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearch('')
                  setFilterLead('')
                }}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de documentos */}
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
            <FileText className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">No hay documentos</h3>
            <p className="text-gray-600 text-sm">
              {search || filterLead ? 'No se encontraron resultados' : 'Los documentos aparecerán aquí cuando los clientes los suban.'}
            </p>
          </div>
        ) : (
          <>
            {/* Versión Desktop - Tabla */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Archivo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subido por</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getFileIcon(doc.fileType)}</span>
                            <div>
                              <p className="font-medium text-gray-900">{doc.filename}</p>
                              <p className="text-xs text-gray-500">{doc.fileType || 'Desconocido'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/admin/leads/${doc.lead.id}`)}
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <User className="w-3 h-3" />
                            {doc.lead.fullName}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{doc.uploadedBy?.name || 'Sistema'}</p>
                          <p className="text-xs text-gray-500">{doc.uploadedBy?.email || ''}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {new Date(doc.uploadedAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatFileSize(doc.fileSize)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Ver documento"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <a
                              href={doc.fileUrl}
                              download
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Descargar"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Versión Móvil - Cards */}
            <div className="md:hidden space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{getFileIcon(doc.fileType)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doc.filename}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(doc.fileSize)} • {doc.fileType || 'Desconocido'}</p>
                    </div>
                    <div className="flex gap-1">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={doc.fileUrl}
                        download
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pl-11 space-y-1">
                    <button
                      onClick={() => router.push(`/admin/leads/${doc.lead.id}`)}
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <User className="w-3 h-3" />
                      {doc.lead.fullName}
                    </button>
                    <p className="text-xs text-gray-500">
                      Subido por: {doc.uploadedBy?.name || 'Sistema'}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.uploadedAt).toLocaleDateString()} • {new Date(doc.uploadedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}