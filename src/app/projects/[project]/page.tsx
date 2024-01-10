import React from "react"
import { cookies } from "next/headers"
import { useRouter } from "next/navigation"
import { NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { format, parseISO } from "date-fns"
import { Copy, MoveRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CopyToClip from "@/components/CopyToClip"
import { NewProjectCard } from "@/components/NewProjectCard"
import NextBestActions from "@/components/NextBestActions"
import RLSPoliciesList from "@/components/RLSPolicies"
import SchemaTable from "@/components/SchemaTable"
import WorkflowsHeader from "@/components/WorkflowsHeader"

export default async function Page(params: { [x: string]: never }) {
  const project: string = params.params["project"]
  const cookieStore = cookies()
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  })

  const { data: user, error } = await supabase.auth.getUser()
  if (error) {
    console.error("GET USER ERROR: ", error)
    return
  }

  const { data: db, error: dbError } = await supabase
    .from("user_projects")
    .select("*")
    .eq("db_name", project)

  if (dbError) {
    console.error("dbError: ", dbError)
    return
  }

  if (db.length === 0) {
    return (
      <div className="m-12 flex flex-col items-center object-center align-middle gap-8">
        <NewProjectCard />
      </div>
    )
  }

  const dbfunction = `BEGIN
  RETURN QUERY
  SELECT 
      ns.nspname::TEXT AS schema_name,
      cls.relname::TEXT AS table_name,
      pol.polname::TEXT AS policy_name,
      pg_get_expr(pol.polqual, pol.polrelid)::TEXT AS policy_condition,
      pg_get_expr(pol.polwithcheck, pol.polrelid)::TEXT AS policy_check,
      CASE pol.polcmd 
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        ELSE pol.polcmd 
      END::TEXT AS command,
      COALESCE(rol.rolname, 'public')::TEXT AS role
  FROM 
      pg_policy pol
      LEFT JOIN pg_class cls ON cls.oid = pol.polrelid
      LEFT JOIN pg_namespace ns ON ns.oid = cls.relnamespace
      LEFT JOIN pg_roles rol ON rol.oid = any(pol.polroles)
  ORDER BY 
      ns.nspname, 
      cls.relname, 
      pol.polname;
END;`

  const { data: assistants, error: nbaError } = await supabase
    .from("assistants")
    .select("*")
    .eq("user_id", user?.user.id)
    .eq("project_id", db[0]?.id)

  const { data: projReqs, error: projReqsError } = await supabase
    .from("project_reqs")
    .select("*")
    .eq("assistant_id", assistants[0]?.id)

  return (
    <div className="m-12 grid grid-cols-3 justify-between gap-8">
      <NextBestActions project={project} db={db} assistants={assistants} />
      <div className="grid gap-4 w-sm max-h-[450px] col-span-2">
        {assistants?.length == 0 && (
          <>
            <CardHeader>
              <CardTitle className="flex gap-2">
                Database Function{" "}
                <span>
                  <CopyToClip text={dbfunction} />
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col">
              <div
                data-state="active"
                data-orientation="horizontal"
                role="tabpanel"
                aria-labelledby="radix-:rd:-trigger-code"
                id="radix-:rd:-content-code"
                className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex flex-col">
                  <div className="w-full rounded-md [&amp;_pre]:my-0 [&amp;_pre]:max-h-[350px] [&amp;_pre]:overflow-auto">
                    <div data-rehype-pretty-code-fragment="">
                      <pre
                        className="mb-4 max-h-[280px] overflow-x-auto rounded-lg border bg-zinc-950  dark:bg-zinc-900"
                        data-language="tsx"
                        data-theme="default"
                      >
                        <code
                          className={`relative rounded bg-muted font-mono text-sm`}
                          data-language="tsx"
                          data-theme="default"
                        >
                          {dbfunction}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {assistants?.length > 0 && (
          <WorkflowsHeader project={project} assistants={assistants} />
        )}
      </div>

      <div className="col-span-2">
        <RLSPoliciesList
          className=""
          project={project}
          db_key={db[0]?.db_key}
          db_url={db[0]?.db_url}
          pols={projReqs[0].rls}
        />
      </div>
      <div className="col-span-1">
        <SchemaTable db_ref={db[0]?.db_ref} schema={projReqs[0].schema} />
      </div>
    </div>
  )
}
