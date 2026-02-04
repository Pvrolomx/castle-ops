export const ADMIN_PIN = '1978'

export type PropertyOwner = {
  name: string
  code: string  // 4-digit PIN
  properties: string[]
}

export const OWNERS: PropertyOwner[] = [
  { name: 'Connie', code: '1701', properties: ['Nitta 102'] },
  { name: 'Herb and Ann', code: '9042', properties: ['Mismaloya 5705', 'Mismaloya 7202'] },
  { name: 'Jay and Stephen', code: '9686', properties: ['Sagitario'] },
  { name: 'John and Brenda', code: '7060', properties: ['Villa Magna 352 A', 'Villa Magna 352 B'] },
  { name: 'Scott and Emy', code: '4537', properties: ['Villa Magna 336'] },
  { name: 'Russell', code: '7048', properties: ['Villa Magna 253 A'] },
  { name: 'John and Joanne', code: '4021', properties: ['Avida 408', 'Cielo 101'] },
  { name: 'Roberto', code: '3336', properties: ['Playa Royal 603', 'Playa Royal 604'] },
  { name: 'Len', code: '7350', properties: ['Playa Royal 103', 'Playa Royal 105'] },
  { name: 'Daren and Kevin', code: '7486', properties: ['V Estrella 502', 'Su Casita 1', 'Su Casita 2'] },
  { name: 'George', code: '6169', properties: ['Villa Magna 373 B'] },
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
  'Su Casita 1',
  'Su Casita 2',
]

export const CATEGORIES = [
  { value: 'plomeria', label: { es: '🔧 Plomería', en: '🔧 Plumbing' } },
  { value: 'electricidad', label: { es: '⚡ Electricidad', en: '⚡ Electrical' } },
  { value: 'limpieza', label: { es: '🧹 Limpieza', en: '🧹 Cleaning' } },
  { value: 'ac', label: { es: '❄️ Aire Acondicionado', en: '❄️ AC' } },
  { value: 'otro', label: { es: '📦 Otro', en: '📦 Other' } },
]

export const URGENCY = [
  { value: 'baja', label: { es: '🟢 Baja', en: '🟢 Low' } },
  { value: 'normal', label: { es: '🔵 Normal', en: '🔵 Normal' } },
  { value: 'alta', label: { es: '🟠 Alta', en: '🟠 High' } },
  { value: 'urgente', label: { es: '🔴 Urgente', en: '🔴 Urgent' } },
]
