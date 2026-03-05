"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Loader2, ShieldCheck, FileText, User, Mail, Phone, MessageSquare, CheckCircle, DollarSign } from "lucide-react"
import Image from "next/image"

interface LeadCaptureFormProps {
  isOpen: boolean
  onClose: () => void
  creditType?: "traditional" | "crypto"
  // DATOS PRE-LLENADOS DESDE LA CALCULADORA
  prefilledData?: {
    estimatedAmount?: string
    selectedCrypto?: string
    plazo?: number
    creditType?: "traditional" | "crypto"
  }
}

export function LeadCaptureForm({ 
  isOpen, 
  onClose, 
  creditType = "traditional",
  prefilledData = {}
}: LeadCaptureFormProps) {
  
  // ESTADO INICIAL CON DATOS PRE-LLENADOS
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    estimatedAmount: prefilledData.estimatedAmount || "",
    creditType: prefilledData.creditType || creditType,
    plazo: prefilledData.plazo?.toString() || "",
    selectedCrypto: prefilledData.selectedCrypto || "USDT",
    message: "",
    preferredContact: "whatsapp", // whatsapp, email
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // ACTUALIZAR FORMULARIO SI CAMBIAN LOS DATOS PRE-LLENADOS
  useEffect(() => {
    if (prefilledData.estimatedAmount) {
      setFormData(prev => ({
        ...prev,
        estimatedAmount: prefilledData.estimatedAmount || prev.estimatedAmount,
        creditType: prefilledData.creditType || prev.creditType,
        selectedCrypto: prefilledData.selectedCrypto || prev.selectedCrypto,
        plazo: prefilledData.plazo?.toString() || prev.plazo
      }))
    }
  }, [prefilledData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const dataToSend = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        estimatedAmount: formData.estimatedAmount,
        creditType: formData.creditType,
        selectedCrypto: formData.selectedCrypto,
        plazo: formData.plazo,
        preferredContact: formData.preferredContact,
        message: formData.message
      }

      const response = await fetch('/api/formulario-externo-simple', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json()
      
      if (result.success) {
        setSubmitted(true)
        localStorage.setItem('last_lead_id', result.leadId)
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // OPCIONES DE CRIPTOMONEDAS
  const cryptoOptions = [
    { value: "USDT", label: "USDT (Tether)", icon: "₮" },
    { value: "BTC", label: "BTC (Bitcoin)", icon: "₿" },
    { value: "ETH", label: "ETH (Ethereum)", icon: "Ξ" },
    { value: "BNB", label: "BNB (Binance Coin)", icon: "B" },
    { value: "SOL", label: "SOL (Solana)", icon: "◎" }
  ]

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
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-green-600 to-green-700 text-white">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6" />
                <div>
                  <h3 className="text-2xl font-bold">Pre-Evaluación de Crédito</h3>
                  <p className="text-sm opacity-90">
                    {formData.creditType === "crypto" ? "Créditos en Criptomonedas" : "Créditos Tradicionales"}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    ¡Solicitud Recibida!
                  </h4>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Hemos registrado tu interés. Un asesor se pondrá en contacto contigo por{' '}
                    <span className="font-semibold text-green-600">
                      {formData.preferredContact === "whatsapp" ? "WhatsApp" : "correo electrónico"}
                    </span>{' '}
                    en las próximas horas.
                  </p>

                  {/* Pasos para el cliente - SIN NOMBRE DE ASESOR */}
                  <div className="space-y-4 mb-8 max-w-md mx-auto">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">Espera nuestro contacto</p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Un asesor se comunicará contigo por el método que elegiste en <strong>2-4 horas hábiles</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900 dark:text-purple-100">Recibirás formulario completo</p>
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          Te enviaremos un formulario detallado para adjuntar tus documentos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-left">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">Evaluación formal</p>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Revisaremos tu documentación y te daremos respuesta en <strong>24-48 horas</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información genérica - SIN ASESOR ESPECÍFICO */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 mb-6 text-left">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      Método de contacto elegido
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
                        {formData.preferredContact === "whatsapp" ? (
                          <>
                            <div className="relative w-8 h-8">
                              <Image
                                src="/whatsapp.png"
                                alt="WhatsApp"
                                fill
                                className="object-contain"
                                sizes="32px"
                              />
                            </div>
                            <div>
                              <p className="font-medium">WhatsApp</p>
                              <p className="text-sm text-gray-600">Te contactaremos por este medio</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Mail className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-medium">Correo Electrónico</p>
                              <p className="text-sm text-gray-600">Recibirás toda la información en tu email</p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                        <strong>Horario de contacto:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>

                  {/* Documentos a preparar */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800 text-left">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-yellow-600" />
                      {formData.creditType === "crypto" ? "Documentos para crédito en cripto" : "Prepara estos documentos"}
                    </h5>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5"></div>
                        <span><strong>INE/IFE</strong> (ambos lados, vigente)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5"></div>
                        <span><strong>Comprobante de domicilio</strong> (no mayor a 3 meses)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5"></div>
                        <span><strong>Estados de cuenta</strong> (últimos 3 meses)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5"></div>
                        <span><strong>Comprobante de ingresos</strong> (recibos de nómina, declaraciones)</span>
                      </li>
                      {formData.creditType === "crypto" && (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5"></div>
                            <span><strong>Wallet de criptomonedas</strong> (dirección para recepción)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5"></div>
                            <span><strong>Historial de transacciones</strong> (opcional, para verificación)</span>
                          </li>
                        </>
                      )}
                    </ul>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                      *Documentos adicionales pueden ser requeridos según el tipo de crédito
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Entendido, cerrar ventana
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Info Banner */}
                  <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Proceso en Dos Etapas</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                          <strong>Etapa 1 (Esta forma):</strong> Captura básica para asignarte un asesor personal.
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed mt-1">
                          <strong>Etapa 2 (Con asesor):</strong> Te enviaremos un formulario completo para adjuntar documentos y evaluación formal.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Credit Bureau Notice */}
                  <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-green-900 dark:text-green-100 mb-1">
                        Sin Consulta a Buró de Crédito
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        Tu historial crediticio no será un obstáculo. Todos son bienvenidos.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name Input */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Nombre Completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Ej: Juan Pérez García"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                      />
                    </div>

                    {/* Phone and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Phone className="w-4 h-4 inline mr-1" />
                          Teléfono / WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="55 1234 5678"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <Mail className="w-4 h-4 inline mr-1" />
                          Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="ejemplo@correo.com"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Amount and Type Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="estimatedAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Monto Estimado <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="estimatedAmount"
                          name="estimatedAmount"
                          value={formData.estimatedAmount}
                          onChange={handleChange}
                          required
                          placeholder="100,000"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="creditType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tipo de Crédito <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="creditType"
                          name="creditType"
                          value={formData.creditType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                        >
                          <option value="traditional">Crédito Tradicional (6.9% anual)</option>
                          <option value="crypto">Crédito en Criptomonedas (5.4% anual)</option>
                        </select>
                      </div>
                    </div>

                    {/* CAMPOS ESPECÍFICOS PARA CRÉDITOS EN CRIPTO */}
                    {formData.creditType === "crypto" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="selectedCrypto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Criptomoneda Preferida <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="selectedCrypto"
                            name="selectedCrypto"
                            value={formData.selectedCrypto}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                          >
                            {cryptoOptions.map((crypto) => (
                              <option key={crypto.value} value={crypto.value}>
                                {crypto.icon} {crypto.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="plazo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Plazo (meses) <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="plazo"
                            name="plazo"
                            value={formData.plazo}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                          >
                            <option value="">Seleccionar plazo</option>
                            <option value="6">6 meses</option>
                            <option value="12">12 meses</option>
                            <option value="18">18 meses</option>
                            <option value="24">24 meses</option>
                            <option value="36">36 meses</option>
                            <option value="48">48 meses</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Preferred Contact Method - CON LOGO WHATSAPP PNG */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prefiero ser contactado por <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {/* WhatsApp con logo PNG */}
                        <label
                          className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.preferredContact === "whatsapp"
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-300 dark:border-gray-700 hover:border-green-300 hover:bg-green-50/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="preferredContact"
                            value="whatsapp"
                            checked={formData.preferredContact === "whatsapp"}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div className="relative w-8 h-8 mb-2">
                            <Image
                              src="/whatsapp.png"
                              alt="WhatsApp"
                              fill
                              className="object-contain"
                              sizes="32px"
                            />
                          </div>
                          <span className="text-sm font-medium">WhatsApp</span>
                        </label>
                        
                        {/* Email con icono */}
                        <label
                          className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.preferredContact === "email"
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-300 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="preferredContact"
                            value="email"
                            checked={formData.preferredContact === "email"}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <Mail className={`w-8 h-8 mb-2 ${
                            formData.preferredContact === "email" 
                              ? "text-blue-600" 
                              : "text-gray-500"
                          }`} />
                          <span className="text-sm font-medium">Correo Electrónico</span>
                        </label>
                      </div>
                    </div>

                    {/* Optional Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        Mensaje (Opcional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                        placeholder={`Cuéntanos brevemente sobre tu necesidad...${formData.creditType === "crypto" ? " ¿Para qué usarás el crédito en criptomonedas?" : ""}`}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Enviando Solicitud...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Enviar Pre-Evaluación
                        </>
                      )}
                    </button>

                    {/* Privacy Notice */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                      Al enviar este formulario, aceptas que un asesor de Caja Valladolid se ponga en contacto contigo.
                      Tus datos están protegidos según nuestra política de privacidad.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}