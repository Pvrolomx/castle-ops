export const ADMIN_PIN = '1978'

export type PropertyOwner = {
  name: string
  code: string  // 4-digit PIN
  properties: string[]
}

// Mock data - reemplazar con nombres y códigos reales después
export const OWNERS: PropertyOwner[] = [
  { name: 'Carlos Mendoza', code: '2501', properties: ['Villa Magna 253 A'] },
  { name: 'María Fernández', code: '3102', properties: ['Villa Magna 253 B'] },
  { name: 'Roberto Gutiérrez', code: '4453', properties: ['Nitta 102', 'Avida 408'] },
  { name: 'Ana López', code: '5574', properties: ['Mismaloya 7202'] },
  { name: 'Jorge Ramírez', code: '6685', properties: ['Mismaloya 5705'] },
  { name: 'Patricia Herrera', code: '7796', properties: ['Cielo 101'] },
  { name: 'Luis Morales', code: '1237', properties: ['Marina Sol 301'] },
  { name: 'Elena Castro', code: '2348', properties: ['Playa Real 1205', 'Playa Real 1206'] },
  { name: 'Fernando Torres', code: '3459', properties: ['Sunset Bay 402'] },
  { name: 'Claudia Ríos', code: '4560', properties: ['Pacífico 88'] },
  { name: 'Diego Navarro', code: '5671', properties: ['Las Palmas 15'] },
  { name: 'Sofia Medina', code: '6782', properties: ['Coral 201'] },
  { name: 'Miguel Vargas', code: '7893', properties: ['Vista Mar 507'] },
  { name: 'Laura Sánchez', code: '8904', properties: ['Azul 1102'] },
  { name: 'Andrés Peña', code: '9015', properties: ['Marina Norte 603'] }
]

export const ALL_PROPERTIES = OWNERS.flatMap(o => o.properties)

export const RENTAL_PROPERTIES = [
  'Villa Magna 253 A',
  'Villa Magna 253 B',
  'Nitta 102',
  'Mismaloya 7202',
  'Mismaloya 5705',
  'Avida 408',
  'Cielo 101',
  'Marina Sol 301',
  'Playa Real 1205',
  'Sunset Bay 402'
]

export const CATEGORIES = [
  { value: 'plomeria', label: { es: '🔧 Plomería', en: '🔧 Plumbing' } },
  { value: 'electricidad', label: { es: '⚡ Electricidad', en: '⚡ Electrical' } },
  { value: 'limpieza', label: { es: '🧹 Limpieza', en: '🧹 Cleaning' } },
  { value: 'ac', label: { es: '❄️ Aire Acondicionado', en: '❄️ AC' } },
  { value: 'otro', label: { es: '📦 Otro', en: '📦 Other' } }
]

export const URGENCY = [
  { value: 'baja', label: { es: '🟢 Baja', en: '🟢 Low' } },
  { value: 'normal', label: { es: '🔵 Normal', en: '🔵 Normal' } },
  { value: 'alta', label: { es: '🟠 Alta', en: '🟠 High' } },
  { value: 'urgente', label: { es: '🔴 Urgente', en: '🔴 Urgent' } }
]
