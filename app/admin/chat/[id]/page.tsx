"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Send, ArrowLeft, Mail, Phone, CheckCircle, XCircle, Paperclip, FileText, Trash2, Loader2, FileCheck, MoreVertical, X } from 'lucide-react'

// 🔗 Función para convertir URLs en enlaces clickeables
const linkify = (text: string, isAgent: boolean) => {
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
          className={`underline hover:opacity-80 break-all ${isAgent ? 'text-green-200' : 'text-blue-600'}`}
        >
          {part}
        </a>
      )
    }
    return <span key={index}>{part}</span>
  })
}

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
  const [isGeneratingDocLink, setIsGeneratingDocLink] = useState(false)
  const [isGeneratingCalculatorLink, setIsGeneratingCalculatorLink] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastMessageCountRef = useRef<number>(0)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasMarkedAsReadRef = useRef<boolean>(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

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
          setMessages(data.messages)
          lastMessageCountRef.current = data.messages.length
        }
        
        if (data.conversation) {
          setConversation(data.conversation)
        }
        
        if (markAsRead) {
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

  useEffect(() => {
    if (id) {
      setLoading(true)
      loadMessages(true).finally(() => setLoading(false))
    }
  }, [id, loadMessages])

  useEffect(() => {
    return () => {
      if (id && hasMarkedAsReadRef.current) {
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

  useEffect(() => {
    if (!id) return
    
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
    
    const pollForMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${id}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        const data = await res.json()
        
        if (data.success) {
          const newMessageCount = data.messages.length
          
          if (newMessageCount !== lastMessageCountRef.current) {
            setMessages(data.messages)
            lastMessageCountRef.current = newMessageCount
            
            if (data.conversation) {
              setConversation(data.conversation)
            }
            
            const hasNewUserMessages = data.messages.some((m: any) => 
              m.senderType === 'user' && !m.isRead
            )
            
            if (hasNewUserMessages) {
              await fetch(`/api/chat/messages?conversationId=${id}&markAsRead=true`)
              localStorage.setItem('chat_refresh', Date.now().toString())
              window.dispatchEvent(new CustomEvent('refreshConversations'))
            }
          }
        }
      } catch (error) {
        console.error('Error en polling:', error)
      }
    }
    
    pollingIntervalRef.current = setInterval(pollForMessages, 3000)
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [id])

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }, 50)
  }, [messages])

  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
      }, 100)
    }
  }, [loading])

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
        const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        
        const tempFileMessage = {
          id: `temp-file-${Date.now()}`,
          message: isImage ? '' : `📎 ${file.name}`,
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
            message: isImage ? '' : `📎 ${file.name}`,
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
    if (!confirm('¿Eliminar permanentemente esta conversación?')) return
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

  const generateDocumentLink = async () => {
    if (!conversation?.userEmail) {
      alert('No hay email asociado a esta conversación')
      return
    }

    setIsGeneratingDocLink(true)
    try {
      const leadsRes = await fetch(`/api/leads?email=${encodeURIComponent(conversation.userEmail)}`)
      const leadsData = await leadsRes.json()
      
      if (!leadsData.success || !leadsData.data?.length) {
        alert('No se encontró un lead asociado a este email')
        return
      }

      const lead = leadsData.data[0]
      const baseUrl = window.location.origin
      
      const linkRes = await fetch('/api/leads/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ leadId: lead.id, baseUrl })
      })
      
      const linkData = await linkRes.json()
      
      if (linkData.success) {
        const documentLink = linkData.data.url
        await navigator.clipboard.writeText(documentLink)
        setInput(documentLink)
        alert('✅ Enlace copiado al input')
      } else {
        alert('Error: ' + (linkData.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error generando enlace:', error)
      alert('Error al generar el enlace')
    } finally {
      setIsGeneratingDocLink(false)
      setShowMenu(false)
    }
  }

  const generateCalculatorLink = async () => {
    if (!conversation?.userEmail) {
      alert('No hay email asociado a esta conversación')
      return
    }

    setIsGeneratingCalculatorLink(true)
    try {
      const leadsRes = await fetch(`/api/leads?email=${encodeURIComponent(conversation.userEmail)}`)
      const leadsData = await leadsRes.json()
      
      if (!leadsData.success || !leadsData.data?.length) {
        alert('No se encontró un lead asociado a este email')
        return
      }

      const lead = leadsData.data[0]
      const baseUrl = window.location.origin
      
      const linkRes = await fetch('/api/leads/generate-calculator-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ leadId: lead.id, baseUrl })
      })
      
      const linkData = await linkRes.json()
      
      if (linkData.success) {
        const calculatorLink = linkData.data.url
        await navigator.clipboard.writeText(calculatorLink)
        setInput(calculatorLink)
        alert('✅ Enlace copiado al input')
      } else {
        alert('Error: ' + (linkData.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error generando enlace:', error)
      alert('Error al generar el enlace')
    } finally {
      setIsGeneratingCalculatorLink(false)
      setShowMenu(false)
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
        <span className="truncate">{fileName}</span>
      </a>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header OPTIMIZADO PARA MÓVIL */}
      <div className="bg-white border-b px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={() => {
              fetch(`/api/chat/messages?conversationId=${id}&markAsRead=true`, { cache: 'no-store' })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    localStorage.setItem('chat_refresh', Date.now().toString())
                    window.dispatchEvent(new CustomEvent('refreshConversations'))
                    router.push('/admin/chat')
                  } else {
                    router.push('/admin/chat')
                  }
                })
                .catch(() => router.push('/admin/chat'))
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-sm truncate">{conversation?.userName || conversation?.userEmail}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="truncate">{conversation?.userEmail}</span>
              {conversation?.userPhone && (
                <span className="shrink-0">{conversation.userPhone}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          {conversation?.status === 'active' && (
            <button
              onClick={closeConversation}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar chat"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
          
          {/* Menú desplegable para más opciones */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={generateDocumentLink}
                    disabled={isGeneratingDocLink}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    {isGeneratingDocLink ? 'Generando...' : 'Enlace Docs'}
                  </button>
                  <button
                    onClick={generateCalculatorLink}
                    disabled={isGeneratingCalculatorLink}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                  >
                    <FileCheck className="w-4 h-4 text-purple-600" />
                    {isGeneratingCalculatorLink ? 'Generando...' : 'Enlace Calc'}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={deleteConversation}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages - OCUPA TODO EL ESPACIO DISPONIBLE */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-3"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-lg ${
              msg.senderType === 'agent'
                ? 'bg-green-600 text-white rounded-br-none'
                : msg.senderType === 'system'
                ? 'bg-gray-200 text-gray-500 italic text-xs'
                : 'bg-white text-gray-800 rounded-bl-none shadow'
            }`}>
              {msg.senderType === 'system' && (
                <div className="text-xs mb-1">📢 Sistema</div>
              )}
              {msg.message && (
                <p className="text-sm whitespace-pre-wrap break-all">
                  {linkify(msg.message, msg.senderType === 'agent')}
                </p>
              )}
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

      {/* Input OPTIMIZADO */}
      {conversation?.status === 'active' && (
        <div className="bg-white border-t p-2 shrink-0">
          <div className="flex items-end gap-2">
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
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
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
              className="flex-1 px-3 py-2 border rounded-xl text-sm focus:ring-1 focus:ring-green-500 focus:border-transparent outline-none resize-none bg-gray-50 max-h-24"
              rows={1}
              disabled={isSending}
              style={{ minHeight: '42px' }}
            />
            
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}