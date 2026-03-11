"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft, Mail, Phone, User, Calendar,
  DollarSign, FileText, CheckCircle, XCircle,
  Clock, AlertCircle, Edit, Trash2, Download,
  Link, Copy, Eye, Upload, RefreshCw,
  Send, MessageCircle, Check, Loader2, 
  Bitcoin, FileSignature
} from 'lucide-react'

// Interfaces para tipado
interface Document {
  id: string
  filename: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
}

interface Note {
  content: string
  createdAt: string
  author?: {
    name: string
  }
}

interface Lead {
  id: string
  fullName: string
  email: string
  phone: string
  estimatedAmount?: number
  creditType?: 'TRADITIONAL' | 'CRYPTO'
  status: string
  createdAt: string
  updatedAt: string
  documentsSubmitted?: boolean
  uniqueToken?: string
  notes?: Note[]
  documents?: Document[]
}

export default function LeadDetailPage() {
  const router = useRouter()
  const params = useParams()
  
  // Manejo seguro de params.id
  const leadId = params?.id as string | undefined
  
  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState<Lead | null>(null)
  const [error, setError] = useState('')
  
  // Estados para generación de link
  const [generating, setGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  
  // Estados para documentos
  const [documents, setDocuments] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [sendingCriptoEmail, setSendingCriptoEmail] = useState<string | null>(null)

  useEffect(() => {
    // Redirigir si no hay ID
    if (!leadId) {
      router.push('/admin/leads')
      return
    }

    const fetchLead = async () => {
      try {
        setLoading(true)
        
        const response = await fetch(`/api/leads/${leadId}`, {
          credentials: 'include'
        })

        if (response.status === 401) {
          router.push('/admin/login')
          return
        }

        const data = await response.json()

        if (data.success) {
          setLead(data.data)
          if (data.data.uniqueToken) {
            setGeneratedLink(`${window.location.origin}/formulario-documentos/${data.data.uniqueToken}`)
            setShowShareOptions(true)
          }
          if (data.data.documents && data.data.documents.length > 0) {
            setDocuments(data.data.documents)
          }
        } else {
          setError(data.error || 'Error al cargar lead')
        }
      } catch (error) {
        console.error('Error:', error)
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    fetchLead()
  }, [leadId, router])

  useEffect(() => {
    if (leadId) {
      fetchDocuments()
    }
  }, [leadId])

  // Función para generar link con animación de carga
  const generateLink = async () => {
    try {
      setGenerating(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const response = await fetch('/api/leads/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          leadId,
          baseUrl: window.location.origin 
        }),
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.success) {
        setGeneratedLink(data.data.url)
        setLead(prev => prev ? { ...prev, uniqueToken: data.data.token } : null)
        setShowShareOptions(true)
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error al generar link')
    } finally {
      setGenerating(false)
    }
  }

  // Función para enviar correo cripto
  const handleSendCriptoApprovalEmail = async (leadId: string) => {
    if (!confirm('¿Enviar correo de aprobación CRIPTO a este cliente?')) return
    
    setSendingCriptoEmail(leadId)
    try {
      const response = await fetch('/api/admin/send-approval-email-cripto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
        credentials: 'include'
      })
      
      const data = await response.json()
      if (data.success) {
        alert('✅ Correo de aprobación CRIPTO enviado correctamente')
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    } finally {
      setSendingCriptoEmail(null)
    }
  }

  // Función para copiar al portapapeles
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      alert('❌ Error al copiar')
    }
  }

  // Función para enviar por WhatsApp
  const sendByWhatsApp = () => {
    if (!lead) return
    
    const message = encodeURIComponent(
      `Hola ${lead?.fullName || 'cliente'},\n\n` +
      `Para continuar con tu solicitud de crédito, necesitamos que subas algunos documentos. ` +
      `Por favor ingresa al siguiente enlace:\n\n` +
      `${generatedLink}\n\n` +
      `El enlace es válido por 30 días.\n\n` +
      `Saludos,\nEquipo Caja Valladolid`
    )
    window.open(`https://wa.me/${lead?.phone?.replace(/\D/g, '')}?text=${message}`, '_blank')
  }

  // Función para enviar por email
  const sendByEmail = () => {
    if (!lead) return
    
    const subject = encodeURIComponent('Enlace para subir documentos - Caja Valladolid')
    const body = encodeURIComponent(
      `Hola ${lead?.fullName || 'cliente'},\n\n` +
      `Para continuar con tu solicitud de crédito, necesitamos que subas los siguientes documentos:\n` +
      `- Identificación oficial (INE/IFE)\n` +
      `- Comprobante de domicilio\n` +
      `- Comprobante de ingresos\n` +
      `- Estado de cuenta (si aplica)\n\n` +
      `Por favor ingresa al siguiente enlace para subir tus documentos:\n\n` +
      `${generatedLink}\n\n` +
      `El enlace es válido por 30 días.\n\n` +
      `Saludos,\nEquipo Caja Valladolid`
    )
    window.open(`mailto:${lead?.email}?subject=${subject}&body=${body}`, '_blank')
  }

  // Función para generar nuevo enlace
  const generateNewLink = () => {
    if (confirm('¿Generar nuevo enlace? El anterior dejará de funcionar inmediatamente.')) {
      setGeneratedLink('')
      setShowShareOptions(false)
      generateLink()
    }
  }

  // Función para cargar documentos
  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true)
      const response = await fetch(`/api/leads/documents?leadId=${leadId}`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents || [])
        console.log('Documentos cargados:', data.documents)
      }
    } catch (error) {
      console.error('Error cargando documentos:', error)
    } finally {
      setLoadingDocs(false)
    }
  }

  // Función para ver documento
  const viewDocument = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  // Función para descargar documento
  const downloadDocument = (fileUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async () => {
    if (!leadId) return
    if (!confirm('¿Estás seguro de eliminar este lead?')) return

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/leads')
      } else {
        alert(data.error || 'Error al eliminar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  // ============================================
  // FUNCIÓN DE CAMBIO DE ESTADO CON CORREO DE APROBACIÓN
  // ============================================
  const handleStatusChange = async (newStatus: string) => {
    if (!lead || !leadId) return
    
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        setLead({ ...lead, status: newStatus })
        
        // ✅ SI SE APROBÓ, ENVIAR CORREO DE APROBACIÓN
        if (newStatus === 'APPROVED') {
          try {
            const emailResponse = await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: lead.email,
                nombre: lead.fullName,
                tipo: 'aprobacion',
                leadId: lead.id,
                monto: lead.estimatedAmount,
                creditType: lead.creditType
              })
            })
            
            const emailData = await emailResponse.json()
            
            if (emailData.success) {
              alert('✅ Crédito aprobado y correo enviado al cliente')
            } else {
              alert('⚠️ Crédito aprobado pero hubo un error al enviar el correo')
            }
          } catch (emailError) {
            console.error('Error enviando correo:', emailError)
            alert('⚠️ Crédito aprobado pero no se pudo enviar el correo')
          }
        } else {
          alert('✅ Estado actualizado')
        }
      } else {
        alert(data.error || 'Error al actualizar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  // Función para reenviar correo de aprobación manualmente
  const handleResendApprovalEmail = async () => {
    if (!lead) return
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: lead.email,
          nombre: lead.fullName,
          tipo: 'aprobacion',
          leadId: lead.id,
          monto: lead.estimatedAmount,
          creditType: lead.creditType
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('✅ Correo de aprobación reenviado correctamente')
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string, icon: any, text: string }> = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, text: 'Pendiente' },
      'CONTACTED': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Phone, text: 'Contactado' },
      'UNDER_REVIEW': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: AlertCircle, text: 'En Revisión' },
      'APPROVED': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Aprobado' },
      'REJECTED': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, text: 'Rechazado' },
      'PENDING_DOCUMENTS': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: FileText, text: 'Pendiente Documentos' }
    }
    return config[status] || config['PENDING']
  }

  // Validar que tenemos leadId antes de continuar
  if (!leadId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Cargando detalles del lead...</p>
        </div>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Lead no encontrado'}</p>
          <button
            onClick={() => router.push('/admin/leads')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Volver a Leads
          </button>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge(lead.status)
  const StatusIcon = statusBadge.icon

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
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/admin/leads/${leadId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>

        {/* Lead Info */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg overflow-hidden mb-6 border border-green-100">
          <div className="p-6 border-b border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {lead.fullName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                    <Mail className="w-4 h-4 text-green-600" />
                    {lead.email}
                  </span>
                  <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm">
                    <Phone className="w-4 h-4 text-green-600" />
                    {lead.phone}
                  </span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 shadow-md ${statusBadge.color}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="font-medium">{statusBadge.text}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Monto solicitado</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(lead.estimatedAmount || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Tipo: {lead.creditType === 'TRADITIONAL' ? 'Crédito Tradicional' : 'Crédito Cripto'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Fecha de solicitud</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(lead.createdAt)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Actualizado: {formatDate(lead.updatedAt)}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Estado documentación</p>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lead.documentsSubmitted 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {lead.documentsSubmitted ? '✅ Documentos completos' : '⏳ Pendiente de documentos'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE GENERACIÓN DE LINK */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Link className="w-5 h-5" />
              📎 Formulario de Documentación
            </h2>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Genera un enlace para que el cliente pueda subir sus documentos de forma segura.
              El enlace expira en 30 días.
            </p>

            {!showShareOptions ? (
              <button
                onClick={generateLink}
                disabled={generating}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg text-lg font-medium transition-all transform hover:scale-105"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generando enlace...
                  </>
                ) : (
                  <>
                    <Link className="w-5 h-5" />
                    🔗 Generar Enlace para Documentos
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                {/* Link generado */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    ✅ Enlace generado exitosamente
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-200 mb-6">
                    <div className="flex flex-col md:flex-row gap-3">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="flex-1 p-3 border rounded-lg bg-gray-50 font-mono text-sm"
                      />
                      <button
                        onClick={copyToClipboard}
                        className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all min-w-[120px] ${
                          copied 
                            ? 'bg-green-600 text-white' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            ¡Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Opciones de envío */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Enviar enlace al cliente:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={sendByWhatsApp}
                        className="flex items-center justify-center gap-3 p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">Enviar por WhatsApp</span>
                      </button>
                      
                      <button
                        onClick={sendByEmail}
                        className="flex items-center justify-center gap-3 p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="font-medium">Enviar por Email</span>
                      </button>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">📱 Vista previa del mensaje:</p>
                      <p className="text-sm text-gray-700">
                        Hola {lead.fullName}, para continuar con tu solicitud de crédito, 
                        necesitamos que subas tus documentos aquí: {generatedLink}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>⏰ Expira: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    <button
                      onClick={generateNewLink}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Generar nuevo enlace
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN DE DOCUMENTOS SUBIDOS */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                📄 Documentos del Cliente
              </h2>
              {documents.length > 0 && (
                <button
                  onClick={fetchDocuments}
                  className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {loadingDocs ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="text-gray-600 mt-4">Cargando documentos...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No hay documentos subidos aún</p>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  Cuando el cliente acceda al enlace y suba sus documentos, aparecerán aquí automáticamente
                </p>
                {showShareOptions && (
                  <p className="text-sm text-blue-600 mt-4 font-medium">
                    El enlace ya fue generado. Compártelo con el cliente para que suba sus documentos.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc: Document) => (
                  <div 
                    key={doc.id} 
                    className="group border rounded-xl p-4 hover:shadow-lg transition-all hover:border-green-300 bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 mb-1 line-clamp-1">
                            {doc.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(doc.fileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => viewDocument(doc.fileUrl)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Ver documento"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadDocument(doc.fileUrl, doc.filename)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {doc.filename.split('.').pop()?.toUpperCase() || 'DOC'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Acciones rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleStatusChange('CONTACTED')}
              className="p-6 border-2 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all group"
            >
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-900 text-center">Contactado</p>
            </button>

            <button
              onClick={() => handleStatusChange('UNDER_REVIEW')}
              className="p-6 border-2 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all group"
            >
              <AlertCircle className="w-8 h-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-900 text-center">En Revisión</p>
            </button>

            <button
              onClick={() => handleStatusChange('APPROVED')}
              className="p-6 border-2 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all group"
            >
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-900 text-center">Aprobar</p>
            </button>

            <button
              onClick={() => handleStatusChange('REJECTED')}
              className="p-6 border-2 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all group"
            >
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-gray-900 text-center">Rechazar</p>
            </button>
          </div>

          {/* BOTÓN PARA REENVIAR CORREO DE APROBACIÓN (SOLO SI ESTÁ APROBADO) */}
          {lead.status === 'APPROVED' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Notificaciones
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleResendApprovalEmail}
                  className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 flex items-center justify-center gap-3 shadow-md transition-all group"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">📧 Reenviar correo de aprobación</span>
                </button>
              </div>
            </div>
          )}

          {/* BOTONES ESPECÍFICOS PARA CRÉDITOS CRIPTO */}
          {lead.creditType === 'CRYPTO' && lead.status === 'APPROVED' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bitcoin className="w-5 h-5 text-purple-600" />
                Acciones para Crédito Cripto
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSendCriptoApprovalEmail(lead.id)}
                  disabled={sendingCriptoEmail === lead.id}
                  className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center gap-3 shadow-md transition-all group disabled:opacity-50"
                >
                  {sendingCriptoEmail === lead.id ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-medium">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Bitcoin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">📧 Enviar Correo Cripto</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => window.open(`/api/contratos/cripto/${lead.id}`, '_blank')}
                  className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center gap-3 shadow-md transition-all group"
                >
                  <FileSignature className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">📄 Generar Contrato Cripto</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Estos botones solo aparecen para créditos cripto aprobados
              </p>
            </div>
          )}
        </div>

        {/* Notas */}
        {lead.notes && lead.notes.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Notas</h2>
            <div className="space-y-4">
              {lead.notes.map((note: Note, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-800">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(note.createdAt)} - {note.author?.name || 'Sistema'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}