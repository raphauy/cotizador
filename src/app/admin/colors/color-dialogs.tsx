"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, Ban, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArchiveAndDuplicateColorForm, ColorForm, DeleteColorForm, MarkAsDiscontinuedColorForm } from "./color-forms"
import { getColorDAOAction } from "./color-actions"

type Props= {
  id?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Crear Color</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function ColorDialog({ id }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} Color 
          </DialogTitle>
        </DialogHeader>
        <ColorForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteColorDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Color</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteColorForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type ArchiveAndDuplicateProps = {
  id: string
  name: string
}

export function ArchiveAndDuplicateColorDialog({ id, name }: ArchiveAndDuplicateProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowLeftRight className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archivar y Duplicar Color</DialogTitle>
          <DialogDescription className="py-4">
            Esta acción archivará el color actual &quot;{name}&quot; y creará una copia con nuevos precios.
            Las cotizaciones existentes seguirán utilizando el color archivado.
          </DialogDescription>
        </DialogHeader>
        <ArchiveAndDuplicateColorForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type MarkAsDiscontinuedProps = {
  id: string
  name: string
  discontinued: boolean
}

export function MarkAsDiscontinuedColorDialog({ id, name, discontinued }: MarkAsDiscontinuedProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Ban className="hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{discontinued ? 'Reactivar' : 'Marcar como Discontinuado'}</DialogTitle>
          <DialogDescription className="py-4">
            {discontinued 
              ? `¿Está seguro que desea reactivar el color "${name}"? Volverá a estar disponible para nuevos trabajos.`
              : `¿Está seguro que desea marcar como discontinuado el color "${name}"? No estará disponible para nuevos trabajos, pero los trabajos existentes mantendrán este color.`
            }
          </DialogDescription>
        </DialogHeader>
        <MarkAsDiscontinuedColorForm closeDialog={() => setOpen(false)} id={id} discontinued={discontinued} />
      </DialogContent>
    </Dialog>
  )
}
