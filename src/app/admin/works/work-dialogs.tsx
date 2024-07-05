"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, PlusCircle, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteWorkForm, DuplicateWorkForm, WorkForm } from "./work-forms";

type Props= {
  id?: string
  cotizationId: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear Trabajo</Button>
const updateTrigger= <div className="flex items-center gap-2 hover:cursor-pointer"><Settings size={25} className="mr-2"/>Configurar trabajo</div> 

export function WorkDialog({ id, cotizationId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2 hover:bg-slate-100 hover:text-green-600 h-9 rounded-sm">
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} Trabajo
          </DialogTitle>
        </DialogHeader>
        <WorkForm closeDialog={() => setOpen(false)} id={id} cotizationId={cotizationId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteWorkDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2 hover:bg-slate-100 hover:text-green-600 h-9 rounded-sm">
        <div className="flex items-center gap-2 hover:cursor-pointer">
          <Trash2 size={25} className="text-red-400 mr-2"/>
          <p>Eliminar trabajo</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Work</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteWorkForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type DuplicateProps= {
  id: string
  description: string
}

export function DuplicateWorkDialog({ id, description }: DuplicateProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2 hover:bg-slate-100 hover:text-green-600 h-9 rounded-sm">
        <div className="flex items-center gap-2 hover:cursor-pointer">
          <Copy className="mr-2"/>
          <p>Duplicar trabajo</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicar trabajo</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DuplicateWorkForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
