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

  const { data: threads, error: threadsErr } = await supabase
    .from("threads")
    .select("*")
    .eq("assistant_id", assistantResp[0].assistant.id)

  if (assistantError) {
    console.error("assistantError: ", assistantError)
    return
  }

  return (
    <div className="m-12 max-h-screen">
      <AgentHero assistantResp={assistantResp} threads={threads} />
      <RunDataTable assistantResp={assistantResp} threads={threads} />
    </div>
  )
}
