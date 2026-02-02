import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Provider = {
  id: string
  name: string
  phone: string | null
  email: string | null
  category: string
  notes: string | null
  active: boolean
  created_at: string
}

export type Incident = {
  id: string
  property_name: string
  reporter_type: string
  reporter_name: string | null
  reporter_contact: string | null
  category: string
  description: string
  urgency: string
  status: string
  provider_id: string | null
  photo_url: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  provider?: Provider
}

export type IncidentUpdate = {
  id: string
  incident_id: string
  message: string
  status_change: string | null
  created_by: string | null
  created_at: string
}
