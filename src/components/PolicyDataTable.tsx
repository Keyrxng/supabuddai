"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

export type RLSPolicy = {
  schema_name: string;
  table_name: string;
  policy_name: string;
  policy_condition: string | null;
  policy_check: string | null;
  command: string;
  role: string;
};

export const columns: ColumnDef<RLSPolicy>[] = [
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
];

export function PolicyDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rls, setRls] = React.useState<RLSPolicy[]>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: rls,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  const rlsFetching = async () => {
    const resp = await fetch("/api/rls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test",
        description: "test",
      }),
    });

    const data = await resp.json();

    setRls(data);
    console.log(data);
  };

  return (
    <div className="w-full">
      <Button variant="outline" onClick={() => rlsFetching()} className="mr-4">
        Aggregrate
      </Button>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
