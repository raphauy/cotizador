"use server"
  
import { revalidatePath } from "next/cache"
import { ManoDeObraDAO, ManoDeObraFormValues, createManoDeObra, updateManoDeObra, getFullManoDeObraDAO, deleteManoDeObra, getManoDeObrasDAO } from "@/services/manodeobra-services"


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

export async function getManoDeObrasDAOAction(): Promise<ManoDeObraDAO[]> {
    return await getManoDeObrasDAO()
}

