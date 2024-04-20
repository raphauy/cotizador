import * as z from "zod"
import { prisma } from "@/lib/db"
import { WorkDAO, getFullWorkDAO, getWorkDAO } from "./work-services"
import { ClientType, ItemType } from "@prisma/client"
import { ColorDAO } from "./color-services"
import { AreaItem } from "@/app/seller/cotizations/[cotizationId]/addItems/page"
import { TerminacionDAO, getTerminacionDAO } from "./terminacion-services"

export type ItemDAO = {
	id: string
	type: ItemType
	orden?: number
	largo?: number | null | undefined
	ancho?: number | null | undefined 
  superficie?: number | null | undefined
	metros?: number | null | undefined
	valor?: number | null | undefined
  ajuste?: number | null | undefined
  createdAt: Date
	workId: string
  work: WorkDAO
  terminacionId: string
  terminacion: TerminacionDAO
}

export const itemSchema = z.object({
  type: z.nativeEnum(ItemType),
  largo: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  ancho: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  metros: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	workId: z.string().min(1, "workId is required."),
})

export type ItemFormValues = z.infer<typeof itemSchema>


export const terminationSchema = z.object({
  terminationId: z.string().min(1, "Debes elegir una terminación."),
  llevaCurva: z.boolean(),
  ajuste: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  workId: z.string().min(1, "workId is required."),
  meters: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
})

export type TerminationFormValues = z.infer<typeof terminationSchema>





export async function getItemsDAO() {
  const found = await prisma.item.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found
}

export async function getItemDAO(id: string) {
  const found = await prisma.item.findUnique({
    where: {
      id
    },
  })
  return found
}
    
export async function createItem(data: ItemFormValues) {
  const largo = data.largo ? Number(data.largo) : 0
  const ancho = data.ancho ? Number(data.ancho) : 0
  const metros = data.metros ? Number(data.metros) : 0
  const superficie = largo * ancho / 10000
  const type = data.type
  const work= await getFullWorkDAO(data.workId)
  if (!work) throw new Error("Work not found")

  const orden= work.items.length
  const color= work.color
  const client= work.cotization.client
  const clientType= client.type
  // @ts-ignore
  const valor= calculateValue(type, clientType, superficie, metros, color)
  const created = await prisma.item.create({
    data: {
      ...data,
      largo,
      ancho,
      metros,
      superficie,
      valor,
      orden,
    }
  })
  return created
}

function calculateValue(type: ItemType, clientType: ClientType, superficie: number, metros: number, color: ColorDAO): number {
  let valor= 0
  if (type === ItemType.TRAMO || type === ItemType.ZOCALO || type === ItemType.ALZADA) {
    valor = superficie
  // } else if (type === ItemType.TERMINACION) {
  //   valor = metros
  }

  switch (clientType) {
    case ClientType.CLIENTE_FINAL:
      valor = valor * color.clienteFinalPrice
      break
    case ClientType.ARQUITECTO_ESTUDIO:
      valor = valor * color.arquitectoStudioPrice
      break
    case ClientType.DISTRIBUIDOR:
      valor = valor * color.distribuidorPrice
      break
  }

  return valor
}
export async function updateItem(id: string, data: ItemFormValues) {
  const largo = data.largo ? Number(data.largo) : 0
  const ancho = data.ancho ? Number(data.ancho) : 0
  const superficie = largo * ancho / 10000
  const metros = data.metros ? Number(data.metros) : 0
  const type = data.type
  const work= await getFullWorkDAO(data.workId)
  if (!work) throw new Error("Work not found")
  const color= work.color
  const client= work.cotization.client
  const clientType= client.type
  // @ts-ignore
  const valor= calculateValue(type, clientType, superficie, metros, color)
  console.log("superficie: ", superficie)
  console.log("valor:", valor)
  const updated = await prisma.item.update({
    where: {
      id
    },
    data: {
      ...data,
      largo,
      ancho,
      superficie,
      metros,
      valor,
    }
  })
  return updated
}

export async function deleteItem(id: string) {
  const deleted = await prisma.item.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullItemsDAO() {
  const found = await prisma.item.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			work: {
        include: {
          color: true,
          material: true,
          cotization: true,
        }
      },
      terminacion: true,
		}
  })
  return found
}
  
export async function getFullItemDAO(id: string) {
  const found = await prisma.item.findUnique({
    where: {
      id
    },
    include: {
			work: {
        include: {
          color: true,
          material: true,
          cotization: true,
        }
      },
      terminacion: true,
		}
  })
  return found
}
    

export async function createBulkAreaItem(workId: string, type: ItemType, areaItems: AreaItem[]): Promise<boolean> {

  for (let i = 0; i < areaItems.length; i++) {
    const dataItem: ItemFormValues = {
      workId,
      type,
      largo: areaItems[i].length?.toString(),
      ancho: areaItems[i].width?.toString(),
    }
    await createItem(dataItem)
  }

  return true
}

export async function createTerminationItem(data: TerminationFormValues) {
  const workId= data.workId
  const termination= await getTerminacionDAO(data.terminationId)
  const type= ItemType.TERMINACION
  const metros= Number(data.meters)
  let total= metros * termination.price
  if (data.llevaCurva) {
    total += Number(data.ajuste)
  }
  const valor= total
  const created = await prisma.item.create({
    data: {
      type,
      metros,
      valor,
      ajuste: data.ajuste ? Number(data.ajuste) : 0,
      workId,
      terminacionId: data.terminationId,
    }
  })
  return created
}

export async function updateTerminationItem(id: string, data: TerminationFormValues){
  const workId= data.workId
  const termination= await getTerminacionDAO(data.terminationId)
  const type= ItemType.TERMINACION
  const metros= Number(data.meters)
  let total= metros * termination.price
  if (data.llevaCurva) {
    total += Number(data.ajuste)
  }
  const valor= total
  const updated = await prisma.item.update({
    where: {
      id
    },
    data: {
      type,
      metros,
      valor,
      ajuste: data.ajuste ? Number(data.ajuste) : 0,
      workId,
      terminacionId: data.terminationId,
    }
  })
  return updated
}