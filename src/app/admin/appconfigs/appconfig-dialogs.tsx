"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast";
import { AppConfigForm, DeleteAppConfigForm } from "./appconfig-forms"
import { getAppConfigDAOAction } from "./appconfig-actions"

import { getComplentaryDefaultManoDeObrasAction, setDefaultManoDeObrasAction } from "./appconfig-actions"
import { ManoDeObraDAO } from "@/services/manodeobra-services"  
import { ScrollArea } from "@/components/ui/scroll-area";
  
type Props= {
  id?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create AppConfig</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function AppConfigDialog({ id }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} AppConfig
          </DialogTitle>
        </DialogHeader>
        <AppConfigForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteAppConfigDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete AppConfig</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteAppConfigForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}

    
export function DefaultManoDeObrasDialog({ id, title }: CollectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowLeftRight className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <AppConfigDefaultManoDeObrasBox closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  );
}      




interface DefaultManoDeObrasBoxProps{
  id: string
  closeDialog?: () => void
}

export function AppConfigDefaultManoDeObrasBox({ id, closeDialog }: DefaultManoDeObrasBoxProps) {

  const [loading, setLoading] = useState(false)
  const [defaultManoDeObras, setDefaultManoDeObras] = useState<ManoDeObraDAO[]>([])
  const [complementary, setComplementary] = useState<ManoDeObraDAO[]>([])

  useEffect(() => {
      getAppConfigDAOAction(id)
      .then((data) => {
          if(!data) return null
          if (!data.defaultManoDeObras) return null
          console.log(data.defaultManoDeObras)            
          setDefaultManoDeObras(data.defaultManoDeObras)
      })
      getComplentaryDefaultManoDeObrasAction(id)
      .then((data) => {
          if(!data) return null
          setComplementary(data)
      })
  }, [id])

  function complementaryIn(id: string) {
      const comp= complementary.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= complementary.filter((c) => c.id !== id)
      setComplementary(newComplementary)
      setDefaultManoDeObras([...defaultManoDeObras, comp])
  }

  function complementaryOut(id: string) {            
      const comp= defaultManoDeObras.find((c) => c.id === id)
      if(!comp) return
      const newComplementary= defaultManoDeObras.filter((c) => c.id !== id)
      setDefaultManoDeObras(newComplementary)
      setComplementary([...complementary, comp])
  }

  function allIn() {
      setDefaultManoDeObras([...defaultManoDeObras, ...complementary])
      setComplementary([])
  }

  function allOut() {
      setComplementary([...complementary, ...defaultManoDeObras])
      setDefaultManoDeObras([])
  }

  async function handleSave() {
      setLoading(true)
      setDefaultManoDeObrasAction(id, defaultManoDeObras)
      .then(() => {
          toast({ title: "DefaultManoDeObras updated" })
          closeDialog && closeDialog()
      })
      .catch((error) => {
          toast({ title: "Error updating defaultManoDeObras" })
      })
      .finally(() => {
          setLoading(false)
      })
  }

  return (
      <div className="w-full">
          <p className="font-bold text-lg">Mano de obra por defecto para el ingreso de datos:</p>
          <div className="grid grid-cols-2 gap-4 p-3 border rounded-md min-w-[400px] min-h-[300px] bg-white">
              <div className="flex flex-col">
                <ScrollArea className="h-72 rounded-md border p-2 mb-2">
                {
                  defaultManoDeObras.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center justify-between gap-2 mb-1 mr-5">
                          <p className="whitespace-nowrap">{item.name}</p>
                          <Button variant="secondary" className="h-7" onClick={() => complementaryOut(item.id)}><ChevronsRight /></Button>
                      </div>
                  )})
                }
                </ScrollArea>
                <div className="flex items-end justify-between flex-1 gap-2 mb-1 mr-5">
                    <p>Todos</p>
                    <Button variant="secondary" className="h-7" onClick={() => allOut()}><ChevronsRight /></Button>
                </div>
              </div>
              <div className="flex flex-col">
                <ScrollArea className="h-72 rounded-md border p-2 mb-2">
                {
                  complementary.map((item) => {
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
                <div className="flex items-end flex-1 gap-2 mb-1">
                    <Button variant="secondary" className="h-7" onClick={() => allIn()}><ChevronsLeft /></Button>
                    <p>Todos</p>
                </div>
              </div>
          </div>

          <div className="flex justify-end mt-4">
              <Button onClick={handleSave} className="w-32 ml-2" >{loading ? <Loader className="animate-spin" /> : <p>Guardar</p>}</Button>
          </div>
      </div>
  )
} 
  
