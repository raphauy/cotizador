"use client"

import { DataTablePagination } from "./data-table-pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ColumnDef, ColumnFiltersState, SortingState, Table as TanstackTable, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"
import * as React from "react"

export type DateRange = {
  startDate: Date | undefined
  endDate: Date | undefined
}

interface DataTableToolbarProps<TData> {
  table: TanstackTable<TData>;
  clientNames: string[]
  sellerNames: string[];
}

export function DataTableToolbar<TData>({ table, sellerNames, clientNames }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  function resetFilters() {
    table.resetColumnFilters()
  }  

  return (
    <div className="flex gap-1 dark:text-white items-center bg-white dark:bg-gray-800">

      <div className="flex items-center">        

        <Input className="max-w-xs" placeholder="filtro por número..."
            value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("number")?.setFilterValue(event.target.value)}                
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="h-8 px-2 lg:px-3"
          >
            <X className="w-4 h-4 " />
          </Button>
        )}
      </div>          
    </div>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnsOff?: string[]
  subject: string
  clientNames: string[]
  sellerNames: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnsOff,
  subject,
  clientNames,
  sellerNames,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })
  React.useEffect(() => {
    columnsOff && columnsOff.forEach(colName => {
      table.getColumn(colName)?.toggleVisibility(false)      
    });
    table.setPageSize(20)
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [])

  const path= usePathname()
  const pathCount= path.split("/").length
  console.log(pathCount)
  
  if ((path !== "/seller" && !path.startsWith("/seller/cotizations/")) || pathCount > 4)
    return null

  return (
    <div className="space-y-4 dark:text-white w-48 mt-4">
      <DataTableToolbar table={table} sellerNames={sellerNames} clientNames={clientNames}/>
      <div className="border rounded-md  bg-white dark:bg-gray-800 ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} subject={subject}/>
    </div>
  )
}
