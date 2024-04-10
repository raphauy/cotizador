import * as z from "zod"
import { prisma } from "@/lib/db"
import { CotizationStatus, CotizationType } from "@prisma/client"

export type CotizationDAO = {
	id: string
	number: number
	status: CotizationStatus
	type: CotizationType
	obra: string | undefined
	createdAt: Date
	updatedAt: Date
	clientId: string
	creatorId: string
  sellerId: string
}

export const cotizationSchema = z.object({
	type: z.nativeEnum(CotizationType),	
	obra: z.string().optional(),
	clientId: z.string().min(1, "clientId is required."),
	creatorId: z.string().min(1, "creatorId is required."),
  sellerId: z.string().min(1, "sellerId is required."),
})

export type CotizationFormValues = z.infer<typeof cotizationSchema>


export async function getCotizationsDAO() {
  const found = await prisma.cotization.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as CotizationDAO[]
}

export async function getCotizationDAO(id: string) {
  const found = await prisma.cotization.findUnique({
    where: {
      id
    },
  })
  return found as CotizationDAO
}
    
export async function createCotization(data: CotizationFormValues) {
  // TODO: implement createCotization
  const created = await prisma.cotization.create({
    data
  })
  return created
}

export async function updateCotization(id: string, data: CotizationFormValues) {
  const updated = await prisma.cotization.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteCotization(id: string) {
  const deleted = await prisma.cotization.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullCotizationsDAO() {
  const found = await prisma.cotization.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as CotizationDAO[]
}
  
export async function getFullCotizationDAO(id: string) {
  const found = await prisma.cotization.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as CotizationDAO
}

export async function getCotizationsCountByClientId(clientId: string) {
  const found = await prisma.cotization.count({
    where: {
      clientId
    },
  })
  return found
}