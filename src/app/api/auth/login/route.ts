import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)

  const { email, password } = await request.json()

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (!data?.user?.id)
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }

  return NextResponse.redirect(requestUrl.origin)
}
