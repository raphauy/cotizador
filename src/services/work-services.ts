import { prisma } from "@/lib/db"
import * as z from "zod"
import { ColorDAO } from "./color-services"
import { CotizationDAO } from "./cotization-services"
import { ItemDAO, recalculateAreaValues } from "./item-services"
import { MaterialDAO } from "./material-services"
import { NoteDAO } from "./note-services"
import { WorkTypeDAO, getWorkTypeDAO } from "./worktype-services"

export type WorkDAO = {
	id: string
	name: string
  reference: string | null
	createdAt: Date
	updatedAt: Date
  workType: WorkTypeDAO
  workTypeId: string
	material: MaterialDAO
	materialId: string
  color: ColorDAO
  colorId: string
	cotization: CotizationDAO
	cotizationId: string
  items: ItemDAO[]
  notes: NoteDAO[]
  optionalColors: ColorDAO[]
}

export type FullWorkDAO= WorkDAO & {
  color: ColorDAO
  cotization: CotizationDAO
  workType: WorkTypeDAO
  material: MaterialDAO
  items: ItemDAO[]
}

export const workSchema = z.object({
	workTypeId: z.string().min(1, "workTypeId is required."),
	materialId: z.string().min(1, "materialId is required."),
	cotizationId: z.string().min(1, "cotizationId is required."),
  colorId: z.string().min(1, "colorId is required."),
  reference: z.string().optional(),
})

export type WorkFormValues = z.infer<typeof workSchema>


export async function getWorksDAO() {
  const found = await prisma.work.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as WorkDAO[]
}

export async function getWorkDAO(id: string) {
  const found = await prisma.work.findUnique({
    where: {
      id
    },
  })
  return found as WorkDAO
}
    
export async function createWork(data: WorkFormValues) {
  const workType= await getWorkTypeDAO(data.workTypeId)
  const name= workType.name
  const created = await prisma.work.create({
    data: {
      name,
      reference: data.reference,
      workTypeId: data.workTypeId,
      materialId: data.materialId,
      colorId: data.colorId,
      cotizationId: data.cotizationId,
    },
  })
  return created
}

export async function updateWork(id: string, data: WorkFormValues) {
  const work= await getWorkDAO(id)
  const previusColorId= work.colorId
  const updated = await prisma.work.update({
    where: {
      id
    },
    data
  })

  if (!updated) throw new Error("Hubo un error al actualizar el Trabajo")

  const newColorId= updated.colorId
  if (newColorId !== previusColorId) {
    console.log("recalculando precios")    
    await recalculateAreaValues(id)
  }

  return updated
}

export async function deleteWork(id: string) {
  const deleted = await prisma.work.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullWorksDAO(): Promise<WorkDAO[]> {
  const found = await prisma.work.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			material: true,
      color: true,
      workType: true,
			cotization: true,
		}
  })
  return found as WorkDAO[]
}
  
export async function getFullWorkDAO(id: string): Promise<FullWorkDAO | null> {
  const found = await prisma.work.findUnique({
    where: {
      id
    },
    include: {
      workType: true,
      color: true,
			material: true,
			cotization: {
        include: {
          client: true,
        }
      },
      items: {
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          manoDeObra: true,
          terminacion: true,
        }
      },
      notes: true,
		}
  })
  return found as FullWorkDAO | null
}
