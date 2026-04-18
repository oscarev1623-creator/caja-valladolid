"use client"

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, User, Clock, CheckCircle, ArrowLeft, Users, Filter, X, Trash2, RefreshCw, Search } from 'lucide-react'

export default function AdminChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<any[]>([])
  const [filteredConversations, setFilteredConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingChat, setCreatingChat] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string>('all')
  const [agents, setAgents] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date())
  const [isPolling, setIsPolling] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const leadId = searchParams?.get('leadId') || null
  const leadEmail = searchParams?.get('email') || null
  const leadName = searchParams?.get('name') || null
  const leadPhone = searchParams?.get('phone') || null

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chat_refresh') {
        console.log('💥 ACTUALIZACIÓN NUCLEAR DETECTADA');
        fetchConversations(true);
        setForceUpdate(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const handleRefresh = () => {
      console.log('🔄 Evento refresh recibido');
      fetchConversations(true);
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('refreshConversations', handleRefresh);
    window.addEventListener('focus', handleRefresh);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('refreshConversations', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, []);

  useEffect(() => {
    fetchConversations();
    fetchAgents();
    
    pollingIntervalRef.current = setInterval(() => {
      fetchConversations(true);
    }, 2000);
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let filtered = [...conversations].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    if (search.trim()) {
      const lower = search.toLowerCase()
      filtered = filtered.filter(c => 
        (c.userName || '').toLowerCase().includes(lower) ||
        (c.userEmail || '').toLowerCase().includes(lower) ||
        (c.userPhone || '').includes(lower)
      )
    }
    
    if (selectedAgent !== 'all') {
      filtered = filtered.filter(conv => conv.assignedTo?.id === selectedAgent);
    }
    
    setFilteredConversations(filtered);
    
    const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
    setUnreadCount(totalUnread);
    
    if (totalUnread > 0) {
      document.title = `(${totalUnread}) Conversaciones - Caja Valladolid`;
    } else {
      document.title = 'Conversaciones - Caja Valladolid';
    }
  }, [conversations, selectedAgent, forceUpdate, search]);

  useEffect(() => {
    if (leadId && leadEmail && !creatingChat) {
      openOrCreateConversation();
    }
  }, [leadId, leadEmail]);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/admin/agents');
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const openOrCreateConversation = async () => {
    setCreatingChat(true);
    try {
      const res = await fetch(`/api/chat/find-by-email?email=${encodeURIComponent(leadEmail || '')}`);
      const data = await res.json();
      
      if (data.success && data.conversationId) {
        router.push(`/admin/chat/${data.conversationId}`);
      } else {
        const createRes = await fetch('/api/chat/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: leadName || 'Cliente',
            email: leadEmail,
            phone: leadPhone || ''
          })
        });
        const createData = await createRes.json();
        
        if (createData.success) {
          await fetch('/api/chat/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId: createData.conversationId })
          });
          
          router.push(`/admin/chat/${createData.conversationId}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCreatingChat(false);
    }
  };

  const fetchConversations = async (silent = false) => {
    if (!silent) {
      setIsPolling(true);
    }
    
    try {
      const res = await fetch('/api/chat/conversations', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await res.json();
      
      if (data.success) {
        setConversations(data.conversations);
        setLastRefreshTime(new Date());
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      if (!silent) {
        setIsPolling(false);
      }
    }
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('¿Eliminar esta conversación permanentemente?')) return;
    
    try {
      const res = await fetch(`/api/chat/delete/${id}`, { method: 'DELETE' })
      const data = await res.json();
      if (data.success) {
        fetchConversations();
        localStorage.setItem('chat_refresh', Date.now().toString());
        window.dispatchEvent(new CustomEvent('refreshConversations'));
      } else {
        alert(data.error || 'Error al eliminar la conversación');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Error al eliminar');
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Activo</span>
    }
    return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Cerrado</span>
  };

  const getAgentColor = (color: string | undefined) => {
    const colors: Record<string, string> = {
      blue: '#3b82f6',
      green: '#10b981',
      purple: '#8b5cf6',
      pink: '#ec4899',
      orange: '#f97316',
      yellow: '#eab308',
      red: '#ef4444',
      cyan: '#06b6d4',
      lime: '#84cc16'
    };
    return colors[color || 'green'] || '#10b981';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/leads')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              Conversaciones
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-xs">
              Actualización cada 2s • {lastRefreshTime.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              fetchConversations(false);
              setForceUpdate(prev => prev + 1);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {creatingChat && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg text-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent inline-block mr-2"></div>
          <span className="text-blue-700 text-sm">Creando conversación...</span>
        </div>
      )}

      {/* Búsqueda en móvil */}
      <div className="mb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white rounded-xl shadow p-3 md:p-4 mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtrar por asesor:</span>
          </div>
          {selectedAgent !== 'all' && (
            <button
              onClick={() => setSelectedAgent('all')}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Limpiar
            </button>
          )}
        </div>
        
        {/* Búsqueda desktop */}
        <div className="hidden md:block mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedAgent('all')}
            className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition-all ${
              selectedAgent === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Todos ({conversations.length})
              {unreadCount > 0 && selectedAgent === 'all' && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
          {agents.map((agent) => {
            const agentConversations = conversations.filter(c => c.assignedTo?.id === agent.id);
            const agentUnread = agentConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
            const agentColor = getAgentColor(agent.color);
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition-all flex items-center gap-1 ${
                  selectedAgent === agent.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedAgent === agent.id ? { backgroundColor: agentColor } : {}}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: agentColor }}
                />
                {agent.name} ({agentConversations.length})
                {agentUnread > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                    {agentUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {search ? 'No se encontraron conversaciones' : 
               selectedAgent !== 'all' ? 'No hay conversaciones para este asesor' : 
               'No hay conversaciones aún'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <Link
                  href={`/admin/chat/${conv.id}`}
                  className={`block p-3 md:p-4 hover:bg-gray-50 transition-colors ${
                    conv.unreadCount > 0 ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1">
                            <span className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
                            <span className="relative w-3 h-3 bg-red-500 rounded-full"></span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 flex items-center gap-2 text-sm md:text-base truncate">
                          {conv.userName || conv.userEmail}
                          {conv.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 truncate">{conv.userEmail}</p>
                        {conv.userPhone && (
                          <p className="text-xs text-gray-400">{conv.userPhone}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <div className="mb-1">{getStatusBadge(conv.status)}</div>
                      <p className="text-xs text-gray-400">
                        {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  {conv.lastMessage && (
                    <p className={`text-xs md:text-sm mt-2 truncate pl-12 md:pl-15 ${
                      conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                      {conv.lastMessage}
                    </p>
                  )}
                </Link>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}