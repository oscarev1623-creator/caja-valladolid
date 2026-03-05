"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft, Ticket, FileText, Download, Eye,
  Upload, User, Mail, Phone, Calendar, Clock,
  Link as LinkIcon, Copy, Send, Trash2
} from 'lucide-react'

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.id as string

  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])

  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setTicket(data.data)
        // Si el ticket tiene documentos asociados
        if (data.data.documents) {
          setDocuments(data.data.documents)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('ticketId', ticketId)
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
    alert('✅ Enlace copiado')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!ticket) {
    return <div>Ticket no encontrado</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
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
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Número de ticket</p>
              <p className="text-lg font-bold text-gray-900">{ticket.ticketNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <span className={`px-3 py-1 rounded-full text-sm ${
                ticket.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                ticket.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {ticket.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Lead asociado</p>
              <p className="font-medium">{ticket.lead.fullName}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
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
              <p className="text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Creado: {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                Expira: {new Date(ticket.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Link del ticket */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-sm text-gray-600 flex-1 truncate">
                {ticket.linkUrl}
              </span>
              <button
                onClick={() => copyToClipboard(ticket.linkUrl)}
                className="p-1 text-gray-500 hover:text-blue-600"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE SUBIR DOCUMENTOS */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            Subir documento a este ticket
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium mb-1">
                {uploading ? 'Subiendo...' : 'Haz clic para seleccionar un archivo'}
              </p>
              <p className="text-sm text-gray-500">
                PDF, JPG, PNG, DOC (máx 10MB)
              </p>
            </label>
          </div>
        </div>

        {/* DOCUMENTOS SUBIDOS */}
        {documents.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Documentos del ticket
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 flex items-start justify-between hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{doc.filename}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <a
                      href={doc.fileUrl}
                      download
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}