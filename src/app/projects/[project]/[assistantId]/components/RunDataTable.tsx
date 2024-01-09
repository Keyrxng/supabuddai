"use client"

import { parse } from "path"
import React, { useCallback, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format, parseISO, set } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TestSuiteDataTable } from "@/components/TestSuiteDataTable"

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
})

function RunDataTable({
  assistantResp,
  threads,
}: {
  assistantResp: any
  threads: any
}) {
  const [user, setUser] = useState(null)
  const [recentRun, setRecentRun] = useState(null)

  console.log("threads: ", threads)
  console.log("assistantResp: ", assistantResp)

  useEffect(() => {
    async function load() {
      const { data: user, error } = await supabase.auth.getUser()
      if (error) {
        console.error("GET USER ERROR: ", error)
        toast.error("Error getting user")
        return
      }

      setUser(user.user)
    }
    load()
  }, [])

  useEffect(() => {
    async function load() {
      const data = await fetch("/api/ai/fetch-thread", {
        method: "POST",
        body: JSON.stringify({
          thread_id: threads[threads.length - 1].thread_id,
        }),
      })
      const json = await data.json()
      console.log("json: ", json)

      setRecentRun(json)
    }
    load()
  }, [threads])

  const handleResumeRun = async () => {
    if (!recentRun) {
      toast.error("No recent run found")
      return
    }

    const data = await fetch("/api/ai/resume-run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thread_id: recentRun.thread_id,
      }),
    })
    const json = await data.json()
    console.log("json: ", json)
    return json
  }

  useEffect(() => {
    // const interval = setInterval(async () => {
    //   const threadId = threads[threads.length - 1].thread_id
    //   const data = await fetch("/api/ai/fetch-thread", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       thread_id: threadId,
    //     }),
    //   })
    //   const json = await data.json()
    //   setRecentRun(json)
    // }, 10000)
    // return () => clearInterval(interval)
  }, [threads])

  const reformatMessage = useCallback(
    (message: any) => {
      if (!recentRun) {
        return
      }
      let message_content = message.content[0].text
      let annotations = message_content.annotations
      let citations = new Set()
      let file_citations = []

      for (let index = 0; index < annotations.length; index++) {
        let annotation = annotations[index]

        if (annotation.type === "file_path") {
          let cited_file = annotation.file_path.file_id
          const regexForCitation =
            /(\[Download )(.+)(\]\(sandbox:\/mnt\/data\/)(.+)(\))/g

          message_content.value = message_content.value.replace(
            regexForCitation,
            ""
          )

          file_citations.push({
            file_id: cited_file,
            message_id: message.id,
            thread_id: message.thread_id,
          })
        } else if (annotation.type === "file_citation") {
          let cited_file = annotation.file_citation.file_id
          const regexForCitation = /【(\d+)†source】/g

          message_content.value = message_content.value.replace(
            regexForCitation,
            ""
          )

          citations.add(`${index + 1}. [${cited_file.slice(0, 8)}]`)

          file_citations.push({
            file_id: cited_file,
            message_id: message.id,
            thread_id: message.thread_id,
            index: index,
          })
        }
      }

      return file_citations
    },
    [recentRun]
  )

  const handleViewFile = async (
    threadId: string,
    messageId: string,
    fileId: string
  ) => {
    if (!threadId) {
      return toast.error("No thread id found")
    }

    if (!messageId) {
      return toast.error("No message id found")
    }

    if (!fileId) {
      return toast.error("No file id found")
    }
    const data = await fetch("/api/ai/read-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId,
        messageId,
        fileId,
      }),
    })

    const json = await data.json()

    if (json.error) {
      toast.error(json.error.message)
      return
    }

    return json
  }

  function Comp(tests: any) {
    const [work, setWork] = useState({})

    useEffect(() => {
      async function load() {
        for (const test of tests.tests) {
          const res = reformatMessage(test)

          if (res?.length === 0) {
            return
          }

          if (!res?.[0].thread_id) {
            return toast.error("No thread id found")
          }

          if (!res?.[0].message_id) {
            return toast.error("No message id found")
          }

          if (!res?.[0].file_id) {
            return toast.error("No file id found")
          }

          const fileda = await handleViewFile(
            res?.[0].thread_id,
            res?.[0].message_id,
            res?.[0].file_id
          )

          if (fileda.resp2) {
            setWork((prev) => fileda.resp2)
          }
        }
      }
      load()
    }, [tests])

    useEffect(() => {}, [work])

    return <TestSuiteDataTable work={work} />
  }

  console.log("RECENT RUN: ", recentRun)

  return (
    <div className="col-span-3 grid grid-cols-3 gap-4 my-4">
      <Card className="col-span-2 border-gray-800">
        <CardHeader>
          <CardTitle className="flex gap-2">Most Recent Run</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col w-full overflow-y-scroll ">
          {threads && threads.length > 0 && (
            <>
              <div className="flex flex-col border-gray-800 border-b cursor-pointer">
                <div className="flex w-full justify-between border-gray-800 border-b">
                  <p className="text-sm font-bold">
                    {threads[threads.length - 1].thread_id
                      .split("_")[1]
                      .slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {format(
                      parseISO(threads[threads.length - 1].created_at),
                      "dd/MM/yyyy"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-row justify-between ">
                {recentRun && (
                  <div className="h-full w-full ">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Results
                    </p>
                    {recentRun && <Comp tests={recentRun?.resp2?.data} />}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1 border-gray-800">
        <CardHeader>
          <CardTitle className="flex gap-2">Run Logs</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col w-full overflow-y-scroll">
          <div className="flex flex-col justify-between my-2 pb-1">
            {recentRun && (
              <div className="">
                <p className="text-sm text-gray-500 dark:text-gray-400">Logs</p>
                {recentRun.resp2.data.length > 0 &&
                  recentRun.resp2.data.map((test: any, i) => {
                    const res = reformatMessage(test)

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
                                      handleViewFile(
                                        citation.thread_id,
                                        citation.message_id,
                                        citation.file_id
                                      )
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
