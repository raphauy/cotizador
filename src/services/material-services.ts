import * as z from "zod"
import { prisma } from "@/lib/db"

export type MaterialDAO = {
	id: string
	name: string
}

export const materialSchema = z.object({
	name: z.string().min(1, "name is required."),
})

export type MaterialFormValues = z.infer<typeof materialSchema>


export async function getMaterialsDAO() {
  const found = await prisma.material.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as MaterialDAO[]
}

export async function getMaterialDAO(id: string) {
  const found = await prisma.material.findUnique({
    where: {
      id
    },
  })
  return found as MaterialDAO
}
    
export async function createMaterial(data: MaterialFormValues) {
  // TODO: implement createMaterial
  const created = await prisma.material.create({
    data
  })
  return created
}

export async function updateMaterial(id: string, data: MaterialFormValues) {
  const updated = await prisma.material.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteMaterial(id: string) {
  const deleted = await prisma.material.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullMaterialsDAO() {
  const found = await prisma.material.findMany({
    orderBy: {
      name: 'asc'
    },
    include: {
		}
  })
  return found as MaterialDAO[]
}
  
export async function getFullMaterialDAO(id: string) {
  const found = await prisma.material.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as MaterialDAO
}
    