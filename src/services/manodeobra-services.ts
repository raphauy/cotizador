import * as z from "zod"
import { prisma } from "@/lib/db"

export type ManoDeObraDAO = {
	id: string
	name: string
	clienteFinalPrice: number
	arquitectoStudioPrice: number
	distribuidorPrice: number
  isLinear: boolean
  isSurface: boolean
}

export const manoDeObraSchema = z.object({
	name: z.string().min(1, "name is required."),
  clienteFinalPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  arquitectoStudioPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  distribuidorPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  isLinear: z.boolean().optional(),
  isSurface: z.boolean().optional(),
})

export type ManoDeObraFormValues = z.infer<typeof manoDeObraSchema>


export async function getManoDeObrasDAO() {
  const found = await prisma.manoDeObra.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ManoDeObraDAO[]
}

export async function getManoDeObraDAO(id: string) {
  const found = await prisma.manoDeObra.findUnique({
    where: {
      id
    },
  })
  return found as ManoDeObraDAO
}
    
export async function createManoDeObra(data: ManoDeObraFormValues) {
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const created = await prisma.manoDeObra.create({
    data: {
      ...data,
      clienteFinalPrice,
      arquitectoStudioPrice,
      distribuidorPrice,
    }
  })
  return created
}

export async function updateManoDeObra(id: string, data: ManoDeObraFormValues) {
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const updated = await prisma.manoDeObra.update({
    where: {
      id
    },
    data: {
      ...data,
      clienteFinalPrice,
      arquitectoStudioPrice,
      distribuidorPrice,
    }
  })
  return updated
}

export async function deleteManoDeObra(id: string) {
  const deleted = await prisma.manoDeObra.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullManoDeObrasDAO() {
  const found = await prisma.manoDeObra.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as ManoDeObraDAO[]
}
  
export async function getFullManoDeObraDAO(id: string) {
  const found = await prisma.manoDeObra.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as ManoDeObraDAO
}
    