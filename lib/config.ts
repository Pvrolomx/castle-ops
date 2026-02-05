export const ADMIN_PIN = '1978'

export type PropertyOwner = {
  name: string
  code: string
  properties: string[]
  greeting?: { es: string; en: string }
}

export const OWNERS: PropertyOwner[] = [
  { name: 'Connie', code: '1701', properties: ['Nitta 102'], greeting: { es: 'Bienvenida', en: 'Welcome' } },
  { name: 'Herb and Ann', code: '9042', properties: ['Mismaloya 5705', 'Mismaloya 7202'], greeting: { es: 'Bienvenidos', en: 'Welcome' } },
  { name: 'Jay and Stephen', code: '9686', properties: ['Sagitario'], greeting: { es: 'Bienvenidos', en: 'Welcome' } },
  { name: 'John and Brenda', code: '7060', properties: ['Villa Magna 352 A', 'Villa Magna 352 B'], greeting: { es: 'Bienvenidos', en: 'Welcome' } },
  { name: 'Scott and Emy', code: '4537', properties: ['Villa Magna 336'], greeting: { es: 'Bienvenidos', en: 'Welcome' } },
  { name: 'Russell', code: '7048', properties: ['Villa Magna 253 A'], greeting: { es: 'Bienvenido', en: 'Welcome' } },
  { name: 'John and Joanne', code: '4021', properties: ['Avida 408', 'Cielo 101'], greeting: { es: 'Bienvenidos', en: 'Welcome' } },
  { name: 'Roberto', code: '3336', properties: ['Playa Royal 603', 'Playa Royal 604'], greeting: { es: 'Bienvenido', en: 'Welcome' } },
  { name: 'Len', code: '7350', properties: ['Playa Royal 103', 'Playa Royal 105'], greeting: { es: 'Bienvenido', en: 'Welcome' } },
  { name: 'Daren and Kevin', code: '7487', properties: ['V Estrella 502'], greeting: { es: 'Bienvenidos', en: 'Welcome' } },
  { name: 'Daren, Kevin and Doug', code: '7486', properties: ['Casita 1', 'Casita 2'], greeting: { es: 'Bienvenidos', en: 'Welcome' } },
  { name: 'George', code: '6169', properties: ['Villa Magna 373 B'], greeting: { es: 'Bienvenido', en: 'Welcome' } },
]

export const ALL_PROPERTIES = OWNERS.flatMap(o => o.properties)

export const RENTAL_PROPERTIES = [
  'Villa Magna 253 A',
  'Villa Magna 352 A',
  'Villa Magna 352 B',
  'Villa Magna 336',
  'Villa Magna 373 B',
  'Nitta 102',
  'Mismaloya 7202',
  'Mismaloya 5705',
  'Avida 408',
  'Cielo 101',
  'Sagitario',
  'Playa Royal 603',
  'Playa Royal 604',
  'Playa Royal 103',
  'Playa Royal 105',
  'V Estrella 502',
  'Casita 1',
  'Casita 2',
]

export const CATEGORIES = [
  { value: 'plomeria', label: { es: '🔧 Plomería', en: '🔧 Plumbing' } },
  { value: 'electricidad', label: { es: '⚡ Electricidad', en: '⚡ Electrical' } },
  { value: 'ac', label: { es: '❄️ Aire Acondicionado', en: '❄️ AC' } },
  { value: 'otro', label: { es: '📦 Otro', en: '📦 Other' } },
]

export const REQUEST_CATEGORIES = [
  { value: 'limpieza', label: { es: '🧹 Limpieza', en: '🧹 Cleaning' } },
  { value: 'mantenimiento', label: { es: '🔧 Mantenimiento', en: '🔧 Maintenance' } },
  { value: 'compras', label: { es: '🛒 Compras', en: '🛒 Shopping' } },
  { value: 'mejoras', label: { es: '📐 Mejoras', en: '📐 Improvements' } },
  { value: 'jardineria', label: { es: '🌿 Jardinería', en: '🌿 Landscaping' } },
  { value: 'otro', label: { es: '📦 Otro', en: '📦 Other' } },
]

export const URGENCY = [
  { value: 'baja', label: { es: '🟢 Baja', en: '🟢 Low' } },
  { value: 'normal', label: { es: '🔵 Normal', en: '🔵 Normal' } },
  { value: 'alta', label: { es: '🟠 Alta', en: '🟠 High' } },
  { value: 'urgente', label: { es: '🔴 Urgente', en: '🔴 Urgent' } },
]
