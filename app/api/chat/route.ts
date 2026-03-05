import { NextRequest, NextResponse } from 'next/server'

// Respuestas predefinidas para el chatbot
const responses = [
  {
    keywords: ['tasa', 'interés', 'interes'],
    response: `💰 **Tasas de interés:**\n\n• Crédito Tradicional: desde 12% anual\n• Crédito Cripto: desde 8% anual\n\nLa tasa exacta depende del monto y plazo que elijas.`
  },
  {
    keywords: ['buró', 'buro', 'historial', 'credito', 'crédito'],
    response: `📊 **Sin consulta a Buró de Crédito**\n\nNo revisamos tu historial crediticio. Todos tienen oportunidad independientemente de su historial.`
  },
  {
    keywords: ['formulario', 'solicitar', 'aplicar'],
    response: `📋 **Para solicitar un crédito:**\n\n1. Usa el botón "Solicitar Crédito" en la página\n2. Llena el formulario con tus datos\n3. Un asesor te contactará en 24-48 horas`
  },
  {
    keywords: ['requisitos', 'necesito', 'documentos'],
    response: `📄 **Requisitos básicos:**\n\n• Identificación oficial (INE/IFE)\n• Comprobante de domicilio\n• Comprobante de ingresos\n• 2 referencias personales`
  },
  {
    keywords: ['monto', 'cantidad', 'cuánto', 'maximo', 'máximo'],
    response: `💰 **Montos de crédito:**\n\n• Desde $5,000 hasta $500,000 pesos\n• Plazos de 6 a 36 meses\n• Monto exacto según tu capacidad de pago`
  },
  {
    keywords: ['contacto', 'whatsapp', 'teléfono', 'llamar', 'asesor'],
    response: `📞 **Contacto directo:**\n\nWhatsApp: +52 985 123 4567\nTeléfono: 01 985 123 4567\nEmail: contacto@cajavalladolid.com\n\nHorario: Lun-Vie 9am-6pm`
  }
]

const defaultResponse = `Lo siento, no entendí tu pregunta. 😅\n\nPuedes preguntarme sobre:\n• Tasas de interés\n• Requisitos\n• Montos y plazos\n• Buró de crédito\n• Formularios\n\nO contacta directamente a un asesor: 📞 +52 985 123 4567`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    const userMessage = messages[messages.length - 1].content.toLowerCase()

    // Buscar respuesta por keywords
    let botResponse = defaultResponse
    
    for (const item of responses) {
      if (item.keywords.some(keyword => userMessage.includes(keyword))) {
        botResponse = item.response
        break
      }
    }

    // Simular tiempo de procesamiento (opcional)
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ 
      message: botResponse,
      success: true 
    })

  } catch (error) {
    console.error('Error en chat:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}