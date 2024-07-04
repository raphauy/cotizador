"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CommentsForm, DeleteCotizationForm } from "./cotization-forms";
import { Button } from "@/components/ui/button";
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteCotizationDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Cotization</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteCotizationForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}
  


// --- Comments ---
type CommentsProps= {
  cotizationId: string
  comments: string
}

export function CommentsDialog({ cotizationId, comments }: CommentsProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {
          comments ?
          <div><Pencil className="hover:cursor-pointer"/></div>
          :
          <Button variant="outline" className="gap-2 text-verde-abbate">
            <p>Agregar comentario</p>
          </Button>
        }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ comments ? "Actualizar comentarios" : "Agregar comentarios" }</DialogTitle>
        </DialogHeader>
        <CommentsForm closeDialog={() => setOpen(false)} cotizationId={cotizationId} comments={comments} />
      </DialogContent>
    </Dialog>
  )
}