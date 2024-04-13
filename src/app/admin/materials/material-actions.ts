"use server"
  
import { revalidatePath } from "next/cache"
import { MaterialDAO, MaterialFormValues, createMaterial, updateMaterial, getFullMaterialDAO, deleteMaterial } from "@/services/material-services"


export async function getMaterialDAOAction(id: string): Promise<MaterialDAO | null> {
    return getFullMaterialDAO(id)
}

export async function createOrUpdateMaterialAction(id: string | null, data: MaterialFormValues): Promise<MaterialDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateMaterial(id, data)
    } else {
        updated= await createMaterial(data)
    }     

    revalidatePath("/admin/materials")

    return updated as MaterialDAO
}

export async function deleteMaterialAction(id: string): Promise<MaterialDAO | null> {    
    const deleted= await deleteMaterial(id)

    revalidatePath("/admin/materials")

    return deleted as MaterialDAO
}

