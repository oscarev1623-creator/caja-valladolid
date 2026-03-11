"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Upload, FileText, User, Mail, Phone, Home, 
  Briefcase, CreditCard, Camera, Save, Check, AlertCircle
} from 'lucide-react'

// Interfaces para tipado
interface LeadInfo {
  id: string
  fullName: string
  email: string
  phone: string
  estimatedAmount?: number
  creditType?: string
}

interface FormularioData {
  curp: string
  fechaNacimiento: string
  nacionalidad: string
  estadoCivil: string
  dependientes: number
  calle: string
  numeroExterior: string
  numeroInterior: string
  colonia: string
  ciudad: string
  estado: string
  codigoPostal: string
  tiempoResidencia: string
  empleoActual: string
  puesto: string
  antiguedad: string
  ingresoMensual: string
  otrosIngresos: string
  tieneCredito: boolean
  institucionesCreditos: string
  deudaActual: string
  ineFrontal: string
  ineTrasera: string
  comprobanteDomicilio: string
  estadosCuenta: string[]
  comprobanteIngresos: string
  referencia1Nombre: string
  referencia1Telefono: string
  referencia1Parentesco: string
  referencia2Nombre: string
  referencia2Telefono: string
  referencia2Parentesco: string
  aceptaTerminos: boolean
  autorizaConsulta: boolean
}

export default function FormularioCompletoPage() {
  const params = useParams()
  const router = useRouter()
  
  // Manejo seguro de params.token
  const token = params?.token as string | undefined
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormularioData>({
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
    // Si no hay token, redirigir
    if (!token) {
      router.push('/')
      return
    }

    // Verificar token y cargar información del lead
    const verificarToken = async () => {
      try {
        setInitialLoading(true)
        setError(null)
        
        const response = await fetch(`/api/tickets/${token}/verify`)
        
        if (response.status === 404) {
          setError('El enlace no es válido o ha expirado')
          return
        }
        
        const data = await response.json()
        
        if (data.success) {
          setLeadInfo(data.lead)
        } else {
          setError(data.error || 'Enlace inválido o expirado')
          setTimeout(() => router.push('/'), 3000)
        }
      } catch (error) {
        console.error('Error verificando token:', error)
        setError('Error de conexión. Por favor intenta de nuevo.')
      } finally {
        setInitialLoading(false)
      }
    }
    
    verificarToken()
  }, [token, router])

  const handleFileUpload = async (file: File, fieldName: keyof FormularioData) => {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      alert('❌ Solo se permiten archivos PDF, JPG o PNG')
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ El archivo no puede ser mayor a 5MB')
      return
    }

    const uploadData = new FormData()
    uploadData.append('file', file)
    uploadData.append('token', token || '')
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      })
      
      const data = await response.json()
      if (data.success) {
        if (fieldName === 'estadosCuenta') {
          setFormData(prev => ({
            ...prev,
            estadosCuenta: [...prev.estadosCuenta, data.url]
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            [fieldName]: data.url
          }))
        }
        alert('✅ Archivo subido correctamente')
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error subiendo archivo:', error)
      alert('❌ Error al subir el archivo')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      alert('Error: Token no válido')
      return
    }
    
    if (!leadInfo) {
      alert('Error: Información del lead no disponible')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch(`/api/tickets/${token}/complete`, {
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
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // Mostrar pantalla de carga inicial
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si el token es inválido
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enlace inválido</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    )
  }

  if (!leadInfo) {
    return null
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
            Hola <span className="font-semibold">{leadInfo.fullName}</span>, por favor completa tu información para continuar con el proceso
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
                  maxLength={18}
                  pattern="[A-Z0-9]{18}"
                  title="CURP debe tener 18 caracteres alfanuméricos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nacionalidad *
                </label>
                <select
                  value={formData.nacionalidad}
                  onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Mexicana">Mexicana</option>
                  <option value="Extranjera">Extranjera</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Civil *
                </label>
                <select
                  value={formData.estadoCivil}
                  onChange={(e) => setFormData({...formData, estadoCivil: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Seleccionar...</option>
                  <option value="Soltero">Soltero/a</option>
                  <option value="Casado">Casado/a</option>
                  <option value="Divorciado">Divorciado/a</option>
                  <option value="Viudo">Viudo/a</option>
                  <option value="UnionLibre">Unión Libre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Dependientes
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.dependientes}
                  onChange={(e) => setFormData({...formData, dependientes: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
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
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, 'ineFrontal')
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {formData.ineFrontal && (
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Archivo subido</span>
                  </div>
                )}
              </div>

              {/* INE Trasera */}
              <div className="p-4 border-2 border-dashed rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  INE (Reverso) *
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, 'ineTrasera')
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {formData.ineTrasera && (
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Archivo subido</span>
                  </div>
                )}
              </div>

              {/* Comprobante de Domicilio */}
              <div className="p-4 border-2 border-dashed rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Comprobante de Domicilio *
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, 'comprobanteDomicilio')
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {formData.comprobanteDomicilio && (
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Archivo subido</span>
                  </div>
                )}
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
                    const files = e.target.files
                    if (files) {
                      for (let i = 0; i < files.length; i++) {
                        await handleFileUpload(files[i], 'estadosCuenta')
                      }
                    }
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {formData.estadosCuenta.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">{formData.estadosCuenta.length} archivo(s) subido(s)</span>
                  </div>
                )}
              </div>

              {/* Comprobante de Ingresos */}
              <div className="p-4 border-2 border-dashed rounded-lg">
                <label className="block text-sm font-medium mb-2">
                  Comprobante de Ingresos *
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, 'comprobanteIngresos')
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {formData.comprobanteIngresos && (
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Archivo subido</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sección 3: Términos y Condiciones */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Términos y Condiciones</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={(e) => setFormData({...formData, aceptaTerminos: e.target.checked})}
                  className="mt-1"
                />
                <label htmlFor="aceptaTerminos" className="text-sm text-gray-700">
                  He leído y acepto los <a href="/terminos" className="text-green-600 underline">términos y condiciones</a> 
                  y autorizo el tratamiento de mis datos personales.
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="autorizaConsulta"
                  checked={formData.autorizaConsulta}
                  onChange={(e) => setFormData({...formData, autorizaConsulta: e.target.checked})}
                  className="mt-1"
                />
                <label htmlFor="autorizaConsulta" className="text-sm text-gray-700">
                  Autorizo a Caja Valladolid a consultar mi historial crediticio en SOC y/o Buro de Crédito.
                </label>
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading || !formData.aceptaTerminos || !formData.autorizaConsulta}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
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