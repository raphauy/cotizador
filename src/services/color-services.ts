import * as z from "zod"
import { prisma } from "@/lib/db"
import { MaterialDAO } from "./material-services"

export type ColorDAO = {
	id: string
	name: string
	image: string | undefined | null
  clienteFinalPrice: number
	arquitectoStudioPrice: number
	distribuidorPrice: number
	materialId: string
  material: MaterialDAO
}

export type ColorToFilter = ColorDAO & {
  materialName: string
}

//percMax: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
export const colorSchema = z.object({
	name: z.string().min(1, "nombre es obligatorio"),
	image: z.string().optional().nullable(),
  clienteFinalPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	arquitectoStudioPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	distribuidorPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	materialId: z.string().min(1, "materialId is required."),
})

export type ColorFormValues = z.infer<typeof colorSchema>


export async function getColorsDAO() {
  const found = await prisma.color.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ColorDAO[]
}

export async function getColorDAO(id: string) {
  const found = await prisma.color.findUnique({
    where: {
      id
    },
  })
  return found as ColorDAO
}
    
export async function createColor(data: ColorFormValues) {
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const created = await prisma.color.create({
    data: {
      ...data,
      clienteFinalPrice,
      arquitectoStudioPrice,
      distribuidorPrice,
    }
  })
  return created
}

export async function updateColor(id: string, data: ColorFormValues) {
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const updated = await prisma.color.update({
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

export async function deleteColor(id: string) {
  const deleted = await prisma.color.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function getFullColorsDAOToFilter() {
  const found = await prisma.color.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			material: true,
		}
  })
  if (!found) return []

  const res: ColorToFilter[]= []
  found.forEach((color) => {
    const resColor= {
      ...color,
      materialName: color.material.name
    }
    res.push(resColor)
  })

  return res as ColorToFilter[]
}

export async function getFullColorsDAO(): Promise<ColorDAO[]> {
  const found = await prisma.color.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			material: true,
		}
  })
  if (!found) return []

  return found as ColorDAO[]
}

export async function getFullColorsDAOByMaterialId(materialId: string): Promise<ColorDAO[]> {
  const found = await prisma.color.findMany({
    orderBy: {
      id: 'asc'
    },
    where: {
      materialId
    },
    include: {
			material: true,
		}
  })
  if (!found) return []

  const res: ColorDAO[]= []
  found.forEach((color) => {
    const resColor= {
      ...color,
      materialName: color.material.name
    }
    res.push(resColor)
  })

  return res as ColorDAO[]
}
  
export async function getFullColorDAO(id: string): Promise<ColorDAO | null> {
  const found = await prisma.color.findUnique({
    where: {
      id
    },
    include: {
			material: true,
		}
  })
  if (!found) return null
  const res= {
    ...found,
    materialName: found.material.name,
  }
  return res as ColorDAO
}
    