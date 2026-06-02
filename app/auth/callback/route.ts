import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const redirectUrl = next.includes('mycerts')
        ? `${process.env.NEXT_PUBLIC_MY_CERTS_URL}/login`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/login`
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
