"use server"
  
import { revalidatePath } from "next/cache"
import { AppConfigDAO, AppConfigFormValues, createAppConfig, updateAppConfig, getFullAppConfigDAO, deleteAppConfig } from "@/services/appconfig-services"

import { getComplentaryDefaultManoDeObras, setDefaultManoDeObras} from "@/services/appconfig-services"
import { ManoDeObraDAO } from "@/services/manodeobra-services"
    

export async function getAppConfigDAOAction(id: string): Promise<AppConfigDAO | null> {
    return getFullAppConfigDAO(id)
}


export async function createOrUpdateAppConfigAction(id: string | null, data: AppConfigFormValues): Promise<AppConfigDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateAppConfig(id, data)
    } else {
        updated= await createAppConfig(data)
    }     

    revalidatePath("/admin/appconfigs")

    return updated as AppConfigDAO
}

export async function deleteAppConfigAction(id: string): Promise<AppConfigDAO | null> {    
    const deleted= await deleteAppConfig(id)

    revalidatePath("/admin/appconfigs")

    return deleted as AppConfigDAO
}
    
export async function getComplentaryDefaultManoDeObrasAction(id: string): Promise<ManoDeObraDAO[]> {
    const complementary= await getComplentaryDefaultManoDeObras(id)

    return complementary as ManoDeObraDAO[]
}

export async function setDefaultManoDeObrasAction(id: string, defaultManoDeObras: ManoDeObraDAO[]): Promise<boolean> {
    const res= setDefaultManoDeObras(id, defaultManoDeObras)

    revalidatePath("/admin/appconfigs")

    return res
}


