"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  const navItems = [
    { id: "home", label: "Inicio" },
    { id: "calculadora", label: "Calculadora" },
    { id: "crypto-calculator", label: "Cripto" },
    { id: "pagos", label: "Pagos" },
    { id: "testimonios", label: "Testimonios" },
    { id: "quienes-somos", label: "Quiénes Somos" },
    { id: "faq", label: "FAQ" },
    { id: "contacto", label: "Contacto" },
  ]

  return (
    <>
      {/* Barra fija superior */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={[
          "fixed w-full top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[var(--card)]/95 backdrop-blur-md shadow-lg"
            : "bg-[var(--card)]/90 backdrop-blur-sm shadow-md",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => scrollToSection("home")}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md bg-[var(--primary)]">
                <span className="text-[var(--primary-foreground)] font-bold text-xl">CV</span>
              </div>
              <div>
                <h1 className="font-bold text-lg sm:text-xl text-[var(--primary)] leading-tight">
                  Caja Valladolid
                </h1>
                <p className="text-xs text-[var(--muted-foreground)] hidden sm:block">
                  Tu crédito de confianza
                </p>
              </div>
            </motion.div>

            {/* Navegación desktop */}
            <ul className="hidden lg:flex gap-6 xl:gap-8 items-center">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="text-sm font-medium text-[color:var(--foreground)]/80 hover:text-[var(--primary)] transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all duration-300 group-hover:w-full" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Botones de acción */}
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/5215551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label="Contactar por WhatsApp"
              >
                {/* Icono en verde institucional */}
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://webapps.condusef.gob.mx/SIPRES_N/jsp/home_publico.jsp?idins=4930"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex hover:opacity-90 transition-opacity"
                aria-label="Visitar CONDUSEF"
              >
                <div className="w-20 sm:w-24 h-7 sm:h-8 rounded-md flex items-center justify-center transition-colors shadow-sm bg-[var(--muted)] hover:bg-[var(--muted)]/80">
                  <span className="text-xs font-semibold text-[var(--foreground)]">CONDUSEF</span>
                </div>
              </motion.a>

              {/* Botón menú móvil */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md transition-colors bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Menú móvil deslizante */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ top: "72px" }} // altura aproximada del navbar
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-64 bg-[var(--card)] shadow-2xl overflow-y-auto"
            >
              <nav className="p-6">
                <ul className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] transition-all"
                      >
                        {item.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer para que el contenido no quede bajo el navbar fijo */}
      <div className="h-[72px]" aria-hidden="true" />
    </>
  )
}