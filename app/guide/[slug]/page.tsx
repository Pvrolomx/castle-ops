'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown, X } from 'lucide-react'
import { Lang } from '@/lib/i18n'

type PropertyData = {
  name: string
  sections: { icon: string; title: { es: string; en: string; fr?: string }; content: { es: string; en: string; fr?: string }; videoUrl?: string }[]
}

const PROPERTY_DATA: Record<string, PropertyData> = {
  'mismaloya-7202': {
    name: 'La Jolla de Mismaloya 7202',
    sections: [
      { icon: '📍', title: { es: 'Ubicación', en: 'Location', fr: 'Emplacement' }, content: { es: 'Condominios La Jolla de Mismaloya\n48294 Mismaloya, Jalisco\n\n📍 Google Maps:\nhttps://maps.app.goo.gl/EUxsPhGv76UvDjQ16\n\n✈️ Desde el aeropuerto (30-35 min):\n• Toma Carretera 200 hacia el sur\n• Pasa el centro de PV y Los Arcos\n• Llega a Bahía de Mismaloya\n\n👉 Dile al conductor:\n"Condominios La Jolla de Mismaloya"\n\n⚠️ NO te dejes en hoteles cercanos — este es un condominio privado con caseta.', en: 'Condominios La Jolla de Mismaloya\n48294 Mismaloya, Jalisco\n\n📍 Google Maps:\nhttps://maps.app.goo.gl/EUxsPhGv76UvDjQ16\n\n✈️ From the airport (30-35 min):\n• Take Highway 200 south\n• Pass downtown PV and Los Arcos\n• Arrive at Mismaloya Bay\n\n👉 Tell your driver:\n"Condominios La Jolla de Mismaloya"\n\n⚠️ Do NOT get dropped at nearby hotels — this is a private gated community.', fr: 'Condominios La Jolla de Mismaloya\n48294 Mismaloya, Jalisco\n\n📍 Google Maps:\nhttps://maps.app.goo.gl/EUxsPhGv76UvDjQ16\n\n✈️ Depuis l\'aéroport (30-35 min):\n• Prenez la route 200 vers le sud\n• Passez le centre-ville de PV et Los Arcos\n• Arrivez à la baie de Mismaloya\n\n👉 Dites au conducteur:\n"Condominios La Jolla de Mismaloya"\n\n⚠️ Ne vous faites PAS déposer aux hôtels voisins — c\'est une communauté fermée privée.' } },
      { icon: '🔐', title: { es: 'Llegada y Acceso', en: 'Arrival & Access', fr: 'Arrivée et Accès' }, content: { es: '🏢 Comunidad cerrada con seguridad 24/7\n\nAl llegar:\n1. Ve a la entrada principal / recepción\n2. Da tu nombre y unidad: 7202\n\n✅ En recepción te darán:\n• 🔑 Llave de la unidad\n• 🪪 Tarjeta/token de acceso\n\nLa tarjeta te da acceso a:\n• Edificio 7\n• Gym\n• Acceso a playa\n\n🛗 Para llegar a tu unidad:\n• Ve al Edificio/Torre 7\n• Toma el elevador al Piso 2\n• Suite 7202', en: '🏢 Gated community with 24/7 security\n\nUpon arrival:\n1. Go to the main entrance / front desk\n2. Provide your name and unit: 7202\n\n✅ Front desk will provide:\n• 🔑 Key to your unit\n• 🪪 Token / digital access card\n\nThe card gives you access to:\n• Building 7\n• Gym\n• Beach access\n\n🛗 To reach your unit:\n• Go to Tower / Building 7\n• Take elevator to Floor 2\n• Suite 7202', fr: '🏢 Communauté fermée avec sécurité 24/7\n\nÀ votre arrivée:\n1. Allez à l\'entrée principale / réception\n2. Donnez votre nom et unité: 7202\n\n✅ La réception vous fournira:\n• 🔑 Clé de l\'unité\n• 🪪 Carte/jeton d\'accès\n\nLa carte donne accès à:\n• Bâtiment 7\n• Gym\n• Accès à la plage\n\n🛗 Pour atteindre votre unité:\n• Allez à la Tour / Bâtiment 7\n• Prenez l\'ascenseur au 2ème étage\n• Suite 7202' } },
      { icon: '📶', title: { es: 'WiFi', en: 'WiFi', fr: 'WiFi' }, content: { es: 'Los datos del WiFi están dentro de la unidad.\n📍 Busca las etiquetas en el módem de la cocina con:\n• Nombre de red\n• Contraseña', en: 'WiFi details are available inside the unit.\n📍 Look at the modem in the kitchen for labels with:\n• Network name\n• Password', fr: 'Les détails WiFi sont disponibles dans l\'unité.\n📍 Cherchez les étiquettes sur le modem dans la cuisine avec:\n• Nom du réseau\n• Mot de passe' } },
      { icon: '🅿️', title: { es: 'Estacionamiento', en: 'Parking', fr: 'Stationnement' }, content: { es: 'No hay cajón asignado.\nEstacionamiento disponible por orden de llegada dentro del complejo.', en: 'No assigned parking space.\nParking available on a first-come, first-served basis within the complex.', fr: 'Pas de place assignée.\nStationnement disponible selon l\'ordre d\'arrivée dans le complexe.' } },
      { icon: '📺', title: { es: 'TV y Entretenimiento', en: 'TV & Entertainment', fr: 'TV et Divertissement' }, content: { es: 'La TV incluye:\n• 📡 TV en vivo\n• 🌍 Canales en inglés e internacionales\n\nSigue las instrucciones dentro de la unidad para acceder a apps y canales.', en: 'The TV includes:\n• 📡 Live TV\n• 🌍 English & international channels\n\nFollow instructions inside the unit to access apps and channels.', fr: 'La TV inclut:\n• 📡 TV en direct\n• 🌍 Chaînes anglaises et internationales\n\nSuivez les instructions dans l\'unité pour accéder aux apps et chaînes.' } },
      { icon: '🔒', title: { es: 'Caja Fuerte', en: 'Safe', fr: 'Coffre-fort' }, content: { es: 'Hay una caja fuerte para tus pertenencias.\n\n⚠️ IMPORTANTE:\n1. Lee las instrucciones en la puerta interior\n2. Configura tu código\n3. Pruébalo ANTES de guardar objetos\n4. Solo ciérrala cuando confirmes que funciona\n\n📹 Podemos enviarte un video de YouTube con instrucciones.', en: 'A safe is available for your belongings.\n\n⚠️ IMPORTANT:\n1. Read instructions inside the door\n2. Set your code\n3. Test it BEFORE placing items inside\n4. Only close once confirmed working\n\n📹 We can send a YouTube video with instructions.', fr: 'Un coffre-fort est disponible pour vos affaires.\n\n⚠️ IMPORTANT:\n1. Lisez les instructions à l\'intérieur de la porte\n2. Définissez votre code\n3. Testez-le AVANT d\'y placer des objets\n4. Ne fermez qu\'une fois confirmé fonctionnel\n\n📹 Nous pouvons vous envoyer une vidéo YouTube avec des instructions.' } },
      { icon: '🏊', title: { es: 'Amenidades', en: 'Amenities', fr: 'Commodités' }, content: { es: '🏖️ Acceso a playa (usa tu tarjeta)\n🏋️ Gym (usa tu tarjeta)\n🧺 Lavandería disponible — pide acceso/llave en recepción\n🏖️ Toallas de playa en recepción (devuélvelas ahí)\n\n⚠️ NO uses toallas de cara/mano para:\n• Quitarte maquillaje\n• Limpiar zapatos\nCargos adicionales por daños.', en: '🏖️ Beach access (use your card)\n🏋️ Gym (use your card)\n🧺 Laundry service available — request access/key at front desk\n🏖️ Beach towels at front desk (return them there)\n\n⚠️ Do NOT use face/hand towels to:\n• Remove makeup\n• Clean shoes\nAdditional charges for damage.', fr: '🏖️ Accès à la plage (utilisez votre carte)\n🏋️ Gym (utilisez votre carte)\n🧺 Service de blanchisserie disponible — demandez l\'accès/clé à la réception\n🏖️ Serviettes de plage à la réception (retournez-les là-bas)\n\n⚠️ N\'utilisez PAS les serviettes de visage/main pour:\n• Enlever le maquillage\n• Nettoyer les chaussures\nFrais supplémentaires pour les dommages.' } },
      { icon: '🏠', title: { es: 'Reglas de la Casa', en: 'House Rules', fr: 'Règles de la Maison' }, content: { es: '🚭 No fumar dentro de la unidad\n🐾 No se permiten mascotas\n👥 No se permiten visitantes o huéspedes no registrados\n🔇 Respeta las horas de silencio', en: '🚭 No smoking inside the unit\n🐾 No pets allowed\n👥 No visitors or unregistered guests permitted\n🔇 Please respect quiet hours', fr: '🚭 Interdiction de fumer à l\'intérieur\n🐾 Pas d\'animaux autorisés\n👥 Pas de visiteurs ou invités non enregistrés\n🔇 Respectez les heures de silence' } },
      { icon: '🚽', title: { es: 'Plomería (Importante)', en: 'Plumbing (Important)', fr: 'Plomberie (Important)' }, content: { es: '⚠️ NO arrojes al inodoro:\n• Papel higiénico\n• Toallitas\n• Productos femeninos\n\n👉 Usa los botes de basura provistos.', en: '⚠️ Do NOT flush:\n• Toilet paper\n• Wipes\n• Feminine products\n\n👉 Please use the trash bins provided.', fr: '⚠️ NE JETEZ PAS dans les toilettes:\n• Papier toilette\n• Lingettes\n• Produits féminins\n\n👉 Utilisez les poubelles fournies.' } },
      { icon: '🧳', title: { es: 'Check-Out', en: 'Check-Out', fr: 'Départ' }, content: { es: '🕚 Check-out: 11:00 AM\n\n✔ Antes de salir:\n• Apaga A/C y luces\n• Cierra y asegura todas las puertas\n• Deja llaves/tarjetas según instrucciones\n\nSigue las instrucciones de check-out dentro de la unidad.', en: '🕚 Check-out: 11:00 AM\n\n✔ Before leaving:\n• Turn off A/C and lights\n• Close and lock all doors\n• Leave keys/access items as instructed\n\nFollow check-out instructions inside the unit.', fr: '🕚 Départ: 11h00\n\n✔ Avant de partir:\n• Éteignez la climatisation et les lumières\n• Fermez et verrouillez toutes les portes\n• Laissez les clés/cartes selon les instructions\n\nSuivez les instructions de départ dans l\'unité.' } },
      { icon: '🏥', title: { es: 'Emergencias', en: 'Emergencies', fr: 'Urgences' }, content: { es: 'Emergencias: 911\nCruz Roja: 322-222-1533\nHospital CMQ: 322-223-1919\nFarmacia Guadalajara: 322-224-1100', en: 'Emergencies: 911\nRed Cross: 322-222-1533\nCMQ Hospital: 322-223-1919\nPharmacia Guadalajara: 322-224-1100', fr: 'Urgences: 911\nCroix-Rouge: 322-222-1533\nHôpital CMQ: 322-223-1919\nPharmacie Guadalajara: 322-224-1100' } },
      { icon: '📞', title: { es: 'Contacto Castle Solutions', en: 'Contact Castle Solutions', fr: 'Contact Castle Solutions' }, content: { es: '📧 Email: info@castlesolutions.biz\n\n¡Estamos para ayudarte!', en: '📧 Email: info@castlesolutions.biz\n\nWe\'re happy to help!', fr: '📧 Email: info@castlesolutions.biz\n\nNous sommes là pour vous aider!' } },
    ]
  },
  'cielo-101': {
    name: 'El Cielo 101',
    sections: [
      { icon: '📶', title: { es: 'WiFi', en: 'WiFi', fr: 'WiFi' }, content: { es: 'Red: INFINITUMM52B5\nContraseña: KGN7T3vpWV', en: 'Network: INFINITUMM52B5\nPassword: KGN7T3vpWV', fr: 'Réseau: INFINITUMM52B5\nMot de passe: KGN7T3vpWV' } },
      { icon: '🔐', title: { es: 'Acceso al Departamento', en: 'Apartment Access', fr: 'Accès à l\'Appartement' }, content: { es: 'Código de puerta: 7330\n\n⚠️ IMPORTANTE:\n• No hay recepción. Debes agendar hora de encuentro.\n• Si no hay cita previa, podrías esperar hasta 1 hora.\n• Al entrar encontrarás tarjetas blancas para la puerta y llaves azules para el edificio.\n• Pérdida de llaves = cargo de $75 USD.\n• No dejes el seguro puesto al salir (bloquea códigos y tarjetas).', en: 'Door code: 7330\n\n⚠️ IMPORTANT:\n• No front desk. You must schedule a meeting time.\n• Without an appointment, you may wait up to 1 hour.\n• Inside you\'ll find white cards for the door and blue keys for the building.\n• Lost keys = $75 USD charge.\n• Don\'t leave the deadbolt engaged when leaving (blocks codes and cards).', fr: 'Code de porte: 7330\n\n⚠️ IMPORTANT:\n• Pas de réception. Vous devez planifier une heure de rencontre.\n• Sans rendez-vous, vous pourriez attendre jusqu\'à 1 heure.\n• À l\'intérieur, vous trouverez des cartes blanches pour la porte et des clés bleues pour le bâtiment.\n• Clés perdues = frais de 75 USD.\n• Ne laissez pas le verrou engagé en partant (bloque les codes et les cartes).' } },
      { icon: '🏢', title: { es: 'Acceso al Edificio', en: 'Building Access', fr: 'Accès au Bâtiment' }, content: { es: 'Dirección: Calle Rodolfo Gómez 393, Zona Romántica, Col. Alta Vista\nGoogle Maps: https://maps.app.goo.gl/DYcJSsZ7z7hTw7vq8\n\n🚗 En auto/taxi/Uber:\n• Destino: Calle Rodolfo Gómez\n• Es una calle empinada sin salida\n• Desde Aguacate, gira a la izquierda hasta el final\n• Edificio El Cielo junto a Restaurante Palomar de los González\n\n🚶 Caminando:\n• Hay escaleras desde Aguacate hasta Basilio Badillo (solo peatones)\n\n🛗 Elevador:\n• Entrada en Piso 3\n• Baja al Piso 1 para el depto y alberca', en: 'Address: Calle Rodolfo Gómez 393, Romantic Zone, Col. Alta Vista\nGoogle Maps: https://maps.app.goo.gl/DYcJSsZ7z7hTw7vq8\n\n🚗 By car/taxi/Uber:\n• Destination: Calle Rodolfo Gómez\n• It\'s a steep dead-end street\n• From Aguacate, turn left and go to the end\n• El Cielo building is next to Restaurant Palomar de los González\n\n🚶 Walking:\n• Stairs connect Aguacate to Basilio Badillo (pedestrians only)\n\n🛗 Elevator:\n• Entrance on Floor 3\n• Go down to Floor 1 for the apartment and pool', fr: 'Adresse: Calle Rodolfo Gómez 393, Zone Romantique, Col. Alta Vista\nGoogle Maps: https://maps.app.goo.gl/DYcJSsZ7z7hTw7vq8\n\n🚗 En voiture/taxi/Uber:\n• Destination: Calle Rodolfo Gómez\n• C\'est une rue en pente sans issue\n• Depuis Aguacate, tournez à gauche jusqu\'au bout\n• Le bâtiment El Cielo est à côté du Restaurant Palomar de los González\n\n🚶 À pied:\n• Des escaliers relient Aguacate à Basilio Badillo (piétons uniquement)\n\n🛗 Ascenseur:\n• Entrée au 3ème étage\n• Descendez au 1er étage pour l\'appartement et la piscine' } },
      { icon: '🅿️', title: { es: 'Estacionamiento', en: 'Parking', fr: 'Stationnement' }, content: { es: 'Para estadías menores a 30 días: solo estacionamiento en la calle.\nPara estacionamiento en el edificio, solicítalo con anticipación.', en: 'For stays under 30 days: street parking only.\nFor building parking, request in advance.', fr: 'Pour les séjours de moins de 30 jours: stationnement dans la rue uniquement.\nPour le stationnement dans le bâtiment, demandez à l\'avance.' } },
      { icon: '🔒', title: { es: 'Caja Fuerte', en: 'Safe', fr: 'Coffre-fort' }, content: { es: 'Hay una caja fuerte en cada recámara.\n1. Sigue las instrucciones dentro de la caja\n2. Configura tu propio código\n3. ⚠️ Pruébalo al menos una vez antes de cerrar\n4. Al salir, deja la caja abierta y resetea el código', en: 'There\'s a safe in each bedroom.\n1. Follow instructions inside the safe\n2. Set your own code\n3. ⚠️ Test it at least once before closing\n4. Before checkout, leave safe open and reset code', fr: 'Il y a un coffre-fort dans chaque chambre.\n1. Suivez les instructions à l\'intérieur du coffre\n2. Définissez votre propre code\n3. ⚠️ Testez-le au moins une fois avant de fermer\n4. Avant le départ, laissez le coffre ouvert et réinitialisez le code' } },
      { icon: '🏊', title: { es: 'Amenidades', en: 'Amenities', fr: 'Commodités' }, content: { es: 'Alberca: Piso 1 (ver horarios en el pasillo)\n⚠️ Las albercas y terrazas del Piso 6 son PRIVADAS.\n\nAsador: Disponible en área de alberca (limpiar después de usar, cerrar el gas)\n\n🚫 Sin mascotas (excepto perros de servicio)\n🚫 Sin ruido excesivo (los edificios de concreto amplifican el sonido)', en: 'Pool: Floor 1 (see hours posted in hallway)\n⚠️ 6th floor pools and terraces are PRIVATE.\n\nGrill: Available at pool area (clean after use, turn off gas)\n\n🚫 No pets (except service dogs)\n🚫 No excessive noise (concrete buildings amplify sound)', fr: 'Piscine: 1er étage (voir les horaires affichés dans le couloir)\n⚠️ Les piscines et terrasses du 6ème étage sont PRIVÉES.\n\nBarbecue: Disponible dans l\'espace piscine (nettoyer après utilisation, fermer le gaz)\n\n🚫 Pas d\'animaux (sauf chiens d\'assistance)\n🚫 Pas de bruit excessif (les bâtiments en béton amplifient le son)' } },
      { icon: '🏠', title: { es: 'Reglas de la Casa', en: 'House Rules', fr: 'Règles de la Maison' }, content: { es: '• Quítate la arena antes de entrar\n• Apaga el A/C con puertas/ventanas abiertas\n• 🚭 No fumar adentro\n• 🔇 Sin música fuerte después de las 10pm\n• Los controles están etiquetados en las paredes\n• Cargo por toallas con manchas permanentes\n• No colgar toallas en barandales del balcón\n• No arrojar objetos desde balcones', en: '• Remove sand before entering\n• Turn off A/C when doors/windows are open\n• 🚭 No smoking inside\n• 🔇 No loud music after 10pm\n• Remotes are labeled on the walls\n• Fee for permanently stained towels\n• Don\'t hang towels on balcony railings\n• Don\'t throw objects from balconies', fr: '• Enlevez le sable avant d\'entrer\n• Éteignez la climatisation si portes/fenêtres ouvertes\n• 🚭 Interdiction de fumer à l\'intérieur\n• 🔇 Pas de musique forte après 22h\n• Les télécommandes sont étiquetées sur les murs\n• Frais pour serviettes tachées de façon permanente\n• Ne pas suspendre de serviettes aux balustrades du balcon\n• Ne pas jeter d\'objets depuis les balcons' } },
      { icon: '🚽', title: { es: 'Plomería (MUY IMPORTANTE)', en: 'Plumbing (VERY IMPORTANT)', fr: 'Plomberie (TRÈS IMPORTANT)' }, content: { es: '⚠️ NO arrojes al inodoro:\n• Papel higiénico\n• Toallitas\n• Productos femeninos\n• Toallas de papel\n• NINGÚN objeto\n\nLa plomería mexicana es muy sensible.\n💰 Cargo de $50 USD por taponamiento.\nUsa el bote de basura.', en: '⚠️ Do NOT flush:\n• Toilet paper\n• Wipes\n• Feminine products\n• Paper towels\n• ANY objects\n\nMexican plumbing is very sensitive.\n💰 $50 USD charge for clogs.\nUse the trash bin provided.', fr: '⚠️ NE JETEZ PAS dans les toilettes:\n• Papier toilette\n• Lingettes\n• Produits féminins\n• Essuie-tout\n• AUCUN objet\n\nLa plomberie mexicaine est très sensible.\n💰 Frais de 50 USD en cas de bouchage.\nUtilisez la poubelle fournie.' } },
      { icon: '💧', title: { es: 'Agua', en: 'Water', fr: 'Eau' }, content: { es: 'El departamento tiene sistema de agua filtrada.\nHay un filtro adicional para el refrigerador.\n⚠️ Beber agua es bajo tu propio riesgo.', en: 'The apartment has a whole-apartment water filtration system.\nThere\'s an additional filter for the refrigerator.\n⚠️ Drinking water is at your own risk.', fr: 'L\'appartement dispose d\'un système de filtration d\'eau.\nIl y a un filtre supplémentaire pour le réfrigérateur.\n⚠️ Boire l\'eau est à vos propres risques.' } },
      { icon: '♻️', title: { es: 'Basura', en: 'Trash', fr: 'Déchets' }, content: { es: 'Deposita la basura en el punto de recolección:\n📍 Esquina de Aguacate y Pulpito\n\n⚠️ NO hay recolección de basura en el edificio El Cielo.', en: 'Dispose of trash at the collection point:\n📍 Corner of Aguacate and Pulpito\n\n⚠️ There is NO trash pickup at El Cielo building.', fr: 'Déposez les déchets au point de collecte:\n📍 Coin d\'Aguacate et Pulpito\n\n⚠️ Il n\'y a PAS de collecte de déchets au bâtiment El Cielo.' } },
      { icon: '⚡', title: { es: 'Aviso Mensual', en: 'Monthly Notice', fr: 'Avis Mensuel' }, content: { es: 'Alrededor del día 28 de cada mes (por la tarde), el HOA de Cielo necesita acceso para inspeccionar los medidores eléctricos en el cuarto de lavado.\n\nSi no estás, usaremos llave maestra. El proceso toma 1-2 minutos.', en: 'Around the 28th of each month (late afternoon), the Cielo HOA needs access to inspect electrical meters in the laundry room.\n\nIf you\'re out, we\'ll use the master key. Process takes 1-2 minutes.', fr: 'Vers le 28 de chaque mois (en fin d\'après-midi), l\'association du Cielo doit inspecter les compteurs électriques dans la buanderie.\n\nSi vous êtes absent, nous utiliserons la clé maîtresse. Le processus prend 1-2 minutes.' } },
      { icon: '🏥', title: { es: 'Emergencias', en: 'Emergencies', fr: 'Urgences' }, content: { es: 'Emergencias: 911\nCruz Roja: 322-222-1533\nHospital CMQ: 322-223-1919\nFarmacia Guadalajara: 322-224-1100', en: 'Emergencies: 911\nRed Cross: 322-222-1533\nCMQ Hospital: 322-223-1919\nPharmacia Guadalajara: 322-224-1100', fr: 'Urgences: 911\nCroix-Rouge: 322-222-1533\nHôpital CMQ: 322-223-1919\nPharmacie Guadalajara: 322-224-1100' } },
      { icon: '📞', title: { es: 'Contacto Castle Solutions', en: 'Contact Castle Solutions', fr: 'Contact Castle Solutions' }, content: { es: '📱 Host: Claudia Castillo\n📞 WhatsApp: +52 322 306 8482\n\n¡Estamos para ayudarte!', en: '📱 Host: Claudia Castillo\n📞 WhatsApp: +52 322 306 8482\n\nWe\'re happy to help!', fr: '📱 Hôte: Claudia Castillo\n📞 WhatsApp: +52 322 306 8482\n\nNous sommes là pour vous aider!' } },
    ]
  },
  'villa-magna-253a': {
    name: 'Villa Magna 253 A',
    sections: [
      { icon: '📶', title: { es: 'WiFi', en: 'WiFi', fr: 'WiFi' }, content: { es: 'Red: VillaMagna253A\nContraseña: Pendiente', en: 'Network: VillaMagna253A\nPassword: Pending', fr: 'Réseau: VillaMagna253A\nMot de passe: En attente' } },
      { icon: '📺', title: { es: 'Televisión', en: 'Television', fr: 'Télévision' }, content: { es: 'Smart TV con Netflix, Prime Video y Disney+.\nUse el control remoto para cambiar entre apps.', en: 'Smart TV with Netflix, Prime Video and Disney+.\nUse the remote to switch between apps.', fr: 'Smart TV avec Netflix, Prime Video et Disney+.\nUtilisez la télécommande pour changer d\'application.' } },
      { icon: '🔐', title: { es: 'Caja Fuerte', en: 'Safe', fr: 'Coffre-fort' }, content: { es: 'Ubicada en el closet principal.\n1. Abra la puerta\n2. Ingrese un código de 4 dígitos\n3. Presione el botón verde\n4. Para abrir: ingrese su código y presione el botón verde', en: 'Located in the main closet.\n1. Open the door\n2. Enter a 4-digit code\n3. Press the green button\n4. To open: enter your code and press the green button', fr: 'Situé dans le placard principal.\n1. Ouvrez la porte\n2. Entrez un code à 4 chiffres\n3. Appuyez sur le bouton vert\n4. Pour ouvrir: entrez votre code et appuyez sur le bouton vert' } },
      { icon: '🚪', title: { es: 'Acceso / Puerta', en: 'Access / Door', fr: 'Accès / Porte' }, content: { es: 'Código de acceso: Pendiente\nLlave física disponible en recepción.', en: 'Access code: Pending\nPhysical key available at reception.', fr: 'Code d\'accès: En attente\nClé physique disponible à la réception.' } },
      { icon: '🅿️', title: { es: 'Estacionamiento', en: 'Parking', fr: 'Stationnement' }, content: { es: 'Cajón asignado en sótano.\nUse su tarjeta de acceso para ingresar.', en: 'Assigned spot in basement.\nUse your access card to enter.', fr: 'Place assignée au sous-sol.\nUtilisez votre carte d\'accès pour entrer.' } },
      { icon: '🏊', title: { es: 'Amenidades', en: 'Amenities', fr: 'Commodités' }, content: { es: 'Alberca: 7am - 10pm\nGym: 6am - 10pm\nÁrea de asadores: 8am - 10pm', en: 'Pool: 7am - 10pm\nGym: 6am - 10pm\nBBQ area: 8am - 10pm', fr: 'Piscine: 7h - 22h\nGym: 6h - 22h\nAire de barbecue: 8h - 22h' } },
      { icon: '🍽️', title: { es: 'Restaurantes Cercanos', en: 'Nearby Restaurants', fr: 'Restaurants à Proximité' }, content: { es: '• La Leche - Cocina de autor\n• Tintoque - Mexicana contemporánea\n• Porto Bello - Italiana\n• Mariscos 8 Tostadas - Mariscos', en: '• La Leche - Author cuisine\n• Tintoque - Contemporary Mexican\n• Porto Bello - Italian\n• Mariscos 8 Tostadas - Seafood', fr: '• La Leche - Cuisine d\'auteur\n• Tintoque - Mexicain contemporain\n• Porto Bello - Italien\n• Mariscos 8 Tostadas - Fruits de mer' } },
      { icon: '🚕', title: { es: 'Transporte', en: 'Transportation', fr: 'Transport' }, content: { es: 'Uber y Didi disponibles en la zona.\nTaxi seguro: Solicitar en recepción.\nRenta de auto: Consulte en recepción.', en: 'Uber and Didi available in the area.\nSafe taxi: Request at reception.\nCar rental: Ask at reception.', fr: 'Uber et Didi disponibles dans la zone.\nTaxi sûr: Demandez à la réception.\nLocation de voiture: Demandez à la réception.' } },
      { icon: '🏥', title: { es: 'Emergencias', en: 'Emergencies', fr: 'Urgences' }, content: { es: 'Emergencias: 911\nCruz Roja: 322-222-1533\nHospital CMQ: 322-223-1919\nFarmacia Guadalajara: 322-224-1100', en: 'Emergencies: 911\nRed Cross: 322-222-1533\nCMQ Hospital: 322-223-1919\nPharmacia Guadalajara: 322-224-1100', fr: 'Urgences: 911\nCroix-Rouge: 322-222-1533\nHôpital CMQ: 322-223-1919\nPharmacie Guadalajara: 322-224-1100' } },
      { icon: '♻️', title: { es: 'Basura y Reciclaje', en: 'Trash & Recycling', fr: 'Déchets & Recyclage' }, content: { es: 'Deposite la basura en el contenedor del pasillo.\nSeparar orgánico e inorgánico.', en: 'Place trash in the hallway container.\nSeparate organic and inorganic waste.', fr: 'Déposez les déchets dans le conteneur du couloir.\nSéparez les déchets organiques et inorganiques.' } },
      { icon: '📞', title: { es: 'Contacto Castle Solutions', en: 'Contact Castle Solutions', fr: 'Contact Castle Solutions' }, content: { es: 'WhatsApp: +52 322 XXX XXXX\nEmail: info@castlesolutions.mx\nEmergencia 24/7 disponible', en: 'WhatsApp: +52 322 XXX XXXX\nEmail: info@castlesolutions.mx\n24/7 Emergency available', fr: 'WhatsApp: +52 322 XXX XXXX\nEmail: info@castlesolutions.mx\nUrgence 24/7 disponible' } },
    ]
  }
}

// Default data for properties not yet configured
const DEFAULT_SECTIONS = (name: string) => PROPERTY_DATA['villa-magna-253a'].sections.map(s => ({...s}))

function getPropertyData(slug: string): PropertyData {
  if (PROPERTY_DATA[slug]) return PROPERTY_DATA[slug]
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return { name, sections: DEFAULT_SECTIONS(name) }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const slug = params.slug
  const guestName = searchParams.get('guest') || ''
  const langParam = searchParams.get('lang') || 'es'
  const [lang, setLang] = useState<Lang>(langParam as Lang)
  const [openSection, setOpenSection] = useState<number | null>(null)
  const [showBanner, setShowBanner] = useState(true)

  const data = getPropertyData(slug)

  const quickIcons = data.sections.slice(0, 4)

  const welcomeTexts = {
    hello: { es: '¡Hola', en: 'Hello', fr: 'Bonjour' },
    welcome: { es: 'Bienvenido(a) a Puerto Vallarta', en: 'Welcome to Puerto Vallarta', fr: 'Bienvenue à Puerto Vallarta' },
    intro: { es: 'Esperamos hacer de tu estancia una experiencia inolvidable. Aquí tienes todo lo que necesitas.', en: 'We hope to make your stay an unforgettable experience. Here\'s everything you need.', fr: 'Nous espérons faire de votre séjour une expérience inoubliable. Voici tout ce dont vous avez besoin.' },
    guide: { es: 'Tu Guía Personal', en: 'Your Personal Guide', fr: 'Votre Guide Personnel' },
    report: { es: 'Reportar un Problema', en: 'Report an Issue', fr: 'Signaler un Problème' },
    operated: { es: 'Operado por', en: 'Operated by', fr: 'Géré par' },
    help: { es: '¿Necesitas ayuda? Toca "Contacto" arriba', en: 'Need help? Tap "Contact" above', fr: 'Besoin d\'aide? Appuyez sur "Contact" ci-dessus' }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-4 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="Castle Solutions" className="h-20 w-auto" />
          <div className="lang-toggle">
            <button className={`lang-btn ${lang === 'es' ? 'active' : ''}`} onClick={() => setLang('es')}>🇲🇽</button>
            <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>🇺🇸</button>
            <button className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} onClick={() => setLang('fr')}>🇫🇷</button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Welcome Banner */}
        {guestName && showBanner && (
          <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-castle-dark via-gray-900 to-castle-dark p-6 text-center shadow-lg">
            <button onClick={() => setShowBanner(false)} className="absolute top-3 right-3 text-white/40 hover:text-white/70 transition">
              <X className="w-5 h-5" />
            </button>
            <div className="text-castle-gold text-3xl mb-2">🏰</div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {welcomeTexts.hello[lang]}, {guestName}!
            </h2>
            <p className="text-castle-gold font-medium text-lg mb-2">
              {welcomeTexts.welcome[lang]}
            </p>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
              {welcomeTexts.intro[lang]}
            </p>
            <div className="mt-3 flex justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-castle-gold/60"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-castle-gold"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-castle-gold/60"></span>
            </div>
          </div>
        )}

        {/* Property title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-castle-gold/10 rounded-full mb-3">
            <span className="text-castle-gold text-sm font-semibold">🏠 {data.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {welcomeTexts.guide[lang]}
          </h1>
        </div>

        {/* Quick access icons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickIcons.map((s, i) => (
            <button key={i} onClick={() => setOpenSection(openSection === i ? null : i)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all bg-gray-50 hover:bg-gray-100">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">{s.title[lang] || s.title.en}</span>
            </button>
          ))}
        </div>

        {/* Accordion sections */}
        <div className="space-y-2">
          {data.sections.map((section, i) => (
            <div key={i} className="rounded-xl overflow-hidden transition-all border border-gray-100">
              <button onClick={() => setOpenSection(openSection === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors bg-white hover:bg-gray-50">
                <span className="text-xl flex-shrink-0">{section.icon}</span>
                <span className="font-medium text-gray-800 flex-1">{section.title[lang] || section.title.en}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openSection === i ? 'rotate-180' : ''}`} />
              </button>
              {openSection === i && (
                <div className="px-4 pb-4 bg-gray-50">
                  <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{section.content[lang] || section.content.en}</p>
                  {section.videoUrl && (
                    <div className="mt-3">
                      <a href={section.videoUrl} target="_blank" rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-castle-gold text-sm font-medium">
                        ▶ Video
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Report issue button */}
        <div className="mt-8 mb-6">
          <a href={`/report?type=renter&property=${encodeURIComponent(data.name)}&lang=${lang}`}
            className="block w-full text-center bg-castle-gold text-white font-semibold py-3.5 rounded-xl hover:bg-yellow-600 transition-colors shadow-sm">
            ⚠️ {welcomeTexts.report[lang]}
          </a>
        </div>

        {/* Footer */}
        <div className="text-center pb-6">
          <p className="text-xs text-gray-400">
            {welcomeTexts.operated[lang]} <span className="text-castle-gold font-medium">Castle Solutions</span>
          </p>
          <p className="text-xs text-gray-300 mt-1">
            {welcomeTexts.help[lang]}
          </p>
        </div>
      </div>
    </div>
  )
}

