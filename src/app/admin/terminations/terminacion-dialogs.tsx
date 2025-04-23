"use client"

import { useEffect, useState } from "react";
import { Archive, ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast";
import { TerminacionForm, DeleteTerminacionForm, ArchiveTerminacionForm, ArchiveAndDuplicateTerminacionForm } from "./terminacion-forms"
import { getTerminacionDAOAction } from "./terminacion-actions"

type Props= {
  id?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear Terminación</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function TerminacionDialog({ id }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar Terminacion' : 'Crear Terminacion'}</DialogTitle>
        </DialogHeader>
        <TerminacionForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteTerminacionDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Terminacion</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteTerminacionForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type ArchiveProps = {
  id: string
  archived: boolean
}

export function ArchiveTerminacionDialog({ id, archived }: ArchiveProps) {
  const [open, setOpen] = useState(false)
  const title = archived ? "Desarchivar Terminación" : "Archivar Terminación"
  const description = archived 
    ? "Al desarchivar esta terminación, estará disponible de nuevo para nuevas cotizaciones." 
    : "Al archivar esta terminación, no estará disponible para nuevas cotizaciones, pero se mantendrá en cotizaciones existentes."

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Archive className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <ArchiveTerminacionForm closeDialog={() => setOpen(false)} id={id} archived={archived} />
      </DialogContent>
    </Dialog>
  )
}

type ArchiveAndDuplicateProps = {
  id: string
  name: string
}

export function ArchiveAndDuplicateTerminacionDialog({ id, name }: ArchiveAndDuplicateProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowLeftRight className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archivar y Duplicar Terminación</DialogTitle>
          <DialogDescription className="py-8">
            Esta acción archivará la terminación &quot;{name}&quot; y creará una nueva copia con un precio actualizado. 
            Las cotizaciones existentes seguirán usando la versión archivada.
          </DialogDescription>
        </DialogHeader>
        <ArchiveAndDuplicateTerminacionForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
