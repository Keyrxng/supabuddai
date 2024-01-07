"use client";
import { PolicyDataTable, RLSPolicy } from "@/components/PolicyDataTable";
import { SupabaseAccessCard } from "@/components/ProjectCard";
import RLSPoliciesList from "@/components/RLSPolicies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function Home() {
  const [types, setTypes] = useState({});
  const [rls, setRls] = useState<RLSPolicy[]>([]);

  const handleIt = async () => {
    const resp = await fetch("/api/dbtypes", {
      method: "POST",
      headers: {
        "Content-Type": "plain/text",
      },
      body: JSON.stringify({
        name: "test",
        description: "test",
      }),
    });

    const data = await resp.json();

    setTypes(data);
  };

  <div
    data-state="active"
    data-orientation="horizontal"
    role="tabpanel"
    aria-labelledby="radix-:rd:-trigger-code"
    id="radix-:rd:-content-code"
    tabindex="0"
    className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  >
    <div className="flex flex-col space-y-4">
      <div className="w-full rounded-md [&amp;_pre]:my-0 [&amp;_pre]:max-h-[350px] [&amp;_pre]:overflow-auto">
        <div data-rehype-pretty-code-fragment="">
          <pre
            className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900"
            data-language="tsx"
            data-theme="default"
          >
            <code
              className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
              data-language="tsx"
              data-theme="default"
            ></code>
          </pre>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50 absolute right-4 top-4"></button>
        </div>
      </div>
    </div>
  </div>;

  return (
    <div className="m-12 flex f">
      <div className="grid grid-cols-1 w-auto items-center">
        <Card>
          <CardHeader>
            <CardTitle>RLS Policies</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button
              variant="outline"
              onClick={() => handleIt()}
              className="mr-4"
            >
              Connect
            </Button>
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {JSON.stringify(types)}
              </code>
            </div>
          </CardContent>
        </Card>
        <RLSPoliciesList />
      </div>

      {/* <div className="grid grid-cols-2 gap-40 items-center  w-screen">
        <DataTableDemo />
        <SupabaseAccessCard />
      </div> */}
    </div>
  );
}
