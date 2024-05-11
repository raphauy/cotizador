import NotesBox from "@/app/admin/cotization-notes/notes-box"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { reloadOriginalNotes } from "@/services/cotization-services"
import { CotizationNoteDAO } from "@/services/cotizationnote-services"
import { revalidatePath } from "next/cache"

type Props= {
    cotizationId: string
    initialNotes: CotizationNoteDAO[]
}
export default function CotizationNotesBox({ cotizationId, initialNotes }: Props) {
    async function onReloadNotes() {
        "use server"
        console.log("reloading notes, cotizationId: ", cotizationId)

        await reloadOriginalNotes(cotizationId)
        revalidatePath("/seller/cotizations/[cotizationId]", "page")        
    }
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="Notas del presupuesto" className="border-none">
                <AccordionTrigger>
                    <p className="font-bold text-lg">Notas del presupuesto</p>
                </AccordionTrigger>
                <AccordionContent>
                    <NotesBox initialNotes={initialNotes} />
                    <form action={onReloadNotes} className="flex justify-end">
                        <Button className="mt-4" variant="outline">Recargar notas originales</Button>
                    </form>
                </AccordionContent>

            </AccordionItem>
        </Accordion>

    )
}
