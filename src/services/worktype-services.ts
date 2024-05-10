import * as z from "zod"
import { prisma } from "@/lib/db"

export type WorkTypeDAO = {
	id: string
	name: string

	createdAt: Date
	updatedAt: Date
}

export const workTypeSchema = z.object({
	name: z.string().min(1, "name is required."),
})

export type WorkTypeFormValues = z.infer<typeof workTypeSchema>


export async function getWorkTypesDAO() {
  const found = await prisma.workType.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as WorkTypeDAO[]
}

export async function getWorkTypeDAO(id: string) {
  const found = await prisma.workType.findUnique({
    where: {
      id
    },
  })
  return found as WorkTypeDAO
}
    
export async function createWorkType(data: WorkTypeFormValues) {
  const created = await prisma.workType.create({
    data
  })
  return created
}

export async function updateWorkType(id: string, data: WorkTypeFormValues) {
  const updated = await prisma.workType.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteWorkType(id: string) {
  const works= await prisma.work.findMany({
    where: {
      workTypeId: id
    },
  })
  console.log("works count", works.length)
  
  if (works.length > 0) {
    throw new Error("No se puede eliminar este tipo de trabajo ya que tiene trabajos asociados.")
  }
  const deleted = await prisma.workType.delete({
    where: {
      id
    },
  })
  return deleted
}

