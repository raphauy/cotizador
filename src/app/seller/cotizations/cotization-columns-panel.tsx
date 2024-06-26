"use client"

import { Button } from "@/components/ui/button"
import { CotizationDAO } from "@/services/cotization-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import ColumnPanelBox from "./column-panel-box"


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
        <ColumnPanelBox cotization={row.original} />
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

]


