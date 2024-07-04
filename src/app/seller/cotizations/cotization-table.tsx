"use client"

import * as React from "react"
import { Table as TanstackTable } from "@tanstack/react-table"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { ClientType, CotizationStatus, CotizationType } from "@prisma/client"
import { DateRangePicker } from "@/components/data-table/date-range-picker"
import { DatePickerToFilter } from "@/components/data-table/date-picker"
import { DataTableFacetedFilterType } from "@/components/data-table/data-table-faceted-filter-type"

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

  const statuses = Object.values(CotizationStatus)
  const types = Object.values(CotizationType)
  const clientTypes = Object.values(ClientType)

  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: undefined,
    endDate: undefined
  })


  function handleInitDateChange(initDate: Date | undefined) {
    if (initDate) {
      const newDateRange: DateRange = {
        startDate: initDate,
        endDate: dateRange.endDate
      }
      table.getColumn("date")?.setFilterValue(newDateRange)
      setDateRange(newDateRange)
    }
  }

  function handleEndDateChange(endDate: Date | undefined) {
    if (endDate) {
      const newDateRange: DateRange = {
        startDate: dateRange.startDate,
        endDate: endDate
      }
      table.getColumn("date")?.setFilterValue(newDateRange)
      setDateRange(newDateRange)
    }
  }

  function resetFilters() {
    table.resetColumnFilters()
    setDateRange({
      startDate: undefined, 
      endDate: undefined
    })
  }  

  return (
    <div className="flex gap-1 dark:text-white items-center">

      <div className="space-y-2">        
        <div className="flex gap-1 dark:text-white items-center">

          {table.getColumn("clientName") && clientNames && (
            <DataTableFacetedFilter
              column={table.getColumn("clientName")}
              title="Cliente"
              options={clientNames}          
            />
          )}

          {table.getColumn("clientType") && clientTypes && (
            <DataTableFacetedFilter
              column={table.getColumn("clientType")}
              title="Tipo C"
              options={clientTypes}
            />
          )}

          {table.getColumn("sellerName") && sellerNames && (
            <DataTableFacetedFilter
              column={table.getColumn("sellerName")}
              title="Vendedor"
              options={sellerNames}
            />
          )}

          {table.getColumn("status") && statuses && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Estado"
              options={statuses}
            />
          )}

          {table.getColumn("type") && types && (
            <DataTableFacetedFilterType
              column={table.getColumn("type")}
              title="Tipo"
              options={types}
            />
          )}

          <Input className="max-w-xs" placeholder="filtro por número..."
              value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("number")?.setFilterValue(event.target.value)}                
          />
          
          <Input className="max-w-xs" placeholder="filtro por obra..."
              value={(table.getColumn("obra")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("obra")?.setFilterValue(event.target.value)}                
          />

        </div>

        <div className="flex gap-1 dark:text-white items-center">
          <DatePickerToFilter filteredDate={dateRange.startDate} setFilteredDate={handleInitDateChange} label="Desde"/>
          <DatePickerToFilter filteredDate={dateRange.endDate} setFilteredDate={handleEndDateChange} label="Hasta"/>
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
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
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [])

  return (
    <div className="w-full space-y-4 dark:text-white">
      <DataTableToolbar table={table} sellerNames={sellerNames} clientNames={clientNames}/>
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
