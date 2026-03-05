"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  CheckCircle, XCircle, AlertCircle, FileSignature, 
  Shield, ArrowLeft, Download, ExternalLink, Bitcoin
} from 'lucide-react'
import Image from 'next/image'

export default function ContratoCriptoPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.leadId as string

  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState<any>(null)
  const [error, setError] = useState('')
  const [aceptado, setAceptado] = useState(false)
  const [firmando, setFirmando] = useState(false)

  // Precios de criptomonedas (simulados)
  const cryptoPrices: Record<string, number> = {
    'USDT': 1,
    'BTC': 65000,
    'ETH': 3500,
    'BNB': 600,
    'SOL': 150
  }

  useEffect(() => {
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
        setError('Error al cargar la información')
      } finally {
        setLoading(false)
      }
    }

    fetchLead()
  }, [leadId])

  const handleFirmar = async () => {
    setFirmando(true)
    // Simular proceso de firma
    setTimeout(() => {
      setAceptado(true)
      setFirmando(false)
    }, 2000)
  }

  const getCryptoPrice = (crypto: string) => {
    return cryptoPrices[crypto] || 1
  }

  const getCryptoLogo = (crypto: string) => {
    const logos: Record<string, string> = {
      'USDT': '/crypto-logos/usdt.png',
      'BTC': '/crypto-logos/bitcoin.png',
      'ETH': '/crypto-logos/eth.png',
      'BNB': '/crypto-logos/bnb.png',
      'SOL': '/crypto-logos/sol.png'
    }
    return logos[crypto] || '/crypto-logos/bitcoin.png'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-200 blur-xl opacity-50 animate-pulse"></div>
            <div className="relative inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Cargando contrato cripto...</p>
        </div>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enlace no válido</h1>
          <p className="text-gray-600 mb-6">{error || 'El enlace ha expirado o no existe'}</p>
          <a
            href="https://cajavalladolid.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  const cripto = lead.selectedCrypto || 'USDT'
  const precioUSD = getCryptoPrice(cripto)
  const montoUSDT = lead.estimatedAmount || 50000
  const montoCripto = cripto === 'USDT' ? montoUSDT : (montoUSDT / precioUSD).toFixed(6)
  const anticipoUSDT = montoUSDT * 0.10
  const anticipoCripto = cripto === 'USDT' ? anticipoUSDT : (anticipoUSDT / precioUSD).toFixed(6)
  const montoMXN = montoUSDT * 20
  const anticipoMXN = anticipoUSDT * 20

  if (aceptado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">¡Contrato Firmado!</h1>
          <p className="text-gray-600 mb-6">
            Hemos recibido tu firma electrónica correctamente. Tu crédito en {cripto} está siendo procesado.
          </p>
          <div className="bg-purple-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-purple-800 mb-2">📋 Próximos pasos:</p>
            <ul className="text-sm text-purple-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">1️⃣</span>
                <span>Un asesor especializado te contactará en 24-48 horas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">2️⃣</span>
                <span>Realiza el pago de anticipo de {anticipoCripto} {cripto}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">3️⃣</span>
                <span>Recibirás tus {cripto} en la wallet que elijas</span>
              </li>
            </ul>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3">
            <Bitcoin className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Contrato de Crédito Cripto</h1>
          </div>
          <p className="text-purple-100 mt-2">Caja Popular San Bernardino de Siena Valladolid · División Cripto</p>
        </div>

        {/* Información del cliente */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
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
              <p className="text-sm text-gray-600 mb-1">Criptomoneda</p>
              <div className="flex items-center gap-2">
                <Image src={getCryptoLogo(cripto)} alt={cripto} width={24} height={24} />
                <p className="font-semibold text-gray-900">{cripto}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles del crédito */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Términos del Crédito</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-600 mb-1">Monto en {cripto}</p>
              <p className="text-2xl font-bold text-gray-900">{montoCripto} {cripto}</p>
              <p className="text-xs text-gray-500 mt-1">Precio: 1 {cripto} = ${precioUSD} USD</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-600 mb-1">Equivalente en MXN</p>
              <p className="text-2xl font-bold text-gray-900">${montoMXN.toLocaleString('es-MX')} MXN</p>
              <p className="text-xs text-gray-500 mt-1">Tipo de cambio: 1 USD = $20 MXN</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl">
            <div className="flex justify-between items-center">
              <span>Pago mensual estimado</span>
              <span className="text-2xl font-bold">
                {cripto === 'USDT' 
                  ? `$${Math.round(montoUSDT * 0.03).toLocaleString('es-MX')} ${cripto}`
                  : `${(montoUSDT * 0.03 / precioUSD).toFixed(6)} ${cripto}`
                }
              </span>
            </div>
          </div>
        </div>

        {/* Sección de anticipo */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🔐</span>
            Anticipo del 10% - Requisito para activar tu crédito
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm opacity-90">En {cripto}</p>
              <p className="text-3xl font-bold">{anticipoCripto} {cripto}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm opacity-90">En MXN</p>
              <p className="text-3xl font-bold">${anticipoMXN.toLocaleString('es-MX')} MXN</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <span className="block text-lg">70%</span>
              <span>A capital</span>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <span className="block text-lg">30%</span>
              <span>Gastos admin</span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.open(`/api/contratos/cripto/${leadId}`, '_blank')}
            className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Download className="w-5 h-5" />
            Descargar Contrato PDF
          </button>
          
          <button
            onClick={handleFirmar}
            disabled={firmando}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 shadow-lg"
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
          <p>Caja Popular San Bernardino de Siena Valladolid · División Cripto</p>
          <p>Registro: 29198 · CONDUSEF ID: 4930</p>
        </div>
      </div>
    </div>
  )
}