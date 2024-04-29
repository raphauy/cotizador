"use client"

import { Button } from "@/components/ui/button"
import { AppConfigDAO } from "@/services/appconfig-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteAppConfigDialog, AppConfigDialog } from "./appconfig-dialogs"

import { DefaultManoDeObrasDialog } from "./appconfig-dialogs"
  

export const columns: ColumnDef<AppConfigDAO>[] = [
  
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

      const deleteDescription= `Do you want to delete AppConfig ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <DefaultManoDeObrasDialog id={data.id} title={"DefaultManoDeObras"} />
  
          <AppConfigDialog id={data.id} />
          <DeleteAppConfigDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


