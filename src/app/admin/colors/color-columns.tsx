"use client"

import { Button } from "@/components/ui/button"
import { ColorDAO } from "@/services/color-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Archive } from "lucide-react"
import { format } from "date-fns"
import { DeleteColorDialog, ColorDialog, ArchiveAndDuplicateColorDialog, MarkAsDiscontinuedColorDialog } from "./color-dialogs"
import { Badge } from "@/components/ui/badge"

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
        <p className="text-right mr-10">
          {data.distribuidorPrice && data.distribuidorPrice.toLocaleString()}
        </p>
      )
    },
  },

  {
    accessorKey: "archived",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estado
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const archived = row.original.archived
      const discontinued = row.original.discontinued
      
      return (
        <div className="flex justify-center items-center gap-1">
          {archived ? (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
              Archivado
            </Badge>
          ) : discontinued ? (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
              Discontinuado
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
              Activo
            </Badge>
          )}
        </div>
      )
    },
    filterFn: (row, id, filterValue) => {
      const archived = row.getValue(id) as boolean;
      const discontinued = (row.original as any).discontinued as boolean;
      
      // Si no hay filtro, mostrar todo
      if (!filterValue?.length) {
        return true;
      }
      
      // Determinar el estado actual del color
      const currentState = archived ? "Archivado" : discontinued ? "Discontinuado" : "Activo";
      
      // Verificar si el estado actual está en los filtros seleccionados
      return filterValue.includes(currentState);
    },
    enableColumnFilter: true,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Seguro que desea eliminar el color ${data.name}?`
 
      return (
        <div className="flex items-center justify-end gap-2">
          {!data.archived && (
            <ArchiveAndDuplicateColorDialog id={data.id} name={data.name} />
          )}
          {!data.archived && (
            <MarkAsDiscontinuedColorDialog id={data.id} name={data.name} discontinued={data.discontinued} />
          )}
          <ColorDialog id={data.id} />
          <DeleteColorDialog description={deleteDescription} id={data.id} />
        </div>
      )
    },
  },
]


