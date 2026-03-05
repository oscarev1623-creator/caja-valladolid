"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Upload, FileText, User, Mail, Phone, Home, 
  Briefcase, CreditCard, Camera, Save, Check
} from 'lucide-react'

export default function FormularioCompletoPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [leadInfo, setLeadInfo] = useState<any>(null)
  const [formData, setFormData] = useState({
    // Información personal
    curp: '',
    fechaNacimiento: '',
    nacionalidad: '',
    estadoCivil: '',
    dependientes: 0,
    
    // Dirección
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    colonia: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    tiempoResidencia: '',
    
    // Empleo
    empleoActual: '',
    puesto: '',
    antiguedad: '',
    ingresoMensual: '',
    otrosIngresos: '',
    
    // Información financiera
    tieneCredito: false,
    institucionesCreditos: '',
    deudaActual: '',
    
    // Documentos (URLs)
    ineFrontal: '',
    ineTrasera: '',
    comprobanteDomicilio: '',
    estadosCuenta: [],
    comprobanteIngresos: '',
    
    // Referencias
    referencia1Nombre: '',
    referencia1Telefono: '',
    referencia1Parentesco: '',
    referencia2Nombre: '',
    referencia2Telefono: '',
    referencia2Parentesco: '',
    
    // Términos
    aceptaTerminos: false,
    autorizaConsulta: false
  })

  useEffect(() => {
    // Verificar token y cargar información del lead
    const verificarToken = async () => {
      try {
        const response = await fetch(`/api/tickets/${params.token}/verify`)
        const data = await response.json()
        
        if (data.success) {
          setLeadInfo(data.lead)
        } else {
          alert('Enlace inválido o expirado')
          router.push('/')
        }
      } catch (error) {
        console.error('Error verificando token:', error)
      }
    }
    
    verificarToken()
  }, [params.token])

  const handleFileUpload = async (file: File, fieldName: string) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: data.url
        }))
      }
    } catch (error) {
      console.error('Error subiendo archivo:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`/api/tickets/${params.token}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          leadId: leadInfo.id
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('✅ Documentación enviada exitosamente. Serás contactado para evaluación.')
        router.push('/gracias')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!leadInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Completar Solicitud de Crédito
          </h1>
          <p className="text-gray-600 mt-2">
            Hola {leadInfo.fullName}, por favor completa tu información para continuar con el proceso
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección 1: Información Personal */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CURP *
                </label>
                <input
                  type="text"
                  value={formData.curp}
                  onChange={(e) => setFormData({...formData, curp: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              {/* Más campos de información personal... */}
            </div>
          </div>

          {/* Sección 2: Documentos */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Documentos Requeridos
            </h2>
            
            <div className="space-y-4">
              {/* INE Frontal */}
              <div className="p-4 border-2 border-dashed rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  INE (Frente) *
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => e.target.files?.[0] && 
                    handleFileUpload(e.target.files[0], 'ineFrontal')}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
              </div>
              
              {/* Estados de cuenta (múltiples) */}
              <div className="p-4 border-2 border-dashed rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Estados de Cuenta (últimos 3 meses) *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={async (e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files)
                      const urls = []
                      for (const file of files) {
                        const url = await handleFileUpload(file, 'temp')
                        urls.push(url)
                      }
                      setFormData({...formData, estadosCuenta: urls})
                    }
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              
              {/* Más campos de documentos... */}
            </div>
          </div>

          {/* Botón de envío */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading || !formData.aceptaTerminos}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loading ? 'Enviando...' : (
                <>
                  <Save className="w-5 h-5" />
                  Enviar Documentación Completa
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              * Todos los campos marcados son obligatorios
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}