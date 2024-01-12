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

import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"

export type TestProps = {
  schema: string
  table: string
  policy: string
  condition_test: string
  expected_condition: string
  check_test: string
  expected_check: string
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
    accessorKey: "schema_name",
    header: "Schema",
  },
  {
    accessorKey: "table_name",
    header: "Table",
  },
  {
    accessorKey: "policy_name",
    header: "Policy",
  },
  {
    accessorKey: "test",
    header: "Test",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "command",
    header: "Command",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "expected_result",
    header: "Expected Result",
  },
]

const supabase = createClientComponentClient({
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
})

export function TestPlanDataTable({ work }: { work: any[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rls, setRls] = React.useState<TestProps[]>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  interface Work {
    index: number
    schema: string
    table: string
    policy: string
    tests: [
      {
        description: string
        role: string
        command: string
        condition: string
        expected_result: string
      },
    ]
  }

  const toWork = async (dataa: any[]) => {
    const result: any = []

    if (!dataa) return result

    const d = Array.isArray(dataa) ? dataa : [dataa]

    d.map((w) => {
      w.tests.map((t: any) => {
        const entry = {
          index: w.index,
          schema_name: w.schema,
          table_name: w.table,
          policy_name: w.policy,
          test: t.description,
          role: t.role,
          command: t.command,
          condition: t.condition,
          expected_result: t.expected_result,
        }
        result.push(entry)
      })
    })

    return result
  }

  React.useEffect(() => {
    async function load() {
      const data = await toWork(work)
      setRls((prev) => data)
    }
    load()
  }, [work])

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
    <div className="grid relative gap-4 max-h-[500px] w-auto ">
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <Button variant="outline" className="right-0 ">
          Aggregrate
        </Button>
        <div className="space-x-2">
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
