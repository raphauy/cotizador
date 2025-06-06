"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { BadgeCheck, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ArchiveStatusFilterProps<TData> {
  table: Table<TData>
  columnName?: string
  title?: string
}

/**
 * Componente reutilizable para filtrar por estado archivado/activo/discontinuado
 * @param table - La tabla de TanStack Table
 * @param columnName - El nombre de la columna que contiene el campo 'archived' (por defecto: "archived")
 * @param title - El título que se muestra en el botón del filtro (por defecto: "Estado")
 */
export function ArchiveStatusFilter<TData>({ 
  table,
  columnName = "archived",
  title = "Estado"
}: ArchiveStatusFilterProps<TData>) {
  const column = table.getColumn(columnName)
  if (!column) return null

  const statusOptions = ["Activo", "Archivado", "Discontinuado"];
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])
  
  // Calcular conteos para cada estado usando los datos de la tabla
  const tableData = table.getFilteredRowModel().rows.map(row => row.original) as any[];
  const counts = {
    "Activo": tableData.filter(item => !item.archived && !item.discontinued).length,
    "Archivado": tableData.filter(item => item.archived).length,
    "Discontinuado": tableData.filter(item => !item.archived && item.discontinued).length
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 border-dashed">
          <BadgeCheck className="w-4 h-4 mr-2" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-4 mx-2" />
              <Badge
                variant="secondary"
                className="px-1 font-normal rounded-sm lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="px-1 font-normal rounded-sm"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  statusOptions
                    .filter((option) => selectedValues.has(option))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option}
                        className="px-1 font-normal rounded-sm whitespace-nowrap"
                      >
                        {option}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[230px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {statusOptions.map((option) => {
                const isSelected = selectedValues.has(option)
                return (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option)
                      } else {
                        selectedValues.add(option)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <span>{option}</span>
                    
                    <span className="flex items-center justify-center w-4 h-4 ml-auto font-mono text-xs">
                      {counts[option as keyof typeof counts]}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 