import { cookies } from "next/headers"
import Agent from "@/classes/Agent"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  })

  const body = await request.json()

  const { threadId, assistantId } = body

  const userId = (await supabase.auth.getUser()).data.user?.id

  if (!userId)
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
      },
    })

  const agent = new Agent(process.env.OPENAI_API_KEY!)

  //   {
  //     "index": 21,
  //     "schema": "public",
  //     "table": "usage_tiers",
  //     "policy": "Enable read access for all users",
  //     "test": "const test_21 = async (supabase) => {         let response;n          switch ("public") {n            case \"public\":\n              switch (\"S\") {\n                case \"I\":\n                  response = await supabase.from('usage_tiers').insert([{}]); // Insert some data\n                  break;\n                case \"S\":\n                  response = await supabase.from('usage_tiers').select().limit(1);\n                  break;\n                case \"U\":\n                  response = await supabase.from('usage_tiers').update({});\n                  break;\n                case \"D\":\n                  response = await supabase.from('usage_tiers').delete();\n                  break;\n              }\n              break;\n            case \"storage\":\n              switch (\"S\") {\n                case \"I\":\n                  response = await supabase.storage.from('usage_tiers').upload('path', new Blob());\n                  break;\n                case \"S\":\n                  response = await supabase.storage.from('usage_tiers').list();\n                  break;\n                case \"U\":\n                  // Storage update is not a standard operation in Supabase\n                  break;\n                case \"D\":\n                  response = await supabase.storage.from('usage_tiers').remove(['path']);\n                  break;\n              }\n              break;\n          }\n          return response.error === null;\n        };"
  // }
  const test_21 = async (supabase) => {
    let response
    switch ("public") {
      case "public":
        switch ("S") {
          case "I":
            response = await supabase.from("usage_tiers").insert([{}])
            break
          case "S":
            response = await supabase.from("usage_tiers").select().limit(1)
            break
          case "U":
            response = await supabase.from("usage_tiers").update({})
            break
          case "D":
            response = await supabase.from("usage_tiers").delete()
            break
        }
        break
      case "storage":
        switch ("S") {
          case "I":
            response = await supabase.storage
              .from("usage_tiers")
              .upload("path", new Blob())
            break
          case "S":
            response = await supabase.storage.from("usage_tiers").list()
            break
          case "U":
            break
          case "D":
            response = await supabase.storage
              .from("usage_tiers")
              .remove(["path"])
            break
        }
        break
    }
    return response.error === null
  }

  const run = await agent.generateTests(threadId, assistantId)

  return new Response(JSON.stringify(run), {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
