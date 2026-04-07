"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Send, ArrowLeft, User, Mail, Phone, CheckCircle, XCircle, Paperclip, FileText, Trash2, Loader2 } from 'lucide-react'

export default function AgentChatPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string  // 👈 CORREGIDO: obtener el id correctamente
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [conversation, setConversation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cargar conversación inicial y marcar como leída
  useEffect(() => {
    if (id) {
      loadConversation(true)
    }
  }, [id])

  // Polling para nuevos mensajes
  useEffect(() => {
    if (!id) return
    
    const interval = setInterval(() => {
      fetch(`/api/chat/messages?conversationId=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.messages.length !== messages.length) {
            setMessages(data.messages)
          }
        })
        .catch(err => console.error('Error polling:', err))
    }, 3000)
    
    return () => clearInterval(interval)
  }, [id, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversation = async (markAsRead = false) => {
    if (!id) return
    
    setLoading(true)
    try {
      const url = markAsRead 
        ? `/api/chat/messages?conversationId=${id}&markAsRead=true`
        : `/api/chat/messages?conversationId=${id}`
      
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setMessages(data.messages)
        setConversation(data.conversation)
        if (markAsRead) {
          setHasMarkedAsRead(true)
          window.dispatchEvent(new CustomEvent('refreshConversations'))
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !id) return

    setIsSending(true)
    const newMessage = {
      id: Date.now().toString(),
      message: input,
      senderType: 'agent',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, newMessage])
    setInput('')

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: id,
          message: input,
          senderType: 'agent'
        })
      })
      window.dispatchEvent(new CustomEvent('refreshConversations'))
    } catch (error) {
      console.error('Error sending message:', error)
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
          const newMessage = {
            id: sendData.message.id,
            message: `📎 ${file.name}`,
            senderType: 'agent',
            fileUrl: uploadData.url,
            fileType: uploadData.fileType,
            fileName: file.name,
            createdAt: new Date().toISOString()
          }
          setMessages(prev => [...prev, newMessage])
          window.dispatchEvent(new CustomEvent('refreshConversations'))
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const closeConversation = async () => {
    if (!confirm('¿Cerrar esta conversación?')) return
    try {
      await fetch('/api/chat/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: id })
      })
      loadConversation()
    } catch (error) {
      console.error('Error closing conversation:', error)
    }
  }

const deleteConversation = async () => {
  if (!confirm('¿Eliminar permanentemente esta conversación? Esta acción no se puede deshacer.')) return
  try {
    const res = await fetch(`/api/chat/delete?id=${id}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if (data.success) {
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
    const isPDF = msg.fileType === 'pdf' || fileName.endsWith('.pdf')
    
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
            onClick={() => router.push('/admin/chat')}
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
              {msg.message && <p className="text-sm">{msg.message}</p>}
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
              disabled={isUploading}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Escribe tu respuesta..."
              className="flex-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
              rows={2}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 self-end"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          {isUploading && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Subiendo archivo...
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </p>
        </div>
      )}
    </div>
  )
}