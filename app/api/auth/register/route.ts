import { NextResponse } from 'next/server'
import { supabase } from "@/utils/supabase/client";
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {

  const body = await req.json()
  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    role,
    supabaseId,
  } = body

  const user = await supabase.auth.getUser()
  if (user) {
    console.error("User already exists:", user.data.user?.id)
  }
    const hashed = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase.from('users').insert({
    id: supabaseId,
    email,
    password: hashed,
    firstName,
    lastName,
    phone,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  

  if (insertError) {
    console.error('DB insert error:', insertError.message)
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
