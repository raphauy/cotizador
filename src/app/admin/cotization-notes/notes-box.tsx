"use client"

import { Card } from "@/components/ui/card"
import { CotizationNoteDAO } from "@/services/cotizationnote-services"
import { CotizationNoteDialog, DeleteCotizationNoteDialog } from "./cotizationnote-dialogs"
import { useEffect, useState } from "react"
import { Reorder } from "framer-motion"
import { updateOrderAction } from "./cotizationnote-actions"
import { toast } from "@/components/ui/use-toast"

type Props= {
    initialNotes: CotizationNoteDAO[]
}
export default function NotesBox({ initialNotes }: Props) {

    const [notes, setNotes] = useState(initialNotes)

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
    return (
        <Reorder.Group values={notes} onReorder={(newOrder) => handleNewOrder(newOrder)} className="bg-white rounded-lg dark:bg-slate-800 border mt-10">
        {
            notes.map((note, index) => {
                return (
                    <Reorder.Item key={note.id} value={note} className="flex items-center justify-between w-full text-muted-foreground border-b hover:bg-slate-50 h-12 px-4">
                        <p className="cursor-pointer w-full">{note.text}</p>
                        <div className="flex items-center">
                            <CotizationNoteDialog id={note.id} />
                            <DeleteCotizationNoteDialog id={note.id} description={`seguro que quieres eliminar la nota ${note.text}?`} />
                        </div>
                    </Reorder.Item>
                        )
            })
        }
        </Reorder.Group>
    )
}
