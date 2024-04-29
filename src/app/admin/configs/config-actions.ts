"use server"

import { revalidatePath } from "next/cache"
import { ConfigDAO, ConfigFormValues, createConfig, updateConfig, getConfigDAO, deleteConfig, getValue } from "@/services/config-services"
import { getCurrentUser } from "@/lib/utils"
import { getAppConfigDAOByName } from "@/services/appconfig-services"

export type InputDataConfig = {
  manosDeObraIds: string[]
  tramosPorDefecto: number
  zocalosPorDefecto: number
  alzadosPorDefecto: number
}


export async function getConfigDAOAction(id: string): Promise<ConfigDAO | null> {
  return getConfigDAO(id)
}

export async function createOrUpdateConfigAction(id: string | null, data: ConfigFormValues): Promise<ConfigDAO | null> {       
  let updated= null
  if (id) {
      updated= await updateConfig(id, data)
  } else {
      updated= await createConfig(data)
  }     

  revalidatePath("/admin/configs")

  return updated as ConfigDAO
}

export async function deleteConfigAction(id: string): Promise<ConfigDAO | null> {    
  const user= await getCurrentUser()
  const isRapha= user?.email === "rapha.uy@rapha.uy"
  if (!isRapha) {
    throw new Error("You are not authorized to delete configs.")
  }

  const deleted= await deleteConfig(id)

  revalidatePath("/admin/configs")

  return deleted as ConfigDAO
}

export async function getInputDataConfigAction(): Promise<InputDataConfig> {
  console.log("getInputDataConfigAction")
  
  const appConfig= await getAppConfigDAOByName("Manos de obra por defecto")
  if (!appConfig) {
    throw new Error("No se encontró la appConfig con el nombre Manos de obra por defecto")
  }

  const manosDeObraIds= appConfig.defaultManoDeObras.map(c => c.id)
  const tramosPorDefecto= await getValue("Cantidad de tramos por defecto")
  const zocalosPorDefecto= await getValue("Cantidad de zócalos por defecto")
  const alzadosPorDefecto= await getValue("Cantidad de alzados por defecto")

  return {
    manosDeObraIds,
    tramosPorDefecto: tramosPorDefecto ? Number(tramosPorDefecto) : 0,
    zocalosPorDefecto: zocalosPorDefecto ? Number(zocalosPorDefecto) : 0,
    alzadosPorDefecto: alzadosPorDefecto ? Number(alzadosPorDefecto) : 0,
  }
}