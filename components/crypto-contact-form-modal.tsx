"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, Send, Loader2, ShieldCheck, User, Phone, Mail, DollarSign, 
  MessageSquare, Upload, FileText, CheckCircle, AlertCircle, 
  Camera, Home, Briefcase, CreditCard, Calendar, ChevronRight,
  Bitcoin
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface CryptoContactFormModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCrypto: string
  plazo: number
  monto: number
}

export function CryptoContactFormModal({ 
  isOpen, 
  onClose, 
  selectedCrypto, 
  plazo, 
  monto 
}: CryptoContactFormModalProps) {
  const router = useRouter()
  
  // Estados para el formulario
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Datos personales
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    curp: "",
    monto: monto.toString(),
    tipoCredito: "crypto",
    contactoPreferido: "whatsapp",
    mensaje: "",
  })
  
  // Documentos
  const [documents, setDocuments] = useState({
    ineFront: null as File | null,
    ineBack: null as File | null,
    comprobanteDomicilio: null as File | null,
    constanciaLaboral: null as File | null,
    estadosCuenta: null as File | null,
    otrosDocumentos: null as File | null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (field: keyof typeof documents, file: File | null) => {
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

  const validateRequiredDocuments = () => {
    const errors: string[] = []
    const required = [
      { field: 'ineFront', name: 'INE/IFE Frontal' },
      { field: 'ineBack', name: 'INE/IFE Trasera' },
      { field: 'comprobanteDomicilio', name: 'Comprobante de Domicilio' },
      { field: 'constanciaLaboral', name: 'Constancia Laboral' }
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
    if (!formData.nombre || !formData.telefono || !formData.email || !formData.curp) {
      setError("Todos los campos marcados con * son obligatorios")
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setError("")
    if (step === 1 && validatePersonalData()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar documentos obligatorios
    if (!validateRequiredDocuments()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    setIsSubmitting(true)
    setError("")
    setUploadProgress(20)
    
    try {
      // PASO 1: Crear el lead usando el endpoint específico de cripto
      const leadResponse = await fetch('/api/formulario-externo-cripto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.nombre,
          phone: formData.telefono,
          email: formData.email,
          monto: formData.monto,
          selectedCrypto: selectedCrypto,
          plazo: plazo,
          contactoPreferido: formData.contactoPreferido,
          mensaje: formData.mensaje
        })
      })

      const leadResult = await leadResponse.json()
      if (!leadResult.success) throw new Error(leadResult.error)
      
      const leadId = leadResult.leadId
      setUploadProgress(40)
      
      // PASO 2: Preparar documentos
      const documentFormData = new FormData()
      documentFormData.append('leadId', leadId)
      documentFormData.append('token', leadResult.token || 'temp-token')
      
      Object.entries(documents).forEach(([key, file]) => {
        if (file) documentFormData.append(key, file)
      })
      
      setUploadProgress(60)
      
      // PASO 3: Subir documentos
      const uploadResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        body: documentFormData
      })
      
      const uploadResult = await uploadResponse.json()
      
      if (uploadResult.success) {
        // 📧 ENVIAR CORREO
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: formData.email,
              nombre: formData.nombre,
              tipo: 'documentos'
            })
          })
          console.log('✅ Correo enviado')
        } catch (emailError) {
          console.error('Error en correo:', emailError)
        }
        
        setUploadProgress(100)
        setSubmitted(true)
        setStep(3)
        localStorage.setItem('last_lead_id', leadId)
      } else {
        throw new Error(uploadResult.error || 'Error al subir los documentos')
      }
      
    } catch (err: any) {
      console.error('❌ Error:', err)
      setError(err.message || 'Error al enviar. Por favor intenta nuevamente.')
      setUploadProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      setSubmitted(false)
      setError("")
      setValidationErrors([])
      setUploadProgress(0)
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        curp: "",
        monto: monto.toString(),
        tipoCredito: "crypto",
        contactoPreferido: "whatsapp",
        mensaje: "",
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

  const handleWhatsAppClick = () => {
    const phone = "529541184165"
    const message = encodeURIComponent("Hola, tengo una duda sobre mi solicitud de crédito en criptomonedas")
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {step === 1 && "Solicitud de Crédito en Cripto - Paso 1"}
                  {step === 2 && "Solicitud de Crédito en Cripto - Paso 2 (Documentos)"}
                  {step === 3 && "¡Solicitud Completada!"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-600 font-medium">Crédito en Criptomonedas</span>
                </div>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            {step < 3 && (
              <div className="px-6 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progreso</span>
                  <span className="text-sm font-medium text-purple-600">{step === 1 ? '33%' : '66%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: step === 1 ? '33%' : '66%' }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span className={step >= 1 ? "text-purple-600 font-medium" : ""}>1. Datos personales</span>
                  <span className={step >= 2 ? "text-purple-600 font-medium" : ""}>2. Documentos</span>
                  <span className={step >= 3 ? "text-purple-600 font-medium" : ""}>3. Confirmación</span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Mensaje de error */}
              {error && step < 3 && (
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

              {/* STEP 1: DATOS PERSONALES */}
              {step === 1 && (
                <div className="space-y-5">
                  {/* Resumen de la selección */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <Bitcoin className="w-4 h-4" />
                      Tu selección en la calculadora
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Monto:</span>
                        <p className="font-medium">{monto.toLocaleString()} USDT</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Cripto:</span>
                        <p className="font-medium">{selectedCrypto}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Plazo:</span>
                        <p className="font-medium">{plazo} meses</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                      <Bitcoin className="w-5 h-5" />
                      Proceso para Crédito en Cripto
                    </h4>
                    <div className="space-y-3 text-sm text-purple-800">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-bold">1</span>
                        </div>
                        <p>
                          <strong>Etapa 1 (Esta forma):</strong> Captura básica para asignarte un asesor especializado en cripto.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-purple-600 font-bold">2</span>
                        </div>
                        <p>
                          <strong>Etapa 2 (Con asesor):</strong> Te enviaremos un formulario completo para adjuntar documentos y evaluación formal de tu crédito en criptomonedas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sin consulta a buró */}
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-green-900 mb-1">Sin Consulta a Buró de Crédito</h4>
                      <p className="text-sm text-green-800">
                        Tu historial crediticio no será un obstáculo. Todos son bienvenidos.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    {/* Nombre Completo */}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Teléfono / WhatsApp */}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Correo Electrónico */}
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* CURP */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        CURP *
                      </label>
                      <input
                        type="text"
                        name="curp"
                        value={formData.curp}
                        onChange={handleChange}
                        required
                        placeholder="GARJ800101HDFLRN09"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none uppercase"
                        maxLength={18}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Monto Estimado en USDT */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Monto (USDT) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₿</span>
                          <input
                            type="text"
                            name="monto"
                            value={formData.monto}
                            onChange={handleChange}
                            required
                            placeholder="10,000"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>

                      {/* Tipo de Crédito - SOLO CRIPTO */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Criptomoneda
                        </label>
                        <div className="px-4 py-3 border border-purple-300 rounded-lg bg-purple-50 text-purple-700 flex items-center gap-2">
                          <Bitcoin className="w-5 h-5" />
                          <span>{selectedCrypto} · 5.4% tasa fija</span>
                        </div>
                        <input type="hidden" name="tipoCredito" value="crypto" />
                      </div>
                    </div>

                    {/* Contacto preferido */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prefiero ser contactado por *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, contactoPreferido: "whatsapp" }))}
                          className={`py-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                            formData.contactoPreferido === "whatsapp" 
                              ? "border-purple-500 bg-purple-50 text-purple-700" 
                              : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/50"
                          }`}
                        >
                          <div className="relative w-8 h-8">
                            <Image
                              src="/whatsapp.png"
                              alt="WhatsApp"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <span className="text-sm font-medium">WhatsApp</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, contactoPreferido: "email" }))}
                          className={`py-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                            formData.contactoPreferido === "email" 
                              ? "border-orange-500 bg-orange-50 text-orange-700" 
                              : "border-gray-300 hover:border-orange-300 hover:bg-orange-50/50"
                          }`}
                        >
                          <Mail className="w-6 h-6" />
                          <span className="text-sm font-medium">Correo Electrónico</span>
                        </button>
                      </div>
                      <input type="hidden" name="contactoPreferido" value={formData.contactoPreferido} />
                    </div>

                    {/* Mensaje (Opcional) */}
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
                        placeholder="Cuéntanos sobre tu experiencia con criptomonedas..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>

                    {/* Botón Siguiente */}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      Siguiente: Subir Documentos
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2: DOCUMENTOS */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* Resumen de datos */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
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
                        <span className="text-gray-500">CURP:</span>
                        <p className="font-medium">{formData.curp}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Monto:</span>
                        <p className="font-medium">{formData.monto} USDT</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Cripto:</span>
                        <p className="font-medium">{selectedCrypto}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Plazo:</span>
                        <p className="font-medium">{plazo} meses</p>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje de error de validación */}
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

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Documentos obligatorios */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-purple-600" />
                        Documentación Obligatoria
                      </h4>
                      
                      {/* INE Frontal */}
                      <div className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors ${
                        validationErrors.includes('INE/IFE Frontal') 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-300 hover:border-purple-400'
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
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                          {documents.ineFront && (
                            <p className="mt-2 text-sm text-purple-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.ineFront.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* INE Trasera */}
                      <div className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors ${
                        validationErrors.includes('INE/IFE Trasera') 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-300 hover:border-purple-400'
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
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                          {documents.ineBack && (
                            <p className="mt-2 text-sm text-purple-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.ineBack.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Comprobante de domicilio */}
                      <div className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors ${
                        validationErrors.includes('Comprobante de Domicilio') 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-300 hover:border-purple-400'
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
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                          {documents.comprobanteDomicilio && (
                            <p className="mt-2 text-sm text-purple-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.comprobanteDomicilio.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Constancia laboral */}
                      <div className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors ${
                        validationErrors.includes('Constancia Laboral') 
                          ? 'border-red-400 bg-red-50' 
                          : 'border-gray-300 hover:border-purple-400'
                      }`}>
                        <label className="block mb-2">
                          <span className="font-medium text-gray-900">Constancia Laboral</span>
                          <span className="text-red-500 ml-1">*</span>
                          <p className="text-sm text-gray-500 mt-1">Carta de empleo, recibos de nómina, estados de cuenta</p>
                        </label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('constanciaLaboral', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                          {documents.constanciaLaboral && (
                            <p className="mt-2 text-sm text-purple-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.constanciaLaboral.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Documentos opcionales */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Documentación Adicional (Opcional)
                      </h4>

                      {/* Estados de cuenta */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-4 hover:border-purple-400 transition-colors">
                        <label className="block mb-2">
                          <span className="font-medium text-gray-900">Estados de Cuenta Bancarios</span>
                          <p className="text-sm text-gray-500 mt-1">Últimos 3 meses (ayuda a mejorar tu evaluación)</p>
                        </label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('estadosCuenta', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                          {documents.estadosCuenta && (
                            <p className="mt-2 text-sm text-purple-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.estadosCuenta.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Otros documentos */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-purple-400 transition-colors">
                        <label className="block mb-2">
                          <span className="font-medium text-gray-900">Otros Documentos Relevantes</span>
                          <p className="text-sm text-gray-500 mt-1">Títulos, contratos, escrituras, etc.</p>
                        </label>
                        <div className="mt-2">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange('otrosDocumentos', e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                          />
                          {documents.otrosDocumentos && (
                            <p className="mt-2 text-sm text-purple-600 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {documents.otrosDocumentos.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Subiendo documentos...</span>
                          <span className="text-sm font-medium text-purple-600">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all"
                      >
                        ← Atrás
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: ÉXITO */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Bitcoin className="w-12 h-12 text-purple-600" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">¡Felicidades!</h3>
                  <p className="text-xl text-gray-700 mb-2">Hemos recibido tu solicitud de crédito en criptomonedas</p>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 my-6 text-left">
                    <h4 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" />
                      Tu información está segura con nosotros
                    </h4>
                    
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span>Hemos recibido tus <strong>datos personales</strong> correctamente</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span>Tus <strong>documentos</strong> han sido subidos y almacenados de forma segura</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span>Nuestros analistas especializados en cripto están <strong>evaluando tu solicitud</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span>Recibirás un <strong>correo electrónico</strong> con la confirmación y los siguientes pasos</span>
                      </li>
                    </ul>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <strong>📧 Correo enviado a:</strong> {formData.email}
                      </p>
                    </div>
                  </div>

                  {/* Botón de WhatsApp */}
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
                    <h4 className="font-bold text-lg mb-3 flex items-center justify-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      ¿Tienes alguna duda?
                    </h4>
                    <p className="mb-4">
                      Escríbenos directamente a WhatsApp y un asesor especializado en cripto te atenderá
                    </p>
                    <button
                      onClick={handleWhatsAppClick}
                      className="bg-white text-purple-700 hover:bg-purple-50 font-bold py-4 px-8 rounded-lg transition-all flex items-center justify-center gap-3 mx-auto shadow-lg"
                    >
                      <Image
                        src="/whatsapp.png"
                        alt="WhatsApp"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      Contactar por WhatsApp
                    </button>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleClose}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-all"
                    >
                      Cerrar
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-6">
                    Este formulario se cerrará automáticamente en 10 segundos...
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
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