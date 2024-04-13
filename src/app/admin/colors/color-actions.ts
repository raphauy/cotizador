"use server"
  
import { ColorDAO, ColorFormValues, createColor, deleteColor, getFullColorDAO, getFullColorsDAOByMaterialId, updateColor } from "@/services/color-services"
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

    return updated as ColorDAO
}

export async function deleteColorAction(id: string): Promise<ColorDAO | null> {    
    const deleted= await deleteColor(id)

    revalidatePath("/admin/colors")

    return deleted as ColorDAO
}

export async function getMaterialsDAOAction(): Promise<MaterialDAO[]> {
    return await getFullMaterialsDAO()
}

export async function getColorsDAOByMaterialIdAction(materialId: string): Promise<ColorDAO[]> {
    return await getFullColorsDAOByMaterialId(materialId)
}