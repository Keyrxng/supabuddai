"use client"

import React, { useState } from "react"
import { Copy } from "lucide-react"
import { toast } from "sonner"

import CopyToClip from "./CopyToClip"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

function SchemaTable({ db_ref }: { db_ref: string }) {
  const [types, setTypes] = useState("")

  const handleIt = async () => {
    const resp = await fetch("/api/dbtypes", {
      method: "POST",
      headers: {
        "Content-Type": "plain/text",
      },
      body: JSON.stringify({
        db_ref: db_ref,
      }),
    })

    const data = await resp.json()
    setTypes(data)
  }

  return (
    <Card className="grid gap-4 h-full w-full max-h-[450px] overflow-hidden box-content">
      <CardHeader>
        <CardTitle className="flex gap-2">
          Schema Types <CopyToClip text={types} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col w-full">
        <Button variant="outline" onClick={() => handleIt()} className="">
          Aggregrate
        </Button>

        <div
          data-state="active"
          data-orientation="horizontal"
          role="tabpanel"
          aria-labelledby="radix-:rd:-trigger-code"
          id="radix-:rd:-content-code"
          className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex flex-col ">
            <div className=" max-w-[450px] rounded-md [&amp;_pre]:my-0 [&amp;_pre]:max-h-[350px] [&amp;_pre]:overflow-auto">
              <div data-rehype-pretty-code-fragment="">
                <pre
                  className="mb-4 mt-4 max-h-[280px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900"
                  data-language="tsx"
                  data-theme="default"
                >
                  <code
                    className={`${
                      !types
                        ? "hidden"
                        : "relative rounded bg-muted font-mono text-sm"
                    }`}
                    data-language="tsx"
                    data-theme="default"
                  >
                    {types}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SchemaTable
