import { cookies } from "next/headers"
import Agent from "@/classes/Agent"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const body = await request.json()

  const { assistantId } = body

  const agent = new Agent(process.env.OPENAI_API_KEY!)

  const resp = await agent.fetchAssistant(assistantId)

  return new Response(JSON.stringify(resp), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
