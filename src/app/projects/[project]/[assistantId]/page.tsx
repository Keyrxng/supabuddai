import React from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import AgentHero from "./components/AgentHero"
import RunDataTable from "./components/RunDataTable"

export default async function Page(params: { [x: string]: never }) {
  const assistantId: string = params.params["assistantId"]
  const cookieStore = cookies()
  console.log("params: ", params)
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })

  const { data: user, error } = await supabase.auth.getUser()
  if (error) {
    console.error("GET USER ERROR: ", error)
    return
  }

  const { data: assistantResp, error: assistantError } = await supabase
    .from("assistants")
    .select("*")
    .eq("id", assistantId)

  if (assistantError) {
    console.error("assistantError: ", assistantError)
    return
  }

  return (
    <div className="m-12 grid grid-cols-3 h-screen gap-4">
      <AgentHero assistantResp={assistantResp} />
      <RunDataTable assistantResp={assistantResp} />
    </div>
  )
}

{
  /* 
            assistant: {
      tools: [Array],
      object: 'assistant',
      file_ids: [Array],
      metadata: [Object],
      created_at: 1704735367,
      description: 'SupaBuddAi, a Supabase RLS security expert.',
      instructions: '\n' +
        'You are SupaBuddAi, a Supabase RLS security expert, you are equipped to handle tasks involving the review and penetration test planning of RLS policies using database schemas in TypeScript. You will analyse the complete TypeScript type schema and all RLS policies, including schema name, table name, policy name, condition, check, command, and role. You will generate JSON structures detailing the necessary tests for each policy. These JSONs will contain schema, table, policy, and test context, describing how each policy should be tested against considering the parameters of the RLS policy in-scope.\n'
    },
     */
}
