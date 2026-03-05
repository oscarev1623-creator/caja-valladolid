"use client"

import { MessageSquare } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[var(--secondary)] text-[var(--secondary-foreground)] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-xl mb-4">Caja Valladolid</h3>
            <p className="text-sm opacity-90 mb-4">
              Caja Popular San Bernardino de Siena Valladolid
            </p>
            <p className="text-sm opacity-90">Registro: 29198</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <a
                  href="#calculadora"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Calculadora
                </a>
              </li>
              <li>
                <a
                  href="#testimonios"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Testimonios
                </a>
              </li>
              <li>
                <a
                  href="#quienes-somos"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Quiénes Somos
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contac */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/529541184165"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm opacity-90 hover:text-[var(--primary)] transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
                WhatsApp
              </a>
              <a
                href="https://webapps.condusef.gob.mx/SIPRES_N/jsp/home_publico.jsp?idins=4930"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm opacity-90 hover:text-[var(--primary)] transition-colors block"
              >
                Portal CONDUSEF
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--secondary-foreground)]/20 pt-8 text-center">
          <p className="text-sm opacity-90">
            &copy; {currentYear} Caja Valladolid. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}