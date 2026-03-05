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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterLead, setFilterLead] = useState('')
  const [leads, setLeads] = useState<any[]>([])

  // Cargar documentos
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

  // Cargar leads para el filtro
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
    fetchDocuments()
  }, [search, filterLead])

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-600" />
                Documentos Global
              </h1>
              <p className="text-gray-600 mt-2">
                Total: {documents.length} documentos subidos
              </p>
            </div>
            <button
              onClick={fetchDocuments}
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
                  placeholder="Buscar por nombre de archivo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterLead}
                onChange={(e) => setFilterLead(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="">Todos los leads</option>
                {leads.map(lead => (
                  <option key={lead.id} value={lead.id}>
                    {lead.fullName}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSearch('')
                    setFilterLead('')
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de documentos */}
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay documentos</h3>
            <p className="text-gray-600 mb-6">
          Los documentos aparecerán aquí cuando los clientes los suban o cuando los agregues manualmente.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                  {documents.map((doc) => (
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
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Ver documento"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <a
                            href={doc.fileUrl}
                            download
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
        )}
      </div>
    </div>
  )
}