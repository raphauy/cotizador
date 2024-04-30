"use client"

import { Button } from "@/components/ui/button"
import { ItemDAO } from "@/services/item-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil } from "lucide-react"
import { format } from "date-fns"
import { DeleteItemDialog, ItemDialog } from "./item-dialogs"
import { formatCurrency, getItemDescription } from "@/lib/utils"
import { ItemType } from "@prisma/client"
import Link from "next/link"


export const columns: ColumnDef<ItemDAO>[] = [

  {
    accessorKey: "type",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <p>{getItemDescription(data)}</p>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que deseas eliminar este(a) ${data.type}?`

      return (
        <div className="flex items-center justify-end gap-4">

          <p className="whitespace-nowrap">{formatCurrency((data.valor || 0) * data.quantity)}</p>
          <div className="flex items-center">
            {
              data.type === ItemType.TERMINACION ?
              <Link href={`/seller/cotizations/${data.work.cotizationId}/addTermination?itemId=${data.id}`}>
                <Pencil className="w-5 h-5 cursor-pointer mr-2" />
              </Link>
              :
              data.type === ItemType.MANO_DE_OBRA ?
              <Link href={`/seller/cotizations/${data.work.cotizationId}/addManoDeObra?itemId=${data.id}`}>
                <Pencil className="w-5 h-5 cursor-pointer mr-2" />
              </Link>
              :
              data.type === ItemType.AJUSTE ?
              <Link href={`/seller/cotizations/${data.work.cotizationId}/addAjuste?itemId=${data.id}`}>
                <Pencil className="w-5 h-5 cursor-pointer mr-2" />
              </Link>
              :
              data.type === ItemType.COLOCACION ?
              <div className="w-6"/>
              :
              <ItemDialog id={data.id} workId={data.workId} cotizationId={data.work.cotizationId} />
            }
            
            <DeleteItemDialog description={deleteDescription} id={data.id} />
          </div>
        </div>

      )
    },
  },
]


