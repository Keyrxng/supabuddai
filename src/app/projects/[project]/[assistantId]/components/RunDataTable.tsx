"use client"

import { parse } from "path"
import React, { useCallback, useEffect, useState } from "react"
import { Label } from "@radix-ui/react-dropdown-menu"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format, parseISO, set } from "date-fns"
import { toast } from "sonner"

import { handleViewFile, reformatMessage } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { TestGenTable } from "./TestGenTable"
import { TestPlanTable } from "./TestPlanTable"
import { Badge } from "@/components/ui/badge"

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
})

function RunDataTable({
  threads,
  assistantId,
  threadToUse,
}: {
  threads: any
  assistantId: any
  threadToUse?: any
}) {
  const [user, setUser] = useState(null)
  const [recentRun, setRecentRun] = useState(null)

  useEffect(() => {
    async function load() {
      const data = await fetch("/api/ai/fetch-thread", {
        method: "POST",
        body: JSON.stringify({
          thread_id:
            threadToUse?.[0]?.thread_id ?? threads[threads.length - 1].thread_id,
        }),
      })
      const json = await data.json()

      setRecentRun(json)
    }
    load()
  }, [threadToUse, threads])

  const handleRefresh = async () => {
    const data = await fetch("/api/ai/fetch-thread", {
      method: "POST",
      body: JSON.stringify({
        thread_id:
          threadToUse?.[0]?.thread_id ?? threads[threads.length - 1].thread_id,
      }),
    })
    const json = await data.json()

    console.log("handleRefresh: ", json)

    setRecentRun(json)
  }

  return (
    <div className="col-span-3 grid grid-cols-3 gap-4 my-4">
      <Tabs defaultValue="test_plan" className="w-full col-span-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="test_plan">Plan</TabsTrigger>
          <TabsTrigger value="test_gen">Generate</TabsTrigger>
          <TabsTrigger value="test_exec">Execute</TabsTrigger>
        </TabsList>

        <TabsContent value="test_plan">
          <Card className="col-span-2 border-gray-800">
            <CardHeader className="">
              <CardTitle className="flex justify-between border-b mb-1 border-gray-800 gap-2">
                {threadToUse?.[0]?.thread_id.split("_")[1].slice(0, 8) ??
                  threads[threads.length - 1].thread_id
                    .split("_")[1]
                    .slice(0, 8)}
                <CardDescription className="flex flex-row gap-2">
                  Planning Phase
                </CardDescription>
                <span className="text-xs bottom-0 mt-3 text-gray-500 dark:text-gray-400">
                  {format(
                    parseISO(
                      threadToUse?.[0]?.created_at ??
                        threads[threads.length - 1].created_at
                    ),
                    "dd/MM/yyyy"
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col w-full overflow-y-scroll ">
              {threads && threads.length > 0 && (
                <>
                  <div className="flex flex-row justify-between ">
                    {recentRun && (
                      <div className="h-full w-full ">
                        {recentRun && <TestPlanTable recentRun={recentRun} />}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="test_gen">
          <Card className="col-span-2 w-full border-gray-800">
            <CardHeader className="">
              <CardTitle className="flex justify-between border-b mb-1 border-gray-800 gap-2">
                {threadToUse?.[0]?.thread_id.split("_")[1].slice(0, 8) ??
                  threads[threads.length - 1].thread_id
                    .split("_")[1]
                    .slice(0, 8)}
                <CardDescription className="flex flex-row gap-2">
                  Generation Phase
                </CardDescription>
                <span className="text-xs bottom-0 mt-3 text-gray-500 dark:text-gray-400">
                  {format(
                    parseISO(
                      threadToUse?.[0]?.created_at ??
                        threads[threads.length - 1].created_at
                    ),
                    "dd/MM/yyyy"
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col w-full ">
              {threads && threads.length > 0 && (
                <>
                  <div className="flex flex-row justify-between ">
                    {recentRun && (
                      <div className="h-full w-full ">
                        <TestGenTable
                          threads={threads}
                          recentRun={recentRun}
                          assistantId={assistantId}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="test_exec">
          <Card className="col-span-2 border-gray-800">
            <CardHeader className="">
              <CardTitle className="flex justify-between border-b mb-1 border-gray-800 gap-2">
                {threadToUse?.[0]?.thread_id.split("_")[1].slice(0, 8) ??
                  threads[threads.length - 1].thread_id
                    .split("_")[1]
                    .slice(0, 8)}
                <CardDescription className="flex flex-row gap-2">
                  Execution Phase
                </CardDescription>
                <span className="text-xs bottom-0 mt-3 text-gray-500 dark:text-gray-400">
                  {format(
                    parseISO(
                      threadToUse?.[0]?.created_at ??
                        threads[threads.length - 1].created_at
                    ),
                    "dd/MM/yyyy"
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col w-full overflow-y-scroll ">
              {threads && threads.length > 0 && (
                <>
                  <div className="flex flex-row justify-between ">
                    {recentRun && (
                      <div className="h-full w-full ">Component to come</div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="col-span-1 border-gray-800 max-h-[655px]  overflow-y-scroll ">
        <CardHeader>
          <CardTitle className="flex justify-between gap-2 align-middle cursor-default  text-center border-b border-gray-800">
            <div className="flex flex-row gap-2">
            Run Logs
            <Badge className="bg-green-900/25 h-min ">
              {recentRun && recentRun.resp.data?.length ?? 0}
              
              /{recentRun && recentRun.resp.data?.length ?? 0}
            </Badge>
            </div>
            
            <Button
              className="bg-green-900/75 mb-1 hover:bg-green-900 cursor-pointer"
              size="sm"
              onClick={() => handleRefresh()}
            >
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col w-full">
          <div className="flex flex-col justify-between">
            {recentRun && (
              <div >
                {recentRun.resp2.data.length > 0 &&
                  recentRun.resp2.data.map((test: any, i) => {
                    const res = reformatMessage({
                      message: test,
                      recentRun: recentRun,
                    })

                    return (
                      <div
                        key={i}
                        className="flex gap-2 border-b m-2 border-gray-800"
                      >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {test.content[0].text.value}
                        </p>
                        <div className="flex flex-col">
                          {res &&
                            res.map((citation: any, i) => {
                              return (
                                <div
                                  key={i}
                                  className="flex flex-row justify-between"
                                >
                                  <Button
                                    className="bg-green-900/75 hover:bg-green-900 "
                                    size="sm"
                                    onClick={() =>
                                      handleViewFile({
                                        fileId: citation.file_id,
                                        messageId: citation.message_id,
                                        threadId: citation.thread_id,
                                      })
                                    }
                                  >
                                    View
                                  </Button>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RunDataTable
