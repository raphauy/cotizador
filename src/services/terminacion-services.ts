import * as z from "zod"
import { prisma } from "@/lib/db"

export type TerminacionDAO = {
	id: string
	name: string
	image: string | undefined | null
  clienteFinalPrice: number
  arquitectoStudioPrice: number
  distribuidorPrice: number
}

export const terminacionSchema = z.object({
	name: z.string().min(1, "name is required."),
  clienteFinalPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  arquitectoStudioPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  distribuidorPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
})

export type TerminacionFormValues = z.infer<typeof terminacionSchema>


export async function getTerminacionsDAO() {
  const found = await prisma.terminacion.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as TerminacionDAO[]
}

export async function getTerminacionDAO(id: string) {
  const found = await prisma.terminacion.findUnique({
    where: {
      id
    },
  })
  return found as TerminacionDAO
}
    
export async function createTerminacion(data: TerminacionFormValues) {
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const created = await prisma.terminacion.create({
    data: {
      ...data,
      clienteFinalPrice,
      arquitectoStudioPrice,
      distribuidorPrice,
    }
  })
  return created
}

export async function updateTerminacion(id: string, data: TerminacionFormValues) {
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const updated = await prisma.terminacion.update({
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

export async function deleteTerminacion(id: string) {
  const deleted = await prisma.terminacion.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullTerminacionsDAO() {
  const found = await prisma.terminacion.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as TerminacionDAO[]
}
  
export async function getFullTerminacionDAO(id: string) {
  const found = await prisma.terminacion.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as TerminacionDAO
}
    
