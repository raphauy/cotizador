"use server"
  
import { revalidatePath } from "next/cache"
import { ColocacionDAO, ColocacionFormValues, createColocacion, updateColocacion, getFullColocacionDAO, deleteColocacion, getFullColocacionsDAO } from "@/services/colocacion-services"


export async function getColocacionDAOAction(id: string): Promise<ColocacionDAO | null> {
    return getFullColocacionDAO(id)
}

export async function getColocacionsDAOAction(): Promise<ColocacionDAO[]> {
    return getFullColocacionsDAO()
}

export async function createOrUpdateColocacionAction(id: string | null, data: ColocacionFormValues): Promise<ColocacionDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateColocacion(id, data)
    } else {
        updated= await createColocacion(data)
    }     

    revalidatePath("/admin/colocacions")

    return updated as ColocacionDAO
}

export async function deleteColocacionAction(id: string): Promise<ColocacionDAO | null> {    
    const deleted= await deleteColocacion(id)

    revalidatePath("/admin/colocacions")

    return deleted as ColocacionDAO
}

