"use server"
  
import { revalidatePath } from "next/cache"
import { WorkDAO, WorkFormValues, createWork, updateWork, getFullWorkDAO, deleteWork } from "@/services/work-services"


export async function getWorkDAOAction(id: string): Promise<WorkDAO | null> {
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

