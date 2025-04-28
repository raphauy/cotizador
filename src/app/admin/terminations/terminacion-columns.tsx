"use client"

import { Button } from "@/components/ui/button"
import { TerminacionDAO } from "@/services/terminacion-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CircleCheck } from "lucide-react"
import { format } from "date-fns"
import { ArchiveAndDuplicateTerminacionDialog, DeleteTerminacionDialog, TerminacionDialog } from "./terminacion-dialogs"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
    cell: ({ row }) => {
      const data= row.original
      return (
        <p className="ml-3">
          {data.price && formatCurrency(data.price)}
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
      return (
        <div className="flex justify-center items-center">
          {archived ? (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Archivado
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Activo
            </Badge>
          )}
        </div>
      )
    },
    filterFn: (row, id, filterValue) => {
      const archived = row.getValue(id) as boolean;
      // Manejar casos:
      // Si no hay filtro, o ambos están seleccionados, mostrar todo
      if (!filterValue?.length || 
          (filterValue.includes("Activo") && filterValue.includes("Archivado"))) {
        return true;
      }
      // Si solo Activo está seleccionado
      if (filterValue.includes("Activo") && !filterValue.includes("Archivado")) {
        return !archived;
      }
      // Si solo Archivado está seleccionado
      if (!filterValue.includes("Activo") && filterValue.includes("Archivado")) {
        return archived;
      }
      // Por defecto mostrar todo
      return true;
    },
    enableColumnFilter: true,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `¿Seguro que desea eliminar la terminación ${data.name}?`
 
      return (
        <div className="flex items-center justify-end gap-2">
          {!data.archived && (
            <ArchiveAndDuplicateTerminacionDialog id={data.id} name={data.name} />
          )}
          <TerminacionDialog id={data.id} />
          <DeleteTerminacionDialog description={deleteDescription} id={data.id} />
        </div>
      )
    },
  },
]


