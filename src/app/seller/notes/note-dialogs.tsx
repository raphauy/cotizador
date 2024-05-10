"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { NoteForm, DeleteNoteForm } from "./note-forms"
import { getNoteDAOAction } from "./note-actions"

type Props= {
  id?: string
  workId: string
}

const addTrigger= <Button variant="link" className="px-2"><PlusCircle size={22} className=""/></Button> 
const updateTrigger= <Pencil size={28} className="pr-2 hover:cursor-pointer text-muted-foreground"/>

export function NoteDialog({ id, workId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar nota' : 'Crear nota'}</DialogTitle>
        </DialogHeader>
        <NoteForm closeDialog={() => setOpen(false)} id={id} workId={workId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteNoteDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 size={20} className="hover:cursor-pointer text-muted-foreground"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Note</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteNoteForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}




  
