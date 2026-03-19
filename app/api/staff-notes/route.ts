import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('staff_notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json({ notes: data })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ notes: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { staff_name, property, category, note, photo } = body

    const { data, error } = await supabase
      .from('staff_notes')
      .insert([{
        staff_name,
        property,
        category,
        note,
        photo,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, note: data?.[0] })
  } catch (error) {
    console.error('Error saving note:', error)
    return NextResponse.json({ success: false, error: 'Failed to save note' }, { status: 500 })
  }
}
