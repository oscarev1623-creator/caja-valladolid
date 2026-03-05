"use client"

import { useState } from 'react'
import { 
  Clock, Phone, FileText, Check, X, 
  RefreshCw, ArrowRight, AlertCircle, UserCheck
} from 'lucide-react'

interface StatusManagerProps {
  leadIds: string[]
  currentStatus?: string
  onStatusChange: (status: string, notes?: string) => Promise<void>
  disabled?: boolean
}

const statusOptions = [
  {
    value: 'PENDING',
    label: 'Pendiente',
    description: 'Lead en espera de revisión inicial',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    badgeColor: 'bg-yellow-500',
    apiAction: 'PENDING'
  },
  {
    value: 'CONTACTED',
    label: 'Contactado',
    description: 'Cliente ya ha sido contactado',
    icon: Phone,
    color: 'bg-blue-100 text-blue-800',
    badgeColor: 'bg-blue-500',
    apiAction: 'CONTACTED'
  },
  {
    value: 'DOCUMENTATION',
    label: 'Documentación',
    description: 'Esperando documentos del cliente',
    icon: FileText,
    color: 'bg-purple-100 text-purple-800',
    badgeColor: 'bg-purple-500',
    apiAction: 'DOCUMENTATION'
  },
  {
    value: 'UNDER_REVIEW',
    label: 'En Revisión',
    description: 'Documentación en análisis',
    icon: RefreshCw,
    color: 'bg-indigo-100 text-indigo-800',
    badgeColor: 'bg-indigo-500',
    apiAction: 'UNDER_REVIEW'
  },
  {
    value: 'APPROVED',
    label: 'Aprobado',
    description: 'Crédito aprobado',
    icon: Check,
    color: 'bg-green-100 text-green-800',
    badgeColor: 'bg-green-500',
    apiAction: 'APPROVE'
  },
  {
    value: 'REJECTED',
    label: 'Rechazado',
    description: 'Crédito rechazado',
    icon: X,
    color: 'bg-red-100 text-red-800',
    badgeColor: 'bg-red-500',
    apiAction: 'REJECT'
  },
  {
    value: 'ASSIGNED',
    label: 'Asignado',
    description: 'Asignado a ejecutivo',
    icon: UserCheck,
    color: 'bg-cyan-100 text-cyan-800',
    badgeColor: 'bg-cyan-500',
    apiAction: 'ASSIGN'
  }
]

const actionMap: Record<string, string> = {
  'PENDING': 'PENDING',
  'CONTACTED': 'CONTACTED',
  'DOCUMENTATION': 'DOCUMENTATION',
  'UNDER_REVIEW': 'UNDER_REVIEW',
  'APPROVED': 'APPROVE',
  'REJECTED': 'REJECT',
  'ASSIGNED': 'ASSIGN'
}

export default function StatusManager({ 
  leadIds, 
  currentStatus, 
  onStatusChange,
  disabled = false 
}: StatusManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [sendEmail, setSendEmail] = useState(false)
  const [autoAssign, setAutoAssign] = useState(true)

  const handleSubmit = async () => {
    if (!selectedStatus) return
    
    setLoading(true)
    try {
      const apiAction = actionMap[selectedStatus]
      if (!apiAction) {
        throw new Error('Estado no válido')
      }
      
      await onStatusChange(apiAction, notes)
      setSelectedStatus('')
      setNotes('')
    } catch (error) {
      console.error('Error cambiando estado:', error)
      alert('Error al cambiar el estado')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentStatusInfo = () => {
    return statusOptions.find(opt => opt.value === currentStatus)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statusOptions.map((option) => {
          const Icon = option.icon
          const isCurrent = currentStatus === option.value
          
          return (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              disabled={disabled || isCurrent}
              className={`
                relative p-4 rounded-lg border-2 transition-all text-left
                group hover:shadow-md
                ${selectedStatus === option.value 
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                  : isCurrent
                  ? 'border-gray-300 bg-gray-50 opacity-75'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${disabled || isCurrent ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              title={isCurrent ? 'Estado actual' : `Cambiar a ${option.label}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${option.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                </div>
              </div>
              
              {isCurrent && (
                <div className="absolute top-2 right-2">
                  <div className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    Actual
                  </div>
                </div>
              )}
              
              {selectedStatus === option.value && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedStatus && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <ArrowRight className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">
                Cambiar estado a: {
                  statusOptions.find(opt => opt.value === selectedStatus)?.label
                }
              </p>
              <p className="text-sm text-green-600">
                Esta acción afectará a {leadIds.length} {leadIds.length === 1 ? 'lead' : 'leads'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              {showAdvanced ? 'Ocultar opciones' : 'Mostrar opciones avanzadas'}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedStatus('')
                  setNotes('')
                  setShowAdvanced(false)
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !selectedStatus}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  'Cambiar Estado'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}