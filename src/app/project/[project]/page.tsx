import React, { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RLSPoliciesList from "@/components/RLSPolicies";
import { PolicyDataTable } from "@/components/PolicyDataTable";
import SchemaTable from "@/components/SchemaTable";
import { Copy, MoveRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default async function Page(params: { [x: string]: never }) {
  const project: string = params.params["project"];
  const cookieStore = cookies();

  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const { data: user, error } = await supabase.auth.getUser();
  if (error) {
    console.error("GET USER ERROR: ", error);
    return;
  }

  console.log(project);

  const { data: db, error: dbError } = await supabase
    .from("user_projects")
    .select("*")
    .eq("db_name", project);

  if (dbError) {
    console.error("dbError: ", dbError);
    return;
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
END;`;

  const nextBestActions = [
    {
      name: "Add the database function to your database",
      description:
        "This will allow SupaBuddAI to gather all of your RLS rules.",
      href: `https://supabase.com/dashboard/project/${db[0].db_ref}/database/functions`,
      required: true,
    },
    {
      name: "Aggregrate your data",
      description:
        "This will allow SupaBuddAI to gather all of your RLS rules and the database schema types.",
      href: `https://supabase.com/dashboard/project/${db[0].db_ref}/database/functions`,
      action: "Aggregate",
      required: true,
    },

    {
      name: "Begin a new workflow",
      description:
        "This will allow SupaBuddAI to begin generating a test suite.",
      required: false,
    },
  ];

  const handleAggregation = async () => {
    const rlsResp = await fetch("/api/rls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: project,
      }),
    });

    const rlsData = await rlsResp.json();

    const schemaResp = await fetch("/api/dbtypes", {
      method: "POST",
      headers: {
        "Content-Type": "plain/text",
      },
      body: JSON.stringify({
        name: project,
      }),
    });

    const schemaData = await schemaResp.json();

    if (rlsData && schemaData) {
    }
  };

  return (
    <div className="m-12 grid grid-cols-3 justify-between gap-8">
      <div className="grid gap-4 w-sm max-h-[450px] h-fit col-span-1">
        <CardHeader>
          <CardTitle className="flex gap-2">{project} </CardTitle>
          <CardDescription>Next Best Actions</CardDescription>
        </CardHeader>
        <CardContent className="container flex flex-col">
          <div className="grid grid-flow-dense gap-4">
            <ul className="flex flex-col gap-4">
              {nextBestActions.map((action) => (
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
      <div className="grid gap-4 w-sm max-h-[450px] col-span-2">
        <CardHeader>
          <CardTitle className="flex gap-2">
            Database Function{" "}
            <span>
              <Copy size={24} />
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
      </div>

      <div className="col-span-2">
        <RLSPoliciesList className="" project={project} />
      </div>
      <div className="col-span-1">
        <SchemaTable />
      </div>
    </div>
  );
}
