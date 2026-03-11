"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, AlertCircle, FileSignature, Shield, ArrowLeft, Download, Mail } from 'lucide-react'

// Interfaces para tipado
interface Lead {
  id: string
  fullName: string
  email: string
  phone: string
  estimatedAmount?: number
  plazo?: number
  tasa?: number
  creditType?: string
  status?: string
}

export default function ContratoPage() {
  const params = useParams()
  const router = useRouter()
  
  // Manejo seguro de params.leadId
  const leadId = params?.leadId as string | undefined

  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState<Lead | null>(null)
  const [error, setError] = useState('')
  const [aceptado, setAceptado] = useState(false)
  const [firmando, setFirmando] = useState(false)

  useEffect(() => {
    // Redirigir si no hay leadId
    if (!leadId) {
      setError('Enlace inválido')
      setLoading(false)
      return
    }

    const fetchLead = async () => {
      try {
        const response = await fetch(`/api/public/lead/${leadId}`)
        const data = await response.json()
        
        if (data.success) {
          setLead(data.data)
        } else {
          setError('Enlace inválido o expirado')
        }
      } catch (error) {
        console.error('Error:', error)
        setError('Error al cargar la información')
      } finally {
        setLoading(false)
      }
    }

    fetchLead()
  }, [leadId])

  const handleFirmar = async () => {
    if (!leadId) return
    
    setFirmando(true)
    
    try {
      // Llamada real a API para firmar contrato
      const response = await fetch(`/api/contratos/${leadId}/firmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aceptado: true })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAceptado(true)
      } else {
        alert('Error al firmar el contrato: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión al firmar el contrato')
    } finally {
      setFirmando(false)
    }
  }

  // Mostrar pantalla de carga inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-200 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Cargando contrato...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si no hay leadId o hubo error
  if (error || !lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enlace no válido</h1>
          <p className="text-gray-600 mb-6">{error || 'El enlace ha expirado o no existe'}</p>
          <a
            href="https://cajavalladolid.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  // Mostrar pantalla de éxito después de firmar
  if (aceptado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">¡Contrato Firmado!</h1>
          <p className="text-gray-600 mb-6">
            Hemos recibido tu firma electrónica correctamente. En breve recibirás un correo con los siguientes pasos.
          </p>
          <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-green-800 mb-2">📋 Próximos pasos:</p>
            <ul className="text-sm text-green-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">1️⃣</span>
                <span>Un asesor te contactará en 24-48 horas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">2️⃣</span>
                <span>Realiza el pago de anticipo para activar tu crédito</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">3️⃣</span>
                <span>Recibirás tu tarjeta en tu domicilio</span>
              </li>
            </ul>
          </div>
          <a
            href="https://cajavalladolid.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  // Calcular valores para mostrar
  const estimatedAmount = lead.estimatedAmount || 50000
  const plazo = lead.plazo || 36
  const tasa = lead.tasa || 12
  const anticipo = estimatedAmount * 0.2

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Contrato de Crédito</h1>
          <p className="text-green-100">Caja Popular San Bernardino de Siena Valladolid</p>
        </div>

        {/* Información del cliente */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Datos del Contrato
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cliente</p>
              <p className="font-semibold text-gray-900">{lead.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-900">{lead.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Teléfono</p>
              <p className="font-semibold text-gray-900">{lead.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Monto aprobado</p>
              <p className="font-semibold text-green-600">
                ${estimatedAmount.toLocaleString('es-MX')} MXN
              </p>
            </div>
          </div>
        </div>

        {/* Resumen del contrato */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Términos y Condiciones</h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold mb-2">📌 Monto y Plazo</p>
              <p className="text-sm">Crédito por ${estimatedAmount.toLocaleString('es-MX')} a {plazo} meses</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold mb-2">💰 Tasa de Interés</p>
              <p className="text-sm">Tasa fija del {tasa}% anual</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="font-semibold mb-2 text-green-800">🔒 Pago de Anticipo</p>
              <p className="text-sm text-green-700">
                Anticipo requerido: ${anticipo.toLocaleString('es-MX')} MXN (20% del total)
              </p>
              <p className="text-xs text-green-600 mt-2">
                • 70% se descuenta de tu crédito<br />
                • 30% gastos administrativos
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold mb-2">💳 Entrega de Tarjeta</p>
              <p className="text-sm">Recibirás tu tarjeta en tu domicilio una vez confirmado el anticipo</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Al firmar electrónicamente, aceptas todos los términos y condiciones 
              establecidos en el contrato completo. Puedes descargar el contrato en PDF para revisarlo detalladamente.
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.open(`/api/contratos/tradicional/${leadId}`, '_blank')}
            className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Download className="w-5 h-5" />
            Descargar Contrato PDF
          </button>
          
          <button
            onClick={handleFirmar}
            disabled={firmando}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 shadow-lg"
          >
            {firmando ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Procesando firma...</span>
              </>
            ) : (
              <>
                <FileSignature className="w-5 h-5" />
                Firmar Contrato Electrónicamente
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Caja Popular San Bernardino de Siena Valladolid · Registro: 29198 · CONDUSEF ID: 4930</p>
        </div>
      </div>
    </div>
  )
}