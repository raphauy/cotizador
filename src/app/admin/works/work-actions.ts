"use server"
  
import { ColorDAO } from "@/services/color-services"
import { OptionalColorsTotalResult, calculateTotalWorkValue, getComplementaryOptionalColorsDAO, getOptionalColorsDAO, setOptionalColors } from "@/services/optional-colors-services"
import { WorkDAO, WorkFormValues, createWork, deleteWork, getFullWorkDAO, updateWork } from "@/services/work-services"
import { revalidatePath } from "next/cache"


export async function getWorkDAOAction(id: string){
    return getFullWorkDAO(id)
}

export async function createOrUpdateWorkAction(id: string | null, data: WorkFormValues): Promise<WorkDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateWork(id, data)
    } else {
        updated= await createWork(data)
    }     

    revalidatePath("/admin/works")

    return updated as WorkDAO
}

export async function deleteWorkAction(id: string): Promise<WorkDAO | null> {    
    const deleted= await deleteWork(id)

    revalidatePath("/admin/works")

    return deleted as WorkDAO
}

export async function getOptionalColorsDAOAction(workId: string): Promise<ColorDAO[]> {
    return getOptionalColorsDAO(workId)
}

export async function getComplementaryOptionalColorsDAOAction(workId: string): Promise<ColorDAO[]> {
    return getComplementaryOptionalColorsDAO(workId)
}

export async function setOptionalColorsAction(workId: string, colors: ColorDAO[]) {
    const res= await setOptionalColors(workId, colors)

    revalidatePath("/seller/cotizations")

    return res
}

export async function calculateTotalWorkValueAction(workId: string, colors: ColorDAO[]): Promise<OptionalColorsTotalResult[]> {
    return calculateTotalWorkValue(workId, colors)
}