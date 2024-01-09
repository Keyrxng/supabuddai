import { cookies } from "next/headers"
import Agent from "@/classes/Agent"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const body = await request.json()

  const { name, rlsData, schemaData } = body

  const agent = new Agent(process.env.OPENAI_API_KEY!)

  const rlsFile = new File([JSON.stringify(rlsData)], "rls.json", {
    type: "application/json",
  })

  const schemaFile = new File([schemaData], "schema.text", {
    type: "text/plain",
  })

  const { schema, policy, assistant } = await agent.assistantFileUpload(
    rlsFile,
    schemaFile,
    name
  )

  const { data, error: assistantInsertError } = await supabase
    .from("assistants")
    .insert({
      id: assistant.id,
      assistant,
      schema: schema,
      policy: policy,
    })

  if (assistantInsertError) {
    console.log("error", assistantInsertError)
    return new Response(JSON.stringify(assistantInsertError), {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

  const { data: projId, error: projIdError } = await supabase
    .from("user_projects")
    .select("*")
    .eq("db_name", name)
    .single()

  const { data: reqs, error: reqsError } = await supabase
    .from("project_reqs")
    .insert({
      id: projId?.id,
      assistant_id: assistant.id,
      rls: rlsData,
      schema: schemaData,
    })

  if (reqsError) {
    console.log("error", reqsError)
    return new Response(JSON.stringify(reqsError), {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

  if (projIdError) {
    console.log("error", projIdError)
    return new Response(JSON.stringify(projIdError), {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }

  return new Response(JSON.stringify(assistant), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
