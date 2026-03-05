"use client"

import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Mail, 
  Clock, 
  Shield,
  ArrowRight,
  Calculator,
  FileText,
  CheckCircle
} from "lucide-react"

export function StrategicCTASection() {
  
  const contactOptions = [
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "Respuesta en minutos",
      action: "https://wa.me/5215512345678",
      color: "bg-green-500",
      highlight: true
    },
    {
      icon: Mail,
      title: "Email",
      description: "contacto@cajavalladolid.com",
      action: "mailto:contacto@cajavalladolid.com",
      color: "bg-red-500",
      highlight: false
    }
  ]
  
  const benefits = [
    "Sin consulta a buró de crédito",
    "Tasa fija 6.9% anual",
    "Aprobación en 24-48 horas",
    "Asesor personal asignado",
    "Documentación guiada",
    "Pagos flexibles"
  ]

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contáctanos Directamente
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Elige la forma que más te convenga para hablar con nuestro equipo
          </p>
        </motion.div>

        {/* Tarjetas de contacto - AHORA SOLO 2 COLUMNAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
          {contactOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border ${
                  option.highlight 
                    ? 'border-green-300 dark:border-green-700 shadow-xl' 
                    : 'border-gray-200 dark:border-gray-700'
                } hover:shadow-xl transition-all`}
              >
                <div className={`${option.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {option.title}
                  {option.highlight && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                      RECOMENDADO
                    </span>
                  )}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {option.description}
                </p>
                
                <a
                  href={option.action}
                  target={option.action.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 font-semibold transition-colors ${
                    option.highlight 
                      ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                >
                  Contactar ahora
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* Beneficios destacados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 text-white mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-10 h-10" />
            <h3 className="text-2xl font-bold">¿Por qué elegir Caja Valladolid?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-white/95">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Horario de Atención</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Lunes a Viernes<br/>
                9:00 AM - 6:00 PM
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Documentación</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Te guiamos paso a paso<br/>
                en los documentos requeridos
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Simulación Previa</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Usa nuestras calculadoras<br/>
                antes de contactarnos
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}