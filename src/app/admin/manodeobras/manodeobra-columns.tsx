"use client"

import { Button } from "@/components/ui/button"
import { ManoDeObraDAO } from "@/services/manodeobra-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { DeleteManoDeObraDialog, ManoDeObraDialog } from "./manodeobra-dialogs"


export const columns: ColumnDef<ManoDeObraDAO>[] = [
  
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
    cell: ({ row }) => {
      const data= row.original
      return (
        <p className="md:min-w-[250px]">
          {data.name}
        </p>
      )
    },
  },

  {
    accessorKey: "clienteFinalPrice",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white w-full"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            CF $
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <p className="text-right mr-7">
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
            A/E $
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <p className="text-right mr-7">
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
            Dist. $
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (
        <p className="text-right mr-7">
          {data.distribuidorPrice && data.distribuidorPrice.toLocaleString()}
        </p>
      )
    },
  },

  {
    accessorKey: "isLinear",
    header: ({ column }) => {
        return (<div>ml</div>)
    },
    cell: ({ row }) => {
      const data= row.original
      return (
        <p>
          {data.isLinear && <CheckCircle className="w-4 h-4 text-green-600" />}
        </p>
      )
    },  
  },

  {
    accessorKey: "isSurface",
    header: ({ column }) => {
        return (<div>m²</div>)
    },
    cell: ({ row }) => {
      const data= row.original
      return (
        <p>
          {data.isSurface && <CheckCircle className="w-4 h-4 text-green-600" />}
        </p>
      )
    },
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete ManoDeObra ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <ManoDeObraDialog id={data.id} />
          <DeleteManoDeObraDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


