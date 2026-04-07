"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, CheckCircle, AlertCircle, MessageCircle } from "lucide-react"

const trackFacebookEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params)
    console.log(`📊 Pixel FB: ${eventName}`, params)
  } else {
    console.warn('⚠️ Facebook Pixel no disponible')
  }
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")
  const [submittedName, setSubmittedName] = useState("")
  const [chatOpened, setChatOpened] = useState(false)

  const openVirtualOffice = async () => {
    if (chatOpened) return
    
    setChatOpened(true)
    
    window.dispatchEvent(new CustomEvent('openChat'))
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      
      console.log('📝 Abriendo chat con:', { 
        email: formData.email, 
        name: fullName, 
        phone: formData.phone 
      })
      
      const findRes = await fetch(`/api/chat/find-by-email?email=${encodeURIComponent(formData.email)}&name=${encodeURIComponent(fullName)}&phone=${encodeURIComponent(formData.phone)}`)
      const findData = await findRes.json()
      
      let conversationId = findData.conversationId
      
      if (!conversationId) {
        const createRes = await fetch('/api/chat/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            email: formData.email,
            phone: formData.phone
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
          
          const systemMessage = `📋 Consulta general: ${formData.message || 'Sin mensaje adicional'}`
          
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
      window.dispatchEvent(new CustomEvent('reloadConversation'))
      
    } catch (error) {
      console.error('Error opening virtual office:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setSubmitMessage("")

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          estimatedAmount: 0,
          creditType: 'TRADITIONAL',
          message: formData.message
        })
      })

      const result = await response.json()

      if (result.success) {
        setSubmittedName(formData.firstName)
        setSubmitStatus("success")
        setSubmitMessage("¡Mensaje enviado con éxito!")

        trackFacebookEvent('Lead', {
          content_name: 'Contacto',
          content_category: 'Formulario de contacto',
          value: 1,
          currency: 'MXN'
        })

        // NO borrar formData aquí para que el chat pueda usar los datos
        // setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" })
        
      } else {
        setSubmitStatus("error")
        setSubmitMessage(result.error || "Error al enviar el mensaje")
      }
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("Error de conexión. Por favor intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contáctanos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ¿Tienes dudas sobre nuestros créditos? Estamos aquí para ayudarte.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    ¡Hola {submittedName}! 👋
                  </h3>
                  
                  <p className="text-gray-600 mb-6 text-lg">
                    Nos da mucho gusto recibir tu mensaje. Ahora puedes chatear directamente con un asesor en nuestra oficina virtual.
                  </p>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
                    <p className="text-green-800 font-medium mb-4">
                      📧 Hemos recibido tu información. Tu conversación quedará guardada y podrás volver cuando quieras.
                    </p>
                    <p className="text-green-700">
                      Haz clic en el botón de abajo para abrir nuestra oficina virtual y hablar con un asesor.
                    </p>
                  </div>
                  
                  <button
                    onClick={openVirtualOffice}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg text-lg"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Abrir Oficina Virtual
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50 text-gray-900 transition-all"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50 text-gray-900 transition-all"
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50 text-gray-900 transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50 text-gray-900 transition-all"
                      placeholder="555 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-gray-50 text-gray-900 transition-all resize-none"
                      placeholder="¿En qué podemos ayudarte?"
                    />
                  </div>

                  {submitStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <p className="text-red-600 text-sm">{submitMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}