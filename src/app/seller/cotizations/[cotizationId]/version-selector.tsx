"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CotizationDAO } from "@/services/cotization-services"
import { Check, ChevronsUpDown, Loader } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { getVersionsAction } from "../cotization-actions"

export type SelectorData={
  id: string,
  name: string,
}

type Props= {
    cotization: CotizationDAO
}

export function VersionSelector({ cotization }: Props) {

  const router= useRouter()

  const [data, setData] = useState<SelectorData[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [name, setName] = useState("")
  const [selectors, setSelectors]= useState<SelectorData[]>([])

  useEffect(() => {
    setLoading(true)
    getVersionsAction(cotization.id)
    .then((found) => {
        const data= found.map((item) => ({ id: item.id, name: item.label }))
        setData(data)
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(() => {
      setLoading(false)
    })
    
  }, [cotization])
  

  useEffect(() => {
    if (data) {
      setSelectors(data)
    }

    if (cotization.id) {
      const selectedName= data.find((item) => item.id === cotization.id)?.name
      selectedName && setName(selectedName)
    }

  }, [data, cotization.id])

  const filteredValues = useMemo(() => {
      if (!searchValue) return selectors

      const lowerCaseSearchValue = searchValue.toLowerCase();
      return selectors.filter((item) => item.name.toLowerCase().includes(lowerCaseSearchValue))
  }, [selectors, searchValue])

  if (!cotization.id) return null

  return (
    <div className="flex items-center w-full mb-3 text-verde-abbate">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full whitespace-nowrap min-w-[150px] border"
          >
            <div className="flex items-center gap-2">
              <p>{name}</p>
            </div>
            {
              loading ? <Loader className="w-4 h-4 ml-2 animate-spin" /> : <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
            }
          </Button>
        </PopoverTrigger>

        <PopoverContent className="min-w-[150px] p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Buscar cliente..." />
          <CommandList>
              <CommandEmpty>No hay resultados.</CommandEmpty>
              <CommandGroup>
                  {filteredValues.map((item, index) => {
                  //if (index >= 10) return null
                  return (
                      <CommandItem
                      key={item.id}
                      onSelect={(currentValue) => {
                        if (currentValue !== name) {
                          setLoading(true)
                          router.push(`/seller/cotizations/${item.id}`)
                        }
                        setSearchValue("")
                        setOpen(false)
                        setName(item.name)
                      }}
                      >
                      <Check className={cn("mr-2 h-4 w-4", name === item.name ? "opacity-100" : "opacity-0")}/>
                      <div className="flex items-center gap-2 text-verde-abbate">
                        {item.name}
                      </div>
                      </CommandItem>
                  )})}

              </CommandGroup>
          </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

  )
}
  
