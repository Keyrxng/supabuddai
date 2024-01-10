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

  if (!threadId || !messageId || !fileId) {
    return new Response(
      JSON.stringify({ error: "missing threadId, messageId, or fileId" }),
      {
        status: 400,
        headers: {
          "Content-Type": "text/plain",
        },
      }
    )
  }

  const agent = new Agent(process.env.OPENAI_API_KEY!)
  let resp = null
  try {
    resp = await agent.readFile(threadId, messageId, fileId)
  } catch (err) {
    console.log(err)
  }
  let resp2 = null

  try {
    resp2 = await agent.readFileString(fileId)
  } catch (err) {
    console.log(err)
  }

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
