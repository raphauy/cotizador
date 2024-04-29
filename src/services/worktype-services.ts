import * as z from "zod"
import { prisma } from "@/lib/db"

export type WorkTypeDAO = {
	id: string
	name: string

  clienteFinalPrice: number
  arquitectoStudioPrice: number
  distribuidorPrice: number

	createdAt: Date
	updatedAt: Date
}

export const workTypeSchema = z.object({
	name: z.string().min(1, "name is required."),
  clienteFinalPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	arquitectoStudioPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	distribuidorPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
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
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const created = await prisma.workType.create({
    data: {
      ...data,
      clienteFinalPrice,
      arquitectoStudioPrice,
      distribuidorPrice,
    }
  })
  return created
}

export async function updateWorkType(id: string, data: WorkTypeFormValues) {
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const updated = await prisma.workType.update({
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

export async function deleteWorkType(id: string) {
  const deleted = await prisma.workType.delete({
    where: {
      id
    },
  })
  return deleted
}

