"use server"
  
import { revalidatePath } from "next/cache"
import { CotizationNoteDAO, CotizationNoteFormValues, createCotizationNote, updateCotizationNote, getFullCotizationNoteDAO, deleteCotizationNote, updateOrder } from "@/services/cotizationnote-services"
import { reloadOriginalNotes } from "@/services/cotization-services"


export async function getCotizationNoteDAOAction(id: string): Promise<CotizationNoteDAO | null> {
    return getFullCotizationNoteDAO(id)
}

export async function createOrUpdateCotizationNoteAction(id: string | null, data: CotizationNoteFormValues): Promise<CotizationNoteDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateCotizationNote(id, data)
    } else {
        updated= await createCotizationNote(data)
    }     

    revalidatePath("/admin/cotization-notes")

    return updated as CotizationNoteDAO
}

export async function deleteCotizationNoteAction(id: string): Promise<CotizationNoteDAO | null> {    
    const deleted= await deleteCotizationNote(id)

    revalidatePath("/admin/cotization-notes")

    return deleted as CotizationNoteDAO
}

export async function updateOrderAction(notes: CotizationNoteDAO[]) {
    
    await updateOrder(notes)

    revalidatePath("/admin/cotization-notes")
    
}

