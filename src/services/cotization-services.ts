import { prisma } from "@/lib/db"
import * as z from "zod"
import { completeWithZeros, getCurrentUser } from "@/lib/utils"
import { ClientType, CotizationStatus, CotizationType } from "@prisma/client"
import { ClientDAO, getClientDAO } from "./client-services"
import { CotizationNoteDAO, copyOriginalNotes } from "./cotizationnote-services"
import { WorkDAO } from "./work-services"
import { CotizationForPanel } from "@/app/seller/cotizations/column-panel-box"
import { recalculateAreaValues } from "./item-services"

export type CotizationDAO = {
	id: string
	number: number
  version: number
  label: string
	status: CotizationStatus
	type: CotizationType
  date: Date
	obra: string | null
  comments: string
  showTotalInPreview: boolean
  showTaxesInPreview: boolean
	createdAt: Date
	updatedAt: Date
	clientId: string
  clientName: string
  clientType: ClientType
  client: ClientDAO
	creatorId: string
  creatorName: string
  sellerId: string
  sellerName: string
  works: WorkDAO[]
  cotizationNotes: CotizationNoteDAO[]
  originalCotizationId: string | null
}

export type CotizationDAOForTable = {
	id: string
	number: number
  version: number
  label: string
	status: CotizationStatus
	type: CotizationType
  date: Date
	obra: string | null
  comments: string
  showTotalInPreview: boolean
  showTaxesInPreview: boolean
	createdAt: Date
	updatedAt: Date
	clientId: string
  clientName: string
  clientType: ClientType
  client: ClientDAO
	creatorId: string
  creatorName: string
  sellerId: string
  sellerName: string
  originalCotizationId: string | null
}
export const cotizationSchema = z.object({
	type: z.nativeEnum(CotizationType),
  date: z.date(),
	obra: z.string().optional(),
  showTotalInPreview: z.boolean(),
  showTaxesInPreview: z.boolean(),
	clientId: z.string().min(1, "clientId is required."),
	creatorId: z.string().min(1, "creatorId is required."),
  sellerId: z.string().min(1, "sellerId is required."),
})

export type CotizationFormValues = z.infer<typeof cotizationSchema>


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
      cotizationsNotes: true,
    }
  })
  if (!found) return null

  const res: CotizationDAO = {
    ...found,
    client: found.client as ClientDAO,
    clientName: found.client?.name,
    clientType: found.client?.type,
    creatorName: found.creator?.name,    
    sellerName: found.seller.name,
    works: found.works as WorkDAO[],
    cotizationNotes: found.cotizationsNotes
  }

  return res 
}
    
export async function createCotization(data: CotizationFormValues) {
  console.log(data)
  
  const created = await prisma.cotization.create({
      data,
      include: {
        client: true,
        creator: true,
        seller: true,
        works: true,
        cotizationsNotes: true,
      },
    })
  if (created) {
    await copyOriginalNotes(created.id)
  }

  const label= "#" + completeWithZeros(created.number)
  await prisma.cotization.update({where: {id: created.id},data: {label}})

  const res: CotizationDAO = {
    ...created,
    client: created.client as ClientDAO,
    clientName: created.client?.name,
    clientType: created.client?.type,
    creatorName: created.creator?.name,    
    sellerName: created.seller.name,
    works: created.works as WorkDAO[],
    cotizationNotes: created.cotizationsNotes
  }

  return res
}

export async function updateCotization(id: string, data: CotizationFormValues) {
  const cotization= await getCotizationDAO(id)
  if (!cotization) throw new Error("Cotization not found")

  const updated = await prisma.cotization.update({
    where: {
      id
    },
    data
  })
  const newClient= await getClientDAO(data.clientId)
  if (cotization.client.type !== newClient.type) {
    // Los tipos de cliente son diferentes, hay que recalcular los valores
    const newCotizationWithWorks = await prisma.cotization.findUnique({
      where: { id: updated.id },
      include: { works: true }
    })

    if (newCotizationWithWorks && newCotizationWithWorks.works.length > 0) {
      for (const work of newCotizationWithWorks.works) {
        await recalculateAreaValues(work.id)
      }
    }
  }

  return updated
}

export async function deleteCotization(id: string) {
  const deleted = await prisma.cotization.delete({
    where: {
      id
    },
    include: {
      client: true,
      creator: true,
      seller: true,
      works: true,
      cotizationsNotes: true,
    }
  })
  const res: CotizationDAO = {
    ...deleted,
    client: deleted.client as ClientDAO,
    clientName: deleted.client?.name,
    clientType: deleted.client?.type,
    creatorName: deleted.creator?.name,
    sellerName: deleted.seller.name,
    works: deleted.works as WorkDAO[],
    cotizationNotes: deleted.cotizationsNotes
  }
  return res
}


export async function getFullCotizationsDAO(from: Date | null, to: Date | null): Promise<CotizationDAOForTable[]> {
  const found = await prisma.cotization.findMany({
    where: {
      createdAt: {
        gte: from ? from : undefined,
        lte: to ? to : undefined,
      },
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      client: true,
      creator: true,
      seller: true,
		}
  })
  const res: CotizationDAOForTable[]= []
  found.forEach(cotization => {
    res.push({
      ...cotization,
      client: cotization.client as ClientDAO,
      clientName: cotization.client?.name,
      clientType: cotization.client?.type,
      creatorName: cotization.creator?.name,
      sellerName: cotization.seller.name,
    })
  })
  return res
}

export async function getCotizationsDAOForPanel(): Promise<CotizationForPanel[]> {
  const found = await prisma.cotization.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          type: true,
        }
      },
      seller: {
        select: {
          id: true,
          name: true,          
        }
      },
      works: {
        select: {
          id: true,
        }
      }
		},
  })
  const res: CotizationForPanel[]= []
  found.forEach(cotization => {
    res.push({
      id: cotization.id,
      number: cotization.number.toString(),
      status: cotization.status,
      date: cotization.date,
      label: cotization.label,
      clientName: cotization.client?.name,
      clientType: cotization.client?.type,
      sellerName: cotization.seller.name,
      workCount: cotization.works.length,
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
          optionalColors: {
            include: {
              material: true
            }
          },
          items: {
            orderBy: {
              createdAt: 'asc'
            },
            include: {
              terminacion: true,
              manoDeObra: true,
              colocacion: true,
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
          createdAt: 'asc'
        }    
      },
      cotizationsNotes: {
        orderBy: {
          order: 'asc'
        }
      },
      versions: true
		},
  })
  if (!found) return null

  const res: CotizationDAO = {
    ...found,
    client: found.client as ClientDAO,
    clientName: found.client?.name,
    clientType: found.client?.type,
    creatorName: found.creator?.name,
    sellerName: found.seller.name,
    // @ts-ignore
    works: found.works as WorkDAO[],
    cotizationNotes: found.cotizationsNotes
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
  const actualStatus= await getCotizationStatusByCotizationId(id)
  if (actualStatus === CotizationStatus.COTIZADO || actualStatus === CotizationStatus.VENDIDO || actualStatus === CotizationStatus.PERDIDO) {
    if (status === CotizationStatus.BORRADOR)
      throw new Error("El presupuesto ya no puede volver a ser BORRADOR")
  }
    
  
  const updated = await prisma.cotization.update({
    where: {
      id
    },
    data: {
      status
    },
  })
  if (!updated) 
    return false
  
  return true
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
      createdAt: 'desc'
    },
    include: {
      client: true,
      creator: true,
      seller: true,
      works: true,
      cotizationsNotes: true,
    }
  })

  const res: CotizationDAO[]= []
  found.forEach(cotization => {
    res.push({
      ...cotization,
      client: cotization.client as ClientDAO,
      clientName: cotization.client?.name,
      clientType: cotization.client?.type,
      creatorName: cotization.creator?.name,
      sellerName: cotization.seller.name,
      works: cotization.works as WorkDAO[],
      cotizationNotes: cotization.cotizationsNotes
    })
  })
	
 	return res
}

export async function reloadOriginalNotes(cotizationId: string) {
  // delete all notes of the cotization and recreate them copying the original notes
  const cotization = await prisma.cotization.findUnique({
    where: {
      id: cotizationId,
    },
  })
  if (!cotization) {
    throw new Error("Cotization not found")
  }
  // delete all notes of the cotization and recreate them copying the original notes
  const cotizationNotes = await prisma.cotizationNote.deleteMany({
    where: {
      cotizationId: cotizationId,
    },
  })
  const originalNotes = await prisma.cotizationNote.findMany({
    where: {
      cotizationId: null,
    },
    orderBy: {
      order: 'asc'
    },
  })
  for (let i = 0; i < originalNotes.length; i++) {
    const note = originalNotes[i]
    await prisma.cotizationNote.create({
      data: {
        text: note.text,
        order: i,
        cotizationId: cotizationId,
      }
    })
  }
}

export async function createVersion(cotizationId: string) {
  const cotization = await prisma.cotization.findUnique({
    where: {
      id: cotizationId,
    },
    include: {
      works: {
        include: {
          items: true,
          notes: true,
          optionalColors: true,
        },
        orderBy: {
          createdAt: 'asc'
        },
      },
      cotizationsNotes: true,
    },
  })

  if (!cotization) {
    throw new Error("No se encontró la cotización")
  }

  // Identificar la cotización original
  const originalId = cotization.originalCotizationId || cotization.id
  const originalCotization = await prisma.cotization.findUnique({
    where: {
      id: originalId,
    },
  })

  if (!originalCotization) {
    throw new Error("No se encontró la cotización original")
  }

  // Contar todas las versiones existentes del original para determinar el nuevo número de versión
  const versionsCount = await prisma.cotization.count({
    where: {
      originalCotizationId: originalId,
    },
  })

  const newVersionNumber = versionsCount + 1
  const newLabel = `#${completeWithZeros(originalCotization.number)}-${newVersionNumber}`

  const newCotization = await prisma.cotization.create({
    data: {
      number: originalCotization.number,
      version: newVersionNumber,
      label: newLabel,
      status: "BORRADOR",
      type: cotization.type,
      date: new Date(),
      obra: cotization.obra,
      showTotalInPreview: false,
      showTaxesInPreview: false,
      clientId: cotization.clientId,
      creatorId: cotization.creatorId,
      sellerId: cotization.sellerId,
      originalCotizationId: originalId,
    },
  })

  for (const work of cotization.works) {
    // Obtener la versión activa del color
    const activeColorId = await getActiveColorId(work.colorId);
    
    const newWork = await prisma.work.create({
      data: {
        name: work.name,
        reference: work.reference,
        workTypeId: work.workTypeId,
        materialId: work.materialId,
        colorId: activeColorId, // Usar la versión activa del color
        cotizationId: newCotization.id,
      },
    })

    for (const item of work.items) {
      // Obtener versiones activas de terminación y mano de obra
      const activeTerminacionId = item.terminacionId ? await getActiveTerminacionId(item.terminacionId) : null;
      const activeManoDeObraId = item.manoDeObraId ? await getActiveManoDeObraId(item.manoDeObraId) : null;
      
      await prisma.item.create({
        data: {
          type: item.type,
          orden: item.orden,
          description: item.description,
          quantity: item.quantity,
          largo: item.largo,
          ancho: item.ancho,
          superficie: item.superficie,
          centimetros: item.centimetros,
          valor: item.valor,
          ajuste: item.ajuste,
          valorAreaTerminacion: item.valorAreaTerminacion,
          workId: newWork.id,
          terminacionId: activeTerminacionId, // Usar la versión activa
          manoDeObraId: activeManoDeObraId, // Usar la versión activa
          colocacionId: item.colocacionId,
        },
      })
    }

    for (const note of work.notes) {
      await prisma.note.create({
        data: {
          text: note.text,
          private: note.private,
          workId: newWork.id,
          userId: note.userId,
        },
      })
    }

    for (const optionalColor of work.optionalColors) {
      // Obtener la versión activa del color opcional
      const activeOptionalColorId = await getActiveColorId(optionalColor.id);
      
      await prisma.work.update({
        where: {
          id: newWork.id,
        },
        data: {
          optionalColors: {
            connect: { id: activeOptionalColorId },
          },
        },
      })
    }
  }

  // Copiar las notas asociadas
  for (const note of cotization.cotizationsNotes) {
    await prisma.cotizationNote.create({
      data: {
        text: note.text,
        order: note.order,
        cotizationId: newCotization.id,
      },
    })
  }

  // Recalcular valores para todos los trabajos de la nueva cotización
  const newCotizationWithWorks = await prisma.cotization.findUnique({
    where: { id: newCotization.id },
    include: {
      works: true,
    },
  });

  if (newCotizationWithWorks?.works && newCotizationWithWorks.works.length > 0) {
    for (const work of newCotizationWithWorks.works) {
      await recalculateAreaValues(work.id);
    }
  }

  return newCotization
}

export async function getVersions(cotizationId: string) {
  const found = await prisma.cotization.findUnique({
    where: {
      id: cotizationId,
    },
    include: {
      versions: true,
    },
  })

  if (!found) {
    throw new Error("No se encontró la cotización")
  }

  const originalCotizationId= found.originalCotizationId
  if (originalCotizationId) {
    // there is an original cotization, so we need to get the original versions
    const originalCotization= await prisma.cotization.findUnique({
      where: {
        id: originalCotizationId,
      },
      include: {
        versions: true,
      },
    })
    if (!originalCotization) {
      throw new Error("No se encontró la cotización original")
    }
    const res= originalCotization.versions
    // add original cotization to the list at the start
    res.unshift(originalCotization)
    return res
  }

  if (found.versions.length === 0) {
    return []
  }
  const res= found.versions
  // add original cotization to the list at the start
  res.unshift(found)
  return res
}


export async function getNextLabel(cotizationId: string) {
  const found = await prisma.cotization.findUnique({
    where: {
      id: cotizationId,
    },
    include: {
      versions: true,
    },
  })

  if (!found) {
    throw new Error("No se encontró la cotización")
  }

  const originalCotizationId= found.originalCotizationId
  if (originalCotizationId) {
    // there is an original cotization, so we need to get the original versions
    const originalCotization= await prisma.cotization.findUnique({
      where: {
        id: originalCotizationId,
      },
      include: {
        versions: true,
      },
    })
    if (!originalCotization) {
      throw new Error("No se encontró la cotización original")
    }
    return originalCotization.label + "-" + (originalCotization.versions.length+1)
  }

  const versions= found.versions
  return found.label + "-" + (versions.length+1)
}


export async function setComments(cotizationId: string, comments: string) {
  const cotization= await prisma.cotization.update({
    where: {
      id: cotizationId
    },
    data: {
      comments
    }
  })
  return cotization
}

export async function createDuplicated(cotizationId: string, clientId: string) {
  const cotization = await prisma.cotization.findUnique({
    where: {
      id: cotizationId,
    },
    include: {
      works: {
        include: {
          items: true,
          notes: true,
          optionalColors: true,
        },
        orderBy: {
          createdAt: 'asc'
        },
      },
      cotizationsNotes: true,
      client: true,
    },
  })

  if (!cotization) {
    throw new Error("No se encontró la cotización")
  }

  const currentUser= await getCurrentUser()
  if (!currentUser) {
    throw new Error("Debes estar logueado para realizar esta acción")
  }

  // Crear la nueva cotización
  const newCotization = await prisma.cotization.create({
    data: {
      label: "change it",
      status: "BORRADOR",
      type: cotization.type,
      date: new Date(),
      obra: "poner nombre",
      showTotalInPreview: false,
      showTaxesInPreview: false,
      clientId,
      creatorId: currentUser.id,
      sellerId: cotization.sellerId,
    },
  })

  // Copiar los trabajos asociados junto con sus items
  for (const work of cotization.works) {
    const newWork = await prisma.work.create({
      data: {
        name: work.name,
        reference: work.reference,
        workTypeId: work.workTypeId,
        materialId: work.materialId,
        colorId: await getActiveColorId(work.colorId),
        cotizationId: newCotization.id,
      },
    })

    for (const item of work.items) {
      // Obtener las versiones activas de terminaciones y mano de obra
      const activeTerminacionId = item.terminacionId ? await getActiveTerminacionId(item.terminacionId) : null;
      const activeManoDeObraId = item.manoDeObraId ? await getActiveManoDeObraId(item.manoDeObraId) : null;
      
      await prisma.item.create({
        data: {
          type: item.type,
          orden: item.orden,
          description: item.description,
          quantity: item.quantity,
          largo: item.largo,
          ancho: item.ancho,
          superficie: item.superficie,
          centimetros: item.centimetros,
          valor: item.valor,
          ajuste: item.ajuste,
          valorAreaTerminacion: item.valorAreaTerminacion,
          workId: newWork.id,
          terminacionId: activeTerminacionId,
          manoDeObraId: activeManoDeObraId,
          colocacionId: item.colocacionId,
        },
      })
    }

    for (const note of work.notes) {
      await prisma.note.create({
        data: {
          text: note.text,
          private: note.private,
          workId: newWork.id,
          userId: note.userId,
        },
      })
    }

    for (const optionalColor of work.optionalColors) {
      // Obtener la versión activa del color opcional
      const activeOptionalColorId = await getActiveColorId(optionalColor.id);
      
      await prisma.work.update({
        where: {
          id: newWork.id,
        },
        data: {
          optionalColors: {
            connect: { id: activeOptionalColorId },
          },
        },
      })
    }
  }

  // Copiar las notas asociadas
  for (const note of cotization.cotizationsNotes) {
    await prisma.cotizationNote.create({
      data: {
        text: note.text,
        order: note.order,
        cotizationId: newCotization.id,
      },
    })
  }

  const label= "#" + completeWithZeros(newCotization.number)
  await prisma.cotization.update({where: {id: newCotization.id},data: {label}})

  // Verificar si los tipos de cliente son diferentes y recalcular si es necesario
  // const newClient = await prisma.client.findUnique({ where: { id: clientId } })
  // if (!newClient) {
  //   throw new Error("No se encontró el nuevo cliente")
  // }

  // if (cotization.client.type !== newClient.type) {
  //   // Los tipos de cliente son diferentes, hay que recalcular los valores
  //   const newCotizationWithWorks = await prisma.cotization.findUnique({
  //     where: { id: newCotization.id },
  //     include: { works: true }
  //   })

  //   if (newCotizationWithWorks && newCotizationWithWorks.works.length > 0) {
  //     for (const work of newCotizationWithWorks.works) {
  //       await recalculateAreaValues(work.id)
  //     }
  //   }
  // }

  const newCotizationWithWorks = await prisma.cotization.findUnique({
    where: { id: newCotization.id },
    include: { works: true }
  })

  if (newCotizationWithWorks && newCotizationWithWorks.works.length > 0) {
    for (const work of newCotizationWithWorks.works) {
      await recalculateAreaValues(work.id)
    }
  }

  return newCotization
}


export async function createWorkDuplicated(workId: string) {
  const work= await prisma.work.findUnique({
    where: {
      id: workId
    },
    include: {
      items: true,
      notes: true,
      optionalColors: true,
    }
  })
  if (!work) throw new Error("Work not found")

  const newWork= await prisma.work.create({
    data: {
      name: work.name,
      reference: work.reference,
      workTypeId: work.workTypeId,
      materialId: work.materialId,
      colorId: await getActiveColorId(work.colorId),
      cotizationId: work.cotizationId,
    }
  })

  for (const item of work.items) {
    // Obtener las versiones activas de terminaciones y mano de obra
    const activeTerminacionId = item.terminacionId ? await getActiveTerminacionId(item.terminacionId) : null;
    const activeManoDeObraId = item.manoDeObraId ? await getActiveManoDeObraId(item.manoDeObraId) : null;
    
    const newItem= await prisma.item.create({
      data: {
        type: item.type,
        orden: item.orden,
        description: item.description,
        quantity: item.quantity,
        largo: item.largo,
        ancho: item.ancho,
        superficie: item.superficie,
        centimetros: item.centimetros,
        valor: item.valor,
        ajuste: item.ajuste,
        valorAreaTerminacion: item.valorAreaTerminacion,
        workId: newWork.id,
        terminacionId: activeTerminacionId,
        manoDeObraId: activeManoDeObraId,
        colocacionId: item.colocacionId,
      },
    })
  }

  for (const note of work.notes) {
    await prisma.note.create({
      data: {
        text: note.text,
        private: note.private,
        workId: newWork.id,
        userId: note.userId,
      },
    })
  }
  for (const optionalColor of work.optionalColors) {
    // Obtener la versión activa del color opcional
    const activeOptionalColorId = await getActiveColorId(optionalColor.id);
    
    await prisma.work.update({
      where: {
        id: newWork.id,
      },
      data: {
        optionalColors: {
          connect: { id: activeOptionalColorId },
        },
      },
    })
  }

  // Recalcular todos los valores ya que pudimos haber reemplazado elementos archivados
  await recalculateAreaValues(newWork.id)

  return newWork
}


export async function getCotizationStatusByWorkId(workId: string) {
  const found = await prisma.work.findUnique({
    where: {
      id: workId
    },
    include: {
      cotization: true,
    }
  })
  if (!found) throw new Error("Work not found")

  const cotization= found.cotization
  if (!cotization) throw new Error("Work not found")

  return cotization.status
}

export async function getCotizationStatusByCotizationId(cotizationId: string) {
  const found = await prisma.cotization.findUnique({
    where: {
      id: cotizationId
    },
    select: {
      status: true
    }
  })

  return found?.status
}

/**
 * Sigue la cadena de duplicados de un color hasta encontrar uno activo.
 * @param colorId ID del color a verificar
 * @returns ID del color activo más reciente
 */
async function getActiveColorId(colorId: string): Promise<string> {
  if (!colorId) return colorId;
  
  // Obtener el color actual
  const color = await prisma.color.findUnique({
    where: { id: colorId }
  });
  
  // Si no existe o no está archivado, devolver el mismo ID
  if (!color || !color.archived) {
    return colorId;
  }
  
  // Si está archivado pero no tiene duplicatedId, devolver el mismo ID
  if (!color.duplicatedId) {
    return colorId;
  }
  
  // Recursivamente buscar el color activo a través de la cadena de duplicados
  return getActiveColorId(color.duplicatedId);
}

/**
 * Sigue la cadena de duplicados de una terminación hasta encontrar una activa.
 * @param terminacionId ID de la terminación a verificar
 * @returns ID de la terminación activa más reciente
 */
async function getActiveTerminacionId(terminacionId: string): Promise<string> {
  if (!terminacionId) return terminacionId;
  
  // Obtener la terminación actual
  const terminacion = await prisma.terminacion.findUnique({
    where: { id: terminacionId }
  });
  
  // Si no existe o no está archivada, devolver el mismo ID
  if (!terminacion || !terminacion.archived) {
    return terminacionId;
  }
  
  // Si está archivada pero no tiene duplicatedId, devolver el mismo ID
  if (!terminacion.duplicatedId) {
    return terminacionId;
  }
  
  // Recursivamente buscar la terminación activa a través de la cadena de duplicados
  return getActiveTerminacionId(terminacion.duplicatedId);
}

/**
 * Sigue la cadena de duplicados de una mano de obra hasta encontrar una activa.
 * @param manoDeObraId ID de la mano de obra a verificar
 * @returns ID de la mano de obra activa más reciente
 */
async function getActiveManoDeObraId(manoDeObraId: string): Promise<string> {
  if (!manoDeObraId) return manoDeObraId;
  
  // Obtener la mano de obra actual
  const manoDeObra = await prisma.manoDeObra.findUnique({
    where: { id: manoDeObraId }
  });
  
  // Si no existe o no está archivada, devolver el mismo ID
  if (!manoDeObra || !manoDeObra.archived) {
    return manoDeObraId;
  }
  
  // Si está archivada pero no tiene duplicatedId, devolver el mismo ID
  if (!manoDeObra.duplicatedId) {
    return manoDeObraId;
  }
  
  // Recursivamente buscar la mano de obra activa a través de la cadena de duplicados
  return getActiveManoDeObraId(manoDeObra.duplicatedId);
}