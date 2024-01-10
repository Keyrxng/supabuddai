import React from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import AgentHero from "../components/AgentHero"
import RunDataTable from "../components/RunDataTable"

export default async function Page(params: { [x: string]: never }) {
  const assistantId: string = params.params["assistantId"]
  const project: string = params.params["project"]
  const threadId: string = params.params["runId"]

  const cookieStore = cookies()
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
    .eq("assistant_id", assistantId)

  if (assistantError) {
    console.error("assistantError: ", assistantError)
    return
  }

  const threadToUse = threads.filter((thread) => thread.thread_id === threadId)

  return (
    <div className="m-12 max-h-screen">
      <AgentHero
        project={project}
        assistantResp={assistantResp}
        threads={threads}
        threadToUse={threadToUse}
      />
      <RunDataTable
        threadToUse={threadToUse}
        assistantId={assistantId}
        threads={threads}
      />
    </div>
  )
}
