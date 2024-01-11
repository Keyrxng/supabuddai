import { cookies } from "next/headers"
import Agent from "@/classes/Agent"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const body = await request.json()

  const { fileIds, assistantId } = body

  const userId = (await supabase.auth.getUser()).data.user?.id

  if (!userId) return new Response("Unauthorized", { status: 401 })

  const agent = new Agent(process.env.OPENAI_API_KEY!)

  const run = await agent.runThread(assistantId, userId)

  return new Response(JSON.stringify(run), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
