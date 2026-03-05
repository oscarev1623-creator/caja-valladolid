// app/formulario-documentos/[token]/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Upload, FileText, User, CheckCircle, AlertCircle } from 'lucide-react'

export default function DocumentosPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [loading, setLoading] = useState(true)
  const [lead, setLead] = useState<any>(null)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    curp: '',
    rfc: '',
    ocupacion: '',
    ingresoMensual: '',
    tiempoEmpleo: '',
    direccion: '',
    referencia: '',
    comentarios: ''
  })
  
  const [documents, setDocuments] = useState({
    ineFront: null as File | null,
    ineBack: null as File | null,
    comprobanteDomicilio: null as File | null,
    constanciaLaboral: null as File | null,
    estadosCuenta: null as File | null,
    otrosDocumentos: null as File | null
  })
  
  useEffect(() => {
    fetchLeadInfo()
  }, [token])
  
  const fetchLeadInfo = async () => {
    try {
      const response = await fetch(`/api/leads/verify-token?token=${token}`)
      const data = await response.json()
      
      if (data.success) {
        setLead(data.lead)
        
        // Si ya envió documentos, redirigir
        if (data.lead.documentsSubmitted) {
         router.push(`/gracias`)
        }
      } else {
        setError(data.error || 'Token inválido')
      }
    } catch (error) {
      setError('Error cargando información')
    } finally {
      setLoading(false)
    }
  }
  
  const handleFileChange = (field: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({
      ...prev,
      [field]: file
    }))
  }
  
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    setLoading(true)
    
    // Crear FormData
    const submitFormData = new FormData()
    
    // Agregar información del formulario
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitFormData.append(key, value)
    })
    
    // Agregar documentos
    Object.entries(documents).forEach(([key, file]) => {
      if (file) submitFormData.append(key, file)
    })
    
    // Agregar IDs
    submitFormData.append('token', token)
    submitFormData.append('leadId', lead.id)
    submitFormData.append('userId', 'client') // En producción, sería el ID del cliente
    
    // Enviar a la API
    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      body: submitFormData
    })
    
    const result = await response.json()
    
if (result.success) {
  alert(`✅ ${result.message}\nSe subieron ${result.documentsCount} documentos.`)
  // Redirigir a página de agradecimiento
  router.push(`/gracias`)
} else {
      alert(`❌ Error: ${result.error}`)
    }
    
  } catch (error) {
    console.error('Error:', error)
    alert('❌ Error enviando formulario. Por favor intenta de nuevo.')
  } finally {
    setLoading(false)
  }
}
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Cargando información del crédito...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enlace inválido</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
 <div className="text-center mb-8 pt-8">
  <div className="inline-flex items-center justify-center w-32 h-32 mb-6">
    {/* Logo de Caja Valladolid */}
    <img 
      src="/logotipo.png" 
      alt="Caja Valladolid" 
      className="w-full h-full object-contain"
      onError={(e) => {
        console.error('Error cargando logo:', e);
        // Fallback si el logo no se carga
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement!.innerHTML = `
          <div class="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center">
            <span class="text-white text-2xl font-bold">CV</span>
          </div>
        `;
      }}
    />
  </div>
  <h1 className="text-3xl font-bold text-gray-900">
    Caja Popular San Bernardino de Siena
  </h1>
  <h2 className="text-2xl font-semibold text-emerald-700 mt-1">
    Valladolid
  </h2>
  <p className="text-gray-600 mt-3 text-lg">
    Formulario de Documentación para Crédito
  </p>
</div>
        
        {/* Información del cliente */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-800" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead?.fullName}</h2>
              <p className="text-gray-600">Solicitud de ${lead?.estimatedAmount?.toLocaleString('es-MX')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{lead?.email}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">Teléfono:</span>
              <p className="font-medium">{lead?.phone}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">Tipo de crédito:</span>
              <p className="font-medium">{lead?.creditType}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">Fecha solicitud:</span>
              <p className="font-medium">
                {new Date(lead?.createdAt).toLocaleDateString('es-MX')}
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">¡Felicidades! Tu crédito está en proceso</p>
                <p className="text-sm text-blue-700 mt-1">
                  Completa esta documentación para continuar con la evaluación
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formulario principal */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Sección 1: Información personal */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal Adicional
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CURP
                </label>
                <input
                  type="text"
                  value={formData.curp}
                  onChange={(e) => setFormData({...formData, curp: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: GARJ800101HDFLRN09"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RFC
                </label>
                <input
                  type="text"
                  value={formData.rfc}
                  onChange={(e) => setFormData({...formData, rfc: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: GARJ800101XXX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ocupación
                </label>
                <select
                  value={formData.ocupacion}
                  onChange={(e) => setFormData({...formData, ocupacion: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="EMPLEADO">Empleado</option>
                  <option value="INDEPENDIENTE">Independiente</option>
                  <option value="EMPRESARIO">Empresario</option>
                  <option value="JUBILADO">Jubilado</option>
                  <option value="ESTUDIANTE">Estudiante</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingreso Mensual Aproximado
                </label>
                <input
                  type="text"
                  value={formData.ingresoMensual}
                  onChange={(e) => setFormData({...formData, ingresoMensual: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: $15,000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo en el Empleo/Antigüedad
                </label>
                <input
                  type="text"
                  value={formData.tiempoEmpleo}
                  onChange={(e) => setFormData({...formData, tiempoEmpleo: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: 2 años"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección Completa
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Calle, número, colonia, ciudad"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentarios o Información Adicional
              </label>
              <textarea
                value={formData.comentarios}
                onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Comentarios adicionales sobre tu situación..."
              />
            </div>
          </div>
          
          {/* Sección 2: Documentos obligatorios */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Documentación Obligatoria
            </h3>
            <p className="text-gray-600 mb-6">Sube copias digitales de los siguientes documentos (PDF, JPG o PNG)</p>
            
            <div className="space-y-6">
              {/* INE Frontal */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 transition-colors">
                <label className="block mb-2">
                  <span className="font-medium text-gray-900">INE/IFE Frontal</span>
                  <span className="text-red-500 ml-1">*</span>
                  <p className="text-sm text-gray-500 mt-1">Foto frontal de tu identificación oficial</p>
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('ineFront', e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {documents.ineFront && (
                    <p className="mt-2 text-sm text-green-600">
                      ✅ Archivo seleccionado: {documents.ineFront.name}
                    </p>
                  )}
                </div>
              </div>
              
              {/* INE Trasera */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 transition-colors">
                <label className="block mb-2">
                  <span className="font-medium text-gray-900">INE/IFE Trasera</span>
                  <span className="text-red-500 ml-1">*</span>
                  <p className="text-sm text-gray-500 mt-1">Foto trasera de tu identificación oficial</p>
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('ineBack', e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {documents.ineBack && (
                    <p className="mt-2 text-sm text-green-600">
                      ✅ Archivo seleccionado: {documents.ineBack.name}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Comprobante de domicilio */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 transition-colors">
                <label className="block mb-2">
                  <span className="font-medium text-gray-900">Comprobante de Domicilio</span>
                  <span className="text-red-500 ml-1">*</span>
                  <p className="text-sm text-gray-500 mt-1">Recibo de luz, agua, teléfono (no mayor a 3 meses)</p>
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('comprobanteDomicilio', e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {documents.comprobanteDomicilio && (
                    <p className="mt-2 text-sm text-green-600">
                      ✅ Archivo seleccionado: {documents.comprobanteDomicilio.name}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Constancia laboral */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-400 transition-colors">
                <label className="block mb-2">
                  <span className="font-medium text-gray-900">Constancia Laboral o Comprobante de Ingresos</span>
                  <span className="text-red-500 ml-1">*</span>
                  <p className="text-sm text-gray-500 mt-1">Carta de empleo, estados de cuenta, recibos de nómina</p>
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('constanciaLaboral', e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {documents.constanciaLaboral && (
                    <p className="mt-2 text-sm text-green-600">
                      ✅ Archivo seleccionado: {documents.constanciaLaboral.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sección 3: Documentos adicionales */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Documentación Adicional (Opcional)
            </h3>
            
            <div className="space-y-6">
              {/* Estados de cuenta */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <label className="block mb-2">
                  <span className="font-medium text-gray-900">Estados de Cuenta Bancarios</span>
                  <p className="text-sm text-gray-500 mt-1">Últimos 3 meses (ayuda a mejorar tu evaluación)</p>
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('estadosCuenta', e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {documents.estadosCuenta && (
                    <p className="mt-2 text-sm text-blue-600">
                      ✅ Archivo seleccionado: {documents.estadosCuenta.name}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Otros documentos */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors">
                <label className="block mb-2">
                  <span className="font-medium text-gray-900">Otros Documentos Relevantes</span>
                  <p className="text-sm text-gray-500 mt-1">Títulos, contratos, escrituras, etc.</p>
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('otrosDocumentos', e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {documents.otrosDocumentos && (
                    <p className="mt-2 text-sm text-blue-600">
                      ✅ Archivo seleccionado: {documents.otrosDocumentos.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Botón de envío */}
          <div className="sticky bottom-6 bg-white rounded-2xl shadow-xl p-6 border border-green-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">✅ Protección de datos garantizada</p>
                <p className="text-sm text-gray-600">Tu información está segura con encriptación SSL</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : '📤 Enviar Documentación'}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Al enviar, aceptas los términos y condiciones de Caja Popular San Bernardino de Siena Valladolid
            </p>
          </div>
        </form>
        
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Caja Popular San Bernardino de Siena Valladolid</p>
          <p className="mt-1">Registro Oficial: 29198 • CONDUSEF ID: 4930</p>
          <p className="mt-4 text-xs text-gray-400">© {new Date().getFullYear()} Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  )
}