"use client"

import { motion } from "framer-motion"
import { FileText, UserCheck, CheckCircle, Shield, ArrowRight, Send, Mail, MessageCircle } from "lucide-react"

export function ProcessExplanation() {
  const openVirtualOffice = () => {
    window.dispatchEvent(new CustomEvent('openChat'))
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Proceso Profesional en 3 Etapas</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo el proceso a través de nuestra Oficina Virtual, con acompañamiento humano en cada paso
          </p>
        </motion.div>

        {/* Tarjetas de proceso */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Etapa 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-xl p-8 border-2 border-green-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-green-600">ETAPA 1</span>
                <h3 className="text-2xl font-bold text-card-foreground">Solicitud Inicial</h3>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-card-foreground">Formulario Simple</p>
                  <p className="text-sm text-muted-foreground">Datos básicos en 2 minutos</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-card-foreground">Sin Documentos</p>
                  <p className="text-sm text-muted-foreground">Solo contacto y monto estimado</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-card-foreground">Oficina Virtual Activada</p>
                  <p className="text-sm text-muted-foreground">Recibes acceso a tu chat personal con asesor</p>
                </div>
              </div>
            </div>

            <button
              onClick={openVirtualOffice}
              className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Abrir Oficina Virtual
            </button>
          </motion.div>

          {/* Etapa 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-xl p-8 border-2 border-blue-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-blue-600">ETAPA 2</span>
                <h3 className="text-2xl font-bold text-card-foreground">Chat con Asesor</h3>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-card-foreground">Contacto Inmediato</p>
                  <p className="text-sm text-muted-foreground">Tu asesor te responde en la Oficina Virtual</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-card-foreground">Sube Documentos</p>
                  <p className="text-sm text-muted-foreground">Envía tus documentos directamente por chat</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-card-foreground">Soporte Continuo</p>
                  <p className="text-sm text-muted-foreground">Chatea con tu asesor cuando lo necesites</p>
                </div>
              </div>
            </div>

            <button
              onClick={openVirtualOffice}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Abrir Oficina Virtual
            </button>
          </motion.div>

          {/* Etapa 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-xl p-8 border-2 border-purple-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-purple-600">ETAPA 3</span>
                <h3 className="text-2xl font-bold text-card-foreground">Evaluación y Respuesta</h3>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-card-foreground">Análisis Personalizado</p>
                  <p className="text-sm text-muted-foreground">Tu asesor evalúa tu documentación</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-card-foreground">Respuesta en 24-48 Horas</p>
                  <p className="text-sm text-muted-foreground">Recibes respuesta por la Oficina Virtual</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-card-foreground">Desembolso Rápido</p>
                  <p className="text-sm text-muted-foreground">Recibes tu dinero en 48-72 horas</p>
                </div>
              </div>
            </div>

            <button
              onClick={openVirtualOffice}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Abrir Oficina Virtual
            </button>
          </motion.div>
        </div>

        {/* Ventajas del sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-12 h-12" />
            <h3 className="text-3xl font-bold">¿Por Qué Nuestra Oficina Virtual?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Seguridad de Datos
              </h4>
              <p className="text-white/90 text-sm">
                Tus documentos se envían directamente a tu asesor en un chat seguro y privado
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Acompañamiento Humano
              </h4>
              <p className="text-white/90 text-sm">
                Un asesor experto te guía personalmente en todo el proceso
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Conversaciones Guardadas
              </h4>
              <p className="text-white/90 text-sm">
                Puedes cerrar y volver cuando quieras, tu historial se guarda automáticamente
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Mayor Aprobación
              </h4>
              <p className="text-white/90 text-sm">
                La evaluación humana permite considerar factores que un sistema automatizado no vería
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={openVirtualOffice}
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all mx-auto"
            >
              <MessageCircle className="w-5 h-5" />
              Comenzar Ahora en la Oficina Virtual
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}