"use client"

import * as React from "react"
import { Table as TanstackTable } from "@tanstack/react-table"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Expand, X } from "lucide-react"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArchiveStatusFilter } from "../archive-status-filter"

interface DataTableToolbarProps<TData> {
  table: TanstackTable<TData>
  materialNames: string[]
}

export function DataTableToolbar<TData>({ table, materialNames }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const path= usePathname()
  const isExpanded= path === "/admin/colors"
  
  return (
    <div className="flex gap-1 dark:text-white items-center">

      {table.getColumn("materialName") && (
        <DataTableFacetedFilter
          column={table.getColumn("materialName")}
          title="Material"
          options={materialNames}
        />
      )}

      {table.getColumn("archived") && (
        <ArchiveStatusFilter table={table} />
      )}

      <Input placeholder="filtrar por color..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}                
      />
        
    
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <X className="w-4 h-4 ml-2" />
        </Button>
      )}

      {!isExpanded && 
        <Link href="/admin/colors">
          <Button variant="ghost" className="h-8 px-2 lg:px-3">
          <Expand />
          </Button>
        </Link>
      }
    </div>

  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnsOff?: string[]
  subject: string
  materialNames: string[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnsOff,
  subject,
  materialNames,
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
    filterFns: {
      // Filtro personalizado para el campo archived
      archiveFilter: (row, id, filterValue) => {
        const archivedStatus = row.getValue(id) as boolean;
        if (filterValue.includes("Activo") && filterValue.includes("Archivado")) {
          return true; // Mostrar todos
        } else if (filterValue.includes("Activo") && !filterValue.includes("Archivado")) {
          return !archivedStatus; // Mostrar solo activos
        } else if (!filterValue.includes("Activo") && filterValue.includes("Archivado")) {
          return archivedStatus; // Mostrar solo archivados
        }
        return true; // Si no hay filtro, mostrar todos
      },
    },
  })

  // Configurar el filtro personalizado para el campo archived
  React.useEffect(() => {
    if (table.getColumn("archived")) {
      table.getColumn("archived")?.setFilterValue([]);
    }
  }, [table]);

  React.useEffect(() => {
    columnsOff && columnsOff.forEach(colName => {
      table.getColumn(colName)?.toggleVisibility(false)      
    });
    table.setPageSize(100)
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [])

  return (
    <div className="w-full space-y-4 dark:text-white">
      <DataTableToolbar table={table} materialNames={materialNames}/>
      <div className="border rounded-md">
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
