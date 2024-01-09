import { cookies } from "next/headers"
import Agent from "@/classes/Agent"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const body = await request.json()

  const { thread_id } = body

  const agent = new Agent(process.env.OPENAI_API_KEY!)

  const resp = await agent.listThreadRuns(thread_id)

  const resp2 = await agent.getThreadMessages(thread_id)

  const data = {
    resp,
    resp2,
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
