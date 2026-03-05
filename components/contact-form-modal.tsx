"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Loader2, ShieldCheck, User, Phone, Mail, DollarSign, MessageSquare } from "lucide-react"
import Image from "next/image"

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    monto: "",
    tipoCredito: "tradicional",
    contactoPreferido: "whatsapp",
    mensaje: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        monto: formData.monto,
        tipo_credito: formData.tipoCredito,
        mensaje: formData.mensaje.trim(),
        contactoPreferido: formData.contactoPreferido,
        source: "CONTACT_FORM_MODAL",
        timestamp: new Date().toISOString()
      };

      // Validación básica
      if (!dataToSend.nombre || !dataToSend.telefono) {
        throw new Error('Nombre y teléfono son requeridos');
      }
      
      // USAR LA RUTA SIMPLE TEMPORAL
const API_URL = '/api/formulario-externo-simple';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      // Obtener la respuesta como texto primero
      const responseText = await response.text();

      // Intentar parsear como JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('La respuesta del servidor no es JSON válido');
      }

      if (!response.ok || !result.success) {
        // Error de la API
        throw new Error(result.error || 'Error al enviar la solicitud');
      }

      // ÉXITO: mostrar confirmación
      setSubmitted(true);
      
      // Opcional: Guardar ID en localStorage
      localStorage.setItem('last_lead_id', result.leadId);

      // Cerrar después de 5 segundos
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        // Resetear formulario
        setFormData({
          nombre: "",
          telefono: "",
          email: "",
          monto: "",
          tipoCredito: "tradicional",
          contactoPreferido: "whatsapp",
          mensaje: "",
        });
      }, 5000);

    } catch (err: any) {
      // Manejo de errores
      setError(err.message || 'Error al enviar. Por favor intenta nuevamente.');
      
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="relative w-full max-w-lg bg-card rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
              <div>
                <h3 className="text-2xl font-bold text-card-foreground">Pre-Evaluación de Crédito</h3>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Sin consulta a Buró de Crédito</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* MOSTRAR ERROR SI EXISTE */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-red-600 mt-0.5">⚠️</div>
                    <div>
                      <h4 className="font-bold text-red-800 mb-1">Error al enviar</h4>
                      <p className="text-sm text-red-700">{error}</p>
                      <p className="text-xs text-red-600 mt-2">
                        Por favor, verifica tus datos e intenta nuevamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Proceso en dos etapas */}
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  Proceso en Dos Etapas
                </h4>
                <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
                    </div>
                    <p>
                      <strong>Etapa 1 (Esta forma):</strong> Captura básica para asignarte un asesor personal.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 dark:text-blue-300 font-bold">2</span>
                    </div>
                    <p>
                      <strong>Etapa 2 (Con asesor):</strong> Te enviaremos un formulario completo para adjuntar documentos y evaluación formal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sin consulta a buró */}
              <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-1">Sin Consulta a Buró de Crédito</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Tu historial crediticio no será un obstáculo. Todos son bienvenidos.
                  </p>
                </div>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-foreground mb-3">¡Solicitud Enviada Exitosamente! 🎉</h4>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      Tu información ha sido registrada correctamente.
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                      Un asesor de Caja Valladolid se pondrá en contacto contigo en breve.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h5 className="font-bold text-blue-900 dark:text-blue-100 mb-2">📧 Próximos pasos:</h5>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 text-left space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Recibirás un correo con el formulario completo para la Etapa 2</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Podrás adjuntar documentos (INE, estados de cuenta)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>Tu asesor personal te contactará según tu preferencia</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
                    Este formulario se cerrará automáticamente en unos segundos...
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nombre Completo */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
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
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                    />
                  </div>

                  {/* Teléfono / WhatsApp */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
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
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                    />
                  </div>

                  {/* Correo Electrónico */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
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
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Monto Estimado */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Monto Estimado *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                        <input
                          type="text"
                          name="monto"
                          value={formData.monto}
                          onChange={handleChange}
                          required
                          placeholder="100,000"
                          className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                        />
                      </div>
                    </div>

                    {/* Tipo de Crédito */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de Crédito *
                      </label>
                      <select
                        name="tipoCredito"
                        value={formData.tipoCredito}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground"
                      >
                        <option value="tradicional">Crédito Tradicional</option>
                        <option value="hipotecario">Crédito Hipotecario</option>
                        <option value="automotriz">Crédito Automotriz</option>
                        <option value="negocios">Crédito para Negocios</option>
                        <option value="personal">Crédito Personal</option>
                        <option value="consolidacion">Consolidación de Deudas</option>
                      </select>
                    </div>
                  </div>

                  {/* Prefiero ser contactado por - CON LOGO WHATSAPP PNG */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Prefiero ser contactado por *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, contactoPreferido: "whatsapp" }))}
                        className={`py-4 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                          formData.contactoPreferido === "whatsapp" 
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" 
                            : "border-border hover:border-green-300 hover:bg-green-50/50"
                        }`}
                      >
                        {/* Logo de WhatsApp PNG */}
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
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300" 
                            : "border-border hover:border-orange-300 hover:bg-orange-50/50"
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
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Mensaje (Opcional)
                    </label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Cuéntanos brevemente sobre tu necesidad..."
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-background text-foreground resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Pre-Evaluación
                      </>
                    )}
                  </button>

                  {/* Footer text */}
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Al enviar este formulario, aceptas que un asesor de Caja Valladolid se ponga en contacto contigo. 
                    Tus datos están protegidos según nuestra política de privacidad.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}