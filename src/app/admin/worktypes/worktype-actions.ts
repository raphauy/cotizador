"use server"
  
import { revalidatePath } from "next/cache"
import { WorkTypeDAO, WorkTypeFormValues, createWorkType, updateWorkType, deleteWorkType, getWorkTypeDAO, getWorkTypesDAO } from "@/services/worktype-services"


export async function getWorkTypeDAOAction(id: string): Promise<WorkTypeDAO | null> {
    return getWorkTypeDAO(id)
}

export async function createOrUpdateWorkTypeAction(id: string | null, data: WorkTypeFormValues): Promise<WorkTypeDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateWorkType(id, data)
    } else {
        updated= await createWorkType(data)
    }     

    revalidatePath("/admin/worktypes")

    return updated as WorkTypeDAO
}

export async function deleteWorkTypeAction(id: string): Promise<WorkTypeDAO | null> {    
    const deleted= await deleteWorkType(id)

    revalidatePath("/admin/worktypes")

    return deleted as WorkTypeDAO
}

export async function getWorkTypesDAOAction(): Promise<WorkTypeDAO[]> {
    return getWorkTypesDAO()
}