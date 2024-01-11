"use client"

import React, { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { toast } from "sonner"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "../../../../../components/ui/button"
import { Checkbox } from "../../../../../components/ui/checkbox"

interface ApiResponse {
  index: number
  value: boolean
}

interface DataRow {
  status: string
  schemaName: string
  table: string
  policy: string
  test: string
}

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
})

export const columns: ColumnDef<TestProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "schemaName",
    header: "Schema",
  },
  {
    accessorKey: "table",
    header: "Table",
  },
  {
    accessorKey: "policy",
    header: "Policy",
  },
  {
    accessorKey: "test",
    header: "Test",
  },
]

export type TestProps = {
  schema: string
  table: string
  policy: string
  test: string
}

export function TestExecCard({
  threadId,
  assistantId,
  runId,
  work,
}: {
  threadId: string
  assistantId: string
  runId: string
  work: any
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rls, setRls] = React.useState<TestProps[]>([
    {
      status: true,
      schemaName: "test",
      table: "test",
      policy: "test",
      test: "test",
    },
    {
      status: false,
      schemaName: "test",
      table: "test",
      policy: "test",
      test: "test",
    },
  ])
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = useState<DataRow[]>([])

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  useEffect(() => {
    const fetchData = async () => {
      /**
         * status: apiResponse.value ? "PASS" : "FAIL",
      schemaName: "test",
      table: "test",
      policy: "test",
      test: "test",
         */

      const response = {
        index: 1,
        value: Math.random() % 2 === 0,
      }
      processNewData(response)
    }

    // Set an interval for polling (or setup WebSocket connection)
    const intervalId = setInterval(fetchData, 25000) // 1 second polling

    return () => clearInterval(intervalId)
  }, [])

  const processNewData = (newData: ApiResponse) => {
    const additionalData = fetchAdditionalData(newData) // Implement this function
    setData((prevData) => [additionalData, ...prevData])
  }

  // Implement this function to fetch additional data based on the index from the API response
  const fetchAdditionalData = (apiResponse: ApiResponse): DataRow => {
    // Fetching logic here
    return {
      status: apiResponse.value ? "PASS" : "FAIL",
      schemaName: "test",
      table: "test",
      policy: "test",
      test: "test",
    }
  }

  const table = useReactTable({
    data: data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleGenerate = async () => {
    if (!threadId) {
      toast.error("No recent run found")
      return
    }

    const data = await fetch("/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId,
        assistantId,
      }),
    })
    const json = await data.json()

    console.log("handleGenerate: ", json)

    return json
  }

  const fileToCSV = (data: TestProps[]) => {
    const csvRows = []
    const headers = Object.keys(data[0])
    csvRows.push(headers.join(","))

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"')
        return `"${escaped}"`
      })
      csvRows.push(values.join(","))
    }

    return csvRows.join("\n")
  }

  const handleExport = async () => {
    const file = fileToCSV(rls)
    const element = document.createElement("a")
    const fileBlob = new Blob([file], { type: "text/plain" })
    element.href = URL.createObjectURL(fileBlob)
    element.download = "rls.csv"
    document.body.appendChild(element)
    element.click()
  }

  const handleCancel = async () => {
    if (!threadId) {
      toast.error("No recent run found")
      return
    }

    const data = await fetch("/api/ai/cancel-run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        threadId,
        runId,
      }),
    })
    const json = await data.json()

    return json
  }

  return (
    <div className="grid relative gap-4 max-h-[500px] w-auto overflow-y-scroll rounded-md p-4">
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <Button
          onClick={() => handleCancel()}
          className="bg-green-900/75 hover:bg-green-900"
        >
          Stop run
        </Button>
        <Button
          onClick={() => handleGenerate()}
          className="bg-green-900/75 hover:bg-green-900"
        >
          Resume run
        </Button>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport()}>
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div>
        <div className="rounded-md border">
          <Table>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="slide-in-animation">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default TestExecCard
