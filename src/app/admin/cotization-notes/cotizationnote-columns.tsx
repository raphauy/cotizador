"use client"

import { Button } from "@/components/ui/button"
import { CotizationNoteDAO } from "@/services/cotizationnote-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteCotizationNoteDialog, CotizationNoteDialog } from "./cotizationnote-dialogs"


export const columns: ColumnDef<CotizationNoteDAO>[] = [
  
  {
    accessorKey: "text",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Text
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },
  // {
  //   accessorKey: "role",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" className="pl-0 dark:text-white"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Rol
  //         <ArrowUpDown className="w-4 h-4 ml-1" />
  //       </Button>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete CotizationNote ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <CotizationNoteDialog id={data.id} />
          <DeleteCotizationNoteDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


