"use server"
  
import { AjusteItem, AreaItem, ManoDeObraItem, TerminationItem } from "@/app/seller/cotizations/[cotizationId]/addAreas/page"
import { AjusteFormValues, ItemFormValues, ManoDeObraItemFormValues, TerminationFormValues, createAjusteItem, upsertBatchAreaItem, createItem, createManoDeObraItem, createTerminationItem, deleteItem, getFullItemDAO, updateAjusteItem, updateItem, updateManoDeObraItem, updateTerminationItem, upsertBatchTerminationItem, upsertBatchManoDeObraItem, updateColocacion, upsertBatchAjusteItem } from "@/services/item-services"
import { FullWorkDAO, getFullWorkDAO } from "@/services/work-services"
import { revalidatePath } from "next/cache"


export async function getItemDAOAction(id: string){
    return getFullItemDAO(id)
}

export async function createOrUpdateItemAction(id: string | null, data: ItemFormValues){       
    let updated= null
    if (id) {
        const work= await getFullWorkDAO(data.workId)
        if (!work) throw new Error("Work not found")
        updated= await updateItem(id, data, work as FullWorkDAO)
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

export async function upsertBatchAreaItemAction(workId: string, areaItems: AreaItem[]): Promise<boolean> {
    const updated= await upsertBatchAreaItem(workId, areaItems)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return updated
}

export async function upsertBatchTerminationItemAction(workId: string, items: TerminationItem[]): Promise<boolean> {
    const updated= await upsertBatchTerminationItem(workId, items)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return updated
}

export async function upsertBatchManoDeObraItemAction(workId: string, items: ManoDeObraItem[]): Promise<boolean> {
    const updated= await upsertBatchManoDeObraItem(workId, items)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return updated
}

export async function upsertBatchAjusteItemAction(workId: string, items: AjusteItem[]): Promise<boolean> {
    const updated= await upsertBatchAjusteItem(workId, items)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return updated
}

export async function createTerminationItemAction(data: TerminationFormValues){
    const items= await createTerminationItem(data)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return items
}

export async function updateTerminationItemAction(id: string, data: TerminationFormValues){
    const work= await getFullWorkDAO(data.workId)
    if (!work) throw new Error("Work not found")
    const items= await updateTerminationItem(id, data, work as FullWorkDAO)

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

export async function createAjusteItemAction(data: AjusteFormValues){
    const items= await createAjusteItem(data)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")
    
    return items
}

export async function updateAjusteItemAction(id: string, data: AjusteFormValues){
    const items= await updateAjusteItem(id, data)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")

    return items
}

export async function deleteColocacionAction(id: string){
    const deleted= await deleteItem(id)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")

    return deleted
}

export async function updateColocacionAction(workId: string){
    const colocacion= await updateColocacion(workId)

    revalidatePath("/seller/cotizations/[cotizationId]", "page")

    return colocacion
}