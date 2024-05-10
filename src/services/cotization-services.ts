import * as z from "zod"
import { prisma } from "@/lib/db"
import { CotizationStatus, CotizationType } from "@prisma/client"
import { ClientDAO } from "./client-services"
import { UserDAO } from "./user-services"
import { WorkDAO } from "./work-services"

export type CotizationDAO = {
	id: string
	number: number
	status: CotizationStatus
	type: CotizationType
  date: Date
	obra: string | null
	createdAt: Date
	updatedAt: Date
	clientId: string
  clientName: string
  client: ClientDAO
	creatorId: string
  creatorName: string
  sellerId: string
  sellerName: string
  works: WorkDAO[]
}

export const cotizationSchema = z.object({
	type: z.nativeEnum(CotizationType),
  date: z.date(),
	obra: z.string().optional(),
	clientId: z.string().min(1, "clientId is required."),
	creatorId: z.string().min(1, "creatorId is required."),
  sellerId: z.string().min(1, "sellerId is required."),
})

export type CotizationFormValues = z.infer<typeof cotizationSchema>


export async function getCotizationsDAO() {
  const found = await prisma.cotization.findMany({
    orderBy: {
      number: 'desc'
    },
  })
  return found as CotizationDAO[]
}


export async function getCotizationDAO(id: string) {
  const found = await prisma.cotization.findUnique({
    where: {
      id
    },
    include: {
      client: true,
      creator: true,
      seller: true,
      works: true,
    }
  })
  if (!found) return null

  const res: CotizationDAO = {
    ...found,
    client: found.client as ClientDAO,
    clientName: found.client?.name,
    creatorName: found.creator?.name,
    sellerName: found.seller.name,
    works: found.works as WorkDAO[]
  }

  return res 
}
    
export async function createCotization(data: CotizationFormValues) {
  console.log(data)
  
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
      number: 'desc'
    },
    include: {
      client: true,
      creator: true,
      seller: true,
      works: true,
		}
  })
  const res: CotizationDAO[]= []
  found.forEach(cotization => {
    res.push({
      ...cotization,
      client: cotization.client as ClientDAO,
      clientName: cotization.client?.name,
      creatorName: cotization.creator?.name,
      sellerName: cotization.seller.name,
      works: cotization.works as WorkDAO[]
    })
  })
  return res
}
  
export async function getFullCotizationDAO(id: string): Promise<CotizationDAO | null> {
  const found = await prisma.cotization.findUnique({
    where: {
      id
    },
    include: {
      client: true,
      creator: true,
      seller: true,
      works: {
        include: {
          workType: true,
          material: true,
          color: true,
          items: {
            orderBy: {
              createdAt: 'asc'
            },
            include: {
              terminacion: true,
              manoDeObra: true,
              work: {
                select: {
                  cotizationId: true
                }
              }
            },
          },
          notes: true
        },
        orderBy: {
          createdAt: 'desc'
        }    
      }
		},
  })
  if (!found) return null

  const res: CotizationDAO = {
    ...found,
    client: found.client as ClientDAO,
    clientName: found.client?.name,
    creatorName: found.creator?.name,
    sellerName: found.seller.name,
    // @ts-ignore
    works: found.works as WorkDAO[]
  }
  return res
}

export async function getCotizationsCountByClientId(clientId: string) {
  const found = await prisma.cotization.count({
    where: {
      clientId
    },
  })
  return found
}

export async function setStatus(id: string, status: CotizationStatus) {
  const updated = await prisma.cotization.update({
    where: {
      id
    },
    data: {
      status
    },
  })
  return updated
}

export async function getFullCotizationsDAOByUser(userId: string) {
  const found = await prisma.cotization.findMany({
    where: {
      OR: [
        { sellerId: userId },
        { creatorId: userId },
      ]
    },
    orderBy: {
      number: 'desc'
    },
    include: {
      client: true,
      creator: true,
      seller: true,
      works: true,
    }
  })

  const res: CotizationDAO[]= []
  found.forEach(cotization => {
    res.push({
      ...cotization,
      client: cotization.client as ClientDAO,
      clientName: cotization.client?.name,
      creatorName: cotization.creator?.name,
      sellerName: cotization.seller.name,
      works: cotization.works as WorkDAO[]
    })
  })
	
 	return res
}
