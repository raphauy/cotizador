"use server"
  
import { revalidatePath } from "next/cache"
import { CotizationDAO, CotizationFormValues, createCotization, updateCotization, getFullCotizationDAO, deleteCotization, setStatus, getVersions, getNextLabel, createVersion, createDuplicated, setComments, createWorkDuplicated } from "@/services/cotization-services"
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
    const ok= await setStatus(id, status)

    revalidatePath("/seller/cotizations")

    return ok
}

export async function getVersionsCountAction(cotizationId: string) {
    const found= await getVersions(cotizationId)
    return found.length
}

export async function getVersionsAction(cotizationId: string) {
    const found= await getVersions(cotizationId)
    return found
}

export async function getNextLabelAction(cotizationId: string) {
    const found= await getNextLabel(cotizationId)
    return found
}

export async function createVersionAction(cotizationId: string) {
    const version= await createVersion(cotizationId)
    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    return version
}

export async function createDuplicatedAction(cotizationId: string, clientId: string) {
    const version= await createDuplicated(cotizationId, clientId)
    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    return version
}

export async function setCommentsAction(cotizationId: string, comments: string) {
    const res= await setComments(cotizationId, comments)
    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    return res
}

export async function createWorkDuplicatedAction(workId: string) {
    const work= await createWorkDuplicated(workId)
    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    return work
}