import { prisma } from "@/lib/db"
import * as z from "zod"

export type ColocacionDAO = {
	id: string
	name: string
	price: number
	createdAt: Date
	updatedAt: Date
}

export const colocacionSchema = z.object({
	name: z.string().min(1, "name is required."),
	price: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
})

export type ColocacionFormValues = z.infer<typeof colocacionSchema>


export async function getColocacionsDAO() {
  const found = await prisma.colocacion.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ColocacionDAO[]
}

export async function getColocacionDAO(id: string) {
  const found = await prisma.colocacion.findUnique({
    where: {
      id
    },
  })
  return found as ColocacionDAO
}
    
export async function createColocacion(data: ColocacionFormValues) {
  const price = data.price ? Number(data.price) : 0

  const created = await prisma.colocacion.create({
    data: {
      ...data,
      price,
    }
  })
  return created
}

export async function updateColocacion(id: string, data: ColocacionFormValues) {
  const price = data.price ? Number(data.price) : 0
  const updated = await prisma.colocacion.update({
    where: {
      id
    },
    data: {
      ...data,
      price,
    }
  })
  return updated
}

export async function deleteColocacion(id: string) {
  const deleted = await prisma.colocacion.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullColocacionsDAO() {
  const found = await prisma.colocacion.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as ColocacionDAO[]
}
  
export async function getFullColocacionDAO(id: string) {
  const found = await prisma.colocacion.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as ColocacionDAO
}
    