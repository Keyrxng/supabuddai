"use client"

import React from "react"
import { format, parseISO } from "date-fns"

import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

function WorkflowsHeader({
  project,
  assistants,
}: {
  project: string
  assistants: any[]
}) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex gap-2">Workflows</CardTitle>
      </CardHeader>
      <Card className="max-h-72">
        <CardContent className="grid grid-flow-col gap-4 h-64 m-2 p-8">
          {assistants?.map((assistant) => (
            <Button
              key={assistant.id}
              onClick={() =>
                (window.location.href = `/projects/${project}/${assistant.id}`)
              }
              className="flex flex-col items-center justify-center gap-2 border-x-2 h-14 border-transparent hover:border-gray-800"
            >
              <p className="text-sm">{assistant.assistant.id}</p>
              <p className="text-sm">
                Created: {format(parseISO(assistant.created_at), "do LLL")}
              </p>
            </Button>
          ))}
        </CardContent>
      </Card>
    </>
  )
}

export default WorkflowsHeader
