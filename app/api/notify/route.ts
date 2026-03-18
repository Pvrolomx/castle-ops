import { NextRequest, NextResponse } from 'next/server'

const EMAIL_SERVICE_URL = 'https://email.duendes.app/api/send'
const NOTIFY_EMAIL = 'info@castlesolutions.biz'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { property, category, description, urgency, reporterType, reporterName, reporterContact } = body

    const urgencyEmoji: Record<string, string> = {
      baja: '🟢 Baja',
      normal: '🔵 Normal',
      alta: '🟠 Alta',
      urgente: '🔴 URGENTE'
    }

    const categoryLabel: Record<string, string> = {
      plomeria: '🔧 Plomería',
      electricidad: '⚡ Electricidad',
      limpieza: '🧹 Limpieza',
      ac: '❄️ Aire Acondicionado',
      otro: '📦 Otro'
    }

    const message = `
NUEVA INCIDENCIA REPORTADA

🏠 Propiedad: ${property}
📋 Categoría: ${categoryLabel[category] || category}
⚠️ Urgencia: ${urgencyEmoji[urgency] || urgency}
👤 Reporta: ${reporterType === 'propietario' ? 'Propietario' : 'Huésped'} - ${reporterName || 'N/A'}
📞 Contacto: ${reporterContact || 'N/A'}

📝 Descripción:
${description}

---
Gestionar en: https://castle-ops.castlesolutions.mx/admin
    `.trim()

    const emailRes = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: NOTIFY_EMAIL,
        subject: `🚨 Nueva Incidencia: ${property} - ${categoryLabel[category] || category}`,
        message,
        sendFrom: 'castlesolutions.mx',
        name: 'Castle Ops'
      })
    })

    const data = await emailRes.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

