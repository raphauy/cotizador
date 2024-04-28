"use client"

import * as React from "react"
import { Table as TanstackTable } from "@tanstack/react-table"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, PlusCircle, X } from "lucide-react"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ItemType } from "@prisma/client"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { ItemDialog, TransitionDialog } from "./item-dialogs"
import Link from "next/link"

const itemTypes = Object.values(ItemType)

interface DataTableToolbarProps<TData> {
  table: TanstackTable<TData>;
  workId: string
  cotizationId: string
}

export function DataTableToolbar<TData>({ table, workId, cotizationId }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex gap-1 dark:text-white items-center justify-between">

      <div className="flex">
        {
          table.getColumn("type") && (
            <DataTableFacetedFilter
              column={table.getColumn("type")}
              title="Tipo"
              options={itemTypes}
            />
          )
        }
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >            
            <X className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Link href={`/seller/cotizations/${cotizationId}/addAreas?workId=${workId}`}>
            <Button className="w-full gap-2">
                {
                table.getRowModel().rows?.length ? 
                <>
                <Pencil className="w-4 h-4" />
                Editar Items
                </>
                : 
                <>
                <PlusCircle className="w-4 h-4" />
                Crear Items
                </>
                }
            </Button>
        </Link>

        {/* <TransitionDialog workId={workId} /> */}
        {/* <ItemDialog workId={workId} cotizationId={cotizationId} /> */}
      </div>


    </div>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnsOff?: string[]
  subject: string
  workId: string
  cotizationId: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnsOff,
  subject,
  workId,
  cotizationId,
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
    table.setPageSize(100)
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [])

  return (
    <div className="w-full space-y-4 dark:text-white">
      <DataTableToolbar table={table} workId={workId} cotizationId={cotizationId}/>
      <div className="border rounded-md">
        <Table>
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
                  Aún no hay Items
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
