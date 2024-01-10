import { cookies } from "next/headers"
import Agent from "@/classes/Agent"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const body = await request.json()

  const { fileIds, assistant_id } = body

  const userId = (await supabase.auth.getUser()).data.user?.id

  const agent = new Agent(process.env.OPENAI_API_KEY!)

  const run = await agent.createMessage(assistant_id, fileIds)

  return new Response(JSON.stringify(run), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
