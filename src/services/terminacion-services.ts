import * as z from "zod"
import { prisma } from "@/lib/db"
import { ItemType } from "@prisma/client"

export type TerminacionDAO = {
	id: string
	name: string
	image: string | undefined | null
  price: number
  archived: boolean
  duplicatedId: string | undefined | null
}

export const terminacionSchema = z.object({
	name: z.string().min(1, "name is required."),
  price: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  archived: z.boolean().default(false),
})

export type TerminacionFormValues = z.infer<typeof terminacionSchema>


export async function getTerminacionsDAO(includeArchived: boolean = false) {
  const found = await prisma.terminacion.findMany({
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
    }
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
  const price = data.price ? Number(data.price) : 0
  const created = await prisma.terminacion.create({
    data: {
      ...data,
      price,
    }
  })
  return created
}

export async function updateTerminacion(id: string, data: TerminacionFormValues) {
  const price = data.price ? Number(data.price) : 0
  const updated = await prisma.terminacion.update({
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

export async function deleteTerminacion(id: string) {
  try {
    const deleted = await prisma.terminacion.delete({
      where: {
        id
      },
    })
    return deleted
  } catch (error: any) {
    // Capturar específicamente el error de clave foránea relacionado con Work
    if (error.code === 'P2003' && error.meta?.field_name?.includes('Work_terminacionId_fkey')) {
      throw new Error("No se puede eliminar esta terminación porque está siendo utilizada en uno o más trabajos.")
    }
    // Para otros errores de clave foránea relacionados con Item
    if (error.code === 'P2003' && error.meta?.field_name?.includes('Item_terminacionId_fkey')) {
      throw new Error("No se puede eliminar esta terminación porque está siendo utilizada en uno o más items.")
    }
    // Para otros errores de clave foránea
    if (error.code === 'P2003') {
      throw new Error("No se puede eliminar esta terminación porque está siendo utilizada en otros registros.")
    }
    // Cualquier otro error
    throw error
  }
}

/**
 * Archiva una terminación existente y crea una nueva con los mismos datos pero diferente precio
 * @param id ID de la terminación a archivar y duplicar
 * @param newPrice Nuevo precio para la terminación duplicada
 * @returns La nueva terminación creada
 */
export async function archiveAndDuplicateTerminacion(id: string, newPrice: number) {
  // Obtener la terminación original con sus datos completos
  const originalTerminacion = await prisma.terminacion.findUnique({
    where: { id }
  });

  if (!originalTerminacion) {
    throw new Error(`No se encontró la terminación con ID: ${id}`);
  }

  // Iniciar una transacción para asegurar que ambas operaciones (archivar y crear) se completan o ninguna
  const result = await prisma.$transaction(async (tx) => {
    // 1. Crear una nueva terminación con los mismos datos pero diferente precio
    const newTerminacion = await tx.terminacion.create({
      data: {
        name: originalTerminacion.name,
        image: originalTerminacion.image,
        price: newPrice,
        archived: false
      }
    });

    // 2. Archivar la terminación original y guardar la referencia a la nueva
    const archivedTerminacion = await tx.terminacion.update({
      where: { id },
      data: { 
        archived: true,
        duplicatedId: newTerminacion.id // Guardamos la referencia a la nueva terminación
      }
    });

    return { archivedTerminacion, newTerminacion };
  });

  return result.newTerminacion;
}

/**
 * Obtiene todas las terminaciones activas y también las archivadas que estén siendo utilizadas
 * en los items del trabajo especificado
 * @param workId ID del trabajo
 * @returns Lista de terminaciones disponibles para el trabajo
 */
export async function getTerminacionsForWorkDAO(workId: string): Promise<TerminacionDAO[]> {
    // 1. Obtener las terminaciones activas
    const activeTerminations = await getTerminacionsDAO(false);
    
    // 2. Obtener los IDs de terminaciones archivadas que ya están en uso en este trabajo
    const workItems = await prisma.item.findMany({
        where: {
            workId: workId,
            type: ItemType.TERMINACION,
            NOT: {
                terminacionId: null
            }
        },
        select: {
            terminacionId: true
        }
    });
    
    const usedTerminationIds = workItems
        .map(item => item.terminacionId)
        .filter((id): id is string => id !== null);
    
    // Si no hay terminaciones usadas, solo devolver las activas
    if (usedTerminationIds.length === 0) {
        return activeTerminations;
    }
    
    // 3. Obtener las terminaciones archivadas que están en uso
    const archivedUsedTerminations = await prisma.terminacion.findMany({
        where: {
            id: { in: usedTerminationIds },
            archived: true
        }
    }) as TerminacionDAO[];
    
    // 4. Combinar ambas listas y devolver
    return [...activeTerminations, ...archivedUsedTerminations];
}

export async function getFullTerminacionsDAO(includeArchived: boolean = false) {
  const found = await prisma.terminacion.findMany({
    orderBy: {
      id: 'asc'
    },
    where: includeArchived ? {} : {
      archived: false
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
    
