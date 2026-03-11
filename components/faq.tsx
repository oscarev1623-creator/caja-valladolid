"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronDown, Shield, Lock, Clock, RefreshCw, BadgeCheck, 
  TrendingUp, FileCheck, Percent, CreditCard, Home, Zap,
  Bitcoin
} from "lucide-react"

interface FAQItemProps {
  question: string
  answer: React.ReactNode
  icon?: React.ReactNode
}

function FAQItem({ question, answer, icon }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-[var(--border)] last:border-b-0 transition-all duration-200 hover:border-[var(--primary)]/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-6 text-left hover:text-[var(--primary)] transition-all duration-200 group"
      >
        <div className="flex items-center gap-4">
          <div className="text-[var(--primary)] opacity-80 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
          <span className="font-semibold text-lg text-[var(--foreground)] group-hover:text-[var(--primary)]">
            {question}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[var(--muted-foreground)] transition-all duration-300 ${
            isOpen ? "rotate-180 text-[var(--primary)]" : "group-hover:text-[var(--primary)]"
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "0.5rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 pl-14 text-[var(--muted-foreground)] leading-relaxed bg-gradient-to-r from-transparent to-[var(--muted)]/10 p-4 rounded-lg">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const faqs = [
    {
      question: "¿Cuál es la tasa de interés que manejan?",
      answer: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20">
            <p className="font-medium text-[var(--foreground)] mb-2">Tasa Competitiva y Transparente</p>
            <p className="mb-3">
              Ofrecemos una <strong>tasa fija anual del 11%</strong> para créditos tradicionales y <strong>5.4%</strong> para créditos en criptomonedas, una de las más competitivas del mercado. 
              Estas tasas incluyen:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
              <li><strong>Sin variaciones sorpresa:</strong> Tu tasa se mantiene igual durante todo el plazo</li>
              <li><strong>CAT (Costo Anual Total):</strong> Incluye todos los costos y comisiones autorizadas</li>
              <li><strong>Comparativa favorable:</strong> Hasta 40% más baja que otras financieras no reguladas</li>
            </ul>
            <p className="mt-3 text-sm italic">
              *La tasa final puede variar según perfil crediticio, monto y plazo, siempre dentro de los márgenes autorizados por la CNBV.
            </p>
          </div>
        </div>
      ),
      icon: <Percent className="w-5 h-5" />
    },
    {
      question: "¿Por qué debo pagar un anticipo y en qué se utiliza?",
      answer: (
        <div className="space-y-4">
          <p className="mb-4">
            El anticipo es un <strong>pago inicial requerido</strong> que cumple varios propósitos fundamentales para garantizar la seguridad y formalidad de tu operación:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🔒 Para Tu Seguridad</h4>
              <ul className="text-sm space-y-1">
                <li>• Reserva el monto aprobado exclusivamente para ti</li>
                <li>• Inicia los trámites legales y contratos</li>
                <li>• Garantiza que el crédito no será asignado a otra persona</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">💰 Destino del Anticipo</h4>
              <ul className="text-sm space-y-1">
                <li>• 70% se descuenta directamente del total del crédito</li>
                <li>• 30% cubre gastos administrativos y de gestión</li>
                <li>• Todo está detallado en tu contrato y estado de cuenta</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              💡 <strong>Importante:</strong> El anticipo NO es una comisión adicional. Es parte del monto total del crédito que pagas por adelantado, lo que reduce tus pagos mensuales posteriores.
            </p>
          </div>
        </div>
      ),
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      question: "¿Cuál es la diferencia entre crédito tradicional y crédito cripto?",
      answer: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-700 mb-3">Crédito Tradicional</h4>
              <ul className="text-sm space-y-2">
                <li>• Tasa: 11% anual</li>
                <li>• Anticipo: 20%</li>
                <li>• Recibes: Tarjeta física Mastercard/Visa</li>
                <li>• Uso: Cajeros, comercios, transferencias</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold text-purple-700 mb-3">Crédito Cripto</h4>
              <ul className="text-sm space-y-2">
                <li>• Tasa: 5.4% anual</li>
                <li>• Anticipo: 10%</li>
                <li>• Recibes: Wallet digital / Exchange</li>
                <li>• Uso: Transferencias, conversión, trading</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      icon: <Bitcoin className="w-5 h-5" />
    },
    {
      question: "¿El anticipo para créditos cripto es diferente?",
      answer: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20">
            <p className="font-medium text-[var(--foreground)] mb-3">
              Para créditos en criptomonedas, el anticipo es del <strong>10% del monto total</strong> (en lugar del 20% de los créditos tradicionales). 
              Esta diferencia se debe a las ventajas del ecosistema digital:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <span className="text-lg">💰</span>
                  ¿Cuánto es?
                </h4>
                <p className="text-sm">
                  <strong>10% del monto solicitado</strong>. Por ejemplo, para un crédito de $50,000 MXN, 
                  el anticipo sería de $5,000 MXN (o su equivalente en criptomoneda).
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  Destino
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• 70% se descuenta del capital</li>
                  <li>• 30% cubre gastos administrativos</li>
                  <li>• No es un costo adicional</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-300 flex items-start gap-2">
                <span className="text-lg">💎</span>
                <span><strong>Ventaja exclusiva cripto:</strong> Si pagas el anticipo en la misma criptomoneda del crédito, 
                obtienes un <strong>5% de descuento adicional</strong> en tus primeras 3 mensualidades.</span>
              </p>
            </div>
          </div>
        </div>
      ),
      icon: <Bitcoin className="w-5 h-5" />
    },
    {
      question: "¿Puedo adelantar pagos sin penalización?",
      answer: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 p-4 rounded-lg border border-purple-500/20">
            <p className="font-medium text-[var(--foreground)] mb-3">
              Sí, <strong>fomentamos y permitimos pagos anticipados</strong> sin ningún tipo de penalización. Creemos en la libertad financiera de nuestros clientes.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 dark:text-purple-300 text-sm font-bold">✓</span>
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">Beneficios de Adelantar Pagos:</p>
                  <ul className="text-sm mt-1 space-y-1">
                    <li>• Reduces el capital pendiente inmediatamente</li>
                    <li>• Disminuyes el interés total a pagar</li>
                    <li>• Acortas el plazo del crédito automáticamente</li>
                    <li>• Mejoras tu historial crediticio</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 dark:text-purple-300 text-sm font-bold">$</span>
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">¿Cómo Funciona?</p>
                  <p className="text-sm mt-1">
                    Simplemente realiza un pago adicional a tu mensualidad regular. El excedente se aplica automáticamente al capital, recalculando tu saldo pendiente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: <RefreshCw className="w-5 h-5" />
    },
    {
      question: "¿Qué requisitos necesito para solicitar un crédito?",
      answer: (
        <div className="space-y-4">
          <p className="mb-4">
            Nuestros requisitos están diseñados para ser <strong>accesibles y transparentes</strong>. Los dividimos en requisitos básicos y específicos según el tipo de crédito:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-green-600" />
                Requisitos Básicos para Todos
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-300 text-xs">1</span>
                  </div>
                  <span><strong>Identificación oficial</strong> vigente (INE, pasaporte, cédula profesional)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-300 text-xs">2</span>
                  </div>
                  <span><strong>Comprobante de domicilio</strong> reciente (no mayor a 3 meses)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-300 text-xs">3</span>
                  </div>
                  <span><strong>Comprobante de ingresos</strong> (últimos 3 meses)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-300 text-xs">4</span>
                  </div>
                  <span><strong>Edad:</strong> Entre 21 y 70 años al momento de solicitud</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-blue-600" />
                Para Créditos Específicos
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>Hipotecarios:</strong> Avalúo de propiedad, estado de cuenta de otros créditos
                </li>
                <li>
                  <strong>Automotrices:</strong> Factura del vehículo, póliza de seguro
                </li>
                <li>
                  <strong>Empresariales:</strong> Estados financieros, acta constitutiva
                </li>
                <li>
                  <strong>Cripto:</strong> Wallet activa, historial de transacciones (opcional)
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
            <p className="text-sm">
              🚀 <strong>Proceso ágil:</strong> Nuestros asesores te guían paso a paso en la recolección de documentos. 
              El 80% de las solicitudes se completan en menos de 24 horas.
            </p>
          </div>
        </div>
      ),
      icon: <FileCheck className="w-5 h-5" />
    },
    {
      question: "¿Cómo protegen mis datos personales y documentos?",
      answer: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 rounded-lg border border-emerald-500/20">
            <p className="font-medium text-[var(--foreground)] mb-3">
              La seguridad de tu información es nuestra máxima prioridad. Implementamos múltiples capas de protección:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Protección Técnica
                </h5>
                <ul className="text-sm space-y-1">
                  <li>• Encriptación bancaria AES-256 bits</li>
                  <li>• Servidores en México con certificación ISO 27001</li>
                  <li>• Firewalls de última generación</li>
                  <li>• Autenticación de dos factores para asesores</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Protección Legal
                </h5>
                <ul className="text-sm space-y-1">
                  <li>• Cumplimos con la Ley Federal de Protección de Datos</li>
                  <li>• Contratos de confidencialidad con todo el personal</li>
                  <li>• Política de retención limitada de documentos</li>
                  <li>• Aviso de privacidad actualizado y accesible</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                🔒 <strong>Importante:</strong> Tus documentos sensibles (INE, estados de cuenta) se comparten directamente con tu asesor asignado vía WhatsApp o email cifrado, NO se suben a sistemas automatizados ni bases de datos públicas.
              </p>
            </div>
          </div>
        </div>
      ),
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "¿Cuánto tiempo tarda todo el proceso?",
      answer: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4 rounded-lg border border-orange-500/20">
            <p className="font-medium text-[var(--foreground)] mb-4">
              Nuestro proceso está optimizado para ser <strong>rápido y eficiente</strong>:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 dark:text-orange-300 font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Evaluación Inicial: 2-4 horas</p>
                  <p className="text-sm">Pre-aprobación basada en información básica</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 dark:text-orange-300 font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Documentación: 24-48 horas</p>
                  <p className="text-sm">Revisión completa una vez recibidos todos los documentos</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 dark:text-orange-300 font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Desembolso: 48-72 horas</p>
                  <p className="text-sm">Transferencia a tu cuenta/wallet una vez aprobado</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <p className="text-sm">
                ⚡ <strong>Récord:</strong> Nuestro caso más rápido fue aprobado en 3 horas y desembolsado en 24 horas. El 95% de las solicitudes completas se resuelven en menos de 72 horas.
              </p>
            </div>
          </div>
        </div>
      ),
      icon: <Clock className="w-5 h-5" />
    },
    {
      question: "¿Qué sucede si tengo problemas para pagar?",
      answer: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-lg border border-blue-500/20">
            <p className="font-medium text-[var(--foreground)] mb-3">
              Entendemos que pueden surgir imprevistos. Por eso tenemos <strong>programas de apoyo</strong> diseñados para ayudarte:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <h5 className="font-semibold text-blue-700 dark:text-blue-300">Opciones Disponibles</h5>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-300 text-xs">✓</span>
                    </div>
                    <span><strong>Reestructuración:</strong> Extender plazo, reducir mensualidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-300 text-xs">✓</span>
                    </div>
                    <span><strong>Periodo de gracia:</strong> Hasta 30 días sin penalización</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-300 text-xs">✓</span>
                    </div>
                    <span><strong>Pagos parciales:</strong> Acuerdos temporales ajustados</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-semibold text-blue-700 dark:text-blue-300">Proceso de Ayuda</h5>
                <ol className="text-sm space-y-2 list-decimal list-inside ml-2">
                  <li>Contacta a tu asesor <strong>antes</strong> de faltar a un pago</li>
                  <li>Presenta tu situación (no se requieren documentos complejos)</li>
                  <li>Juntos diseñamos un plan viable</li>
                  <li>Firmamos el acuerdo de modificación</li>
                </ol>
              </div>
            </div>
            
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                🤝 <strong>Nuestra filosofía:</strong> Preferimos ayudarte a resolver la situación que ejecutar garantías. El 85% de los clientes con problemas temporales logran regularizarse con nuestros programas de apoyo.
              </p>
            </div>
          </div>
        </div>
      ),
      icon: <Zap className="w-5 h-5" />
    },
    {
      question: "¿Cómo recibiré mi crédito una vez aprobado?",
      answer: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 p-4 rounded-lg border border-indigo-500/20">
            <p className="font-medium text-[var(--foreground)] mb-3">
              En Caja Valladolid te ofrecemos la forma <strong>más segura y cómoda</strong> de recibir tu dinero: 
              una tarjeta de débito con respaldo bancario institucional.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Tarjeta de Débito
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 dark:text-indigo-300 text-xs">✓</span>
                    </div>
                    <span><strong>Mastercard / Visa</strong> con tecnología contactless</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 dark:text-indigo-300 text-xs">✓</span>
                    </div>
                    <span><strong>Sin costo de apertura</strong> para el cliente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 dark:text-indigo-300 text-xs">✓</span>
                    </div>
                    <span><strong>Aceptada en millones de establecimientos</strong> en México y el extranjero</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Envío a Domicilio
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 dark:text-indigo-300 text-xs">✓</span>
                    </div>
                    <span><strong>Envío certificado</strong> a tu domicilio (3-5 días hábiles)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 dark:text-indigo-300 text-xs">✓</span>
                    </div>
                    <span><strong>Recolección en sucursal</strong> si lo prefieres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 dark:text-indigo-300 text-xs">✓</span>
                    </div>
                    <span><strong>Activación inmediata</strong> vía app o llamada telefónica</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 my-4">
              <h5 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Alianzas Bancarias
              </h5>
              <p className="text-sm mb-2">
                Trabajamos con las principales instituciones bancarias de México para garantizar 
                que tu dinero esté seguro y accesible en todo momento:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-white dark:bg-amber-900/40 rounded-full text-xs font-medium text-gray-700 dark:text-amber-200 border border-amber-200">
                  BBVA
                </span>
                <span className="px-3 py-1 bg-white dark:bg-amber-900/40 rounded-full text-xs font-medium text-gray-700 dark:text-amber-200 border border-amber-200">
                  Citibanamex
                </span>
                <span className="px-3 py-1 bg-white dark:bg-amber-900/40 rounded-full text-xs font-medium text-gray-700 dark:text-amber-200 border border-amber-200">
                  Santander
                </span>
                <span className="px-3 py-1 bg-white dark:bg-amber-900/40 rounded-full text-xs font-medium text-gray-700 dark:text-amber-200 border border-amber-200">
                  HSBC
                </span>
                <span className="px-3 py-1 bg-white dark:bg-amber-900/40 rounded-full text-xs font-medium text-gray-700 dark:text-amber-200 border border-amber-200">
                  Banorte
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h6 className="font-semibold text-green-700 dark:text-green-300 text-sm mb-1">💳 Retiros en Cajeros</h6>
                <p className="text-xs">Sin comisión en la red de cajeros de nuestros bancos aliados. Más de 15,000 cajeros disponibles en todo México.</p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h6 className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-1">📱 Pagos Digitales</h6>
                <p className="text-xs">Aceptada en Apple Pay, Google Pay y todas las tiendas en línea. Paga desde tu celular sin necesidad de la tarjeta física.</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 flex items-start gap-2">
                <span className="text-xl">📦</span>
                <span><strong>Proceso de entrega:</strong> Una vez aprobado tu crédito y recibido el anticipo, emitimos tu tarjeta personalizada. Recibirás un número de guía para rastrear tu envío. En caso de no estar en domicilio, podrás recogerla en la sucursal de paquetería más cercana presentando tu identificación oficial.</span>
              </p>
            </div>
          </div>
        </div>
      ),
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      question: "¿Cómo recibiré mi crédito si elijo la opción en criptomonedas?",
      answer: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-4 rounded-lg border border-purple-500/20">
            <p className="font-medium text-[var(--foreground)] mb-3">
              En Caja Valladolid ofrecemos <strong>tres opciones flexibles</strong> para recibir tu crédito en criptomonedas, 
              diseñadas para adaptarse a tu nivel de experiencia en el mundo crypto:
            </p>
            
            <div className="space-y-4 mb-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-300 text-lg">₿</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Opción 1: Wallet Digital Caja Valladolid</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Te asignamos una wallet segura dentro de nuestra plataforma. Podrás:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1 list-disc list-inside">
                      <li>Gestionar tus fondos desde un dashboard intuitivo</li>
                      <li>Convertir a MXN cuando lo necesites (tipo de cambio preferencial)</li>
                      <li>Transferir a exchanges o wallets externas sin comisión</li>
                      <li>Ideal para quienes se inician en el mundo cripto</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-300 text-lg">📱</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Opción 2: Exchange Asociado (Binance)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Gracias a nuestro convenio con Binance, podemos depositar directamente en tu cuenta. 
                      Solo necesitas proporcionarnos tu ID de usuario o dirección de depósito.
                    </p>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mt-2">
                      Beneficio exclusivo: 0% comisión por depósito
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-300 text-lg">🔐</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Opción 3: Wallet Externa</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Si ya tienes experiencia en cripto, puedes proporcionarnos la dirección de tu wallet 
                      (MetaMask, Trust Wallet, Ledger, etc.) y transferiremos los fondos directamente.
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1 list-disc list-inside">
                      <li>Compatible con ERC-20, BEP-20 y TRC-20</li>
                      <li>Transferencia en menos de 24 horas</li>
                      <li>Soporte para múltiples blockchains</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mt-4">
              <h5 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
                <span className="text-lg">💡</span>
                ¿Por qué no recibes una tarjeta física?
              </h5>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Los créditos en criptomonedas operan de forma diferente a los tradicionales. Al no estar vinculados 
                al sistema bancario convencional, no emitimos tarjetas físicas. En su lugar, te damos acceso directo 
                a tus fondos a través de medios digitales, lo que te permite:
              </p>
              <ul className="text-sm text-amber-800 dark:text-amber-200 mt-2 space-y-1 list-disc list-inside">
                <li>Mayor flexibilidad para transferir a exchanges y wallets</li>
                <li>Control total sobre tus criptoactivos</li>
                <li>Posibilidad de convertir a moneda local cuando lo necesites</li>
                <li>Sin depender de plásticos físicos que pueden perderse o dañarse</li>
              </ul>
            </div>

            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300 flex items-start gap-2">
                <span className="text-lg">₿</span>
                <span><strong>Importante:</strong> Durante el proceso de contratación, un asesor especializado te guiará 
                para elegir la opción que mejor se adapte a tus necesidades y nivel de experiencia.</span>
              </p>
            </div>
          </div>
        </div>
      ),
      icon: <Bitcoin className="w-5 h-5" />
    }
  ]

  return (
    <section
      id="faq"
      className="py-20 px-6 bg-[var(--muted)]/30 text-[var(--foreground)]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Respuestas detalladas a todas tus dudas. Transparencia y claridad son nuestra prioridad.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-[var(--card)] rounded-2xl shadow-xl p-8 border border-[var(--border)]"
        >
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
              icon={faq.icon}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}