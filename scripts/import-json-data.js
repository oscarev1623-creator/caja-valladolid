require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return null
  }
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw)
}

function getArray(value) {
  if (Array.isArray(value)) return value
  if (value && Array.isArray(value.items)) return value.items
  return []
}

function parseDate(value) {
  if (!value) return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value
  if (typeof value !== 'string') return null
  const isoString = value.replace(' ', 'T')
  const date = new Date(isoString)
  return isNaN(date.getTime()) ? null : date
}

async function upsertUser(user) {
  if (!user.email) {
    console.warn(`Omitiendo usuario sin email: ${JSON.stringify(user)}`)
    return null
  }

  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.name || user.fullName || '',
      password: user.password || user.hashedPassword || '',
      role: user.role || 'agent',
      isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
      color: user.color || 'green'
    },
    create: {
      id: user.id || undefined,
      email: user.email,
      password: user.password || user.hashedPassword || '',
      name: user.name || user.fullName || '',
      role: user.role || 'agent',
      isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
      color: user.color || 'green'
    }
  })
}

async function upsertLead(lead) {
  if (!lead.email) {
    console.warn(`Omitiendo lead sin email: ${JSON.stringify(lead)}`)
    return null
  }

  const whereUnique = lead.id
    ? { id: lead.id }
    : lead.uniqueToken
      ? { uniqueToken: lead.uniqueToken }
      : lead.chatToken
        ? { chatToken: lead.chatToken }
        : lead.calculatorToken
          ? { calculatorToken: lead.calculatorToken }
          : null

  const data = {
    fullName: lead.fullName || lead.name || '',
    phone: lead.phone || lead.telefono || '',
    message: lead.message || lead.notes || '',
    status: lead.status || 'PENDING_CONTACT',
    source: lead.source || 'CHAT_WIDGET',
    estimatedAmount: lead.estimatedAmount || 0,
    creditType: lead.creditType || 'TRADITIONAL',
    assignedToId: lead.assignedToId || null,
    chatToken: lead.chatToken || null,
    emailSent: typeof lead.emailSent === 'boolean' ? lead.emailSent : false,
    emailSentAt: parseDate(lead.emailSentAt),
    documentsSubmitted: typeof lead.documentsSubmitted === 'boolean' ? lead.documentsSubmitted : false,
    hasChatHistory: typeof lead.hasChatHistory === 'boolean' ? lead.hasChatHistory : false
  }

  const createData = {
    id: lead.id || undefined,
    fullName: lead.fullName || lead.name || '',
    email: lead.email,
    phone: lead.phone || lead.telefono || '',
    estimatedAmount: lead.estimatedAmount || 0,
    creditType: lead.creditType || 'TRADITIONAL',
    message: lead.message || lead.notes || '',
    status: lead.status || 'PENDING_CONTACT',
    source: lead.source || 'CHAT_WIDGET',
    assignedToId: lead.assignedToId || null,
    chatToken: lead.chatToken || null,
    emailSent: typeof lead.emailSent === 'boolean' ? lead.emailSent : false,
    emailSentAt: parseDate(lead.emailSentAt),
    documentsSubmitted: typeof lead.documentsSubmitted === 'boolean' ? lead.documentsSubmitted : false,
    hasChatHistory: typeof lead.hasChatHistory === 'boolean' ? lead.hasChatHistory : false
  }

  if (whereUnique) {
    return prisma.lead.upsert({
      where: whereUnique,
      update: data,
      create: createData
    })
  }

  const existing = await prisma.lead.findFirst({ where: { email: lead.email } })
  if (existing) {
    return prisma.lead.update({
      where: { id: existing.id },
      data
    })
  }

  return prisma.lead.create({ data: createData })
}

async function upsertChatConversation(chat, leadId) {
  const data = {
    userEmail: chat.userEmail || chat.email || '',
    userName: chat.userName || chat.name || null,
    userPhone: chat.userPhone || chat.phone || null,
    status: chat.status || 'active',
    assignedToId: chat.assignedToId || null,
    assignedAt: parseDate(chat.assignedAt),
    createdAt: parseDate(chat.createdAt) || undefined,
    updatedAt: parseDate(chat.updatedAt) || undefined,
    leadId: leadId || chat.leadId || null
  }

  if (!data.userEmail) {
    console.warn(`Omitiendo conversación sin userEmail: ${JSON.stringify(chat)}`)
    return null
  }

  return prisma.chatConversation.upsert({
    where: { id: chat.id },
    update: data,
    create: {
      id: chat.id || undefined,
      ...data
    }
  })
}

async function upsertChatMessage(msg) {
  if (!msg.conversationId) {
    console.warn(`Omitiendo mensaje sin conversationId: ${JSON.stringify(msg)}`)
    return null
  }

  return prisma.chatMessage.upsert({
    where: { id: msg.id || `${msg.conversationId}-${Date.now()}` },
    update: {
      senderType: msg.senderType || msg.role || 'user',
      message: msg.message || null,
      fileUrl: msg.fileUrl || null,
      fileName: msg.fileName || null,
      fileType: msg.fileType || null,
      isRead: typeof msg.isRead === 'boolean' ? msg.isRead : false,
      createdAt: parseDate(msg.createdAt) || undefined
    },
    create: {
      id: msg.id || undefined,
      conversationId: msg.conversationId,
      senderType: msg.senderType || msg.role || 'user',
      message: msg.message || null,
      fileUrl: msg.fileUrl || null,
      fileName: msg.fileName || null,
      fileType: msg.fileType || null,
      isRead: typeof msg.isRead === 'boolean' ? msg.isRead : false,
      createdAt: parseDate(msg.createdAt) || undefined
    }
  })
}

async function main() {
  const baseDir = path.join(__dirname, '..', 'respaldos')
  const files = {
    users: path.join(baseDir, 'little-dew-58458726_backup-mayo-2026_neondb_2026-05-01_15-31-24.json'),
    leads: path.join(baseDir, 'little-dew-58458726_backup-mayo-2026_neondb_2026-05-01_15-10-51.json'),
    chats: path.join(baseDir, 'little-dew-58458726_backup-mayo-2026_neondb_2026-05-01_15-11-44.json'),
    messages: path.join(baseDir, 'little-dew-58458726_backup-mayo-2026_neondb_2026-05-01_15-11-59.json')
  }

  for (const type of Object.keys(files)) {
    if (!fs.existsSync(files[type])) {
      console.warn(`Archivo de respaldo no encontrado para ${type}: ${files[type]}`)
    }
  }

  const users = loadJson(files.users) || []
  const leads = loadJson(files.leads) || []
  const chats = loadJson(files.chats) || []
  const messages = loadJson(files.messages) || []

  console.log(`Importando usuarios: ${users.length}`)
  console.log(`Importando leads: ${leads.length}`)
  console.log(`Importando chats: ${chats.length}`)
  console.log(`Importando mensajes: ${messages.length}`)

  for (const user of getArray(users)) {
    await upsertUser(user)
  }

  const leadMap = new Map()
  for (const lead of getArray(leads)) {
    const savedLead = await upsertLead(lead)
    if (savedLead?.email) {
      leadMap.set(savedLead.email, savedLead.id)
    }
  }

  const chatMap = new Map()
  for (const chat of getArray(chats)) {
    const email = chat.userEmail || chat.email
    const leadId = chat.leadId || (email ? leadMap.get(email) : null)
    const savedChat = await upsertChatConversation(chat, leadId)
    if (savedChat?.id && email) {
      chatMap.set(savedChat.id, savedChat)
    }
  }

  for (const msg of getArray(messages)) {
    try {
      await upsertChatMessage(msg)
    } catch (error) {
      console.error(`Error importando mensaje ${msg.id || '(sin id)'}`, error)
    }
  }

  console.log('Importación completa.')
}

main()
  .catch(err => {
    console.error('Error en importación:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
