"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { SlashIcon } from "@radix-ui/react-icons"
import { Check, ChevronsRight, ChevronsUpDown } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

export type SelectorData={
  id: string,
  name: string,
}

type Props= {
  data: SelectorData[]
  onSelect: (id: string) => void
  selectedId?: string
}

export function SellerSelector({ data, onSelect, selectedId }: Props) {

  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [name, setName] = useState("Selecciona un cliente")
  const [selectors, setSelectors]= useState<SelectorData[]>([])
  const params= useParams()    

  useEffect(() => {
    console.log("data", data)
    if (data) {
      setSelectors(data)
    }

    if (selectedId) {
      const selectedName= data.find((item) => item.id === selectedId)?.name
      selectedName && setName(selectedName)
    }

  }, [data, selectedId])

  const filteredValues = useMemo(() => {
      if (!searchValue) return selectors

      const lowerCaseSearchValue = searchValue.toLowerCase();
      return selectors.filter((item) => item.name.toLowerCase().includes(lowerCaseSearchValue))
  }, [selectors, searchValue])

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full whitespace-nowrap min-w-[230px] border"
          >
            <div className="flex items-center gap-2">
              <p className="dark:text-white">{name}</p>
            </div>
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="min-w-[230px] p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Buscar cotizador..." />
          <CommandList>
              <CommandEmpty>No hay resultados.</CommandEmpty>
              <CommandGroup>
                  {filteredValues.map((item, index) => {
                  if (index >= 10) return null
                  return (
                      <CommandItem
                      key={item.id}
                      onSelect={(currentValue) => {
                        if (currentValue !== name) {
                          onSelect(item.id)
                        }
                        setSearchValue("")
                        setOpen(false)
                        setName(item.name)
                      }}
                      >
                      <Check className={cn("mr-2 h-4 w-4", name === item.name ? "opacity-100" : "opacity-0")}/>
                      <div className="flex items-center gap-2">
                        {item.name}
                      </div>
                      </CommandItem>
                  )})}

                  {filteredValues.length - 10 > 0 &&
                  <div className="flex items-center mt-5 font-bold">
                      <ChevronsRight className="w-5 h-5 ml-1 mr-2"/>
                      <p className="text-sm">Hay {filteredValues.length - 10} clientes más</p>
                  </div>
                  }

              </CommandGroup>
          </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

  )
}
  
