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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"

export type RLSPolicy = {
  schema_name: string
  table_name: string
  policy_name: string
  policy_condition: string | null
  policy_check: string | null
  command: string
  role: string
}

export const columns: ColumnDef<RLSPolicy>[] = [
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
    accessorKey: "schema_name",
    header: "Schema",
  },
  {
    accessorKey: "table_name",
    header: "Table",
  },
  {
    accessorKey: "policy_name",
    header: "Policy Name",
  },
  {
    accessorKey: "policy_condition",
    header: "Policy Condition",
  },
  {
    accessorKey: "policy_check",
    header: "Policy Check",
  },
  {
    accessorKey: "command",
    header: "Command",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
]

function jsonToCSV(json: any[], project: string, user: string | undefined) {
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

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
})

export function PolicyDataTable({
  db_url,
  db_key,
  project,
  pols,
}: {
  project: string
  db_url: string
  db_key: string
  pols?: any
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rls, setRls] = React.useState<RLSPolicy[]>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const rlsFetching = async () => {
    const resp = await fetch("/api/rls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        db_url,
        db_key,
      }),
    })

    const data = await resp.json()

    console.log(data)

    setRls(data)
    // const { data: user } = await supabase.auth.getUser()
    // const file = jsonToCSV(data, project, user.user?.id)

    // const element = document.getElementById("rls-download")
    // const fileBlob = new Blob([file], { type: "text/plain" })
    // // @ts-ignore
    // element.href = URL.createObjectURL(fileBlob)
    // // @ts-ignore
    // element.download = `${project}-rls.csv`
  }

  React.useEffect(() => {
    if (pols) {
      setRls(pols)
    } else {
      rlsFetching()
    }
  }, [])

  const table = useReactTable({
    data: rls,
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

  return (
    <div className="grid relative gap-4 h-full max-h-[350px] w-auto overflow-y-auto">
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table &&
            // @ts-ignore
            table.length &&
            table?.getFilteredSelectedRowModel().rows.length}{" "}
          of{" "}
          {table &&
            // @ts-ignore
            table.length &&
            table?.getFilteredRowModel().rows.length}{" "}
          row(s) selected.
        </div>

        <Button
          variant="outline"
          onClick={() => rlsFetching()}
          className="right-0 "
        >
          Aggregrate
        </Button>
        <a id="rls-download" href="">
          <Button
            variant="outline"
            className="right-0 "
            disabled={rls?.length === 0}
          >
            Download
          </Button>
        </a>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              table &&
              // @ts-ignore
              table.length &&
              table?.previousPage()
            }
            disabled={
              !table &&
              // @ts-ignore
              table.length &&
              // @ts-ignore

              table?.getCanPreviousPage()
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              table &&
              // @ts-ignore
              table.length &&
              table?.nextPage()
            }
            disabled={
              !table &&
              // @ts-ignore
              table.length &&
              // @ts-ignore
              table?.getCanNextPage()
            }
          >
            Next
          </Button>
        </div>
      </div>
      <div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table &&
                // @ts-ignore
                table.getHeaderGroups().map((headerGroup) => (
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
              {table &&
                // @ts-ignore
                table.getRowModel().rows.map((row) => (
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
