import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const supabase = createClient(cookies())

  const body = await req.json()
  const {
    firstName,
    lastName,
    phone,
    email,
    role,
    supabaseId,
  } = body

  const { error: insertError } = await (await supabase).from('users').insert({
    id: supabaseId,
    email,
    password: '', // optional: or hash if needed
    firstName,
    lastName,
    phone,
    role,
    createdAt: new Date().toISOString(),
  })

  if (insertError) {
    console.error('DB insert error:', insertError.message)
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
