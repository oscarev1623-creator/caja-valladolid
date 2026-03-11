"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft, Ticket, FileText, Download, Eye,
  Upload, User, Mail, Phone, Calendar, Clock,
  Link as LinkIcon, Copy, Send, Trash2, Loader2
} from 'lucide-react'

// Interfaces para tipado
interface Document {
  id: string
  filename: string
  fileUrl: string
  uploadedAt: string
}

interface Lead {
  id: string
  fullName: string
  email: string
  phone: string
}

interface Ticket {
  id: string
  ticketNumber: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED'
  lead: Lead
  linkUrl: string
  createdAt: string
  expiresAt: string
  documents?: Document[]
}

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  
  // Manejo seguro de params.id
  const ticketId = params?.id as string | undefined

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])

  useEffect(() => {
    if (ticketId) {
      fetchTicket()
    } else {
      router.push('/admin/tickets')
    }
  }, [ticketId])

  const fetchTicket = async () => {
    if (!ticketId) return
    
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        credentials: 'include'
      })
      
      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      
      const data = await response.json()
      if (data.success) {
        setTicket(data.data)
        // Si el ticket tiene documentos asociados
        if (data.data.documents) {
          setDocuments(data.data.documents)
        }
      } else {
        console.error('Error:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !ticket) return

    // Validar tamaño (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ El archivo no puede ser mayor a 10MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('ticketId', ticketId!)
    formData.append('leadId', ticket.lead.id)

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Documento subido correctamente')
        fetchTicket() // Recargar
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al subir documento')
    } finally {
      setUploading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('✅ Enlace copiado al portapapeles')
  }

  // Redirigir si no hay ticketId
  if (!ticketId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ticket...</p>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ticket no encontrado</p>
          <button
            onClick={() => router.push('/admin/tickets')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Volver a Tickets
          </button>
        </div>
      </div>
    )
  }

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'EXPIRED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch(status) {
      case 'PENDING':
        return 'Pendiente'
      case 'IN_PROGRESS':
        return 'En Progreso'
      case 'COMPLETED':
        return 'Completado'
      case 'EXPIRED':
        return 'Expirado'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="w-6 h-6 text-green-600" />
            Detalle del Ticket
          </h1>
        </div>

        {/* Información del ticket */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              Ticket #{ticket.ticketNumber}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Número de ticket</p>
                <p className="text-lg font-bold text-gray-900">{ticket.ticketNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusColor(ticket.status)}`}>
                  {getStatusText(ticket.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Lead asociado</p>
                <p className="font-medium text-gray-900">{ticket.lead.fullName}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm">
                  <a href={`mailto:${ticket.lead.email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {ticket.lead.email}
                  </a>
                  <a href={`tel:${ticket.lead.phone}`} className="text-blue-600 hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {ticket.lead.phone}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Fechas</p>
                <p className="text-sm flex items-center gap-1 text-gray-700">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  Creado: {new Date(ticket.createdAt).toLocaleDateString('es-MX')}
                </p>
                <p className="text-sm flex items-center gap-1 mt-1 text-gray-700">
                  <Clock className="w-3 h-3 text-gray-400" />
                  Expira: {new Date(ticket.expiresAt).toLocaleDateString('es-MX')}
                </p>
              </div>
            </div>

            {/* Link del ticket */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                Enlace del ticket:
              </p>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
                <span className="font-mono text-sm text-gray-600 flex-1 truncate px-2">
                  {ticket.linkUrl}
                </span>
                <button
                  onClick={() => copyToClipboard(ticket.linkUrl)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copiar enlace"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE SUBIR DOCUMENTOS */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Subir documento a este ticket
            </h2>
          </div>
          
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploading ? (
                  <Loader2 className="w-12 h-12 text-blue-500 mb-3 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                )}
                <p className="text-gray-700 font-medium mb-1">
                  {uploading ? 'Subiendo archivo...' : 'Haz clic para seleccionar un archivo'}
                </p>
                <p className="text-sm text-gray-500">
                  PDF, JPG, PNG, DOC (máx 10MB)
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* DOCUMENTOS SUBIDOS */}
        {documents.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentos del ticket ({documents.length})
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{doc.filename}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver documento"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={doc.fileUrl}
                        download
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Descargar documento"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}