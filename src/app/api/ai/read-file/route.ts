import * as fs from "fs/promises"
import { cookies } from "next/headers"
import Agent from "@/classes/Agent"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const body = await request.json()

  const { threadId, messageId, fileId } = body

  const agent = new Agent(process.env.OPENAI_API_KEY!)
  let resp = null
  try {
    resp = await agent.readFile(threadId, messageId, fileId)
  } catch (err) {}
  let resp2 = null

  try {
    const resss = await agent.readFileString(fileId)
    resp2 = await resss.json()
  } catch (err) {}

  console.log("resp", resp2)

  if (resp.error) {
    return new Response(JSON.stringify(resp), {
      status: 400,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

  if (resp2.error) {
    return new Response(JSON.stringify(resp2), {
      status: 400,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

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
