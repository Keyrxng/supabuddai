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
    accessorKey: "check_test",
    header: "Check Test",
  },
  {
    accessorKey: "condition_test",
    header: "Condition Test",
  },
  {
    accessorKey: "description",
    header: "Description",
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

export function TestSuiteDataTable({ work }: { work: {} }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rls, setRls] = React.useState<TestProps[]>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  React.useEffect(() => {
    const data = toWork(work)

    setRls(data)
  }, [work])

  const toWork = (work: Work) => {
    const result = []
    for (const schema in work) {
      for (const table in work[schema]) {
        for (const policy in work[schema][table]) {
          for (const check_test in work[schema][table][policy].check_tests) {
            const check = work[schema][table][policy].check_tests[check_test]
            result.push({
              schema_name: schema,
              table_name: table,
              policy_name: policy,
              check_test: check.description,
              expected_result: check.expected_result,
            })
          }
          for (const condition_test in work[schema][table][policy]
            .condition_tests) {
            const condition =
              work[schema][table][policy].condition_tests[condition_test]
            result.push({
              schema_name: schema,
              table_name: table,
              policy_name: policy,
              condition_test: condition.description,
              expected_result: condition.expected_result,
            })
          }
        }
      }
    }
    return result
  }

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

/**
 * // const rlsFetching = async () => {
  //   const resp = await fetch("/api/rls", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       name: project,
  //     }),
  //   });

  //   const data = await resp.json();

  //   setRls(data);
  //   const { data: user } = await supabase.auth.getUser();
  //   const file = jsonToCSV(data, project, user.user.id);

  //   const element = document.createElement("a");
  //   const fileBlob = new Blob([file], { type: "text/plain" });
  //   element.href = URL.createObjectURL(fileBlob);
  //   element.download = "rls.csv";
  //   document.body.appendChild(element);
  //   element.click();
  // };
 */
