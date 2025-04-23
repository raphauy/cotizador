"use server"
  
import { revalidatePath } from "next/cache"
import { TerminacionDAO, TerminacionFormValues, createTerminacion, updateTerminacion, getFullTerminacionDAO, deleteTerminacion, getTerminacionsDAO, archiveTerminacion, archiveAndDuplicateTerminacion, getTerminacionsForWorkDAO } from "@/services/terminacion-services"
import { prisma } from "@/lib/db"
import { ItemType } from "@prisma/client"

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

export async function archiveTerminacionAction(id: string, archive: boolean): Promise<TerminacionDAO | null> {    
    const updated = await archiveTerminacion(id, archive)

    revalidatePath("/admin/terminations")

    return updated as TerminacionDAO
}

export async function archiveAndDuplicateTerminacionAction(id: string, newPrice: number): Promise<TerminacionDAO | null> {    
    const created = await archiveAndDuplicateTerminacion(id, newPrice)

    revalidatePath("/admin/terminations")

    return created as TerminacionDAO
}

export async function getTerminacionsDAOAction(): Promise<TerminacionDAO[]> {
    return await getTerminacionsDAO()
}

/**
 * Obtiene todas las terminaciones activas y también las archivadas que estén siendo utilizadas
 * en los items del trabajo especificado
 * @param workId ID del trabajo
 * @returns Lista de terminaciones disponibles para el trabajo
 */
export async function getTerminacionsForWorkDAOAction(workId: string): Promise<TerminacionDAO[]> {
    return await getTerminacionsForWorkDAO(workId);
}