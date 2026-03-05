"use client"

import { useState, useEffect } from 'react'
import { 
  Search, Filter, Download, Mail, Phone, 
  FileText, CheckCircle, XCircle, Send,
  Eye, UserCheck, Clock, DollarSign
} from 'lucide-react'

export default function LeadsAvanzadosPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchLeadsAvanzados()
  }, [])

  const fetchLeadsAvanzados = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/leads/avanzados', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setLeads(data.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAprobar = async (leadId: string) => {
    if (!confirm('¿Aprobar esta solicitud de crédito?')) return
    
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/leads/${leadId}/aprove`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const data = await response.json()
      if (data.success) {
        alert('✅ Crédito aprobado. Se enviará email al cliente.')
        fetchLeadsAvanzados()
      }
    } catch (error) {
      alert('Error al aprobar')
    }
  }

  const handleRechazar = async (leadId: string, motivo: string) => {
    const motivoInput = prompt('Motivo del rechazo:', motivo)
    if (!motivoInput) return
    
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/leads/${leadId}/reject`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ motivo: motivoInput })
      })
      
      const data = await response.json()
      if (data.success) {
        alert('❌ Crédito rechazado. Se enviará email al cliente.')
        fetchLeadsAvanzados()
      }
    } catch (error) {
      alert('Error al rechazar')
    }
  }

  const generarContrato = async (leadId: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/contratos/generar/${leadId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const data = await response.json()
      if (data.success) {
        // Descargar contrato
        window.open(data.url, '_blank')
      }
    } catch (error) {
      alert('Error generando contrato')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Solicitudes Avanzadas
          </h1>
          <p className="text-gray-600 mt-2">
            Leads que completaron el formulario 2 - Evaluación de créditos
          </p>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Cliente</th>
                  <th className="px-6 py-3 text-left">Documentos</th>
                  <th className="px6 py-3 text-left">Ingresos</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{lead.fullName}</p>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {lead.ineFrontal && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            INE ✓
                          </span>
                        )}
                        {lead.estadosCuenta?.length > 0 && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Estados {lead.estadosCuenta.length}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">
                        ${parseFloat(lead.ingresoMensual).toLocaleString()}/mes
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        lead.status === 'EN_EVALUACION' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'APROBADO' ? 'bg-green-100 text-green-800' :
                        lead.status === 'RECHAZADO' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {lead.status === 'EN_EVALUACION' && (
                          <>
                            <button
                              onClick={() => handleAprobar(lead.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="Aprobar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRechazar(lead.id, '')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Rechazar"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {lead.status === 'APROBADO' && (
                          <button
                            onClick={() => generarContrato(lead.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                            title="Generar contrato"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de detalles */}
        {modalOpen && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Contenido del modal con todos los detalles del lead */}
                <h2 className="text-2xl font-bold mb-4">
                  Detalles completos: {selectedLead.fullName}
                </h2>
                {/* Mostrar toda la información aquí */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}