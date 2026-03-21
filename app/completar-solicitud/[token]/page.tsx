"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import CreditCalculator from '@/components/credit-calculator'
import CryptoCreditCalculator from '@/components/crypto-credit-calculator'

export default function CompletarSolicitudPage() {
  const params = useParams()
  const router = useRouter()
  const token = params?.token as string | undefined
  
  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Token no válido')
      setLoading(false)
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/leads/verify-calculator-token?token=${token}`)
        const data = await response.json()
        
        if (data.success) {
          setLead(data.lead)
        } else {
          setError(data.error || 'Enlace inválido o expirado')
        }
      } catch (error) {
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Enlace inválido</h1>
          <p className="text-gray-600">{error || 'El enlace ha expirado o no existe'}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  // Renderizar la calculadora con los valores del lead
  return (
    <div className="min-h-screen bg-gray-50">
      {lead.creditType === 'CRYPTO' ? (
        <CryptoCreditCalculator 
          initialMonto={lead.estimatedAmount || 50000}
          initialPlazo={lead.plazo || 12}
          leadId={lead.id}
          token={token}
        />
      ) : (
        <CreditCalculator 
          initialMonto={lead.estimatedAmount || 50000}
          initialPlazo={lead.plazo ? lead.plazo / 12 : 8}
          leadId={lead.id}
          token={token}
        />
      )}
    </div>
  )
}