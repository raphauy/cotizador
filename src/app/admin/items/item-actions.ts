"use server"
  
import { revalidatePath } from "next/cache"
import { ItemDAO, ItemFormValues, createItem, updateItem, getFullItemDAO, deleteItem, createBulkItem } from "@/services/item-services"
import { getWorkDAO } from "@/services/work-services"
import { AreaItem } from "@/app/seller/cotizations/[cotizationId]/addItems/page"
import { ItemType } from "@prisma/client"


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

export async function createBulkItemAction(workId: string, type: ItemType, areaItems: AreaItem[]): Promise<boolean> {
    const items= await createBulkItem(workId, type, areaItems)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return items
}
