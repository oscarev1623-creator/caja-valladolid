"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X, ChevronDown, ShieldCheck, TrendingUp, Award, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { ContactFormModal } from "./contact-form-modal"
import Image from "next/image"

export default function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const scrollToCalculator = () => {
    const element = document.getElementById("calculadora")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const features = [
    { icon: ShieldCheck, text: "Sin Buró de Crédito", color: "text-green-600" },
    { icon: Clock, text: "Aprobación Rápida", color: "text-green-500" },
    { icon: TrendingUp, text: "Tasa Fija 11%", color: "text-green-600" },
    { icon: Award, text: "100% Transparente", color: "text-gray-800" },
  ]

  return (
    <>
      {/* Navegación */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 relative flex items-center justify-center">
                <Image
                  src="/logotipo.png"
                  alt="Caja Valladolid Logo"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-800">Caja Valladolid</span>
                <span className="text-xs text-gray-600 font-medium">Seguridad y Confianza</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection("inicio")} className="text-gray-700 hover:text-green-600 font-medium transition-colors">Inicio</button>
              <button onClick={() => scrollToSection("calculadora")} className="text-gray-700 hover:text-green-600 font-medium transition-colors">Calculadora</button>
              <button onClick={() => scrollToSection("testimonios")} className="text-gray-700 hover:text-green-600 font-medium transition-colors">Testimonios</button>
              <button onClick={() => scrollToSection("quienes-somos")} className="text-gray-700 hover:text-green-600 font-medium transition-colors">Nosotros</button>
              <button onClick={() => scrollToSection("faq")} className="text-gray-700 hover:text-green-600 font-medium transition-colors">Preguntas</button>
              <button onClick={() => scrollToSection("contacto")} className="text-gray-700 hover:text-green-600 font-medium transition-colors">Contacto</button>
            </div>

            <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 space-y-3"
            >
              {["Inicio", "Calculadora", "Testimonios", "Nosotros", "Preguntas", "Contacto"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    let id = item.toLowerCase();
                    if (item === "Nosotros") id = "quienes-somos";
                    if (item === "Preguntas") id = "faq";
                    scrollToSection(id);
                  }}
                  className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Sección Hero - CON VIDEO DE YOUTUBE */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      >
        {/* Video de fondo desde YouTube */}
        <div className="absolute inset-0 z-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            src="https://www.youtube.com/embed/x472zBmlxqo?autoplay=1&mute=1&loop=1&playlist=x472zBmlxqo&controls=0&showinfo=0&modestbranding=1&rel=0"
            title="Caja Valladolid - Créditos"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsVideoLoaded(true)}
          />
          
          {/* Overlay para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
          
          {/* Loader mientras carga el video */}
          {!isVideoLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-green-800 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-400 border-t-transparent"></div>
            </div>
          )}
        </div>
        
        {/* Contenido */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge superior */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8 inline-block"
            >
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-bold text-base sm:text-lg">¡No Revisamos Buró de Crédito!</span>
              </div>
            </motion.div>

            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight text-white drop-shadow-xl">
              Tu crédito hecho{" "}
              <span className="text-green-300 drop-shadow-lg">
                fácil y transparente
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-10 max-w-3xl mx-auto font-medium drop-shadow-lg">
              Financiamiento confiable para tu casa, auto y más
            </p>

            {/* CTA - Dos botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={scrollToCalculator}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg sm:text-xl px-8 sm:px-10 py-3 sm:py-4 rounded-xl shadow-2xl transition-all transform hover:shadow-3xl"
              >
                Usar Calculadora
              </motion.button>
              
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-lg sm:text-xl px-8 sm:px-10 py-3 sm:py-4 rounded-xl shadow-2xl transition-all transform hover:shadow-3xl border border-white/30"
              >
                Solicitar Crédito
              </motion.button>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 sm:mt-28"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="bg-white/90 backdrop-blur-md hover:bg-white rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all border border-white/30"
                >
                  <feature.icon className={`w-10 h-10 sm:w-12 sm:h-12 ${feature.color} mx-auto mb-4`} />
                  <p className="text-sm sm:text-base font-bold text-gray-800">{feature.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Registro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12"
            >
              <p className="text-lg text-white drop-shadow-md">
                Registro Oficial: <span className="font-bold text-green-300 text-xl">29198</span>
              </p>
            </motion.div>
          </motion.div>

          {/* Flecha indicadora de scroll */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <button
              onClick={scrollToCalculator}
              className="flex flex-col items-center text-white hover:text-green-300 transition-colors"
            >
              <span className="mb-3 text-lg font-medium drop-shadow-md">Descubre más</span>
              <ChevronDown className="w-8 h-8 animate-bounce" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Modal de contacto */}
      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}