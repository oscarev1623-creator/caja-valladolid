"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, X, Send, User, Mail, Phone, 
  Minimize2, Paperclip, FileText, Loader2
} from 'lucide-react'

function getAgentGradient(color: string | undefined) {
  const gradients: Record<string, string> = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-emerald-600',
    purple: 'from-purple-600 to-indigo-600',
    pink: 'from-pink-600 to-rose-600',
    orange: 'from-orange-600 to-amber-600',
    yellow: 'from-yellow-600 to-amber-600',
    red: 'from-red-600 to-rose-600',
    cyan: 'from-cyan-600 to-teal-600',
    lime: 'from-lime-600 to-green-600'
  }
  return gradients[color || 'green'] || 'from-green-600 to-emerald-600'
}

const linkify = (text: string, isUser: boolean) => {
  if (!text) return text
  
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g
  const parts = text.split(urlRegex)
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const href = part.startsWith('www.') ? `https://${part}` : part
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline decoration-2 underline-offset-2 hover:opacity-80 break-all ${isUser ? 'text-white font-medium' : 'text-blue-600 font-medium'}`}
        >
          {part}
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [step, setStep] = useState<'form' | 'chat'>('form')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [assignedAgent, setAssignedAgent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingConversation, setIsLoadingConversation] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
// ✅ Función para auto-iniciar conversación
const autoStartConversation = async (name: string, email: string) => {
  console.log('🚀 Auto-iniciando conversación para:', email)
  
  setIsLoading(true)
  try {
    // 1. Iniciar conversación
    const res = await fetch('/api/chat/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone: '' })
    })
    const data = await res.json()
    
    console.log('📦 Start response:', data)

    if (data.success && data.conversationId) {
      setConversationId(data.conversationId)
      localStorage.setItem('chat_conversation_id', data.conversationId)
      
      // 2. Asignar asesor
      try {
        const assignRes = await fetch('/api/chat/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: data.conversationId })
        })
        const assignData = await assignRes.json()
        if (assignData.success && assignData.agent) {
          setAssignedAgent(assignData.agent)
        }
      } catch (err) {
        console.error('Error asignando:', err)
      }
      
      // 3. Ir al chat DIRECTAMENTE
      setStep('chat')
      setMessages([{
        id: 'welcome',
        message: `Hola ${name}, ¡bienvenido! Un asesor te atenderá en breve.`,
        senderType: 'system',
        createdAt: new Date().toISOString()
      }])
    }
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    setIsLoading(false)
  }
}
  // ✅ Detectar token en URL al cargar la página
// ✅ Detectar parámetros en URL y AUTO-INICIAR conversación
// ✅ Detectar parámetros en URL y AUTO-INICIAR conversación
// ✅ Detectar parámetros en URL y AUTO-INICIAR conversación
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const chatName = urlParams.get('chat_name')
  const chatEmail = urlParams.get('chat_email')
  
  if (chatName && chatEmail) {
    console.log('📧 Abriendo chat desde correo para:', chatEmail)
    
    // Pre-llenar formulario
    setFormData({
      name: chatName,
      email: chatEmail,
      phone: ''
    })
    
    // Guardar en localStorage
    localStorage.setItem('chat_user_name', chatName)
    localStorage.setItem('chat_user_email', chatEmail)
    
    // Abrir el chat
    setIsOpen(true)
    
    // 🚀 AUTO-INICIAR conversación automáticamente (sin que el usuario haga clic)
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent
      startConversation(fakeEvent)
    }, 500)
    
    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}, [])

  // ✅ Cargar datos guardados
  useEffect(() => {
    const savedName = localStorage.getItem('chat_user_name')
    const savedEmail = localStorage.getItem('chat_user_email')
    const savedPhone = localStorage.getItem('chat_user_phone')
    
    if (savedName && savedEmail) {
      setFormData({
        name: savedName,
        email: savedEmail,
        phone: savedPhone || ''
      })
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const savedId = localStorage.getItem('chat_conversation_id')
    if (savedId && !conversationId) {
      loadConversation(savedId)
      setIsOpen(true)
    }
  }, [])

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true)
      setIsLoadingConversation(true)
    }
    window.addEventListener('openChat', handleOpenChat)
    return () => window.removeEventListener('openChat', handleOpenChat)
  }, [])

  useEffect(() => {
    const handleReloadConversation = async () => {
      const savedId = localStorage.getItem('chat_conversation_id')
      if (savedId) {
        await loadConversation(savedId)
        setIsLoadingConversation(false)
      }
    }
    window.addEventListener('reloadConversation', handleReloadConversation)
    return () => window.removeEventListener('reloadConversation', handleReloadConversation)
  }, [])

 const loadConversation = async (id: string) => {
  try {
    const res = await fetch(`/api/chat/messages?conversationId=${id}`)
    const data = await res.json()
    
    if (data.success) {
      setConversationId(id)
      setMessages(data.messages)
      setStep('chat')
      if (data.conversation?.assignedTo) {
        setAssignedAgent(data.conversation.assignedTo)
      }
    } else if (data.error === 'Conversation not found') {
      // ✅ Si la conversación no existe, limpiar el ID inválido
      console.log('🗑️ Conversación no encontrada, limpiando ID inválido')
      localStorage.removeItem('chat_conversation_id')
      setConversationId(null)
      setStep('form')
    }
  } catch (error) {
    console.error('Error loading conversation:', error)
  }
}

  // ✅ Iniciar conversación automáticamente con los datos del lead
  const startConversationAutomatically = async (lead: any) => {
    if (!lead || !lead.email || !lead.name) return
    
    console.log('🚀 Iniciando conversación automática para:', lead.email)
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone || ''
        })
      })
      const data = await res.json()

      if (data.success) {
        setConversationId(data.conversationId)
        localStorage.setItem('chat_conversation_id', data.conversationId)
        
        const assignRes = await fetch('/api/chat/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: data.conversationId })
        })
        const assignData = await assignRes.json()
        if (assignData.success) setAssignedAgent(assignData.agent)
        
        setStep('chat')
        setMessages([{
          id: 'welcome',
          message: `Hola ${lead.name}, ¡bienvenido de nuevo! Tu asesor te atenderá en breve.`,
          senderType: 'system',
          createdAt: new Date().toISOString()
        }])
      }
    } catch (error) {
      console.error('Error iniciando conversación automática:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const startConversation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    setIsLoading(true)
    try {
      localStorage.setItem('chat_user_name', formData.name)
      localStorage.setItem('chat_user_email', formData.email)
      localStorage.setItem('chat_user_phone', formData.phone)

      const leadResponse = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          estimatedAmount: 0,
          creditType: 'TRADITIONAL',
          status: 'PENDING_CONTACT',
          message: `Cliente inició conversación por chat. Teléfono: ${formData.phone || 'No proporcionado'}`
        })
      })

      const leadData = await leadResponse.json()
      
      let documentLink = ''
      if (leadData.success && leadData.data?.id) {
        try {
          const baseUrl = window.location.origin
          const ticketRes = await fetch('/api/leads/generate-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ leadId: leadData.data.id, baseUrl })
          })
          const ticketData = await ticketRes.json()
          if (ticketData.success) documentLink = ticketData.data.url
        } catch (err) {}
      }
      
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead')
      }

      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      })
      const data = await res.json()

      if (data.success) {
        setConversationId(data.conversationId)
        localStorage.setItem('chat_conversation_id', data.conversationId)
        
        const assignRes = await fetch('/api/chat/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: data.conversationId })
        })
        const assignData = await assignRes.json()
        if (assignData.success) setAssignedAgent(assignData.agent)
        
        setStep('chat')
        setMessages([{
          id: 'welcome',
          message: `Hola ${formData.name}, ¡bienvenido! Un asesor te atenderá en breve.`,
          senderType: 'system',
          createdAt: new Date().toISOString()
        }])
        
        if (documentLink) {
          await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversationId: data.conversationId,
              message: `📎 Enlace para subir documentos: ${documentLink}`,
              senderType: 'system'
            })
          })
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return

    const newMessage = {
      id: Date.now().toString(),
      message: input,
      senderType: 'user',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMessage])
    setInput('')

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          message: input,
          senderType: 'user'
        })
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const uploadFile = async (file: File) => {
    if (!conversationId) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('conversationId', conversationId)

    try {
      const uploadRes = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData
      })
      const uploadData = await uploadRes.json()
      
      if (uploadData.success) {
        const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        
        const sendRes = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            message: isImage ? '' : `📎 ${file.name}`,
            senderType: 'user',
            fileUrl: uploadData.url,
            fileType: uploadData.fileType,
            fileName: file.name
          })
        })
        
        const sendData = await sendRes.json()
        
        if (sendData.success) {
          const newMessage = {
            id: sendData.message.id,
            message: isImage ? '' : `📎 ${file.name}`,
            senderType: 'user',
            fileUrl: uploadData.url,
            fileType: uploadData.fileType,
            fileName: file.name,
            createdAt: new Date().toISOString()
          }
          setMessages(prev => [...prev, newMessage])
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (!conversationId || step !== 'chat') return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`)
        const data = await res.json()
        if (data.success && data.messages.length > messages.length) {
          setMessages(data.messages)
        }
      } catch (error) {
        console.error('Error polling messages:', error)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [conversationId, messages.length, step])

  const renderFilePreview = (msg: any) => {
    if (!msg.fileUrl) return null
    
    const fileName = msg.fileName || ''
    const isImage = msg.fileType === 'image' || fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    const isPDF = msg.fileType === 'pdf' || fileName.endsWith('.pdf')
    
    if (isImage) {
      return (
        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block">
          <img 
            src={msg.fileUrl} 
            alt={msg.fileName || 'Imagen'} 
            className="max-w-full rounded-lg max-h-36 object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />
        </a>
      )
    }
    
    return (
      <a 
        href={msg.fileUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-2 flex items-center gap-2 p-2 bg-gray-100 rounded-lg text-xs text-blue-600 hover:bg-gray-200 transition-colors"
      >
        {isPDF ? <FileText className="w-4 h-4" /> : <Paperclip className="w-4 h-4" />}
        <span className="truncate flex-1">{msg.fileName || 'Documento'}</span>
      </a>
    )
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-50 md:w-[380px] md:h-[550px] bg-white md:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
      >
        <div className={`bg-gradient-to-r ${getAgentGradient(assignedAgent?.color)} px-4 py-3 flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm md:text-base">Soporte en línea</h3>
              {assignedAgent ? (
                <p className="text-xs text-white/80">Asignado a: {assignedAgent.name}</p>
              ) : (
                <p className="text-xs text-white/80">Te atenderemos en breve</p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <Minimize2 className="w-4 h-4 text-white" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 flex flex-col min-h-0">
              {step === 'form' ? (
                isLoadingConversation ? (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-600 border-t-transparent mx-auto mb-3"></div>
                      <p className="text-gray-500 text-sm">Conectando con tu asesor...</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col justify-center">
                    <div className="text-center mb-4 md:mb-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                      </div>
                      <h4 className="font-bold text-base md:text-lg">¿Necesitas ayuda?</h4>
                      <p className="text-xs md:text-sm text-gray-500">Déjanos tus datos y te contactamos</p>
                    </div>
                    <form onSubmit={startConversation} className="space-y-3">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Tu nombre *" 
                          value={formData.name} 
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                          required 
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="email" 
                          placeholder="Tu correo *" 
                          value={formData.email} 
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                          required 
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="tel" 
                          placeholder="Tu teléfono" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
                      >
                        {isLoading ? 'Conectando...' : 'Iniciar conversación'}
                      </button>
                    </form>
                  </div>
                )
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${msg.senderType === 'user' ? 'bg-green-600 text-white rounded-br-none' : msg.senderType === 'system' ? 'bg-gray-100 text-gray-500 italic' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                          {linkify(msg.message, msg.senderType === 'user')}
                          {renderFilePreview(msg)}
                          <div className={`text-[10px] mt-1 ${msg.senderType === 'user' ? 'text-green-200' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isUploading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                          <span className="text-xs text-gray-500">Subiendo...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-t p-3 flex gap-2 bg-gray-50 shrink-0">
                    <input type="file" ref={fileInputRef} accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { uploadFile(e.target.files[0]); e.target.value = '' } }} />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Escribe tu mensaje..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white" />
                    <button onClick={sendMessage} disabled={!input.trim()} className="bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-2 border-t text-center shrink-0">
              <p className="text-[10px] text-gray-400">💾 Tus mensajes se guardan</p>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}