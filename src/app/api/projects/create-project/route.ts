import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const formData = await request.json()
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const { data, error } = await supabase.from("user_projects").insert({
    db_name: formData.name,
    db_url: formData.url,
    db_pass: formData.pass,
    db_ref: formData.ref,
    db_key: formData.key,
  })

  if (error) {
    console.log("error", error)
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
