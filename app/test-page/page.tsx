// app/test-page/page.tsx
"use client"

import { useState } from 'react'

export default function TestPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    mensaje: ''
  })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/formulario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        // Limpiar formulario
        setFormData({ nombre: '', telefono: '', email: '', mensaje: '' })
      }
    } catch (error) {
      setResult({ success: false, error: 'Error de conexión' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-700">
          🧪 Página de Prueba - Caja Valladolid
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Formulario de Prueba</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="Juan Pérez"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono *</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="5512345678"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                placeholder="juan@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Mensaje</label>
              <textarea
                value={formData.mensaje}
                onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                rows={3}
                placeholder="Mensaje adicional..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        </div>
        
        {result && (
          <div className={`p-4 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <h3 className="font-bold">{result.success ? '✅ Éxito' : '❌ Error'}</h3>
            <p>{result.message || result.error}</p>
            {result.data && (
              <div className="mt-2 text-sm">
                <p>ID: {result.data.id}</p>
                <p>Nombre: {result.data.nombre}</p>
                <p>Teléfono: {result.data.telefono}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 bg-blue-50 p-4 rounded">
          <h3 className="font-bold text-blue-800">📊 Estado del Sistema</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>✅ Prisma 5.22.0 funcionando</li>
            <li>✅ SQLite database conectado</li>
            <li>✅ API /api/formulario activa</li>
            <li>✅ Servidor en: http://localhost:3000</li>
            <li>🔗 Prisma Studio: http://localhost:5555</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
