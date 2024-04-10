"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { ClientForm, DeleteClientForm } from "./client-forms";

  
type Props= {
  id?: string
  onSelect?: (id: string) => void
}


export function ClientDialog({ id, onSelect }: Props) {
  const addTrigger= <Button variant={onSelect ? "outline" : "default" }><PlusCircle size={22} className="mr-2"/>Nuevo Cliente</Button>
  const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} Cliente
          </DialogTitle>
        </DialogHeader>
        <ClientForm closeDialog={() => setOpen(false)} id={id} onSelect={onSelect} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteClientDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteClientForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

