import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({
      cookies: () => cookieStore,
    })
    const { data } = await supabase.auth.exchangeCodeForSession(code)
    await supabase.auth.setSession({
      access_token: data.session?.access_token || "",
      refresh_token: data.session?.refresh_token || "",
    })
  }

  return NextResponse.redirect(requestUrl.origin)
}
