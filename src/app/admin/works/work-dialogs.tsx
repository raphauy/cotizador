"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteWorkForm, WorkForm } from "./work-forms";

type Props= {
  id?: string
  cotizationId: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear Trabajo</Button>
const updateTrigger= <Settings size={25} className="mr-2 hover:cursor-pointer text-muted-foreground"/>

export function WorkDialog({ id, cotizationId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
      <DialogTrigger asChild>
        <Trash2 size={25} className="hover:cursor-pointer text-red-400"/>
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

