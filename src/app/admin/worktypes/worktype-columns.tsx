"use client"

import { Button } from "@/components/ui/button"
import { WorkTypeDAO } from "@/services/worktype-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteWorkTypeDialog, WorkTypeDialog } from "./worktype-dialogs"


export const columns: ColumnDef<WorkTypeDAO>[] = [
  
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
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que desea eliminar el tipo de trabajo ${data.name}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <WorkTypeDialog id={data.id} />
          <DeleteWorkTypeDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


