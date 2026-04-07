"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, UserCheck, UserX, Mail, RefreshCw } from 'lucide-react'

const COLOR_PRESETS = [
  { name: 'Azul', bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', dot: 'bg-blue-500', value: 'blue' },
  { name: 'Verde', bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', dot: 'bg-green-500', value: 'green' },
  { name: 'Morado', bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700', dot: 'bg-purple-500', value: 'purple' },
  { name: 'Rosa', bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-700', dot: 'bg-pink-500', value: 'pink' },
  { name: 'Naranja', bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', dot: 'bg-orange-500', value: 'orange' },
  { name: 'Amarillo', bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700', dot: 'bg-yellow-500', value: 'yellow' },
  { name: 'Rojo', bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700', dot: 'bg-red-500', value: 'red' },
  { name: 'Cian', bg: 'bg-cyan-100', border: 'border-cyan-400', text: 'text-cyan-700', dot: 'bg-cyan-500', value: 'cyan' }
]

export default function AgentsPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAgent, setEditingAgent] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    color: 'green'
  })

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/admin/agents')
      const data = await res.json()
      if (data.success) {
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingAgent ? '/api/admin/agents/update' : '/api/admin/agents/create'
      const method = editingAgent ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAgent ? { ...formData, id: editingAgent.id } : formData)
      })
      const data = await res.json()
      if (data.success) {
        setShowModal(false)
        setEditingAgent(null)
        setFormData({ name: '', email: '', password: '', color: 'green' })
        fetchAgents()
      } else {
        alert(data.error || 'Error al guardar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este asesor?')) return
    try {
      const res = await fetch(`/api/admin/agents/delete?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        fetchAgents()
      } else {
        alert(data.error || 'Error al eliminar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/agents/toggle', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      })
      const data = await res.json()
      if (data.success) {
        fetchAgents()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getColorStyle = (colorValue: string) => {
    return COLOR_PRESETS.find(c => c.value === colorValue) || COLOR_PRESETS[1]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Asesores</h1>
          <p className="text-gray-500">Administra los asesores que atenderán los chats</p>
        </div>
        <button
          onClick={() => {
            setEditingAgent(null)
            setFormData({ name: '', email: '', password: '', color: 'green' })
            setShowModal(true)
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Asesor
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay asesores registrados</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asesor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chats Activos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agents.map((agent) => {
                const colorStyle = getColorStyle(agent.color)
                return (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${colorStyle.bg} flex items-center justify-center`}>
                          <span className={`font-semibold ${colorStyle.text}`}>{agent.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{agent.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {agent.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${colorStyle.dot}`}></div>
                        <span className="text-sm text-gray-600">{colorStyle.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(agent.id, agent.isActive)}
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          agent.isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {agent.isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {agent.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {agent.activeChats || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingAgent(agent)
                            setFormData({
                              name: agent.name,
                              email: agent.email,
                              password: '',
                              color: agent.color || 'green'
                            })
                            setShowModal(true)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(agent.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingAgent ? 'Editar Asesor' : 'Nuevo Asesor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingAgent ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                </label>
                <input
                  type="password"
                  required={!editingAgent}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="grid grid-cols-8 gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-10 h-10 rounded-full ${color.bg} border-2 ${
                        formData.color === color.value ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'
                      } hover:scale-110 transition-all`}
                      title={color.name}
                    >
                      <div className={`w-5 h-5 rounded-full ${color.dot} mx-auto`}></div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingAgent ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}