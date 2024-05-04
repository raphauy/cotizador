"use client"

import { Button } from "@/components/ui/button"
import { ClientDAO } from "@/services/client-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil } from "lucide-react"
import { format } from "date-fns"
import { DeleteClientDialog, ClientDialog } from "./client-dialogs"

export const columns: ColumnDef<ClientDAO>[] = [
  
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
    accessorKey: "email",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Email
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "phone",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Teléfono
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "note",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nota
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
},
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Client ${data.id}?`
      const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/> 

      return (
        <div className="flex items-center justify-end gap-2">

          <ClientDialog id={data.id} updateTrigger={updateTrigger} />
          <DeleteClientDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


