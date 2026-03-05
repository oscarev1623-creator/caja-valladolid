// app/components/admin/LeadCategories.tsx
"use client"

import { useState } from 'react'
import { 
  Users, Phone, FileText, CheckCircle, 
  XCircle, Clock, UserCheck, Filter 
} from 'lucide-react'

interface LeadCategoriesProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  counts: {
    all: number
    pending: number
    contacted: number
    documentation: number
    review: number
    approved: number
    rejected: number
  }
}

export default function LeadCategories({ 
  activeCategory, 
  onCategoryChange,
  counts 
}: LeadCategoriesProps) {
  const categories = [
    {
      id: 'all',
      name: 'Todos los Leads',
      icon: Users,
      color: 'bg-gray-100 text-gray-800',
      count: counts.all,
      description: 'Ver todos los leads'
    },
    {
      id: 'pending',
      name: 'Por Contactar',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800',
      count: counts.pending,
      description: 'Leads nuevos sin contacto'
    },
    {
      id: 'contacted',
      name: 'Contactados',
      icon: Phone,
      color: 'bg-blue-100 text-blue-800',
      count: counts.contacted,
      description: 'Ya se contactó al cliente'
    },
    {
      id: 'documentation',
      name: 'En Documentación',
      icon: FileText,
      color: 'bg-purple-100 text-purple-800',
      count: counts.documentation,
      description: 'Esperando documentos'
    },
    {
      id: 'review',
      name: 'En Revisión',
      icon: Filter,
      color: 'bg-indigo-100 text-indigo-800',
      count: counts.review,
      description: 'Documentación en análisis'
    },
    {
      id: 'approved',
      name: 'Aprobados',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800',
      count: counts.approved,
      description: 'Créditos aprobados'
    },
    {
      id: 'rejected',
      name: 'Rechazados',
      icon: XCircle,
      color: 'bg-red-100 text-red-800',
      count: counts.rejected,
      description: 'Créditos rechazados'
    }
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Categorías de Leads</h2>
        <p className="text-sm text-gray-600">
          Organiza y gestiona por estado del proceso
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = activeCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                relative p-4 rounded-xl border-2 transition-all text-left
                hover:shadow-lg hover:-translate-y-1
                ${isActive 
                  ? 'border-green-500 bg-white shadow-lg ring-2 ring-green-200' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  category.count > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.count}
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 text-sm mb-1">
                {category.name}
              </h3>
              <p className="text-xs text-gray-600">
                {category.description}
              </p>
              
              {isActive && (
                <div className="absolute bottom-2 right-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}