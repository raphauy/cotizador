"use server"
  
import { ColorDAO, ColorFormValues, archiveAndDuplicateColor, createColor, deleteColor, getColorsForWorkDAO, getFullColorDAO, getFullColorsDAOByMaterialId, markColorAsDiscontinued, updateColor } from "@/services/color-services"
import { MaterialDAO, getFullMaterialsDAO } from "@/services/material-services"
import { revalidatePath } from "next/cache"


export async function getColorDAOAction(id: string): Promise<ColorDAO | null> {
    return getFullColorDAO(id)
}

export async function createOrUpdateColorAction(id: string | null, data: ColorFormValues): Promise<ColorDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateColor(id, data)
    } else {
        updated= await createColor(data)
    }     

    revalidatePath("/admin/colors")
    revalidatePath("/admin/materials")

    return updated as ColorDAO
}

export async function deleteColorAction(id: string): Promise<ColorDAO | null> {    
    const deleted= await deleteColor(id)

    revalidatePath("/admin/colors")
    revalidatePath("/admin/materials")

    return deleted as ColorDAO
}

export async function archiveAndDuplicateColorAction(id: string, newPrices: {
    clienteFinalPrice: number,
    arquitectoStudioPrice: number,
    distribuidorPrice: number
}): Promise<ColorDAO | null> {
    const newColor = await archiveAndDuplicateColor(id, newPrices)
    
    revalidatePath("/admin/colors")
    revalidatePath("/admin/materials")

    return newColor as ColorDAO
}

export async function markColorAsDiscontinuedAction(id: string, discontinued: boolean): Promise<ColorDAO | null> {
    const updated = await markColorAsDiscontinued(id, discontinued)
    
    revalidatePath("/admin/colors")
    revalidatePath("/admin/materials")
    
    return updated as ColorDAO
}

export async function getMaterialsDAOAction(): Promise<MaterialDAO[]> {
    return await getFullMaterialsDAO()
}

export async function getColorsDAOByMaterialIdAction(materialId: string): Promise<ColorDAO[]> {
    return await getFullColorsDAOByMaterialId(materialId)
}

export async function getColorsForWorkAction(materialId: string, workId?: string): Promise<ColorDAO[]> {
    return await getColorsForWorkDAO(materialId, workId)
}