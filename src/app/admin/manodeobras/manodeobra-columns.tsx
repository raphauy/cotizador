"use client"

import { Button } from "@/components/ui/button"
import { ManoDeObraDAO } from "@/services/manodeobra-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CheckCircle, Archive } from "lucide-react"
import { format } from "date-fns"
import { DeleteManoDeObraDialog, ManoDeObraDialog, ArchiveManoDeObraDialog, ArchiveAndDuplicateManoDeObraDialog } from "./manodeobra-dialogs"
import { Badge } from "@/components/ui/badge"


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

      const deleteDescription= `¿Seguro que desea eliminar la mano de obra "${data.name}"?`
 
      return (
        <div className="flex items-center justify-end gap-2">
          <ManoDeObraDialog id={data.id} />
          <ArchiveManoDeObraDialog id={data.id} archived={data.archived} />
          {!data.archived && (
            <ArchiveAndDuplicateManoDeObraDialog id={data.id} name={data.name} />
          )}
          <DeleteManoDeObraDialog description={deleteDescription} id={data.id} />
        </div>
      )
    },
  },
]


