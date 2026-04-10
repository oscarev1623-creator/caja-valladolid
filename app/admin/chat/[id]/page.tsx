"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Send, ArrowLeft, Mail, Phone, CheckCircle, XCircle, Paperclip, FileText, Trash2, Loader2 } from 'lucide-react'

export default function AgentChatPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastMessageCountRef = useRef<number>(0)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasMarkedAsReadRef = useRef<boolean>(false)

  // Función para cargar mensajes
  const loadMessages = useCallback(async (markAsRead = false) => {
    if (!id) return
    
    try {
      const url = markAsRead 
        ? `/api/chat/messages?conversationId=${id}&markAsRead=true`
        : `/api/chat/messages?conversationId=${id}`
      
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      })
      const data = await res.json()
      
      if (data.success) {
        if (JSON.stringify(data.messages) !== JSON.stringify(messages)) {
          console.log('📩 Actualizando mensajes:', data.messages.length)
          setMessages(data.messages)
          lastMessageCountRef.current = data.messages.length
        }
        
        if (data.conversation) {
          setConversation(data.conversation)
        }
        
        if (markAsRead) {
          console.log('✅ Mensajes marcados como leídos')
          hasMarkedAsReadRef.current = true
          localStorage.setItem('chat_refresh', Date.now().toString())
          window.dispatchEvent(new CustomEvent('refreshConversations'))
        }
        
        return true
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
    return false
  }, [id, messages])

  // Cargar conversación inicial y marcar como leída
  useEffect(() => {
    if (id) {
      setLoading(true)
      loadMessages(true).finally(() => setLoading(false))
    }
  }, [id, loadMessages])

  // Marcar como leído al SALIR de la página
  useEffect(() => {
    return () => {
      if (id && hasMarkedAsReadRef.current) {
        console.log('👋 Saliendo de conversación, refrescando lista...')
        fetch(`/api/chat/messages?conversationId=${id}&markAsRead=true`, {
          cache: 'no-store'
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              localStorage.setItem('chat_refresh', Date.now().toString())
              window.dispatchEvent(new CustomEvent('refreshConversations'))
            }
          })
          .catch(err => console.error('Error marking as read on exit:', err))
      }
    }
  }, [id])

  // Polling optimizado - Marcar como leído en cada poll
  useEffect(() => {
    if (!id) return
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
    
    const pollForMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${id}&markAsRead=true`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        const data = await res.json()
        
        if (data.success) {
          const newMessageCount = data.messages.length
          
          if (newMessageCount !== lastMessageCountRef.current) {
            console.log(`📨 Mensajes actualizados: ${newMessageCount} (antes: ${lastMessageCountRef.current})`)
            setMessages(data.messages)
            lastMessageCountRef.current = newMessageCount
            
            if (data.conversation) {
              setConversation(data.conversation)
            }
            
            localStorage.setItem('chat_refresh', Date.now().toString())
            window.dispatchEvent(new CustomEvent('refreshConversations'))
          }
        }
      } catch (error) {
        console.error('Error en polling:', error)
      }
    }
    
    pollingIntervalRef.current = setInterval(pollForMessages, 2000)
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [id])

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !id) return

    const messageText = input.trim()
    setIsSending(true)
    
    const tempMessage = {
      id: `temp-${Date.now()}`,
      message: messageText,
      senderType: 'agent',
      createdAt: new Date().toISOString()
    }
    
    setMessages(prev => {
      const newMessages = [...prev, tempMessage]
      lastMessageCountRef.current = newMessages.length
      return newMessages
    })
    setInput('')

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: id,
          message: messageText,
          senderType: 'agent'
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempMessage.id)
          const newMessages = [...filtered, data.message]
          lastMessageCountRef.current = newMessages.length
          return newMessages
        })
        
        // ✅ SOLO UN DISPARO - Sin setTimeout múltiples
        localStorage.setItem('chat_refresh', Date.now().toString())
        window.dispatchEvent(new CustomEvent('refreshConversations'))
      } else {
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempMessage.id)
          lastMessageCountRef.current = filtered.length
          return filtered
        })
        setInput(messageText)
        alert('Error al enviar mensaje')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== tempMessage.id)
        lastMessageCountRef.current = filtered.length
        return filtered
      })
      setInput(messageText)
      alert('Error al enviar mensaje')
    } finally {
      setIsSending(false)
    }
  }

  const uploadFile = async (file: File) => {
    if (!id) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('conversationId', id)

    try {
      const uploadRes = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData
      })
      const uploadData = await uploadRes.json()

      if (uploadData.success) {
        const tempFileMessage = {
          id: `temp-file-${Date.now()}`,
          message: `📎 ${file.name}`,
          senderType: 'agent',
          fileUrl: uploadData.url,
          fileType: uploadData.fileType,
          fileName: file.name,
          createdAt: new Date().toISOString()
        }
        
        setMessages(prev => {
          const newMessages = [...prev, tempFileMessage]
          lastMessageCountRef.current = newMessages.length
          return newMessages
        })
        
        const sendRes = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: id,
            message: `📎 ${file.name}`,
            senderType: 'agent',
            fileUrl: uploadData.url,
            fileType: uploadData.fileType,
            fileName: file.name
          })
        })
        
        const sendData = await sendRes.json()
        
        if (sendData.success) {
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== tempFileMessage.id)
            const newMessages = [...filtered, sendData.message]
            lastMessageCountRef.current = newMessages.length
            return newMessages
          })
          
          // ✅ SOLO UN DISPARO
          localStorage.setItem('chat_refresh', Date.now().toString())
          window.dispatchEvent(new CustomEvent('refreshConversations'))
        } else {
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== tempFileMessage.id)
            lastMessageCountRef.current = filtered.length
            return filtered
          })
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error al subir archivo')
    } finally {
      setIsUploading(false)
    }
  }

  const closeConversation = async () => {
    if (!confirm('¿Cerrar esta conversación?')) return
    try {
      const res = await fetch('/api/chat/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: id })
      })
      const data = await res.json()
      if (data.success) {
        await loadMessages()
        localStorage.setItem('chat_refresh', Date.now().toString())
        window.dispatchEvent(new CustomEvent('refreshConversations'))
      }
    } catch (error) {
      console.error('Error closing conversation:', error)
    }
  }

  const deleteConversation = async () => {
    if (!confirm('¿Eliminar permanentemente esta conversación? Esta acción no se puede deshacer.')) return
    try {
      const res = await fetch(`/api/chat/delete/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('chat_refresh', Date.now().toString())
        window.dispatchEvent(new CustomEvent('refreshConversations'))
        router.push('/admin/chat')
      } else {
        alert(data.error || 'Error al eliminar la conversación')
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      alert('Error al eliminar')
    }
  }

  const renderFilePreview = (msg: any) => {
    if (!msg.fileUrl) return null
    
    const fileName = msg.fileName || ''
    const isImage = msg.fileType === 'image' || fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    
    if (isImage) {
      return (
        <div className="mt-2">
          <img 
            src={msg.fileUrl} 
            alt={fileName} 
            className="max-w-full rounded-lg max-h-48 object-cover cursor-pointer"
            onClick={() => window.open(msg.fileUrl, '_blank')}
          />
        </div>
      )
    }
    
    return (
      <a 
        href={msg.fileUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-2 flex items-center gap-2 p-2 bg-gray-100 rounded-lg text-sm text-blue-600 hover:bg-gray-200"
      >
        <FileText className="w-4 h-4" />
        <span>{fileName}</span>
      </a>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              fetch(`/api/chat/messages?conversationId=${id}&markAsRead=true`, {
                cache: 'no-store'
              })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    localStorage.setItem('chat_refresh', Date.now().toString())
                    window.dispatchEvent(new CustomEvent('refreshConversations'))
                    setTimeout(() => router.push('/admin/chat'), 100)
                  } else {
                    router.push('/admin/chat')
                  }
                })
                .catch(() => router.push('/admin/chat'))
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{conversation?.userName || conversation?.userEmail}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {conversation?.userEmail}</span>
              {conversation?.userPhone && (
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {conversation?.userPhone}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {conversation?.status === 'active' ? (
            <button
              onClick={closeConversation}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              Cerrar chat
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-sm flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Conversación cerrada
            </span>
          )}
          <button
            onClick={deleteConversation}
            className="px-3 py-1.5 bg-red-700 text-white rounded-lg text-sm hover:bg-red-800 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
              msg.senderType === 'agent'
                ? 'bg-green-600 text-white rounded-br-none'
                : msg.senderType === 'system'
                ? 'bg-gray-200 text-gray-500 italic'
                : 'bg-white text-gray-800 rounded-bl-none shadow'
            }`}>
              {msg.senderType === 'system' && (
                <div className="text-xs mb-1">📢 Sistema</div>
              )}
              {msg.message && <p className="text-sm whitespace-pre-wrap">{msg.message}</p>}
              {renderFilePreview(msg)}
              <div className={`text-[10px] mt-1 ${
                msg.senderType === 'agent' ? 'text-green-200' : 'text-gray-400'
              }`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-end">
            <div className="bg-gray-200 p-3 rounded-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-green-600" />
              <span className="text-sm text-gray-500">Enviando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {conversation?.status === 'active' && (
        <div className="bg-white border-t p-4">
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  uploadFile(e.target.files[0])
                  e.target.value = ''
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
              title="Adjuntar archivo"
              disabled={isUploading || isSending}
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Paperclip className="w-5 h-5" />
              )}
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Escribe tu respuesta..."
              className="flex-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
              rows={2}
              disabled={isSending}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 self-end"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </p>
        </div>
      )}
    </div>
  )
}