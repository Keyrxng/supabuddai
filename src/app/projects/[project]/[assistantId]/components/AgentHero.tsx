"use client"

import React from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FileUpIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
})

function AgentHero({ assistantResp }: { assistantResp: any }) {
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

    const data = await fetch("/api/ai/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileIds: [assistantResp[0].schema.id, assistantResp[0].policy.id],
        assistant_id: assistantResp[0].assistant.id,
      }),
    })
    const dataJson = await data.json()

    console.log("dataJson: ", dataJson)

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

    return dataJson
  }

  return (
    <Card className="col-span-3 max-h-72">
      <CardContent className="grid grid-cols-3 gap-4 h-64 m-2 p-8">
        <div className="col-span-1 grid grid-cols-1">
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

        <div className="col-span-1 grid grid-cols-1">
          <div className="flex flex-col ">
            <div className="flex flex-col rounded-md h-full justify-between bg-green-900/25">
              <div className="flex flex-row gap-1 justify-center">
                <p className="text-sm text-muted">Last Run:</p>
                <p className="text-sm text-muted">0/0/0</p>
              </div>
              <div className="animate-spin self-center justify-center align-middle rounded-full h-8 w-8 border-t-2 border-b-2 border-green-900/75"></div>
              <div className="flex flex-row justify-center gap-1">
                <p className="text-sm text-muted">Status:</p>
                <p className="text-sm text-muted">Running</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 text-center grid gap-2 grid-cols-2">
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
