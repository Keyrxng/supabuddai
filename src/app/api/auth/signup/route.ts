import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const body = await request.json()

  const { name, email, password } = body

  const requestUrl = new URL(request.url)

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  try {
    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,

      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${requestUrl.origin}/api/auth/callback`,
      },
    })

    if (error) {
      console.log("signup error", error)
      return new Response(JSON.stringify(error), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      })
    }

    return NextResponse.redirect(requestUrl.origin)
  } catch (err) {
    console.log("caught signup err", err)
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    })
  }
}
