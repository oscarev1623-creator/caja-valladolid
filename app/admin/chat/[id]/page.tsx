"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Send, ArrowLeft, CheckCircle, XCircle, Paperclip, FileText, Trash2, 
  Loader2, FileCheck, MoreVertical, Phone, Mail, MessageCircle 
} from 'lucide-react'

// 🔗 Función linkify (optimizada)
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
  className={`underline decoration-2 underline-offset-2 hover:opacity-80 break-all font-medium ${isAgent ? 'text-blue-700' : 'text-blue-600'}`}
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
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const loadMessages = useCallback(async (markAsRead = false) => {
    if (!id) return
    
    try {
      
      const url = markAsRead 
        ? `/api/chat/messages?conversationId=${id}&markAsRead=true`
        : `/api/chat/messages?conversationId=${id}`
      
      const res = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      const data = await res.json()
      
      if (data.success) {
        if (JSON.stringify(data.messages) !== JSON.stringify(messages)) {
          setMessages(data.messages)
          lastMessageCountRef.current = data.messages.length
        }
        if (data.conversation) setConversation(data.conversation)
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
        fetch(`/api/chat/messages?conversationId=${id}&markAsRead=true`, { cache: 'no-store' })
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
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    
    const pollForMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${id}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
        const data = await res.json()
        
        if (data.success) {
          const newMessageCount = data.messages.length
          if (newMessageCount !== lastMessageCountRef.current) {
            setMessages(data.messages)
            lastMessageCountRef.current = newMessageCount
            if (data.conversation) setConversation(data.conversation)
            
            const hasNewUserMessages = data.messages.some((m: any) => m.senderType === 'user' && !m.isRead)
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
    return () => clearInterval(pollingIntervalRef.current!)
  }, [id])

  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }), 50)
  }, [messages])

  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }), 100)
    }
  }, [loading])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const handleFocus = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const sendMessage = async () => {
    if (!input.trim() || !id) return
    const messageText = input.trim()
    setIsSending(true)
    
    const tempMessage = { id: `temp-${Date.now()}`, message: messageText, senderType: 'agent', createdAt: new Date().toISOString() }
    setMessages(prev => [...prev, tempMessage])
    lastMessageCountRef.current = messages.length + 1
    setInput('')

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: id, message: messageText, senderType: 'agent' })
      })
      const data = await res.json()
      
      if (data.success) {
        setMessages(prev => { const filtered = prev.filter(m => m.id !== tempMessage.id); return [...filtered, data.message] })
        lastMessageCountRef.current = data.messages?.length || messages.length
        localStorage.setItem('chat_refresh', Date.now().toString())
        window.dispatchEvent(new CustomEvent('refreshConversations'))
      } else {
        setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
        setInput(messageText)
        alert('Error al enviar mensaje')
      }
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
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
      const uploadRes = await fetch('/api/chat/upload', { method: 'POST', body: formData })
      const uploadData = await uploadRes.json()
      if (uploadData.success) {
        const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
        const sendRes = await fetch('/api/chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: id, message: isImage ? '' : `📎 ${file.name}`, senderType: 'agent', fileUrl: uploadData.url, fileType: uploadData.fileType, fileName: file.name })
        })
        const sendData = await sendRes.json()
        if (sendData.success) {
          setMessages(prev => [...prev, sendData.message])
          localStorage.setItem('chat_refresh', Date.now().toString())
          window.dispatchEvent(new CustomEvent('refreshConversations'))
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
      await fetch('/api/chat/close', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ conversationId: id }) })
      await loadMessages()
      localStorage.setItem('chat_refresh', Date.now().toString())
      window.dispatchEvent(new CustomEvent('refreshConversations'))
    } catch (error) {
      console.error('Error closing conversation:', error)
    }
  }

  const deleteConversation = async () => {
    if (!confirm('¿Eliminar permanentemente?')) return
    try {
      const res = await fetch(`/api/chat/delete/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('chat_refresh', Date.now().toString())
        window.dispatchEvent(new CustomEvent('refreshConversations'))
        router.push('/admin/chat')
      } else {
        alert(data.error || 'Error al eliminar')
      }
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const generateDocumentLink = async () => {
    if (!conversation?.userEmail) return alert('No hay email asociado')
    setIsGeneratingDocLink(true)
    try {
      const leadsRes = await fetch(`/api/leads?email=${encodeURIComponent(conversation.userEmail)}`)
      const leadsData = await leadsRes.json()
      if (!leadsData.success || !leadsData.data?.length) return alert('Lead no encontrado')
      
      const lead = leadsData.data[0]
      const linkRes = await fetch('/api/leads/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ leadId: lead.id, baseUrl: window.location.origin })
      })
      const linkData = await linkRes.json()
      if (linkData.success) {
        await navigator.clipboard.writeText(linkData.data.url)
        setInput(linkData.data.url)
        alert('✅ Enlace copiado al input')
      } else {
        alert('Error: ' + linkData.error)
      }
    } catch (error) {
      alert('Error al generar enlace')
    } finally {
      setIsGeneratingDocLink(false)
      setShowMenu(false)
    }
  }

  const generateCalculatorLink = async () => {
    if (!conversation?.userEmail) return alert('No hay email asociado')
    setIsGeneratingCalculatorLink(true)
    try {
      const leadsRes = await fetch(`/api/leads?email=${encodeURIComponent(conversation.userEmail)}`)
      const leadsData = await leadsRes.json()
      if (!leadsData.success || !leadsData.data?.length) return alert('Lead no encontrado')
      
      const lead = leadsData.data[0]
      const linkRes = await fetch('/api/leads/generate-calculator-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ leadId: lead.id, baseUrl: window.location.origin })
      })
      const linkData = await linkRes.json()
      if (linkData.success) {
        await navigator.clipboard.writeText(linkData.data.url)
        setInput(linkData.data.url)
        alert('✅ Enlace copiado al input')
      } else {
        alert('Error: ' + linkData.error)
      }
    } catch (error) {
      alert('Error al generar enlace')
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
      <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-2 flex items-center gap-2 p-2 bg-gray-100 rounded-lg text-sm text-blue-600 hover:bg-gray-200">
        <FileText className="w-4 h-4" />
        <span className="truncate">{fileName}</span>
      </a>
    )
  }

  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-[#f0f2f5]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-[#f0f2f5] fixed inset-0 md:relative">
      {/* Header - Estilo WhatsApp */}
      <div className="bg-[#075e54] text-white px-3 py-2 flex items-center justify-between shrink-0 safe-top">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button onClick={() => router.push('/admin/chat')} className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="min-w-0 flex-1">
            <h1 className="font-medium text-base truncate">{conversation?.userName || conversation?.userEmail}</h1>
            <p className="text-xs text-white/70 truncate flex items-center gap-1">
              {conversation?.userPhone && <><Phone className="w-3 h-3" /> {conversation.userPhone}</>}
              {conversation?.userPhone && conversation?.userEmail && <span className="mx-1">•</span>}
              {conversation?.userEmail && <><Mail className="w-3 h-3" /> {conversation.userEmail}</>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-0.5 shrink-0">
          {conversation?.status === 'active' && (
            <button onClick={closeConversation} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Cerrar chat">
              <XCircle className="w-5 h-5" />
            </button>
          )}
          
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            
{showMenu && (
  <>
    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
      <button 
        onClick={generateDocumentLink} 
        disabled={isGeneratingDocLink} 
        className="w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50"
      >
        <FileText className="w-4 h-4 text-blue-600" />
        {isGeneratingDocLink ? 'Generando...' : 'Enlace Docs'}
      </button>
      <button 
        onClick={generateCalculatorLink} 
        disabled={isGeneratingCalculatorLink} 
        className="w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-50 flex items-center gap-3 disabled:opacity-50"
      >
        <FileCheck className="w-4 h-4 text-purple-600" />
        {isGeneratingCalculatorLink ? 'Generando...' : 'Enlace Calc'}
      </button>
      <hr className="my-1" />
      <button 
        onClick={deleteConversation} 
        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
      >
        <Trash2 className="w-4 h-4" />
        Eliminar conversación
      </button>
    </div>
  </>
)}
          </div>
        </div>
      </div>

      {/* Messages - SCROLL ULTRA FLUIDO */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2 overscroll-contain"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p>No hay mensajes aún</p>
              <p className="text-xs mt-1">Envía un mensaje para comenzar</p>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3.5 py-2 rounded-lg ${
              msg.senderType === 'agent'
                ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none'
                : msg.senderType === 'system'
                ? 'bg-gray-200 text-gray-600 italic text-xs text-center w-full max-w-full'
                : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
            }`}>
              {msg.senderType === 'system' && <div className="text-xs mb-1">📢 Sistema</div>}
              {msg.message && <p className="text-sm whitespace-pre-wrap break-all">{linkify(msg.message, msg.senderType === 'agent')}</p>}
              {renderFilePreview(msg)}
              <div className={`text-[11px] mt-1 ${msg.senderType === 'agent' ? 'text-gray-500' : 'text-gray-400'} flex items-center gap-1`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.senderType === 'agent' && <CheckCircle className="w-3 h-3 text-gray-400" />}
              </div>
            </div>
          </div>
        ))}
        
        {isSending && (
          <div className="flex justify-end">
            <div className="bg-[#d9fdd3] px-3.5 py-2 rounded-lg rounded-tr-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">Enviando...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Estilo WhatsApp */}
      {conversation?.status === 'active' && (
        <div className="bg-white border-t border-gray-200 p-2 shrink-0 safe-bottom">
          <div className="flex items-end gap-2">
            <input type="file" ref={fileInputRef} accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { uploadFile(e.target.files[0]); e.target.value = '' } }} />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors shrink-0" disabled={isUploading || isSending}>
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
            </button>
            
            <div className="flex-1 bg-gray-100 rounded-3xl px-4 py-2">
              <textarea
               ref={inputRef}
               onFocus={handleFocus} 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Escribe un mensaje"
                className="w-full bg-transparent text-sm outline-none resize-none placeholder-gray-500"
                rows={1}
                disabled={isSending}
              />
            </div>
            
            <button onClick={sendMessage} disabled={!input.trim() || isSending} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors disabled:opacity-40 shrink-0">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}