import * as z from "zod"
import { prisma } from "@/lib/db"
import { MaterialDAO } from "./material-services"

export type ColorDAO = {
	id: string
	name: string
	image: string | undefined | null
  archived: boolean
  duplicatedId: string | undefined | null
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
  archived: z.boolean().default(false),
  clienteFinalPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	arquitectoStudioPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	distribuidorPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	materialId: z.string().min(1, "materialId is required."),
})

export type ColorFormValues = z.infer<typeof colorSchema>


export async function getColorsDAO(includeArchived: boolean = false) {
  const found = await prisma.color.findMany({
    orderBy: {
      id: 'asc'
    },
    where: includeArchived ? {} : {
      archived: false
    }
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
  try {
    const deleted = await prisma.color.delete({
      where: {
        id
      },
    })
    return deleted
  } catch (error: any) {
    // Capturar específicamente el error de clave foránea relacionado con Work
    if (error.code === 'P2003' && error.meta?.field_name?.includes('Work_colorId_fkey')) {
      throw new Error("No se puede eliminar este color porque está siendo utilizado en uno o más trabajos.")
    }
    // Para otros errores de clave foránea
    if (error.code === 'P2003') {
      throw new Error("No se puede eliminar este color porque está siendo utilizado en otros registros.")
    }
    // Cualquier otro error
    throw error
  }
}

/**
 * Archiva un color existente y crea uno nuevo con los mismos datos pero diferentes precios
 * @param id ID del color a archivar y duplicar
 * @param newPrices Nuevos precios para el color duplicado
 * @returns El nuevo color creado
 */
export async function archiveAndDuplicateColor(
  id: string, 
  newPrices: { 
    clienteFinalPrice: number, 
    arquitectoStudioPrice: number, 
    distribuidorPrice: number 
  }
) {
  // Obtener el color original con sus datos completos
  const originalColor = await prisma.color.findUnique({
    where: { id }
  });

  if (!originalColor) {
    throw new Error(`No se encontró el color con ID: ${id}`);
  }

  // Iniciar una transacción para asegurar que ambas operaciones (archivar y crear) se completan o ninguna
  const result = await prisma.$transaction(async (tx) => {
    // 1. Crear un nuevo color con los mismos datos pero diferentes precios
    const newColor = await tx.color.create({
      data: {
        name: originalColor.name,
        image: originalColor.image,
        materialId: originalColor.materialId,
        archived: false,
        clienteFinalPrice: newPrices.clienteFinalPrice,
        arquitectoStudioPrice: newPrices.arquitectoStudioPrice,
        distribuidorPrice: newPrices.distribuidorPrice
      }
    });

    // 2. Archivar el color original y guardar la referencia al nuevo color
    const archivedColor = await tx.color.update({
      where: { id },
      data: { 
        archived: true,
        duplicatedId: newColor.id // Guardamos la referencia al nuevo color
      }
    });

    return { archivedColor, newColor };
  });

  return result.newColor;
}

export async function getFullColorsDAOToFilter(includeArchived: boolean = false) {
  const found = await prisma.color.findMany({
    orderBy: [
      {
        name: 'asc'
      },
      {
        id: 'asc'
      }
    ],
    where: includeArchived ? {} : {
      archived: false
    },
    include: {
			material: true,
		}
  })
  if (!found) return []

  const res: ColorToFilter[]= []
  found.forEach((color: any) => {
    const resColor= {
      ...color,
      materialName: color.material.name
    }
    res.push(resColor)
  })

  return res as ColorToFilter[]
}

export async function getFullColorsDAO(includeArchived: boolean = false): Promise<ColorDAO[]> {
  const found = await prisma.color.findMany({
    orderBy: {
      id: 'asc'
    },
    where: includeArchived ? {} : {
      archived: false
    },
    include: {
			material: true,
		}
  })
  if (!found) return []

  return found as ColorDAO[]
}

export async function getFullColorsDAOByMaterialId(materialId: string, includeArchived: boolean = false): Promise<ColorDAO[]> {
  const found = await prisma.color.findMany({
    orderBy: {
      name: 'asc'
    },
    where: {
      materialId,
      ...(includeArchived ? {} : { archived: false })
    },
    include: {
			material: true,
		}
  })
  if (!found) return []

  const res: ColorDAO[]= []
  found.forEach((color: any) => {
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
    