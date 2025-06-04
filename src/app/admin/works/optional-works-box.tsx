"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorDAO } from "@/services/color-services";
import { getComplementaryOptionalColorsDAOAction, getOptionalColorsDAOAction, setOptionalColorsAction } from "./work-actions";
import { cn } from "@/lib/utils";

type CollectionProps = {
  workId: string
}
   
export function OptionalColorsBoxDialog({ workId }: CollectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2 hover:bg-slate-100 hover:text-green-600 h-9 rounded-sm pr-2">
        <ArrowLeftRight className="mr-2" />
        <p>Materiales opcionales</p>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Materiales opcionales</DialogTitle>
        </DialogHeader>
        <OptionalColorsBox closeDialog={() => setOpen(false)} workId={workId} />
      </DialogContent>
    </Dialog>
  );
}      




interface OptionalColorsBoxProps{
  workId: string
  closeDialog?: () => void
}

export function OptionalColorsBox({ workId, closeDialog }: OptionalColorsBoxProps) {

  const [loading, setLoading] = useState(false)
  const [optionalColors, setOptionalColors] = useState<ColorDAO[]>([])
  const [complementary, setComplementary] = useState<ColorDAO[]>([])
  const [filteredComplementary, setFilteredComplementary] = useState<ColorDAO[]>(complementary)
  const [inputValue, setInputValue] = useState("")
  const [showX, setShowX] = useState(false)

  useEffect(() => {
      getOptionalColorsDAOAction(workId)
      .then((data) => {
          if(!data) return null
          setOptionalColors(data)          
      })
      getComplementaryOptionalColorsDAOAction(workId)
      .then((data) => {
          if(!data) return null
          setComplementary(data)
          setFilteredComplementary(data)
      })
  }, [workId])

  function complementaryIn(id: string) {
      const comp= complementary.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= complementary.filter((c) => c.id !== id)
      setComplementary(newComplementary)
      setOptionalColors([...optionalColors, comp])
  }

  function complementaryOut(id: string) {            
      const comp= optionalColors.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= optionalColors.filter((c) => c.id !== id)
      setOptionalColors(newComplementary)
      setComplementary([...complementary, comp])
  }

  function allIn() {
      setOptionalColors([...optionalColors, ...complementary])
      setComplementary([])
  }

  function allOut() {
      setComplementary([...complementary, ...optionalColors])
      setOptionalColors([])
  }

  function handleDeleteFilter() {
    setFilteredComplementary(complementary)
    setShowX(false)
    setInputValue("")
  }
  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
      const value = e.target.value
      if (value.length > 0) {
          setShowX(true)
          const filtered = complementary.filter(color => color.name.toLowerCase().includes(value.toLowerCase()))
          setFilteredComplementary(filtered)          
          setInputValue(value)
      } else {
          setShowX(false)
          setFilteredComplementary(complementary)
          setInputValue("")
      }
  }

  async function handleSave() {
      setLoading(true)
      setOptionalColorsAction(workId, optionalColors)
      .then(() => {
          toast({ title: "Colores opcionales actualizados" })
          closeDialog && closeDialog()
      })
      .catch((error) => {
          toast({ title: "Error actualizando colores opcionales" })
      })
      .finally(() => {
          setLoading(false)
      })
  }

  return (
      <div className="w-full">
          <p className="font-bold text-lg">Mueve a la izquierda los colores opcioniales</p>
          <div className="grid grid-cols-2 gap-4 p-3 border rounded-md min-w-[400px] min-h-[300px] bg-white">
              <div className="flex flex-col">
                <p className="font-bold text-lg mt-2">Colores opcionales:</p>
                <ScrollArea className="h-72 rounded-md border p-2 mb-2">
                {
                  optionalColors.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center justify-between gap-2 mb-1 mr-5">
                          <div className="flex items-center gap-2 flex-1">
                              <p className="whitespace-nowrap">{item.name}</p>
                              <div className="flex gap-1">
                                  {item.archived && (
                                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                                          Archivado
                                      </Badge>
                                  )}
                                  {item.discontinued && (
                                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                          Discontinuado
                                      </Badge>
                                  )}
                              </div>
                          </div>
                          <Button variant="secondary" className="h-7" onClick={() => complementaryOut(item.id)}><ChevronsRight /></Button>
                      </div>
                  )})
                }
                </ScrollArea>
                {/* <div className="flex items-end justify-between flex-1 gap-2 mb-1 mr-5">
                    <p>Todos</p>
                    <Button variant="secondary" className="h-7" onClick={() => allOut()}><ChevronsRight /></Button>
                </div> */}
              </div>
              <div className="flex flex-col">
                <div className="relative w-full flex-grow mb-2">
                  <input type="text" placeholder="Buscar color..." 
                      className="border pl-10 py-1 h-full rounded-md w-full" 
                      onChange={handleFilter}
                      value={inputValue}
                  />
                  <Search className="absolute left-3 top-1.5 text-gray-400 h-5 w-5" />
                  <X 
                    className={cn("absolute right-3 top-1.5 text-gray-400 h-5 w-5 hover:cursor-pointer", showX ? "block" : "hidden")}
                    onClick={handleDeleteFilter} 
                  />
                </div>
                <ScrollArea className="h-72 rounded-md border p-2 mb-2">
                {
                  filteredComplementary.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center gap-2 mb-1">
                        <Button variant="secondary" className="h-7 x-7" onClick={() => complementaryIn(item.id)}>
                            <ChevronsLeft />
                        </Button>
                        <p className="whitespace-nowrap">{item.name}</p>
                      </div>

                  )})
                }
                </ScrollArea>
              </div>
          </div>

          <div className="flex justify-end mt-4">
              <Button onClick={handleSave} className="w-32 ml-2" >{loading ? <Loader className="animate-spin" /> : <p>Guardar</p>}</Button>
          </div>
      </div>
  )
} 
  
