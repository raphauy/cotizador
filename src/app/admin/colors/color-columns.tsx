"use client"

import { Button } from "@/components/ui/button"
import { ColorDAO } from "@/services/color-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { DeleteColorDialog, ColorDialog } from "./color-dialogs"


export const columns: ColumnDef<ColorDAO>[] = [
  
  {
    accessorKey: "materialName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Material
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Color
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "clienteFinalPrice",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Precio Cliente Final $
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <p className="text-right w-28">
          {data.clienteFinalPrice && data.clienteFinalPrice.toLocaleString()}
        </p>
      )
    },
  },

  {
    accessorKey: "arquitectoStudioPrice",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Precio Arquitecto/Estudio $
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <p className="text-right w-28">
          {data.arquitectoStudioPrice && data.arquitectoStudioPrice.toLocaleString()}
        </p>
      )
    },
  },

  {
    accessorKey: "distribuidorPrice",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Precio Distribuidor $
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <p className="text-right w-28">
          {data.distribuidorPrice && data.distribuidorPrice.toLocaleString()}
        </p>
      )
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que desea eliminar el color ${data.name}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <ColorDialog id={data.id} />
          <DeleteColorDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


