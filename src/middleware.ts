import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const sesh = await supabase.auth.getSession()

  if (!sesh) {
    // return NextResponse.redirect("/login")
  }

  return res
}
