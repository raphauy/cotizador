"use server"
  
import { revalidatePath } from "next/cache"
import { TerminacionDAO, TerminacionFormValues, createTerminacion, updateTerminacion, getFullTerminacionDAO, deleteTerminacion, getTerminacionsDAO } from "@/services/terminacion-services"


export async function getTerminacionDAOAction(id: string): Promise<TerminacionDAO | null> {
    return getFullTerminacionDAO(id)
}

export async function createOrUpdateTerminacionAction(id: string | null, data: TerminacionFormValues): Promise<TerminacionDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateTerminacion(id, data)
    } else {
        updated= await createTerminacion(data)
    }     

    revalidatePath("/admin/terminacions")

    return updated as TerminacionDAO
}

export async function deleteTerminacionAction(id: string): Promise<TerminacionDAO | null> {    
    const deleted= await deleteTerminacion(id)

    revalidatePath("/admin/terminacions")

    return deleted as TerminacionDAO
}

export async function getTerminacionsDAOAction(): Promise<TerminacionDAO[]> {
    return await getTerminacionsDAO()
}