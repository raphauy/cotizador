"use server"
  
import { revalidatePath } from "next/cache"
import { ClientDAO, ClientFormValues, createClient, updateClient, getFullClientDAO, deleteClient } from "@/services/client-services"

import { CotizationDAO, getCotizationsCountByClientId } from "@/services/cotization-services"
    

export async function getClientDAOAction(id: string): Promise<ClientDAO | null> {
    return getFullClientDAO(id)
}

export async function createOrUpdateClientAction(id: string | null, data: ClientFormValues): Promise<ClientDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateClient(id, data)
    } else {
        updated= await createClient(data)
    }     

    revalidatePath("/seller/clients")
    revalidatePath("/seller/cotizations")

    return updated as ClientDAO
}

export async function deleteClientAction(id: string): Promise<ClientDAO | null> {    
    const cotizationsCount= await getCotizationsCountByClientId(id)
    if (cotizationsCount > 0) {
        throw new Error(`No se puede eliminar un cliente que tiene ${cotizationsCount} cotizaciones asociadas. Por favor, elimine las cotizaciones asociadas antes de eliminar el cliente.`)
    }
    const deleted= await deleteClient(id)

    revalidatePath("/seller/clients")

    return deleted as ClientDAO
}
    


