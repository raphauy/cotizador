"use server"
  
import { AreaItem } from "@/app/seller/cotizations/[cotizationId]/addItems/page"
import { ItemDAO, ItemFormValues, ManoDeObraItemFormValues, TerminationFormValues, createBulkAreaItem, createItem, createManoDeObraItem, createTerminationItem, deleteItem, getFullItemDAO, updateItem, updateManoDeObraItem, updateTerminationItem } from "@/services/item-services"
import { ItemType } from "@prisma/client"
import { revalidatePath } from "next/cache"


export async function getItemDAOAction(id: string){
    return getFullItemDAO(id)
}

export async function createOrUpdateItemAction(id: string | null, data: ItemFormValues){       
    let updated= null
    if (id) {
        updated= await updateItem(id, data)
    } else {
        updated= await createItem(data)
    }     

    revalidatePath("/seller/cotizations/[cotizationId]", "page")

    return updated
}


export async function deleteItemAction(id: string){    
    const deleted= await deleteItem(id)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")

    return deleted
}

export async function createBulkAreaItemAction(workId: string, type: ItemType, areaItems: AreaItem[]): Promise<boolean> {
    const items= await createBulkAreaItem(workId, type, areaItems)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return items
}

export async function createTerminationItemAction(data: TerminationFormValues){
    const items= await createTerminationItem(data)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return items
}

export async function updateTerminationItemAction(id: string, data: TerminationFormValues){
    const items= await updateTerminationItem(id, data)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")

    return items
}

export async function createManoDeObraItemAction(data: ManoDeObraItemFormValues) {
    const items= await createManoDeObraItem(data)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return items
}

export async function updateManoDeObraItemAction(id: string, data: ManoDeObraItemFormValues){
    const items= await updateManoDeObraItem(id, data)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")

    return items
}