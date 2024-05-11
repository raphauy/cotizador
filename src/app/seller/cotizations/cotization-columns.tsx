"use client"

import { Button } from "@/components/ui/button"
import { CotizationDAO } from "@/services/cotization-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil } from "lucide-react"
import { DeleteCotizationDialog } from "./cotization-dialogs"
import Link from "next/link"
import { completeWithZeros, formatWhatsAppStyle } from "@/lib/utils"
import { StatusSelector } from "./[cotizationId]/status-selector"
import { DateRange } from "./cotization-table"


export const columns: ColumnDef<CotizationDAO>[] = [
  
  {
    accessorKey: "number",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Número
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      return (
        <Link href={`/seller/cotizations/${row.original.id}`}>
            <Button variant="link" className="pl-0 dark:text-white">
              #{completeWithZeros(row.original.number)}
            </Button>
        </Link>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "clientName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Cliente
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "sellerName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Vendedor
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      return <StatusSelector id={row.original.id} status={row.original.status} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "type",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tipo
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "obra",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Obra
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "date",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fecha
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      return <p>{formatWhatsAppStyle(row.original.date)}</p>
    },
    filterFn: (row, id, value) => {
      const dateRange= value as DateRange
      const startDate = dateRange.startDate
      const endDate = dateRange.endDate
      const columnValue = row.getValue(id) as Date

      if (startDate && endDate) {
        return columnValue.getTime() >= startDate.getTime() && columnValue.getTime() <= endDate.getTime()
      } else if (startDate) {
        return columnValue.getTime() >= startDate.getTime()
      } else if (endDate) {
        return columnValue.getTime() <= endDate.getTime()
      }
      
      return true
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que desea eliminar la cotización ${completeWithZeros(data.number)}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          {/* <Link href={`/seller/cotizations/new?id=${data.id}`}>
            <Pencil className="hover:cursor-pointer" />
          </Link> */}
          <DeleteCotizationDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


