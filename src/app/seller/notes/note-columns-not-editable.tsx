"use client"

import { Button } from "@/components/ui/button"
import { NoteDAO } from "@/services/note-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteNoteDialog, NoteDialog } from "./note-dialogs"
import { Badge } from "@/components/ui/badge"


export const columns: ColumnDef<NoteDAO>[] = [
  
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
    cell: ({ row }) => {
      const data= row.original
      const deleteDescription= `seguro que quieres eliminar la nota ${data.text}?`
      return (
        <div className="flex items-center justify-between w-full">
          <div className="whitespace-pre-line">
            {data.text}
          </div>
        </div>
      )
    },
  },

]


