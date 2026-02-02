export const ADMIN_PIN = '1978'

export type PropertyOwner = {
  name: string
  properties: string[]
}

// Mock data - reemplazar con nombres reales después
export const OWNERS: PropertyOwner[] = [
  { name: 'Carlos Mendoza', properties: ['Villa Magna 253 A'] },
  { name: 'María Fernández', properties: ['Villa Magna 253 B'] },
  { name: 'Roberto Gutiérrez', properties: ['Nitta 102', 'Avida 408'] },
  { name: 'Ana López', properties: ['Mismaloya 7202'] },
  { name: 'Jorge Ramírez', properties: ['Mismaloya 5705'] },
  { name: 'Patricia Herrera', properties: ['Cielo 101'] },
  { name: 'Luis Morales', properties: ['Marina Sol 301'] },
  { name: 'Elena Castro', properties: ['Playa Real 1205', 'Playa Real 1206'] },
  { name: 'Fernando Torres', properties: ['Sunset Bay 402'] },
  { name: 'Claudia Ríos', properties: ['Pacífico 88'] },
  { name: 'Diego Navarro', properties: ['Las Palmas 15'] },
  { name: 'Sofia Medina', properties: ['Coral 201'] },
  { name: 'Miguel Vargas', properties: ['Vista Mar 507'] },
  { name: 'Laura Sánchez', properties: ['Azul 1102'] },
  { name: 'Andrés Peña', properties: ['Marina Norte 603'] }
]

export const ALL_PROPERTIES = OWNERS.flatMap(o => o.properties)

// Propiedades activas para renta (subset)
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
