"use client"

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import CreditCalculator from '@/components/credit-calculator'
import CryptoCreditCalculator from '@/components/crypto-credit-calculator'

function SimulacionContent() {
  const searchParams = useSearchParams()
  
  const monto = searchParams.get('monto')
  const plazo = searchParams.get('plazo')
  const tipo = searchParams.get('tipo') || 'tradicional'
  
  const initialMonto = monto ? parseInt(monto) : 50000
  const initialPlazo = plazo ? parseInt(plazo) : 8
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {tipo === 'crypto' ? (
        <CryptoCreditCalculator 
          initialMonto={initialMonto}
          initialPlazo={initialPlazo}
        />
      ) : (
        <CreditCalculator 
          initialMonto={initialMonto}
          initialPlazo={initialPlazo}
        />
      )}
    </div>
  )
}

export default function SimulacionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <SimulacionContent />
    </Suspense>
  )
}