"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ArrowRight, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function Testimonials() {
  const [currentGroup, setCurrentGroup] = useState(0)

  // 9 testimonios con rutas a tus imágenes PNG (con tus nombres)
  const testimonialsGroups = [
    // Grupo 1
    [
      {
        id: 1,
        name: "María González",
        role: "Empresaria",
        content: "El proceso fue rápido y confiable. En menos de una semana tenía mi crédito aprobado para expandir mi negocio.",
        rating: 5,
        avatarUrl: "/testimonials/maria.png"
      },
      {
        id: 2,
        name: "Carlos Ramírez",
        role: "Comerciante",
        content: "Me dieron claridad en cada paso. La tasa es justa y sin sorpresas. Volvería a confiar en ellos.",
        rating: 5,
        avatarUrl: "/testimonials/carlos.png"
      },
      {
        id: 3,
        name: "Ana Patricia",
        role: "Profesionista",
        content: "La calculadora me ayudó a decidir mejor. Excelente atención personalizada en todo momento.",
        rating: 4,
        avatarUrl: "/testimonials/ana.png"
      }
    ],
    // Grupo 2
    [
      {
        id: 4,
        name: "Roberto Sánchez",
        role: "Arquitecto",
        content: "Pensé que por mi historial no me aprobarían, pero me dieron una oportunidad. ¡Gracias por confiar!",
        rating: 5,
        avatarUrl: "/testimonials/roberto.png"
      },
      {
        id: 5,
        name: "Laura Mendoza",
        role: "Doctora",
        content: "El asesor me explicó todo con paciencia. No me presionaron y me dieron tiempo para decidir.",
        rating: 5,
        avatarUrl: "/testimonials/laura.png"
      },
      {
        id: 6,
        name: "Jorge Hernández",
        role: "Ingeniero",
        content: "Proceso 100% digital y seguro. Subí mis documentos por WhatsApp y en 48 horas tenía respuesta.",
        rating: 5,
        avatarUrl: "/testimonials/jorge.png"
      }
    ],
    // Grupo 3
    [
      {
        id: 7,
        name: "Sofía Torres",
        role: "Diseñadora",
        content: "La mejor experiencia financiera que he tenido. Transparentes, rápidos y muy profesionales.",
        rating: 5,
        avatarUrl: "/testimonials/sofia.png"
      },
      {
        id: 8,
        name: "Miguel Ángel",
        role: "Consultor",
        content: "Aprobación en tiempo récord. Me solucionaron un problema urgente de liquidez.",
        rating: 5,
        avatarUrl: "/testimonials/miguel.png"
      },
      {
        id: 9,
        name: "Gabriela Ruiz",
        role: "Contadora",
        content: "Como profesional financiera, valoro su transparencia y ética en cada trámite.",
        rating: 5,
        avatarUrl: "/testimonials/gabriela.png"
      }
    ]
  ]

  // Función para ir al siguiente grupo
  const nextGroup = () => {
    setCurrentGroup((prev) => (prev + 1) % testimonialsGroups.length)
  }

  // Función para ir al grupo anterior
  const prevGroup = () => {
    setCurrentGroup((prev) => (prev - 1 + testimonialsGroups.length) % testimonialsGroups.length)
  }

  // Carrusel automático cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextGroup()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const currentTestimonials = testimonialsGroups[currentGroup]

  return (
    <section id="testimonios" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
            <Quote className="w-4 h-4" />
            Testimonios Reales
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Historias reales de personas que confiaron en nosotros y transformaron su situación financiera
          </p>
        </motion.div>

        {/* Contenedor de testimonios con controles */}
        <div className="relative">
          {/* Botón anterior */}
          <button
            onClick={prevGroup}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 p-3 rounded-full bg-white shadow-xl hover:shadow-2xl border border-gray-200 hover:bg-gray-50 transition-all hidden md:flex items-center justify-center"
            aria-label="Grupo anterior"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Botón siguiente */}
          <button
            onClick={nextGroup}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 p-3 rounded-full bg-white shadow-xl hover:shadow-2xl border border-gray-200 hover:bg-gray-50 transition-all hidden md:flex items-center justify-center"
            aria-label="Siguiente grupo"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Grid de 3 testimonios */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGroup}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {currentTestimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * testimonial.id }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  {/* Encabezado del testimonio CON IMAGEN PNG - CORREGIDO */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 relative">
                        <Image
                          src={testimonial.avatarUrl}
                          alt={`Foto de ${testimonial.name}`}
                          width={64}
                          height={64}
                          className="object-cover"
                          priority={testimonial.id <= 3}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-full">
                                  <span class="text-lg font-bold text-gray-600">
                                    ${testimonial.name.charAt(0)}
                                  </span>
                                </div>
                              `
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-green-200" />
                    <p className="text-gray-700 leading-relaxed pl-4">
                      "{testimonial.content}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* INDICADORES DE GRUPO */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {testimonialsGroups.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentGroup(index)}
                className={`p-1 rounded-full transition-all ${
                  index === currentGroup 
                    ? "bg-green-100 ring-2 ring-green-300" 
                    : "hover:bg-gray-100"
                }`}
                aria-label={`Ir al grupo ${index + 1}`}
              >
                <div
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentGroup ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Controles móviles */}
        <div className="flex justify-center gap-4 mt-8 md:hidden">
          <button
            onClick={prevGroup}
            className="p-3 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
            aria-label="Grupo anterior"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextGroup}
            className="p-3 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
            aria-label="Siguiente grupo"
          >
            <ArrowRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-700 font-medium">Clientes satisfechos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-700 font-medium">Tasa de aprobación</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
              <div className="text-gray-700 font-medium">Respuesta promedio</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}