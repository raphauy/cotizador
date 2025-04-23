"use server"
  
import { revalidatePath } from "next/cache"
import { ManoDeObraDAO, ManoDeObraFormValues, createManoDeObra, updateManoDeObra, getFullManoDeObraDAO, deleteManoDeObra, getManoDeObrasDAO, archiveManoDeObra, archiveAndDuplicateManoDeObra, getManoDeObrasForWorkDAO } from "@/services/manodeobra-services"


export async function getManoDeObraDAOAction(id: string): Promise<ManoDeObraDAO | null> {
    return getFullManoDeObraDAO(id)
}

export async function createOrUpdateManoDeObraAction(id: string | null, data: ManoDeObraFormValues): Promise<ManoDeObraDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateManoDeObra(id, data)
    } else {
        updated= await createManoDeObra(data)
    }     

    revalidatePath("/admin/manodeobras")

    return updated as ManoDeObraDAO
}

export async function deleteManoDeObraAction(id: string): Promise<ManoDeObraDAO | null> {    
    const deleted= await deleteManoDeObra(id)

    revalidatePath("/admin/manodeobras")

    return deleted as ManoDeObraDAO
}

export async function getManoDeObrasDAOAction(includeArchived: boolean = false): Promise<ManoDeObraDAO[]> {
    return await getManoDeObrasDAO(includeArchived)
}

export async function archiveManoDeObraAction(id: string, archive: boolean): Promise<ManoDeObraDAO | null> {    
    const updated = await archiveManoDeObra(id, archive)

    revalidatePath("/admin/manodeobras")

    return updated as ManoDeObraDAO
}

export async function archiveAndDuplicateManoDeObraAction(
    id: string, 
    newPrices: { 
        clienteFinalPrice: number, 
        arquitectoStudioPrice: number, 
        distribuidorPrice: number 
    }
): Promise<ManoDeObraDAO | null> {    
    const created = await archiveAndDuplicateManoDeObra(id, newPrices)

    revalidatePath("/admin/manodeobras")

    return created as ManoDeObraDAO
}

export async function getManoDeObrasForWorkDAOAction(workId: string): Promise<ManoDeObraDAO[]> {
    return await getManoDeObrasForWorkDAO(workId)
}

