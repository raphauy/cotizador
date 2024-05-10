"use client"

import { Button } from "@/components/ui/button"
import { WorkDAO } from "@/services/work-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteWorkDialog, WorkDialog } from "./work-dialogs"


export const columns: ColumnDef<WorkDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que desea eliminar el trabajo ${data.name}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <WorkDialog id={data.id} cotizationId={data.cotizationId} />
          <DeleteWorkDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


