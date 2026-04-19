"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, Send, Loader2, ShieldCheck, User, Phone, Mail, DollarSign, 
  MessageSquare, Upload, FileText, CheckCircle, AlertCircle, 
  Camera, Home, Briefcase, CreditCard, Calendar, ChevronRight,
  MessageCircle
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { validateFile, formatFileSize } from '@/lib/file-utils' // ✅ CAMBIO 1: Import agregado

declare global {
  interface Window {
    fbq: (action: string, event: string, options?: any) => void;
    _fbq: any;
  }
}

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [leadToken, setLeadToken] = useState<string | null>(null)
  const [chatOpened, setChatOpened] = useState(false)
  
const [formData, setFormData] = useState({
  nombre: "",
  telefono: "",
  email: "",
  monto: "",
  tipoCredito: "tradicional",
  contactoPreferido: "email",
  mensaje: "",
})
  
  const [documents, setDocuments] = useState({
    ineFront: null as File | null,
    ineBack: null as File | null,
    comprobanteDomicilio: null as File | null,
    constanciaLaboral: null as File | null,
    estadosCuenta: null as File | null,
    otrosDocumentos: null as File | null
  })
  
  const [additionalData, setAdditionalData] = useState({
    curp: "",
    rfc: "",
    ocupacion: "",
    ingresoMensual: "",
    tiempoEmpleo: "",
    direccion: "",
    comentarios: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAdditionalDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAdditionalData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ✅ CAMBIO 2: handleFileChange con validación de tamaño
  const handleFileChange = (field: keyof typeof documents, file: File | null) => {
    if (!file) {
      setDocuments(prev => ({ ...prev, [field]: null }))
      return
    }
    
    // Validar tamaño (máximo 4.5 MB)
    if (file.size > 4.5 * 1024 * 1024) {
      alert(`❌ El archivo "${file.name}" pesa ${formatFileSize(file.size)}. Máximo 4.5 MB permitido.`)
      return
    }
    
    const validation = validateFile(file)
    if (!validation.valid) {
      alert(`❌ ${validation.message}`)
      return
    }
    
    setDocuments(prev => ({
      ...prev,
      [field]: file
    }))
    
    setValidationErrors(prev => 
      prev.filter(error => {
        const fieldMap = {
          ineFront: 'INE/IFE Frontal',
          ineBack: 'INE/IFE Trasera',
          comprobanteDomicilio: 'Comprobante de Domicilio',
          constanciaLaboral: 'Constancia Laboral'
        }
        return error !== fieldMap[field as keyof typeof fieldMap]
      })
    )
  }

  // ✅ CAMBIO 3: constanciaLaboral ya NO es obligatoria
  const validateRequiredDocuments = () => {
    const errors: string[] = []
    const required = [
      { field: 'ineFront', name: 'INE/IFE Frontal' },
      { field: 'ineBack', name: 'INE/IFE Trasera' },
      { field: 'comprobanteDomicilio', name: 'Comprobante de Domicilio' },
      // { field: 'constanciaLaboral', name: 'Constancia Laboral' } // ❌ COMENTADA - Ya no es obligatoria
    ]
    
    required.forEach(({ field, name }) => {
      if (!documents[field as keyof typeof documents]) {
        errors.push(name)
      }
    })
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const validatePersonalData = () => {
    if (!formData.nombre || !formData.telefono || !formData.email) {
      setError("Nombre, teléfono y email son requeridos")
      return false
    }
    return true
  }

const openVirtualOffice = async () => {
  if (chatOpened) return
  
  setChatOpened(true)
  
  // 1. ABRIR EL CHAT INMEDIATAMENTE (antes de cualquier fetch)
  window.dispatchEvent(new CustomEvent('openChat'))
  
  // 2. CERRAR EL MODAL
  onClose()
  
  // 3. Hacer las peticiones en segundo plano (sin bloquear)
  try {
    const fullName = formData.nombre.trim()
    
    const findRes = await fetch(`/api/chat/find-by-email?email=${encodeURIComponent(formData.email)}`)
    const findData = await findRes.json()
    
    let conversationId = findData.conversationId
    
    if (!conversationId) {
      const createRes = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: formData.email,
          phone: formData.telefono
        })
      })
      const createData = await createRes.json()
      
      if (createData.success) {
        conversationId = createData.conversationId
        
        await fetch('/api/chat/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId })
        })
        
        const systemMessage = formData.monto 
          ? `📋 Solicitud de crédito - Monto: $${formData.monto} - Tipo: ${formData.tipoCredito === 'tradicional' ? 'Tradicional' : 'Cripto'}`
          : `📋 Consulta general: ${formData.mensaje || 'Sin mensaje adicional'}`
        
        await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            message: systemMessage,
            senderType: 'system'
          })
        })
      }
    }
    
    localStorage.setItem('chat_conversation_id', conversationId)
    
    // Recargar la conversación en el chat ya abierto
    window.dispatchEvent(new CustomEvent('reloadConversation'))
    
  } catch (error) {
    console.error('Error opening virtual office:', error)
  }
}

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePersonalData()) return
    
    setIsSubmitting(true)
    setError("")
    setUploadProgress(20)
    
    try {
      const response = await fetch('/api/leads/create-calculator-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.nombre.split(' ')[0],
          lastName: formData.nombre.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.telefono,
          estimatedAmount: formData.monto.replace(/[^0-9]/g, '') || 0,
          creditType: formData.tipoCredito,
          message: formData.mensaje
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setLeadId(result.leadId)
        setLeadToken(result.token)
        setUploadProgress(100)
        setStep(3)

        if (result.leadId) {
  try {
    // Obtener asesores disponibles
    const agentsRes = await fetch('/api/admin/agents')
    const agentsData = await agentsRes.json()
    
    if (agentsData.success && agentsData.agents.length > 0) {
      // Seleccionar el asesor con menos carga (puedes usar la misma lógica que en chat)
      // Por ahora, asignamos el primer asesor activo
      const activeAgent = agentsData.agents.find((a: any) => a.isActive === true)
      
      if (activeAgent) {
        await fetch(`/api/leads/${result.leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assignedToId: activeAgent.id
          })
        })
        console.log('✅ Asesor asignado al lead:', activeAgent.name)
      }
    }
  } catch (error) {
    console.error('Error asignando asesor:', error)
  }
}
        
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Lead')
        }
      } else {
        throw new Error(result.error || 'Error al enviar la solicitud')
      }
      
    } catch (err: any) {
      console.error('❌ Error:', err)
      setError(err.message || 'Error al enviar. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateRequiredDocuments()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    setIsSubmitting(true)
    setError("")
    setUploadProgress(20)
    
    try {
      if (leadId) {
        await fetch(`/api/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            curp: additionalData.curp,
            rfc: additionalData.rfc,
            ocupacion: additionalData.ocupacion,
            ingresoMensual: parseFloat(additionalData.ingresoMensual.replace(/[^0-9.-]/g, '')) || 0,
            tiempoEmpleo: additionalData.tiempoEmpleo,
            direccion: additionalData.direccion,
            comentarios: additionalData.comentarios
          })
        })
      }
      
      setUploadProgress(40)
      
      const documentFormData = new FormData()
      if (leadId) documentFormData.append('leadId', leadId)
      if (leadToken) documentFormData.append('token', leadToken)
      
      Object.entries(documents).forEach(([key, file]) => {
        if (file) documentFormData.append(key, file)
      })
      
      setUploadProgress(60)
      
      const uploadResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        body: documentFormData
      })
      
      const uploadResult = await uploadResponse.json()
      
      if (uploadResult.success) {
        setUploadProgress(100)
        
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            nombre: formData.nombre,
            tipo: 'documentos',
            leadId: leadId
          })
        })
        
        setStep(4)
      } else {
        throw new Error(uploadResult.error || 'Error al subir los documentos')
      }
      
    } catch (err: any) {
      console.error('❌ Error:', err)
      setError(err.message || 'Error al enviar. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      setError("")
      setValidationErrors([])
      setUploadProgress(0)
      setLeadId(null)
      setLeadToken(null)
      setChatOpened(false)
setFormData({
  nombre: "",
  telefono: "",
  email: "",
  monto: "",
  tipoCredito: "tradicional",
  contactoPreferido: "email",  // ✅ CORREGIDO
  mensaje: "",
})
      setAdditionalData({
        curp: "",
        rfc: "",
        ocupacion: "",
        ingresoMensual: "",
        tiempoEmpleo: "",
        direccion: "",
        comentarios: ""
      })
      setDocuments({
        ineFront: null,
        ineBack: null,
        comprobanteDomicilio: null,
        constanciaLaboral: null,
        estadosCuenta: null,
        otrosDocumentos: null
      })
    }, 300)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100 sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {step === 1 && "Solicitud de Crédito"}
                  {step === 2 && "Completa tu Documentación"}
                  {step === 3 && "¡Solicitud Recibida!"}
                  {step === 4 && "¡Documentación Completada!"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Sin consulta a Buró de Crédito</span>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            {(step === 1 || step === 2) && (
              <div className="px-6 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progreso</span>
                  <span className="text-sm font-medium text-green-600">{step === 1 ? '50%' : '100%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: step === 1 ? '50%' : '100%' }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span className={step >= 1 ? "text-green-600 font-medium" : ""}>1. Datos básicos</span>
                  <span className={step >= 2 ? "text-green-600 font-medium" : ""}>2. Documentación</span>
                </div>
              </div>
            )}

            <div className="p-6">
              {error && (step === 1 || step === 2) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-800 mb-1">Error</h4>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                      <span className="text-lg">📋</span>
                      Proceso en Dos Etapas
                    </h4>
                    <div className="space-y-3 text-sm text-blue-800">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold">1</span>
                        </div>
                        <p>
                          <strong>Etapa 1 (Esta forma):</strong> Captura básica para asignarte un asesor personal.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold">2</span>
                        </div>
                        <p>
                          <strong>Etapa 2 (Opcional):</strong> Después de enviar, podrás subir tu documentación para agilizar el proceso.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-green-900 mb-1">Sin Consulta a Buró de Crédito</h4>
                      <p className="text-sm text-green-800">
                        Tu historial crediticio no será un obstáculo. Todos son bienvenidos.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitStep1} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Juan Pérez García"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        placeholder="55 1234 5678"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="ejemplo@correo.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Monto Estimado *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          name="monto"
                          value={formData.monto}
                          onChange={handleChange}
                          required
                          placeholder="100,000"
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Crédito *
                      </label>
                      <select
                        name="tipoCredito"
                        value={formData.tipoCredito}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      >
                        <option value="tradicional">11% Crédito Tradicional (MXN)</option>
                        <option value="crypto">5.4% Crédito en Criptomonedas</option>
                      </select>
                    </div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Prefiero ser contactado por *
  </label>
  <div className="grid grid-cols-1 gap-3">
    <div className="py-4 rounded-lg border border-orange-500 bg-orange-50 text-orange-700 flex items-center justify-center gap-2">
      <Mail className="w-6 h-6" />
      <span className="text-sm font-medium">Correo Electrónico</span>
    </div>
  </div>
  <input type="hidden" name="contactoPreferido" value="email" />
</div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Mensaje (Opcional)
                      </label>
                      <textarea
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Cuéntanos brevemente sobre tu necesidad..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Enviando solicitud...</span>
                          <span className="text-sm font-medium text-green-600">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Enviar Solicitud
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Solicitante: {formData.nombre}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Teléfono:</span>
                        <p className="font-medium">{formData.telefono}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Monto:</span>
                        <p className="font-medium">${formData.monto}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tipo:</span>
                        <p className="font-medium">{formData.tipoCredito === 'tradicional' ? 'Tradicional' : 'Cripto'}</p>
                      </div>
                    </div>
                  </div>

                  {validationErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-red-800 mb-2">Faltan documentos obligatorios</h4>
                          <ul className="list-disc list-inside text-red-700 space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index} className="text-sm">{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmitStep2} className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        Información Adicional
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CURP *</label>
                          <input
                            type="text"
                            name="curp"
                            value={additionalData.curp}
                            onChange={handleAdditionalDataChange}
                            required
                            placeholder="GARJ800101HDFLRN09"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ocupación</label>
                          <select
                            name="ocupacion"
                            value={additionalData.ocupacion}
                            onChange={handleAdditionalDataChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Selecciona una opción</option>
                            <option value="EMPLEADO">Empleado</option>
                            <option value="INDEPENDIENTE">Independiente</option>
                            <option value="EMPRESARIO">Empresario</option>
                            <option value="JUBILADO">Jubilado</option>
                            <option value="ESTUDIANTE">Estudiante</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ingreso Mensual</label>
                          <input
                            type="text"
                            name="ingresoMensual"
                            value={additionalData.ingresoMensual}
                            onChange={handleAdditionalDataChange}
                            placeholder="$15,000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección Completa</label>
                          <input
                            type="text"
                            name="direccion"
                            value={additionalData.direccion}
                            onChange={handleAdditionalDataChange}
                            placeholder="Calle, número, colonia, ciudad"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label>
                          <textarea
                            name="comentarios"
                            value={additionalData.comentarios}
                            onChange={handleAdditionalDataChange}
                            rows={3}
                            placeholder="Información adicional sobre tu situación..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-green-600" />
                        Documentación Obligatoria
                      </h4>
                      
                      <div className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors ${
                        validationErrors.includes('INE/IFE Frontal') 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}>
                        <label className="block mb-2">
                          <span className="font-medium text-gray-900">INE/IFE Frontal</span>
                          <span className="text-red-500 ml-1">*</span>
                          <p className="text-sm text-gray-500 mt-1">Foto frontal de tu identificación oficial</p>
                        </label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('ineFront', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                          />
                          {documents.ineFront && (
                            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.ineFront.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors ${
                        validationErrors.includes('INE/IFE Trasera') 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}>
                        <label className="block mb-2">
                          <span className="font-medium text-gray-900">INE/IFE Trasera</span>
                          <span className="text-red-500 ml-1">*</span>
                          <p className="text-sm text-gray-500 mt-1">Foto trasera de tu identificación oficial</p>
                        </label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('ineBack', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                          />
                          {documents.ineBack && (
                            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.ineBack.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors ${
                        validationErrors.includes('Comprobante de Domicilio') 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}>
                        <label className="block mb-2">
                          <span className="font-medium text-gray-900">Comprobante de Domicilio</span>
                          <span className="text-red-500 ml-1">*</span>
                          <p className="text-sm text-gray-500 mt-1">Recibo de luz, agua, teléfono (no mayor a 3 meses)</p>
                        </label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('comprobanteDomicilio', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                          />
                          {documents.comprobanteDomicilio && (
                            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.comprobanteDomicilio.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ✅ CAMBIO EN EL JSX: Constancia Laboral OPCIONAL */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-4 hover:border-green-400 transition-colors">
                        <label className="block mb-2">
                          <span className="font-medium text-gray-900">Constancia Laboral</span>
                          <span className="text-gray-400 ml-1 text-xs">(Opcional)</span>
                          <p className="text-sm text-gray-500 mt-1">Carta de empleo, recibos de nómina, estados de cuenta</p>
                        </label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('constanciaLaboral', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                          />
                          {documents.constanciaLaboral && (
                            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.constanciaLaboral.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Documentación Adicional (Opcional)
                      </h4>

                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-4 hover:border-blue-400 transition-colors">
                        <label className="block mb-2">
                          <span className="font-medium text-gray-900">Estados de Cuenta Bancarios</span>
                          <p className="text-sm text-gray-500 mt-1">Últimos 3 meses (ayuda a mejorar tu evaluación)</p>
                        </label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('estadosCuenta', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {documents.estadosCuenta && (
                            <p className="mt-2 text-sm text-blue-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.estadosCuenta.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                        <label className="block mb-2">
                          <span className="font-medium text-gray-900">Otros Documentos Relevantes</span>
                          <p className="text-sm text-gray-500 mt-1">Títulos, contratos, escrituras, etc.</p>
                        </label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('otrosDocumentos', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {documents.otrosDocumentos && (
                            <p className="mt-2 text-sm text-blue-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.otrosDocumentos.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Subiendo documentos...</span>
                          <span className="text-sm font-medium text-green-600">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
                      >
                        ← Volver
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Enviar Documentación
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

{step === 3 && (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-6"
  >
    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
      <CheckCircle className="w-12 h-12 text-white" />
    </div>
    
    <h3 className="text-3xl font-bold text-gray-900 mb-3">¡Hola {formData.nombre.split(' ')[0]}! 👋</h3>
    <p className="text-xl text-gray-700 mb-2">¡Hemos recibido tu solicitud correctamente!</p>
    
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 my-6 text-left shadow-sm">
      <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5" />
        ¿Qué sigue?
      </h4>
      
      <ul className="space-y-3 text-gray-700">
        <li className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span>Revisa tu correo: <strong className="text-green-700">{formData.email}</strong></span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span>Te llegará un <strong>enlace para completar tu documentación</strong> en los próximos minutos</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <span>Nuestro equipo analizará tu información en <strong>24-48 horas</strong></span>
        </li>
      </ul>
    </div>

    <div className="space-y-4">
      <button
        onClick={openVirtualOffice}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-md transition-all"
      >
        <MessageCircle className="w-6 h-6" />
        Abrir Oficina Virtual
      </button>

      <button
        onClick={() => setStep(2)}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-md transition-all"
      >
        <Upload className="w-5 h-5" />
        Subir documentación ahora (Agiliza tu proceso)
      </button>
    </div>

    <div className="mt-6 pt-4 border-t border-gray-200">
      <button
        onClick={handleClose}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all"
      >
        Cerrar
      </button>
    </div>
  </motion.div>
)}

              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">¡Documentación Completada!</h3>
                  <p className="text-xl text-gray-700 mb-2">Hemos recibido toda tu información</p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6 text-left">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      ¿Qué sigue?
                    </h4>
                    
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Revisa tu correo: <strong>{formData.email}</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Tu documentación será evaluada por nuestros analistas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Te contactaremos en las próximas 24-48 horas</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={openVirtualOffice}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all mb-3 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Abrir Oficina Virtual
                  </button>

                  <button
                    onClick={handleClose}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all"
                  >
                    Cerrar
                  </button>
                </motion.div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Todos tus datos están protegidos con encriptación SSL. 
                Al enviar este formulario, aceptas nuestra política de privacidad.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}