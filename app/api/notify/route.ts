import { NextRequest, NextResponse } from 'next/server'

const EMAIL_SERVICE_URL = 'https://email.duendes.app/api/send'
const NOTIFY_EMAIL = 'info@castlesolutions.biz'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { property, category, description, urgency, reporterType, reporterName, reporterContact, isStaffNote } = body

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
      observacion: '👁️ Observación',
      mantenimiento: '🔧 Mantenimiento Pendiente',
      inventario: '📦 Inventario',
      urgente: '🚨 Urgente',
      otro: '📝 Otro'
    }

    let subject: string
    let message: string

    if (isStaffNote) {
      subject = `📋 Nota de Staff: ${property} - ${categoryLabel[category] || category}`
      message = `
NUEVA NOTA INTERNA DE STAFF

🏠 Propiedad: ${property}
📋 Categoría: ${categoryLabel[category] || category}
⏰ Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}

📝 Nota:
${description}

---
Ver todas las notas: https://castle-ops.castlesolutions.mx/admin
      `.trim()
    } else {
      subject = `🚨 Nueva Incidencia: ${property} - ${categoryLabel[category] || category}`
      message = `
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
    }

    // No se envía 'from' para que el Reply-To quede vacío (noreply)
    // Claudia debe responder manualmente usando el contacto indicado arriba
    const emailRes = await fetch(EMAIL_SERVICE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: NOTIFY_EMAIL,
        subject,
        message,
        sendFrom: 'castlesolutions.biz',
        name: 'Castle Solutions'
      })
    })

    const data = await emailRes.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
