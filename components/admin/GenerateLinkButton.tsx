"use client"

import { useState } from 'react'
import { Copy, Link as LinkIcon, Mail, MessageSquare, ExternalLink, CheckCircle, RefreshCw } from 'lucide-react'

interface GenerateLinkButtonProps {
  leadId: string
  leadName: string
  leadEmail?: string
  onLinkGenerated?: (data: any) => void
  className?: string
}

export default function GenerateLinkButton({ 
  leadId, 
  leadName,
  leadEmail,
  onLinkGenerated,
  className = ''
}: GenerateLinkButtonProps) {
  const [loading, setLoading] = useState(false)
  const [generatedData, setGeneratedData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateLink = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/leads/${leadId}/generate-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseUrl: window.location.origin
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setGeneratedData(result.data)
        if (onLinkGenerated) {
          onLinkGenerated(result.data)
        }
      } else {
        setError(result.error || 'Error generando enlace')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Error copiando:', err)
      })
  }

  const sendEmail = () => {
    if (generatedData?.url && leadEmail) {
      const subject = `Caja Valladolid - Documentación para tu crédito`
      const body = `Hola ${leadName},\n\nPara continuar con tu solicitud de crédito, por favor completa la documentación en el siguiente enlace:\n\n${generatedData.url}\n\nEste enlace es personal e intransferible y expirará en 30 días.\n\nSaludos,\nCaja Valladolid`
      window.location.href = `mailto:${leadEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    } else if (generatedData?.url) {
      const subject = `Caja Valladolid - Enlace para documentación`
      const body = `Enlace para ${leadName}:\n\n${generatedData.url}\n\nExpira: ${new Date(generatedData.expiresAt).toLocaleDateString('es-MX')}`
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }
  }

  const sendWhatsApp = () => {
    if (generatedData?.url) {
      const message = `Hola ${leadName}, para continuar con tu solicitud de crédito en Caja Valladolid, por favor completa la documentación en este enlace: ${generatedData.url}\n\nEste enlace es personal e intransferible.`
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={generateLink}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <LinkIcon className="w-4 h-4" />
          )}
          {generatedData ? 'Regenerar Enlace' : 'Generar Enlace'}
        </button>
        
        {generatedData && (
          <>
            <button
              onClick={() => window.open(generatedData.url, '_blank')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Probar Enlace
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">❌ {error}</p>
        </div>
      )}

      {generatedData && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
          {/* Información del enlace */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Enlace para <span className="font-semibold">{leadName}</span>:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={generatedData.url}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(generatedData.url)}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                title="Copiar enlace"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Expira: {new Date(generatedData.expiresAt).toLocaleDateString('es-MX')}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={sendEmail}
              className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              {leadEmail ? 'Enviar Email' : 'Copiar Email'}
            </button>
            
            <button
              onClick={sendWhatsApp}
              className="inline-flex items-center gap-2 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Enviar WhatsApp
            </button>
          </div>

          {/* Instrucciones */}
          <div className="text-xs text-gray-500 space-y-1">
            <p className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Este enlace es único para este cliente
            </p>
            <p className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              El cliente podrá subir documentos directamente
            </p>
            <p className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Válido por 30 días desde la generación
            </p>
          </div>
        </div>
      )}
    </div>
  )
}