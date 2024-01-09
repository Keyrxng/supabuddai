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

function RunDataTable({ assistantResp }: { assistantResp: any }) {
  const [user, setUser] = useState(null)
  const [threads, setThreads] = useState([])
  const [recentRun, setRecentRun] = useState(null)

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
      const { data: threadss, error } = await supabase
        .from("threads")
        .select("*")
        .eq("assistant_id", assistantResp[0].assistant.id)

      if (error) {
        console.error("GET THREADS ERROR: ", error)
        toast.error("Error getting threads")
        return
      }

      console.log("threads: ", threadss)

      setThreads(threadss)

      const data = await fetch("/api/ai/fetch-thread", {
        method: "POST",
        body: JSON.stringify({
          thread_id: threadss[threadss.length - 1].thread_id,
        }),
      })
      const json = await data.json()
      console.log("json: ", json)

      setRecentRun(json)
    }
    load()
  }, [])

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
    const [work, setWork] = useState([])
    useEffect(() => {
      const files = []

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

          files.push(res[0])

          const fileda = await handleViewFile(
            res?.[0].thread_id,
            res?.[0].message_id,
            res?.[0].file_id
          )

          if (fileda.resp2) {
            console.log("fileData: ", fileda.resp2)
            setWork(Array.from(fileda.resp2))
            if (work.length === 0) {
              return (
                <pre className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Loading...</p>
                </pre>
              )
            }
          }
        }
      }
      load()
    }, [tests])

    useEffect(() => {}, [work])

    return (
      <TestSuiteDataTable work={work} />
      // <table className="table-auto">
      //   <thead>
      //     <tr>
      //       <th className="px-4 py-2">Schema</th>
      //       <th className="px-4 py-2">Table</th>
      //       <th className="px-4 py-2">Policy</th>
      //       <th className="px-4 py-2">Condition Test</th>
      //       <th className="px-4 py-2">Expected Condition</th>
      //       <th className="px-4 py-2">Check Test</th>
      //       <th className="px-4 py-2">Expected Check</th>
      //     </tr>
      //   </thead>
      //   <tbody>
      //     {work.length > 0 &&
      //       work.map((schema: any, i) => {
      //         // public and storage

      //         console.log("schema: ", schema)
      //         return (
      //           <>
      //             {Object.keys(schema).map((table: any, i) => {
      //               //storage:: buckets, objects
      //               //public:: all tables
      //               console.log("table: ", table)

      //               return (
      //                 <>
      //                   {Object.keys(table).map((policy: any, i) => {
      //                     // policy name is the key

      //                     console.log("policy: ", policy)
      //                     return (
      //                       <>
      //                         {Object.keys(policy).map((tests: any, i) => {
      //                           // check_tests & condition_tests

      //                           console.log("tests: ", tests)
      //                           return tests.map((test: any, i) => {
      //                             // description, expected_result
      //                             return (
      //                               <tr key={`${i}-${test.description}`}>
      //                                 <td className="border px-4 py-2">
      //                                   {schema}
      //                                 </td>
      //                                 <td className="border px-4 py-2">
      //                                   {table}
      //                                 </td>
      //                                 <td className="border px-4 py-2">
      //                                   {policy}
      //                                 </td>
      //                                 <td className="border px-4 py-2">
      //                                   {test.description}
      //                                 </td>
      //                                 <td className="border px-4 py-2">
      //                                   {test.expected_result}
      //                                 </td>
      //                                 <td className="border px-4 py-2"></td>
      //                                 <td className="border px-4 py-2"></td>
      //                               </tr>
      //                             )
      //                           })
      //                         })}
      //                       </>
      //                     )
      //                   })}
      //                 </>
      //               )
      //             })}
      //           </>
      //         )
      //       })}
      //   </tbody>
      // </table>
    )
  }

  return (
    <div className="col-span-3 grid grid-cols-3 gap-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex gap-2">Most Recent Run</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col w-full">
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
                <div className="flex flex-row justify-between my-2 ">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    45 Tests
                  </p>
                  <Button
                    className="bg-green-900/75 hover:bg-green-900 "
                    size="sm"
                  >
                    Resume Run
                  </Button>
                </div>
              </div>
              <div className="flex flex-col justify-between my-2 ">
                {recentRun && (
                  <div className="h-24 overflow-y-scroll ">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Logs
                    </p>
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

              <div className="flex flex-row justify-between">
                {recentRun && (
                  <div className="h-24 overflow-y-scroll ">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Results
                    </p>
                    <Comp tests={recentRun?.resp2?.data} />
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="flex gap-2">Previous Runs</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col w-full">
          {threads.length > 0 &&
            threads.toReversed().map((thread: any) => {
              return (
                <div
                  key={thread.id}
                  className="flex flex-col border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer"
                >
                  <div className="flex w-full justify-between border-b">
                    <p className="text-sm font-bold">
                      {thread.thread_id.split("_")[1].slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(parseISO(thread.created_at), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
              )
            })}
        </CardContent>
      </Card>
    </div>
  )
}

export default RunDataTable
