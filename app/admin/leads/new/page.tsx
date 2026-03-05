"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UserType {
  id: string
  name: string
  email: string
}

export default function NewLeadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [users, setUsers] = useState<UserType[]>([])

  // Estado del formulario
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    estimatedAmount: '',
    creditType: 'TRADITIONAL',
    message: '',
    status: 'PENDING',
    stage: 'INITIAL_CONTACT',
    assignedToId: ''
  })

  // Cargar usuarios para asignación
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/admin/users', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setUsers(data.data || [])
        } else {
          // Datos de ejemplo si la API no existe
          setUsers([
            { id: 'current', name: 'Administrador Actual', email: 'admin@cajavalladolid.com' },
            { id: 'user1', name: 'Asesor de Créditos', email: 'asesor@cajavalladolid.com' },
            { id: 'user2', name: 'Coordinador', email: 'coordinador@cajavalladolid.com' }
          ])
        }
      } catch (error) {
        console.error('Error cargando usuarios:', error)
        setUsers([
          { id: 'current', name: 'Administrador Actual', email: 'admin@cajavalladolid.com' },
          { id: 'user1', name: 'Asesor de Créditos', email: 'asesor@cajavalladolid.com' },
          { id: 'user2', name: 'Coordinador', email: 'coordinador@cajavalladolid.com' }
        ])
      }
    }

    loadUsers()
  }, [])

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-session', {
          credentials: 'include'
        })
        if (!response.ok) {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router])

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Validar formulario
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('El nombre completo es requerido')
      return false
    }
    if (!formData.email.trim()) {
      setError('El email es requerido')
      return false
    }
    if (!formData.phone.trim()) {
      setError('El teléfono es requerido')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email inválido')
      return false
    }
    return true
  }

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          estimatedAmount: parseFloat(formData.estimatedAmount) || 0,
          assignedToId: formData.assignedToId || null
        }),
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('✅ Lead creado exitosamente')
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/admin/leads')
        }, 2000)
      } else {
        setError(data.error || 'Error al crear el lead')
      }
    } catch (error) {
      setError('Error de conexión con el servidor')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                Crear Nuevo Lead
              </h1>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>
                Completa el formulario para registrar un nuevo lead en el sistema
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/leads')}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                fontWeight: '500',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px'
              }}
            >
              <span style={{ fontSize: '18px' }}>✕</span>
              Cancelar
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {success && (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <p style={{ margin: 0 }}>{success}</p>
          </div>
        )}

        {/* Formulario */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Información básica */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>👤</span>
                  Información Básica
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ej: Juan Pérez López"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'border 0.2s'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ 
                        display: 'flex',
                        marginBottom: '8px', 
                        fontWeight: '500', 
                        color: '#374151', 
                        alignItems: 'center', 
                        gap: '6px' 
                      }}>
                        <span style={{ fontSize: '16px' }}>📧</span>
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ejemplo@email.com"
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'flex',
                        marginBottom: '8px', 
                        fontWeight: '500', 
                        color: '#374151', 
                        alignItems: 'center', 
                        gap: '6px' 
                      }}>
                        <span style={{ fontSize: '16px' }}>📱</span>
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ej: 5512345678"
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Información financiera */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>💰</span>
                  Información Financiera
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Monto Estimado (MXN)
                    </label>
                    <input
                      type="number"
                      name="estimatedAmount"
                      value={formData.estimatedAmount}
                      onChange={handleChange}
                      placeholder="Ej: 150000"
                      min="0"
                      step="1000"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Tipo de Crédito
                    </label>
                    <select
                      name="creditType"
                      value={formData.creditType}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="TRADITIONAL">Tradicional</option>
                      <option value="HIPOTECARIO">Hipotecario</option>
                      <option value="AUTOMOTRIZ">Automotriz</option>
                      <option value="NEGOCIOS">Negocios</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Estado y seguimiento */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
                  Estado y Seguimiento
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Estado
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="CONTACTED">Contactado</option>
                      <option value="APPROVED">Aprobado</option>
                      <option value="REJECTED">Rechazado</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Etapa
                    </label>
                    <select
                      name="stage"
                      value={formData.stage}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="INITIAL_CONTACT">Contacto Inicial</option>
                      <option value="DOCUMENTATION">Documentación</option>
                      <option value="REVIEW">Revisión</option>
                      <option value="APPROVAL">Aprobación</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Asignación y mensaje */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📄</span>
                  Información Adicional
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Asignar a
                    </label>
                    <select
                      name="assignedToId"
                      value={formData.assignedToId}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        background: 'white'
                      }}
                    >
                      <option value="">Sin asignar</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                      Mensaje o Notas
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Información adicional, necesidades específicas, comentarios..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        resize: 'vertical',
                        minHeight: '100px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => router.push('/admin/leads')}
                  style={{
                    padding: '14px 28px',
                    background: '#f3f4f6',
                    color: '#374151',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '14px 28px',
                    background: loading ? '#9ca3af' : '#10b981',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '140px',
                    justifyContent: 'center'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Creando...
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '18px' }}>💾</span>
                      Crear Lead
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Notas */}
        <div style={{ marginTop: '24px', padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
          <p style={{ color: '#0369a1', fontSize: '14px', margin: 0 }}>
            💡 <strong>Nota:</strong> Los campos marcados con * son obligatorios. 
            Una vez creado el lead, podrás asignarlo a un asesor y hacer seguimiento desde la lista de leads.
          </p>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          }
        `}</style>
      </div>
    </div>
  )
}