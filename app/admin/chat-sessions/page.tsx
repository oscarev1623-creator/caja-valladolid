// app/admin/chat-sessions/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { MessageSquare, User, Search, Calendar, Filter } from 'lucide-react'

// Definir interfaces para los tipos
interface Lead {
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
  source?: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string | Date;
}

interface ChatSession {
  id: string;
  lead?: Lead;
  startedAt: string | Date;
  platform: string;
  messages?: Message[];
  ipAddress?: string;
  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function ChatSessionsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    fetchChatSessions()
  }, [])
  
  const fetchChatSessions = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/chat/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) setSessions(data.sessions)
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
    }
  }
  
  // Filtrar sesiones basado en la búsqueda
  const filteredSessions = sessions.filter(session => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      session.lead?.fullName?.toLowerCase().includes(searchLower) ||
      session.lead?.email?.toLowerCase().includes(searchLower) ||
      session.id?.toLowerCase().includes(searchLower)
    )
  })
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Historial de Chatbot
          </h1>
          <p className="text-gray-600">
            Conversaciones de usuarios con el chatbot del sitio web
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de sesiones */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 mt-3">
                <button className="flex-1 px-3 py-1.5 border rounded-lg text-sm">
                  Hoy
                </button>
                <button className="flex-1 px-3 py-1.5 border rounded-lg text-sm">
                  7 días
                </button>
                <button className="flex-1 px-3 py-1.5 border rounded-lg text-sm">
                  Todo
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {filteredSessions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No hay sesiones disponibles
                </div>
              ) : (
                filteredSessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedSession?.id === session.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-green-800" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {session.lead?.fullName || 'Visitante'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.lead?.email || 'No identificado'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(session.startedAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-700 line-clamp-2">
                      {session.messages?.[0]?.content || 'Sin mensajes'}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {session.platform}
                      </span>
                      <span className="text-xs text-gray-500">
                        {session.messages?.length || 0} mensajes
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Detalle de sesión */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow h-full">
              {selectedSession ? (
                <div className="p-6 h-full flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Conversación con {selectedSession.lead?.fullName || 'Visitante'}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📱 {selectedSession.platform}</span>
                      <span>📅 {new Date(selectedSession.startedAt).toLocaleString()}</span>
                      <span>📍 {selectedSession.ipAddress || 'IP no registrada'}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                    {selectedSession.messages?.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg max-w-[80%] ${
                          msg.role === 'user'
                            ? 'bg-blue-100 ml-auto'
                            : 'bg-gray-100'
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1">
                          {msg.role === 'user' ? 'Usuario' : 'Chatbot'}
                        </div>
                        <p>{msg.content}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedSession.lead && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Información del lead:</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Email:</strong> {selectedSession.lead.email}</p>
                          <p><strong>Teléfono:</strong> {selectedSession.lead.phone}</p>
                        </div>
                        <div>
                          <p><strong>Estado:</strong> {selectedSession.lead.status}</p>
                          <p><strong>Fuente:</strong> {selectedSession.lead.source}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mb-4" />
                  <p>Selecciona una conversación para ver los detalles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}