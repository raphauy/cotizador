import * as z from "zod"
import { prisma } from "@/lib/db"
import { ManoDeObraDAO, getManoDeObrasDAO } from "./manodeobra-services"

export type AppConfigDAO = {
	id: string
  name: string
	createdAt: Date
	updatedAt: Date
	defaultManoDeObras: ManoDeObraDAO[]
}

export const appConfigSchema = z.object({
  name: z.string().optional(),	
})

export type AppConfigFormValues = z.infer<typeof appConfigSchema>


export async function getAppConfigsDAO() {
  const found = await prisma.appConfig.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as AppConfigDAO[]
}

export async function getAppConfigDAO(id: string) {
  const found = await prisma.appConfig.findUnique({
    where: {
      id
    },
  })
  return found as AppConfigDAO
}
    
export async function createAppConfig(data: AppConfigFormValues) {
  // TODO: implement createAppConfig
  const created = await prisma.appConfig.create({
    data
  })
  return created
}

export async function updateAppConfig(id: string, data: AppConfigFormValues) {
  const updated = await prisma.appConfig.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteAppConfig(id: string) {
  const deleted = await prisma.appConfig.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryDefaultManoDeObras(id: string) {
  const found = await prisma.appConfig.findUnique({
    where: {
      id
    },
    include: {
      defaultManoDeObras: true,
    }
  })
  const all= await getManoDeObrasDAO()
  const res= all.filter(aux => {
    return !found?.defaultManoDeObras.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setDefaultManoDeObras(id: string, defaultManoDeObras: ManoDeObraDAO[]) {
  const oldDefaultManoDeObras= await prisma.appConfig.findUnique({
    where: {
      id
    },
    include: {
      defaultManoDeObras: true,
    }
  })
  .then(res => res?.defaultManoDeObras)

  await prisma.appConfig.update({
    where: {
      id
    },
    data: {
      defaultManoDeObras: {
        disconnect: oldDefaultManoDeObras
      }
    }
  })

  const updated= await prisma.appConfig.update({
    where: {
      id
    },
    data: {
      defaultManoDeObras: {
        connect: defaultManoDeObras.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  return true
}



export async function getFullAppConfigsDAO() {
  const found = await prisma.appConfig.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			defaultManoDeObras: true,
		}
  })
  return found as AppConfigDAO[]
}
  
export async function getFullAppConfigDAO(id: string) {
  const found = await prisma.appConfig.findUnique({
    where: {
      id
    },
    include: {
			defaultManoDeObras: true,
		}
  })
  return found as AppConfigDAO
}
    
export async function getAppConfigDAOByName(name: string): Promise<AppConfigDAO | null> {
    const found = await prisma.appConfig.findFirst({
      where: {
        name
      },
      include: {
        defaultManoDeObras: true,
      }
    })
    return found as AppConfigDAO
}