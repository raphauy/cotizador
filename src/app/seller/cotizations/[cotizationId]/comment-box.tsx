"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ClipboardPen, Pencil, PlusCircle } from "lucide-react"
import { setCommentsAction } from "../cotization-actions"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { CommentsDialog } from "../cotization-dialogs"

type Props= {
  cotizationId: string
  comments: string
}
export default function CommentsBox({ cotizationId, comments }: Props) {

    const [value, setValue] = useState(comments)
    const [loading, setLoading] = useState(false)

    function handleSave() {
        setLoading(true)
        setCommentsAction(cotizationId, value)
        .then(() => {
            toast({ title: "Comentario actualizado" })
        })
        .catch((error) => {
            toast({ title: "Error al actualizar el comentario", variant: "destructive" })
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="flex items-center gap-2">
            {
                comments &&
                <div className="max-w-xs line-clamp-2">{comments}</div>
            }
            <CommentsDialog cotizationId={cotizationId} comments={comments} />        
        </div>
    );
}