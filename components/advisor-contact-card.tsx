"use client"

import { useState } from "react"
import { User, Phone, Mail, MessageSquare, Clock, Shield, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { LeadCaptureForm } from "./lead-capture-form"

interface AdvisorContactCardProps {
  title?: string
  description?: string
  showFormOnClick?: boolean
}

export function AdvisorContactCard({ 
  title = "¿Listo para tu crédito?",
  description = "Habla directamente con un asesor financiero",
  showFormOnClick = true
}: AdvisorContactCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const advisors = [
    {
      name: "Juan Pérez",
      role: "Asesor Senior",
      experience: "8 años en financiamiento",
      phone: "+52 1 55 1234 5678",
      email: "juan@cajavalladolid.com",
      specialties: ["Créditos Personales", "Hipotecarios"]
    },
    {
      name: "María González",
      role: "Especialista en Cripto",
      experience: "5 años en fintech",
      phone: "+52 1 55 8765 4321",
      email: "maria@cajavalladolid.com",
      specialties: ["Créditos en Cripto", "Finanzas Digitales"]
    },
    {
      name: "Carlos Rodríguez",
      role: "Director de Créditos",
      experience: "12 años en banca",
      phone: "+52 1 55 5555 1234",
      email: "carlos@cajavalladolid.com",
      specialties: ["Grandes Montos", "Empresariales"]
    }
  ]
  
  const randomAdvisor = advisors[Math.floor(Math.random() * advisors.length)]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Información del asesor */}
          <div className="md:w-2/3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {description}
            </p>
            
            <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {randomAdvisor.name.charAt(0)}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{randomAdvisor.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{randomAdvisor.role} • {randomAdvisor.experience}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {randomAdvisor.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <a 
                      href={`https://wa.me/${randomAdvisor.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      {randomAdvisor.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4 text-green-600" />
                    <a 
                      href={`mailto:${randomAdvisor.email}`}
                      className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      {randomAdvisor.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Asesoría Personalizada</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Evaluamos tu caso específico para ofrecerte la mejor opción</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Respuesta Rápida</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Contacto en menos de 2 horas hábiles</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lado derecho - CTA */}
          <div className="md:w-1/3 flex flex-col justify-center">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Proceso Garantizado</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Contacto inicial</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Envío de formulario completo</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Evaluación con documentos</span>
                </div>
              </div>
              
              <button
                onClick={() => showFormOnClick ? setIsFormOpen(true) : window.open(`https://wa.me/${randomAdvisor.phone.replace(/\D/g, '')}`, '_blank')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                {showFormOnClick ? 'Iniciar Solicitud' : 'Contactar Directamente'}
              </button>
              
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
                Sin costo • Sin compromiso • 100% confidencial
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <LeadCaptureForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </>
  )
}