"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatWhatsAppStyle, getCotizationTypeLabel } from "@/lib/utils"
import { CotizationDAOForTable } from "@/services/cotization-services"
import { CotizationStatus } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ClipboardPen } from "lucide-react"
import Link from "next/link"
import { StatusSelector } from "./[cotizationId]/status-selector"
import { DeleteCotizationDialog } from "./cotization-dialogs"
import { DateRange } from "./cotization-table"


export const columns: ColumnDef<CotizationDAOForTable>[] = [
  
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
              {row.original.label}
            </Button>
        </Link>
      )
    },
    filterFn: (row, id, value) => {
      const valueStr= String(row.getValue(id))
      return valueStr.includes(value as string)
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
    accessorKey: "clientType",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tipo de cliente
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
    cell: ({ row }) => {
      const data= row.original
      return (
        <p>{getCotizationTypeLabel(data.type)}</p>
      )
    },
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

      const deleteDescription= `Seguro que desea eliminar la cotización ${data.label}?`

      const isBorrador= data.status === CotizationStatus.BORRADOR
 
      return (
        <div className="flex items-center justify-end gap-2">

          {
            data.comments &&
            <Tooltip>
              <TooltipTrigger asChild>
                  <ClipboardPen size={20} />
              </TooltipTrigger>
              <TooltipContent>
                  <p className="text-sm max-w-xs">{data.comments}</p>
              </TooltipContent>
          </Tooltip>
          }
          { isBorrador && <DeleteCotizationDialog description={deleteDescription} id={data.id} /> }
        </div>

      )
    },
  },
]


