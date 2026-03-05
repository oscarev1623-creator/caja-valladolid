// app/gracias/page.tsx - VERSIÓN SIMPLE SIN CONTADOR
"use client"

import { useRouter } from 'next/navigation'
import { CheckCircle, Home, Clock, FileText } from 'lucide-react'

export default function GraciasPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-14 h-14 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Documentación Completada!
        </h1>
        
        <p className="text-gray-600 mb-6 text-lg">
          Hemos recibido toda tu información correctamente.
        </p>
        
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-6 h-6 text-green-600" />
              <p className="text-green-800 font-medium">
                ✅ Documentación recibida y verificada
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-blue-900">Próximo paso</p>
                <p className="text-sm text-blue-700">
                  Revisión de documentos en 24-48 horas hábiles
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-500 mb-6">
            Serás contactado por nuestro equipo de evaluación
          </p>
          
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Home className="w-5 h-5" />
            Volver al inicio
          </button>
        </div>
        
        <div className="mt-8 text-xs text-gray-400">
          <p>Caja Popular San Bernardino de Siena Valladolid</p>
          <p className="mt-1">Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
          <p className="mt-2">© {new Date().getFullYear()} Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  )
}