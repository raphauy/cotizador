import * as z from "zod"
import { prisma } from "@/lib/db"

export type ManoDeObraDAO = {
	id: string
	name: string
	clienteFinalPrice: number
	arquitectoStudioPrice: number
	distribuidorPrice: number
  isLinear: boolean
  isSurface: boolean
  archived: boolean
}

export const manoDeObraSchema = z.object({
	name: z.string().min(1, "name is required."),
  clienteFinalPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  arquitectoStudioPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  distribuidorPrice: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  isLinear: z.boolean().optional(),
  isSurface: z.boolean().optional(),
  archived: z.boolean().default(false),
})

export type ManoDeObraFormValues = z.infer<typeof manoDeObraSchema>


export async function getManoDeObrasDAO(includeArchived: boolean = false) {
  const found = await prisma.manoDeObra.findMany({
    orderBy: {
      id: 'asc'
    },
    where: includeArchived ? {} : {
      archived: false
    }
  })
  return found as ManoDeObraDAO[]
}

export async function getManoDeObraDAO(id: string) {
  const found = await prisma.manoDeObra.findUnique({
    where: {
      id
    },
  })
  return found as ManoDeObraDAO
}
    
export async function createManoDeObra(data: ManoDeObraFormValues) {
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const created = await prisma.manoDeObra.create({
    data: {
      ...data,
      clienteFinalPrice,
      arquitectoStudioPrice,
      distribuidorPrice,
    }
  })
  return created
}

export async function updateManoDeObra(id: string, data: ManoDeObraFormValues) {
  const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0
  const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
  const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
  const updated = await prisma.manoDeObra.update({
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

export async function deleteManoDeObra(id: string) {
  const deleted = await prisma.manoDeObra.delete({
    where: {
      id
    },
  })
  return deleted
}

export async function archiveManoDeObra(id: string, archive: boolean = true) {
  const updated = await prisma.manoDeObra.update({
    where: {
      id
    },
    data: {
      archived: archive
    }
  })
  return updated
}

/**
 * Archiva una mano de obra existente y crea una nueva con los mismos datos pero diferentes precios
 * @param id ID de la mano de obra a archivar y duplicar
 * @param newPrices Nuevos precios para la mano de obra duplicada (clienteFinal, arquitectoStudio, distribuidor)
 * @returns La nueva mano de obra creada
 */
export async function archiveAndDuplicateManoDeObra(
  id: string, 
  newPrices: { 
    clienteFinalPrice: number, 
    arquitectoStudioPrice: number, 
    distribuidorPrice: number 
  }
) {
  // Obtener la mano de obra original con sus datos completos
  const originalManoDeObra = await prisma.manoDeObra.findUnique({
    where: { id }
  });

  if (!originalManoDeObra) {
    throw new Error(`No se encontró la mano de obra con ID: ${id}`);
  }

  // Iniciar una transacción para asegurar que ambas operaciones (archivar y crear) se completan o ninguna
  const result = await prisma.$transaction(async (tx) => {
    // 1. Archivar la mano de obra original
    const archivedManoDeObra = await tx.manoDeObra.update({
      where: { id },
      data: { archived: true }
    });

    // 2. Crear una nueva mano de obra con los mismos datos pero diferentes precios
    const newManoDeObra = await tx.manoDeObra.create({
      data: {
        name: originalManoDeObra.name,
        clienteFinalPrice: newPrices.clienteFinalPrice,
        arquitectoStudioPrice: newPrices.arquitectoStudioPrice,
        distribuidorPrice: newPrices.distribuidorPrice,
        isLinear: originalManoDeObra.isLinear,
        isSurface: originalManoDeObra.isSurface,
        archived: false
      }
    });

    return { archivedManoDeObra, newManoDeObra };
  });

  return result.newManoDeObra;
}

export async function getFullManoDeObrasDAO(includeArchived: boolean = false) {
  const found = await prisma.manoDeObra.findMany({
    orderBy: {
      id: 'asc'
    },
    where: includeArchived ? {} : {
      archived: false
    },
    include: {
		}
  })
  return found as ManoDeObraDAO[]
}
  
export async function getFullManoDeObraDAO(id: string) {
  const found = await prisma.manoDeObra.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as ManoDeObraDAO
}

/**
 * Obtiene las manos de obra activas y archivadas que están en uso en un trabajo específico
 * @param workId ID del trabajo
 * @returns Lista de manos de obra disponibles para el trabajo
 */
export async function getManoDeObrasForWorkDAO(workId: string): Promise<ManoDeObraDAO[]> {
  // 1. Obtener las manos de obra activas
  const activeManoDeObras = await getManoDeObrasDAO(false);
  
  // 2. Obtener los IDs de manos de obra archivadas que ya están en uso en este trabajo
  const workItems = await prisma.item.findMany({
      where: {
          workId: workId,
          type: 'MANO_DE_OBRA',
          NOT: {
              manoDeObraId: null
          }
      },
      select: {
          manoDeObraId: true
      }
  });
  
  const usedManoDeObraIds = workItems
      .map(item => item.manoDeObraId)
      .filter((id): id is string => id !== null);
  
  // Si no hay manos de obra utilizadas, solo devolver las activas
  if (usedManoDeObraIds.length === 0) {
      return activeManoDeObras;
  }
  
  // 3. Obtener las manos de obra archivadas que están en uso
  const archivedUsedManoDeObras = await prisma.manoDeObra.findMany({
      where: {
          id: { in: usedManoDeObraIds },
          archived: true
      }
  }) as ManoDeObraDAO[];
  
  // 4. Combinar ambas listas y devolver
  return [...activeManoDeObras, ...archivedUsedManoDeObras];
}
    