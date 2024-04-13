"use client"

import { Button } from "@/components/ui/button"
import { ItemDAO } from "@/services/item-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteItemDialog, ItemDialog } from "./item-dialogs"
import { getItemDescription } from "@/lib/utils"


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

      const deleteDescription= `Seguro que deseas este ${data.type}?`
 
      return (
        <div className="flex items-center justify-end gap-4">

          <p>{data.valor} USD</p>
          <div className="flex items-center">
            <ItemDialog id={data.id} workId={data.workId} />
            <DeleteItemDialog description={deleteDescription} id={data.id} />
          </div>
        </div>

      )
    },
  },
]


