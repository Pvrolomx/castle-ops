export const ADMIN_PIN = '1978'

export type PropertyOwner = {
  name: string
  code: string
  properties: string[]
  greeting?: { es: string; en: string; fr: string }
}

export const OWNERS: PropertyOwner[] = [
  { name: 'Connie', code: '1701', properties: ['Nitta 102'], greeting: { es: 'Bienvenida', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Herb and Ann', code: '9042', properties: ['Mismaloya 5705', 'Mismaloya 7202'], greeting: { es: 'Bienvenidos', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Jay and Stephen', code: '9686', properties: ['Sagitario'], greeting: { es: 'Bienvenidos', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'John and Brenda', code: '7060', properties: ['Villa Magna 352 A', 'Villa Magna 352 B'], greeting: { es: 'Bienvenidos', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Scott and Emy', code: '4537', properties: ['Villa Magna 336'], greeting: { es: 'Bienvenidos', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Russell', code: '7048', properties: ['Villa Magna 253 A'], greeting: { es: 'Bienvenido', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'John and Joanne', code: '4021', properties: ['Avida 408', 'Cielo 101'], greeting: { es: 'Bienvenidos', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Roberto', code: '3336', properties: ['Playa Royal 603', 'Playa Royal 604'], greeting: { es: 'Bienvenido', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Len', code: '7350', properties: ['Playa Royal 103', 'Playa Royal 105'], greeting: { es: 'Bienvenido', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Daren and Kevin', code: '7487', properties: ['V Estrella 502'], greeting: { es: 'Bienvenidos', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Daren, Kevin and Doug', code: '7486', properties: ['Casita 1', 'Casita 2'], greeting: { es: 'Bienvenidos', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'George', code: '6169', properties: ['Villa Magna 373 B'], greeting: { es: 'Bienvenido', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Tony and Bonnie', code: '9262', properties: ['Nitta 305'], greeting: { es: 'Bienvenidos', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Dan', code: '5959', properties: ['Nitta 404'], greeting: { es: 'Bienvenido', en: 'Welcome', fr: 'Bienvenue' } },
  { name: 'Staff', code: '1978', properties: [
    'Villa Magna 253 A', 'Villa Magna 352 A', 'Villa Magna 352 B', 'Villa Magna 336', 'Villa Magna 373 B',
    'Nitta 102', 'Nitta 305', 'Nitta 404',
    'Mismaloya 7202', 'Mismaloya 5705',
    'Avida 408', 'Cielo 101', 'Sagitario',
    'Playa Royal 603', 'Playa Royal 604', 'Playa Royal 103', 'Playa Royal 105',
    'V Estrella 502', 'Casita 1', 'Casita 2'
  ], greeting: { es: 'Bienvenido', en: 'Welcome', fr: 'Bienvenue' } },
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
  { value: 'plomeria', label: { es: '🔧 Plomería', en: '🔧 Plumbing', fr: '🔧 Plomberie' } },
  { value: 'electricidad', label: { es: '⚡ Electricidad', en: '⚡ Electrical', fr: '⚡ Électricité' } },
  { value: 'ac', label: { es: '❄️ Aire Acondicionado', en: '❄️ AC', fr: '❄️ Climatisation' } },
  { value: 'electrodomesticos', label: { es: '🔌 Electrodomésticos', en: '🔌 Appliances', fr: '🔌 Électroménagers' } },
  { value: 'internet_tv', label: { es: '📺 Internet y Televisión', en: '📺 Internet & TV', fr: '📺 Internet et TV' } },
  { value: 'caja_seguridad', label: { es: '🔐 Caja de Seguridad', en: '🔐 Safe Box', fr: '🔐 Coffre-fort' } },
  { value: 'persianas_cortinas', label: { es: '🪟 Persianas y Cortinas', en: '🪟 Blinds & Curtains', fr: '🪟 Stores et Rideaux' } },
  { value: 'mejoras', label: { es: '🛠️ Mejoras', en: '🛠️ Improvements', fr: '🛠️ Améliorations' } },
  { value: 'otro', label: { es: '📦 Otros', en: '📦 Other', fr: '📦 Autre' } },
]

export const REQUEST_CATEGORIES = [
  { value: 'limpieza', label: { es: '🧹 Limpieza', en: '🧹 Cleaning', fr: '🧹 Nettoyage' } },
  { value: 'compras_hogar', label: { es: '🏠 Compras del Hogar', en: '🏠 Home Shopping', fr: '🏠 Achats Maison' } },
  { value: 'compras_despensa', label: { es: '🛒 Compras de Despensa', en: '🛒 Grocery Shopping', fr: '🛒 Courses' } },
  { value: 'transporte', label: { es: '🚗 Transporte', en: '🚗 Transportation', fr: '🚗 Transport' } },
  { value: 'decoracion', label: { es: '🎨 Decoración', en: '🎨 Decoration', fr: '🎨 Décoration' } },
  { value: 'jardineria', label: { es: '🌿 Jardinería', en: '🌿 Landscaping', fr: '🌿 Jardinage' } },
  { value: 'otro', label: { es: '📦 Otros', en: '📦 Other', fr: '📦 Autre' } },
]

export const URGENCY = [
  { value: 'baja', label: { es: '🟢 Baja', en: '🟢 Low', fr: '🟢 Faible' } },
  { value: 'normal', label: { es: '🔵 Normal', en: '🔵 Normal', fr: '🔵 Normal' } },
  { value: 'alta', label: { es: '🟠 Alta', en: '🟠 High', fr: '🟠 Élevée' } },
  { value: 'urgente', label: { es: '🔴 Urgente', en: '🔴 Urgent', fr: '🔴 Urgent' } },
]

export const STAFF_MEMBERS = [
  { name: 'Claudia', code: '2835' },
  { name: 'Miranda', code: '4692' },
]

export const NOTE_CATEGORIES = [
  { value: 'observacion', label: { es: '👁️ Observación', en: '👁️ Observation', fr: '👁️ Observation' } },
  { value: 'mantenimiento', label: { es: '🔧 Mantenimiento Pendiente', en: '🔧 Pending Maintenance', fr: '🔧 Maintenance en attente' } },
  { value: 'inventario', label: { es: '📦 Inventario', en: '📦 Inventory', fr: '📦 Inventaire' } },
  { value: 'limpieza', label: { es: '🧹 Limpieza', en: '🧹 Cleaning', fr: '🧹 Nettoyage' } },
  { value: 'urgente', label: { es: '🚨 Urgente', en: '🚨 Urgent', fr: '🚨 Urgent' } },
  { value: 'otro', label: { es: '📝 Otro', en: '📝 Other', fr: '📝 Autre' } },
]
