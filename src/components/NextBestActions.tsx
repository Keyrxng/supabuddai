"use client"

import React, { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { MoveRight } from "lucide-react"
import { toast } from "sonner"

import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Checkbox } from "./ui/checkbox"

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
})

function NextBestActions({
  project,
  db,
  assistants,
}: {
  project: string
  db: any
  assistants: any
}) {
  const [user, setUser] = React.useState(null)

  useEffect(() => {
    async function load() {
      const { data: user, error } = await supabase.auth.getUser()
      if (error) {
        console.error("GET USER ERROR: ", error)
        return
      }

      // @ts-ignore
      setUser(user.user)
    }
    load()
  }, [])

  const handleAggregation = async () => {
    console.log("Aggregating data")

    let promises = []

    console.log("DB: ", db)

    if (!db[0].db_ref) {
      toast.error("No database reference found")
      return
    }

    if (!db[0].db_url) {
      toast.error("No database url found")
      return
    }

    if (!db[0].db_key) {
      toast.error("No database key found")
      return
    }

    const rlsResp = fetch("/api/rls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: project,
        db_url: db[0].db_url,
        db_key: db[0].db_key,
      }),
    })

    const schemaResp = fetch("/api/dbtypes", {
      method: "POST",
      headers: {
        "Content-Type": "plain/text",
      },
      body: JSON.stringify({
        db_ref: db[0].db_ref,
      }),
    })

    promises.push(rlsResp)
    promises.push(schemaResp)

    toast.promise(schemaResp, {
      loading: "Aggregating data...",
      success: "All data has been aggregated.",
      error: (err) => {
        return `An error occurred: ${err.toString()}`
      },
    })

    const [rlsData, schemaData] = await Promise.all(promises)

    const rlsJson = await rlsData.json()
    const schemaJson = await schemaData.json()

    function jsonToCSV(json: any[], project: any, user: any) {
      const rows = []

      const headers = Object.keys(json[0])
      rows.push(headers.join(","))

      json.forEach((obj) => {
        const row = headers
          .map((hdr) => JSON.stringify(obj[hdr], null, 2))
          .join(",")
        rows.push(row)
      })

      const joinedRows = rows.join("\n")

      return joinedRows
    }

    if (rlsData && schemaData) {
      const resp = fetch("/api/ai/create-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: project,
          rlsData: rlsJson,
          schemaData: schemaJson,
        }),
      })

      toast.promise(resp, {
        loading: "Creating workflow...",
        success: "Workflow created.",
        error: (err) => {
          return `An error occurred: ${err.toString()}`
        },
      })

      const data = await resp

      if (data) {
        console.log("Got data: ", data)
        toast.success("New workflow created ")
      } else {
        toast.error("Workflow creation failed")
      }
    }
  }

  const nextBestActions = [
    {
      name: "Add the database function to your database",
      description:
        "This will allow SupaBuddAI to gather all of your RLS rules.",
      href: `https://supabase.com/dashboard/project/${db[0]?.db_ref}/database/functions`,
      required: true,
    },
    {
      name: "Aggregrate your data",
      description:
        "This will allow SupaBuddAI to gather all of your RLS rules and the database schema types.",
      action: handleAggregation,
      required: true,
    },

    {
      name: "Create a new workflow",
      description:
        "This will allow SupaBuddAI to begin generating a test suite.",
      required: false,
    },
  ]

  const withAgentNBA = [
    {
      name: "View most recent workflow run",
      href: `https://supabase.com/dashboard/projects/${project}/${assistants[0]?.id}`,
      description: "",
      required: false,
    },
    {
      name: "View all workflows",
      description: "",
      href: `https://supabase.com/dashboard/projects/${project}/workflows`,
      required: false,
    },
    {
      name: "Create a new workflow",
      href: `https://supabase.com/dashboard/projects/${project}/${assistants[0]?.id}`,
      description: "For now, you can only have one workflow per project.",
      required: false,
      disabled: true,
    },
  ]

  return (
    <div className="grid gap-4 w-sm max-h-[450px] h-fit col-span-1">
      <CardHeader>
        <CardTitle className="flex gap-2">{project}</CardTitle>
        <CardDescription>Next Best Actions</CardDescription>
      </CardHeader>
      <CardContent className="container flex flex-col">
        <div className="grid grid-flow-dense gap-4">
          <ul className="flex flex-col gap-4">
            {assistants.length == 0 &&
              nextBestActions.map((action) => (
                <li
                  key={action.name}
                  className={`${
                    action.required ? "font-bold" : "font-light"
                  } text-sm text-muted`}
                >
                  <div className="flex flex-row justify-between gap-4">
                    <div className="flex flex-col">
                      <span>{action.name}</span>
                      <span className="text-xs">{action.description}</span>
                    </div>
                    <div className="flex gap-2">
                      <Checkbox />
                      {action.href ? (
                        <a
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline font-bold"
                        >
                          <MoveRight
                            size={16}
                            className="hover:translate-x-1 animate-in ease-in-out duration-300"
                          />
                        </a>
                      ) : action.action ? (
                        <MoveRight
                          size={16}
                          onClick={() => action.action()}
                          className="hover:translate-x-1 animate-in ease-in-out duration-300 text-green-500 cursor-pointer"
                        />
                      ) : (
                        <div className="w-4 h-4"></div>
                      )}
                    </div>
                  </div>
                </li>
              ))}

            {assistants.length > 0 &&
              withAgentNBA.map((action) => (
                <li
                  key={action.name}
                  className={`${
                    action.required ? "font-bold" : "font-light"
                  } text-sm text-muted hover:translate-x-1 animate-in ease-in-out duration-300`}
                >
                  <div className="flex flex-row justify-between gap-4">
                    <div className="flex flex-col">
                      <span>{action.name}</span>
                      <span className="text-xs">{action.description}</span>
                    </div>
                    <div className="flex gap-2">
                      <Checkbox disabled={action.disabled} />
                      {action.href ? (
                        <a
                          href={action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline font-bold hover:translate-x-1 animate-in ease-in-out duration-300"
                        >
                          <MoveRight
                            size={16}
                            id="move-right-disabled"
                            className={` `}
                          />
                        </a>
                      ) : // @ts-ignore
                      action.action ? (
                        <MoveRight
                          size={16}
                          // @ts-ignore
                          onClick={() => action.action()}
                          className="hover:translate-x-1 animate-in ease-in-out duration-300 text-green-500 cursor-pointer"
                        />
                      ) : (
                        <div className="w-4 h-4"></div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </CardContent>
    </div>
  )
}

export default NextBestActions
