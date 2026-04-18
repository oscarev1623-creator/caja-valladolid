"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Plus, Edit, Trash2, RefreshCw,
  Mail, User, Calendar, XCircle, Search
} from 'lucide-react'

interface Admin {
  id: string
  name: string
  email: string
  createdAt: string
}

export default function UsersPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [search, setSearch] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      const data = await response.json()
      if (data.success) {
        setAdmins(data.data)
        setFilteredAdmins(data.data)
      } else {
        setError(data.error || 'Error al cargar administradores')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  useEffect(() => {
    if (search.trim()) {
      const lower = search.toLowerCase()
      setFilteredAdmins(admins.filter(a => 
        a.name.toLowerCase().includes(lower) || 
        a.email.toLowerCase().includes(lower)
      ))
    } else {
      setFilteredAdmins(admins)
    }
  }, [search, admins])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingAdmin
        ? `/api/admin/users/${editingAdmin.id}`
        : '/api/admin/users'
      
      const method = editingAdmin ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        alert(editingAdmin ? '✅ Administrador actualizado' : '✅ Administrador creado')
        setShowModal(false)
        setEditingAdmin(null)
        setFormData({ name: '', email: '', password: '' })
        fetchAdmins()
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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este administrador?')) return

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        alert('✅ Administrador eliminado')
        fetchAdmins()
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error de conexión')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && admins.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              Administradores
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Total: {admins.length} administradores
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={fetchAdmins}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            <button
              onClick={() => {
                setEditingAdmin(null)
                setFormData({ name: '', email: '', password: '' })
                setShowModal(true)
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm flex-1 sm:flex-none justify-center"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Administrador</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Lista de admins */}
        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
        ) : admins.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay administradores</h3>
            <p className="text-gray-600">Crea el primer administrador para comenzar.</p>
          </div>
        ) : (
          <>
            {/* Versión Desktop - Tabla */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-800 font-medium">
                                {admin.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">{admin.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a href={`mailto:${admin.email}`} className="text-blue-600 hover:underline">
                            {admin.email}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(admin.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingAdmin(admin)
                                setFormData({
                                  name: admin.name,
                                  email: admin.email,
                                  password: ''
                                })
                                setShowModal(true)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(admin.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Versión Móvil - Cards */}
            <div className="md:hidden space-y-3">
              {filteredAdmins.map((admin) => (
                <div key={admin.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-800 font-medium text-lg">
                          {admin.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                        <a href={`mailto:${admin.email}`} className="text-sm text-blue-600">
                          {admin.email}
                        </a>
                        <p className="text-xs text-gray-500 mt-1">
                          Creado: {formatDate(admin.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingAdmin(admin)
                          setFormData({
                            name: admin.name,
                            email: admin.email,
                            password: ''
                          })
                          setShowModal(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal para crear/editar */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {editingAdmin ? 'Editar' : 'Nuevo Administrador'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <XCircle className="w-5 h-5 md:w-6 md:h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="admin@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña {editingAdmin && '(dejar en blanco para no cambiar)'}
                  </label>
                  <input
                    type="password"
                    required={!editingAdmin}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm md:text-base"
                  >
                    {loading ? 'Guardando...' : (editingAdmin ? 'Actualizar' : 'Crear')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm md:text-base"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}