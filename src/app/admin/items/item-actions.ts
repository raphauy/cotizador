"use server"
  
import { revalidatePath } from "next/cache"
import { ItemDAO, ItemFormValues, createItem, updateItem, getFullItemDAO, deleteItem } from "@/services/item-services"
import { getWorkDAO } from "@/services/work-services"


export async function getItemDAOAction(id: string): Promise<ItemDAO | null> {
    return getFullItemDAO(id)
}

export async function createOrUpdateItemAction(id: string | null, data: ItemFormValues): Promise<ItemDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateItem(id, data)
    } else {
        updated= await createItem(data)
    }     

    revalidatePath("/seller/cotizations/[cotizationId]", "page")

    return updated as ItemDAO
}

export async function deleteItemAction(id: string): Promise<ItemDAO | null> {    
    const deleted= await deleteItem(id)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")

    return deleted as ItemDAO
}

