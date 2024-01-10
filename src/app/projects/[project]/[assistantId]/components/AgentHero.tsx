"use client"

import React, { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format, formatDistance, parseISO, subDays } from "date-fns"
import { FileUpIcon, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
})

function AgentHero({
  project,
  assistantResp,
  threads,
  threadToUse,
}: {
  project: string
  assistantResp: any
  threads: any
  threadToUse?: any
}) {
  const [status, setStatus] = React.useState("Idle")
  const [hover, setHover] = React.useState(false)

  const handleReadFile = async (fileId: string) => {
    const data = await fetch("/api/ai/read-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileId: fileId,
      }),
    })
    const json = await data.json()
    console.log(json)
    return json
  }

  const handleRun = async () => {
    if (!assistantResp[0].id) {
      toast.error("No assistant found")
      return
    }

    const data = await fetch("/api/ai/create-and-run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileIds: assistantResp[0].file_ids,
        assistantId: assistantResp[0].assistant.id,
      }),
    })
    const dataJson = await data.json()

    const { data: threadUpload, error } = await supabase
      .from("threads")
      .insert({
        run: dataJson.run,
        run_id: dataJson.id,
        assistant_id: dataJson.assistant_id,
        thread_id: dataJson.thread_id,
      })

    if (error) {
      console.error(error)
      return
    }

    window.location.href = `/projects/${project}/${assistantResp[0].assistant.id}/${dataJson.thread_id}`

    return dataJson
  }

  const Spinner = () => {
    const [running, setRunning] = React.useState(false)
    const [runData, setRunData] = React.useState()

    useEffect(() => {
      async function load() {
        const data = await fetch("/api/ai/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId:
              threadToUse?.[0].thread_id ??
              threads[threads.length - 1].thread_id,
            runId:
              threadToUse?.[0].run_id ?? threads[threads.length - 1].run_id,
          }),
        })

        const json = await data.json()
        setRunData((prev) => json)

        setRunning(true)

        return json
      }
      load()

      const interval = setInterval(() => {
        load()

        if (runData?.status === "completed") {
          clearInterval(interval)
        }
      }, 15000)

      return () => clearInterval(interval)
    }, [running])

    const pulser = (
      <div
        id="spinner"
        className=" animate-pulse  self-center justify-center align-middle rounded-full h-8 w-8 border-t-2 border-b-2 border-green-900/75"
      />
    )
    const spinner = (
      <div className="animate-spin self-center justify-center align-middle rounded-full h-8 w-8 border-t-2 border-b-2 border-green-900/75" />
    )
    const pinger = (
      <div className="animate-ping delay-600 duration-1000  self-center justify-center align-middle rounded-full h-8 w-8 border-t-2 border-b-2 border-green-900/75" />
    )

    const lastRun = (runData) => {
      if (runData.status === "in_progress") return "Running..."
      if (!runData.completed_at) return "Never"
      const ist = formatDistance(runData.completed_at * 1000, new Date(), {
        addSuffix: true,
      })

      return ist
    }

    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          cursor: "wait",
        }}
        className="col-span-1 cursor-wait grid grid-cols-1"
      >
        <div className="flex flex-col">
          <div className="flex flex-col rounded-md h-full justify-between bg-current/15">
            <div className="flex flex-row justify-center gap-1 font-light">
              <div className="flex flex-row gap-1 justify-center border-gray-800 border-b">
                <p className="text-sm text-muted">Status:</p>
                <p className="text-sm text-muted">
                  {runData?.status ?? "Loading..."}
                </p>
              </div>
            </div>

            {runData?.status === "in_progress"
              ? spinner
              : hover
                ? pinger
                : pulser}

            <div className="flex flex-row gap-1 justify-center">
              <p className="text-sm text-muted">Last Run:</p>
              <p className="text-sm text-muted">
                {runData && runData.created_at ? (
                  <>{lastRun(runData)}</>
                ) : runData?.status === "in_progress" ? (
                  "Running..."
                ) : (
                  "Loading..."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleDelete = async (thread_ID: string) => {
    const { data, error } = await supabase
      .from("threads")
      .delete()
      .eq("thread_id", thread_ID)

    if (error) {
      console.error(error)
      toast.error("Run could not be deleted")
      return
    }

    toast.success("Run deleted")

    if (
      window.location.href ===
      `/projects/${project}/${assistantResp[0].assistant.id}/${thread_ID}`
    ) {
      window.location.href = `/projects/${project}/${assistantResp[0].assistant.id}`
    } else {
    }
  }

  return (
    <Card className="col-span-3 max-h-72 border-gray-800">
      <CardContent className="grid grid-cols-4 gap-4 h-64 m-2 p-8">
        <div className="col-span-1 grid grid-cols-1 ">
          <div className="grow">
            <h2 className="text-2xl font-bold">
              {assistantResp[0].assistant.name}
            </h2>

            <p className="text-sm text-muted">
              {assistantResp[0].assistant.model}
            </p>
            <div className="flex h-1/2"></div>
            <div className="grid w-fit">
              <Button
                onClick={() => handleRun()}
                className="grid grid-cols-1 bg-green-900/75 hover:bg-green-900"
              >
                New Run
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full ">
          <p className="text-sm font-bold border-b mb-4 cursor-default border-gray-800">
            Previous Runs
          </p>
          {threads.length > 0 &&
            threads.toReversed().map((thread: any) => {
              return (
                <div key={thread.id} className="flex flex-col">
                  <div className="flex w-full justify-between border-b hover:border-gray-800 dark:hover:border-gray-800 cursor-pointer">
                    <a
                      href={`/projects/${project}/${assistantResp[0].assistant.id}/${thread.thread_id}`}
                      className="-z-0 flex justify-between w-full"
                    >
                      {" "}
                      <p className="text-sm font-light">
                        {thread.thread_id.split("_")[1].slice(0, 8)}
                      </p>
                      <div className="flex flex-row gap-2">
                        <p className="text-xs pt-1 text-gray-500 dark:text-gray-400">
                          {format(parseISO(thread.created_at), "dd/MM/yyyy")}{" "}
                        </p>
                      </div>
                    </a>
                    <X
                      onClick={() => handleDelete(thread.thread_id)}
                      className="w-5 z-10 pt-0.5 h-5  text-gray-500 dark:text-gray-400 dark:hover:text-red-700"
                    />
                  </div>
                </div>
              )
            })}
        </div>

        <Spinner />

        <div className="col-span-1 text-center grid gap-2 grid-flow-col justify-between">
          <Card
            onClick={() => handleReadFile(assistantResp[0].schema.id)}
            className="grid w-32 h-full cursor-pointer"
          >
            <CardTitle className="text-xs m-2">
              {assistantResp[0].schema.filename.split(".")[0]}
            </CardTitle>
            <CardContent className="flex flex-col justify-center items-center">
              <FileUpIcon className="w-16 h-16" />
            </CardContent>
            <div className="flex justify-end text-sm m-2 bottom-0 right-0 text-muted">
              <p>{(assistantResp[0].schema.bytes / 1024).toPrecision(2)}</p>
              <p className="text-xs mt-[3px]">kb</p>
            </div>
          </Card>
          <Card
            onClick={() => handleReadFile(assistantResp[0].policy.id)}
            className="grid w-32 h-full cursor-pointer"
          >
            <CardTitle className="text-xs m-2">
              {assistantResp[0].policy.filename.split(".")[0]}
            </CardTitle>
            <CardContent className="flex flex-col justify-center items-center">
              <FileUpIcon className="w-16 h-16" />
            </CardContent>
            <div className="flex justify-end text-sm m-2 bottom-0 right-0 text-muted">
              <p>{(assistantResp[0].policy.bytes / 1024).toPrecision(2)}</p>
              <p className="text-xs mt-[3px]">kb</p>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

export default AgentHero
