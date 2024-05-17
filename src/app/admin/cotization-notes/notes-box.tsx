"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { CotizationNoteDAO } from "@/services/cotizationnote-services"
import { Reorder } from "framer-motion"
import { Loader, X } from "lucide-react"
import { useEffect, useState } from "react"
import { deleteCotizationNoteAction, updateOrderAction } from "./cotizationnote-actions"
import { CotizationNoteDialog } from "./cotizationnote-dialogs"

type Props= {
    initialNotes: CotizationNoteDAO[]
}
export default function NotesBox({ initialNotes }: Props) {

    const [notes, setNotes] = useState(initialNotes)
    const [loading, setLoading] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        setNotes(initialNotes)
    }, [initialNotes])    

    function handleNewOrder(newOrder: CotizationNoteDAO[]) {
        updateOrderAction(newOrder)
        .then(() => {
            setNotes(newOrder)
        })
        .catch((error) => {
            toast({title: "Error", description: "Error al actualizar el orden de las notas", variant: "destructive"})
        })
    }

    function handleDelete(id: string) {
        setLoading(true)
        setDeletingId(id)
        deleteCotizationNoteAction(id)
        .then(() => {
          toast({ title: "Nota eliminada" })
          setNotes(notes.filter((note) => note.id !== id))
        })
        .catch((error) => {
          toast({title: "Error", description: error.message, variant: "destructive"})
        })
        .finally(() => {
          setLoading(false)
          setDeletingId(null)
        })
    }
    return (
        <Reorder.Group values={notes} onReorder={(newOrder) => handleNewOrder(newOrder)} className="bg-white rounded-lg dark:bg-slate-800 border mt-10">
        {
            notes.map((note, index) => {
                return (
                    <Reorder.Item key={note.id} value={note} className="flex items-center justify-between w-full text-muted-foreground border-b hover:bg-slate-50 min-h-12 px-4">
                        <p className="cursor-pointer w-full py-2 pr-3 whitespace-pre-line">{note.text}</p>
                        <div className="flex items-center">
                            <CotizationNoteDialog id={note.id} />
                            {/* <DeleteCotizationNoteDialog id={note.id} description={`seguro que quieres eliminar la nota ${note.text}?`} /> */}
                            {
                                loading && deletingId === note.id ? <Loader className="h-5 w-5 animate-spin" />
                                : 
                                <Button variant="ghost" className="px-1" onClick={() => handleDelete(note.id)}>
                                    <X className="w-5 h-5 text-red-500" />
                                </Button>
                            }
                        </div>
                    </Reorder.Item>
                        )
            })
        }
        </Reorder.Group>
    )
}
