"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! 👋 Soy FinBot de Caja Valladolid. Estoy aquí para ayudarte con tus dudas sobre créditos, tasas, requisitos y más. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Guardar mensaje del usuario en la base de datos
  const saveUserMessage = async (userMessage: string) => {
    try {
      await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Usuario Chatbot",
          email: "chat@cajavalladolid.com",
          phone: null,
          subject: "Consulta desde Chatbot",
          message: `[CHATBOT] ${userMessage}`
        }),
      })
    } catch (error) {
      console.error('Error guardando mensaje:', error)
    }
  }

  // Base de conocimientos del chatbot - ACTUALIZADO con tasa 11%
  const knowledgeBase = [
    {
      keywords: ['tasa', 'interés', 'interes', 'porcentaje', 'intereses'],
      response: `💰 Tasas de interés vigentes:

• Crédito Tradicional: <strong>11% anual fijo</strong> (tasa preferencial)
• Crédito Cripto: 8% a 14% anual (tasas preferenciales)
• Plazos de 4 a 20 años

Ejemplo práctico: Para un préstamo de $50,000 a 5 años, tu pago mensual sería aproximadamente $1,100. ¿Te gustaría que te ayude a simular un monto específico?`
    },
    {
      keywords: ['buró', 'buro', 'historial', 'credito', 'crédito', 'mal historial', 'manchado'],
      response: `📊 ¡Buenas noticias! No consultamos Buró de Crédito.

Esto significa que:
• No importa si tienes historial malo o nulo
• Aprobamos tu crédito sin revisar tu pasado crediticio
• Es una segunda oportunidad real

De hecho, el 60% de nuestros clientes llegaron con historial complicado y hoy ya tienen su crédito. ¿Te animas a iniciar tu solicitud?`
    },
    {
      keywords: ['formulario', 'solicitar', 'aplicar', 'pedir', 'quiero un crédito', 'solicitud'],
      response: `📋 Proceso de solicitud en 3 pasos:

Paso 1: Llena el formulario (2 minutos)
• Tus datos básicos: nombre, teléfono, email
• El tipo de crédito que te interesa

Paso 2: Un asesor te contacta (24-48 horas)
• Revisa tu perfil
• Te explica las opciones disponibles

Paso 3: Recibe tu aprobación (3-5 días)
• Firma de contrato digital
• Depósito en tu cuenta

¿En qué paso te encuentras? ¿Necesitas ayuda con algo específico?`
    },
    {
      keywords: ['requisitos', 'necesito', 'documentos', 'qué necesito', 'papeles'],
      response: `📄 Documentación necesaria:

Para personas físicas:
• INE/IFE vigente (ambos lados)
• Comprobante de domicilio (luz, agua, teléfono - últimos 3 meses)
• Comprobante de ingresos (recibos de nómina o estados de cuenta)
• 2 referencias personales (nombre y teléfono)

Para negocios (adicional):
• RFC de la empresa
• Acta constitutiva
• Estados financieros básicos

¿Eres persona física o representas un negocio?`
    },
    {
      keywords: ['monto', 'cantidad', 'cuánto', 'maximo', 'máximo', 'hasta cuanto', 'mínimo'],
      response: `💰 Escala de montos disponibles:

Crédito Personal: $50,000 - $10,000,000
Crédito Cripto: $10,000 - $500,000 (en USD)
Crédito Negocios: $20,000 - $1,000,000
Crédito Automotriz: $50,000 - $500,000
Crédito Hipotecario: $100,000 - $2,000,000

El monto máximo depende de tu capacidad de pago. Con un ingreso mensual de $15,000, podrías acceder a un crédito de hasta $150,000. ¿Cuál es tu ingreso aproximado?`
    },
    {
      keywords: ['contacto', 'whatsapp', 'teléfono', 'llamar', 'asesor', 'hablar', 'persona', 'comunicarme'],
      response: `📞 ¿Quieres hablar con un humano? ¡Excelente decisión!

Nuestros asesores están disponibles:
• Vía telefónica: 01 985 123 4567 (Lun-Vie 9am-6pm)
• Por WhatsApp: +52 985 123 4567 (respuesta inmediata)
• Email: contacto@cajavalladolid.com

También puedes dejar tu número aquí y te llamamos:
https://cajavalladolid.com/contacto

¿Qué medio prefieres para que te contacten?`
    },
    {
      keywords: ['tiempo', 'demora', 'cuánto tarda', 'aprobación', 'respuesta', 'espera'],
      response: `⏱️ Cronograma del proceso:

Día 1: Llenas el formulario (inmediato)
Días 2-3: Asesor te contacta y revisa documentos
Días 4-5: Análisis de crédito
Días 6-7: Aprobación y firma de contrato
Día 8: ¡Dinero en tu cuenta!

Tiempo total promedio: 5 a 8 días hábiles. Los créditos exprés (montos menores a $30,000) pueden aprobarse en solo 48 horas. ¿Tu crédito es urgente?`
    },
    {
      keywords: ['pagina', 'web', 'sitio', 'navegar', 'menú'],
      response: `🌐 Mapa del sitio:

• Inicio: Calculadoras y bienvenida
• Quiénes somos: Nuestra historia y valores
• Calculadora: Simula tu crédito en pesos (11% anual)
• Calculadora Cripto: Simula crédito en crypto
• Solicitar: Formulario de aplicación
• Contacto: Ubicación y horarios

¿A qué sección te gustaría ir? Puedo darte un acceso directo.`
    },
    {
      keywords: ['seguro', 'seguros', 'protección', 'vida', 'desgravamen'],
      response: `🛡️ Protección incluida en tu crédito:

Seguro de Vida: Cubre el saldo total si algo te pasa
Seguro de Desempleo: Pagamos 3 meses si pierdes tu trabajo
Seguro de Incapacidad: Cubre pagos si no puedes trabajar

Costo total: 2% del monto del crédito (se fracciona en tus pagos mensuales)

Ejemplo: Para un crédito de $50,000, el seguro total sería $1,000, que equivale a unos $30 pesos por pago mensual. ¿Vale la pena, no?`
    },
    {
      keywords: ['pago', 'pagos', 'mensualidad', 'abono', 'amortización', 'tabla'],
      response: `📆 Opciones de pago:

Formas de pago disponibles:
• Ventanilla en nuestras sucursales (sin comisión)
• Transferencia SPEI (gratuita)
• Depósito en OXXO (convenio)
• Cargo automático a tarjeta (2% de descuento)
• Pago anticipado sin penalización

¿Sabías que si pagas antes, te devolvemos parte de los intereses? Por ejemplo, si pagas un crédito a 12 meses en 6 meses, ahorras hasta el 40% de intereses.`
    },
    {
      keywords: ['cripto', 'criptomonedas', 'bitcoin', 'btc', 'eth', 'crypto'],
      response: `₿ Programa Cripto exclusivo:

Beneficios especiales:
• Tasas desde 8% (las más bajas del mercado)
• Aval con criptoactivos (BTC, ETH, USDT)
• Aprobación en 24 horas
• Recibe tu crédito en crypto o pesos

Requisitos adicionales:
• Wallet activa con mínimo 6 meses de antigüedad
• Historial de transacciones
• 20% de garantía en crypto

¿Eres holder o trader? Cuéntame tu perfil para recomendarte la mejor opción.`
    },
    {
      keywords: ['negocios', 'empresa', 'emprendedor', 'pyme', 'comercio'],
      response: `🏢 Línea de Crédito PyME:

Diseñado para impulsar tu negocio:
• Capital de trabajo: $20,000 - $300,000
• Compra de equipo: $50,000 - $500,000
• Expansión local: $100,000 - $1,000,000

Beneficios exclusivos:
• Primer pago a 90 días
• Asesoría financiera gratuita
• Seguro de negocio incluido primer año

Casos de éxito: Una tienda de abarrotes en Valladolid duplicó su inventario con $80,000 y aumentó ventas 40% en 3 meses. ¿Qué tipo de negocio tienes?`
    },
    {
      keywords: ['jubilado', 'pensionado', 'tercera edad', 'adulto mayor'],
      response: `👴 Línea Plata (60+ años):

Pensada para tu tranquilidad:
• Montos desde $10,000 a $200,000
• Plazos hasta 36 meses
• Tasa fija desde 10% anual
• Seguro de vida incluido SIN costo extra
• Descuento vía nómina de pensión (opcional)

Documentos simplificados:
• Identificación vigente
• Último estado de cuenta de pensión
• Comprobante de domicilio

¿Recibes tu pensión por AFORE o por nómina?`
    },
    {
      keywords: ['estudiante', 'universitario', 'joven', 'primer crédito'],
      response: `🎓 Crédito Joven Constructor:

Para estudiantes y recién egresados:
• Montos desde $3,000 hasta $50,000
• Sin aval (hasta $15,000)
• Constancia de estudios o título
• Edad: 18 a 29 años

Beneficios adicionales:
• Educación financiera incluida
• Historial crediticio desde tu primer crédito
• 3 meses de gracia (sin pagos) para recién egresados

¿En qué semestre vas o ya egresaste?`
    },
    {
      keywords: ['auto', 'carro', 'vehículo', 'coche', 'motocicleta', 'moto'],
      response: `🚗 Crédito Automotriz Rápido:

Financia tu próximo vehículo:
• Autos seminuevos (2018+): hasta 85% del valor
• Autos nuevos: hasta 90% del valor
• Motos: hasta 80% del valor
• Plazos: 12 a 60 meses

Ventajas competitivas:
• Tasa desde 11% (la más baja en Yucatán)
• Seguro cobertura amplia primer año INCLUIDO
• Sin penalización por pago anticipado
• Aprobación en 48 horas

¿Ya tienes algún auto en mente? Dime modelo y año y te doy una simulación.`
    },
    {
      keywords: ['casa', 'vivienda', 'hipoteca', 'departamento', 'terreno'],
      response: `🏠 Crédito Hipotecario Soñar:

Opciones para tu patrimonio:
• Compra de vivienda nueva o usada
• Construcción en terreno propio
• Remodelación y ampliaciones
• Compra de terreno

Condiciones especiales:
• Plazos: 5 a 20 años
• Tasa fija primeros 5 años (desde 11%)
• Financiamiento hasta 80% del valor
• Prepagos sin penalización

Ejemplo: Casa de $1,000,000, enganche $200,000, crédito $800,000 a 15 años, mensualidad aprox $8,500. ¿Te interesa cotizar una propiedad específica?`
    }
  ]

  const defaultResponse = `Lo siento, no entendí tu pregunta. 😅

Puedes preguntarme sobre:

💰 Tasas de interés (11% anual en créditos tradicionales)
📊 Buró de crédito (segundas oportunidades)
📋 Formularios (proceso paso a paso)
📄 Requisitos (documentos necesarios)
💰 Montos (desde $50,000 hasta $10M)
📞 Contacto (asesores humanos)
⏱️ Tiempos (cronograma completo)
₿ Cripto (créditos con crypto)
🏢 Negocios (PyMEs y emprendedores)
👴 Jubilados (línea plata)
🎓 Estudiantes (primer crédito)
🚗 Auto (financiamiento vehicular)
🏠 Casa (hipotecas)

¿Sobre cuál tema te gustaría información detallada?`

  // Enviar mensaje
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    }

    setMessages(prev => [...prev, userMessage])
    
    // Guardar mensaje del usuario
    await saveUserMessage(inputValue)
    
    setInputValue("")
    setIsLoading(true)

    // Simular tiempo de respuesta
    setTimeout(() => {
      const userText = inputValue.toLowerCase()
      let botResponse = defaultResponse

      for (const item of knowledgeBase) {
        if (item.keywords.some(keyword => userText.includes(keyword))) {
          botResponse = item.response
          break
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
      }

      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  // Categorías de preguntas rápidas
  const quickCategories = [
    { name: "💰 Tasas (11%)", keywords: "¿Cuál es la tasa de interés?" },
    { name: "📊 Buró", keywords: "¿Revisan Buró de Crédito?" },
    { name: "📋 Formulario", keywords: "¿Cómo solicito un crédito?" },
    { name: "📄 Requisitos", keywords: "¿Qué documentos necesito?" },
    { name: "⏱️ Tiempos", keywords: "¿Cuánto tarda la aprobación?" },
    { name: "₿ Cripto", keywords: "Crédito en criptomonedas" },
    { name: "🏢 Negocios", keywords: "Crédito para mi negocio" },
    { name: "👴 Jubilados", keywords: "Crédito para pensionados" },
    { name: "🎓 Estudiantes", keywords: "Crédito para estudiantes" },
    { name: "🚗 Auto", keywords: "Financiamiento de auto" },
    { name: "🏠 Casa", keywords: "Crédito hipotecario" },
    { name: "📞 Asesor", keywords: "Hablar con un asesor" },
  ]

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-all hover:scale-110"
        aria-label="Abrir chat"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 h-[600px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">FinBot - Asistente Virtual</h3>
                <p className="text-xs opacity-90">Caja Valladolid · Tasa 11% anual</p>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-lg p-3 ${
                    message.sender === "user" 
                      ? "bg-green-600 text-white rounded-br-none" 
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === "bot" ? (
                        <>
                          <Bot className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700">FinBot</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-medium text-white/90">Tú</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {message.text.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                      <span className="text-sm text-gray-600">Escribiendo respuesta...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Preguntas rápidas en grid */}
          <div className="p-3 border-t border-gray-200 bg-white max-h-48 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-2">Preguntas frecuentes:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickCategories.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputValue(item.keywords)
                    setTimeout(() => handleSend(), 100)
                  }}
                  className="text-xs bg-gray-100 hover:bg-green-100 text-gray-700 px-2 py-2 rounded-lg transition-colors text-left truncate"
                  disabled={isLoading}
                  title={item.keywords}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                aria-label="Enviar mensaje"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Mensaje de contacto personalizado */}
            <p className="text-xs text-gray-500 text-center mt-3 italic border-t pt-2">
              ¿Necesitas atención personalizada? 
              <br />Deja tu teléfono o email en el formulario y un asesor te contactará.
            </p>
          </div>
        </div>
      )}
    </>
  )
}