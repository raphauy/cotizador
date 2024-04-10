"use server"
  
import { revalidatePath } from "next/cache"
import { NoteDAO, NoteFormValues, createNote, updateNote, getFullNoteDAO, deleteNote } from "@/services/note-services"


export async function getNoteDAOAction(id: string): Promise<NoteDAO | null> {
    return getFullNoteDAO(id)
}

export async function createOrUpdateNoteAction(id: string | null, data: NoteFormValues): Promise<NoteDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateNote(id, data)
    } else {
        updated= await createNote(data)
    }     

    revalidatePath("/seller/notes")

    return updated as NoteDAO
}

export async function deleteNoteAction(id: string): Promise<NoteDAO | null> {    
    const deleted= await deleteNote(id)

    revalidatePath("/seller/notes")

    return deleted as NoteDAO
}

