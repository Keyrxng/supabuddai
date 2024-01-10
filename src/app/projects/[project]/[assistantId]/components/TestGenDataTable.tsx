"use client"

import * as React from "react"
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

export type TestProps = {
  schema: string
  table: string
  policy: string
  test: string
}

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
    accessorKey: "schema",
    header: "Schema",
  },
  {
    accessorKey: "table",
    header: "Table",
  },
  {
    accessorKey: "policy",
    header: "Policy",
    maxSize: 100,
  },
  {
    accessorKey: "test",
    header: ({ table }) => (
      <div className="flex items-center gap-4 w-full">
        <div>Test</div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setExpanded(true)}
          >
            Expand all
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setExpanded(false)}
          >
            Collapse all
          </Button>
        </div>
      </div>
    ),
    enableResizing: true,
    enableHiding: true,
    cell: ({ row, cell }) => (
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => row.toggleExpanded()}
          >
            {row.getIsExpanded() ? "Collapse" : "Expand"}
          </Button>
        </div>
        <div
          data-state="active"
          data-orientation="horizontal"
          role="tabpanel"
          aria-labelledby="radix-:rd:-trigger-code"
          id="radix-:rd:-content-code"
          className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex flex-col">
            <div
              className={`${
                row.getIsExpanded() ? "block" : "hidden"
              } w-full rounded-md [&amp;_pre]:my-0 [&amp;_pre]:max-h-[350px] [&amp;_pre]:overflow-auto`}
            >
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
                    {cell.getValue()}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
})

export function TestGenDataTable({
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
      schema: "test",
      table: "test",
      policy: "test",
      condition_test: "test",
      expected_condition: "test",
      check_test: "test",
      expected_check: "test",
    },
  ])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data: work,
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

    console.log("handleCancel: ", json)

    return json
  }

  return (
    <div className="grid relative gap-4 max-h-[500px] w-auto overflow-y-scroll">
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
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
