"use server"
  
import { revalidatePath } from "next/cache"
import { CotizationDAO, CotizationFormValues, createCotization, updateCotization, getFullCotizationDAO, deleteCotization, setStatus } from "@/services/cotization-services"
import { CotizationStatus } from "@prisma/client"


export async function getCotizationDAOAction(id: string): Promise<CotizationDAO | null> {
    return getFullCotizationDAO(id)
}

export async function createOrUpdateCotizationAction(id: string | null, data: CotizationFormValues): Promise<CotizationDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateCotization(id, data)
    } else {
        updated= await createCotization(data)
    }     

    revalidatePath("/seller/cotizations")

    return updated as CotizationDAO
}

export async function deleteCotizationAction(id: string): Promise<CotizationDAO | null> {    
    const deleted= await deleteCotization(id)

    revalidatePath("/seller/cotizations")

    return deleted as CotizationDAO
}

export async function setStatusAction(id: string, status: CotizationStatus) {
    const updated= await setStatus(id, status)

    revalidatePath("/seller/cotizations")

    return updated as CotizationDAO
}