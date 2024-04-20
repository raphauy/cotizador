"use client"

import { Button } from "@/components/ui/button"
import { TerminacionDAO } from "@/services/terminacion-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CircleCheck } from "lucide-react"
import { format } from "date-fns"
import { DeleteTerminacionDialog, TerminacionDialog } from "./terminacion-dialogs"


export const columns: ColumnDef<TerminacionDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nombre
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "price",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Precio $
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

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

      const deleteDescription= `Do you want to delete Terminacion ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <TerminacionDialog id={data.id} />
          <DeleteTerminacionDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


