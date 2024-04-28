import * as z from "zod"
import { prisma } from "@/lib/db"
import { WorkDAO, getFullWorkDAO, getWorkDAO } from "./work-services"
import { ClientType, ItemType } from "@prisma/client"
import { ColorDAO } from "./color-services"
import { TerminacionDAO, getTerminacionDAO } from "./terminacion-services"
import { ManoDeObraDAO, ManoDeObraFormValues, getManoDeObraDAO } from "./manodeobra-services"
import { AreaItem, ManoDeObraItem, TerminationItem } from "@/app/seller/cotizations/[cotizationId]/addAreas/page"

export type ItemDAO = {
	id: string
	type: ItemType
	orden?: number
  description?: string
  quantity: number
	largo?: number | null | undefined
	ancho?: number | null | undefined 
  superficie?: number | null | undefined
	centimetros?: number | null | undefined
	valor?: number | null | undefined
  ajuste?: number | null | undefined
  createdAt: Date
	workId: string
  work: WorkDAO
  terminacionId: string
  terminacion: TerminacionDAO
  manoDeObraId: string
  manoDeObra: ManoDeObraDAO
}

export const itemSchema = z.object({
  type: z.nativeEnum(ItemType),
  quantity: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  description: z.string().optional(),
  largo: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  ancho: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  centimetros: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	workId: z.string().min(1, "workId is required."),
})

export type ItemFormValues = z.infer<typeof itemSchema>


export const terminationSchema = z.object({
  terminationId: z.string().min(1, "Debes elegir una terminación."),
  quantity: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  ajuste: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  workId: z.string().min(1, "workId is required."),
  centimetros: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  length: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  width: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
})

export type TerminationFormValues = z.infer<typeof terminationSchema>

export const manoDeObraItemSchema = z.object({
  manoDeObraId: z.string().min(1, "Debes elegir una mano de obra."),
  quantity: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  ajuste: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  workId: z.string().min(1, "workId is required."),
})

export type ManoDeObraItemFormValues = z.infer<typeof manoDeObraItemSchema>

export const ajusteSchema = z.object({
  value: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }),
  description: z.string().optional(),
  workId: z.string().min(1, "workId is required."),
})

export type AjusteFormValues = z.infer<typeof ajusteSchema>


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
  const quantity= data.quantity ? Number(data.quantity) : 1
  const largo = data.largo ? Number(data.largo) : 0
  const ancho = data.ancho ? Number(data.ancho) : 0
  const centimetros = data.centimetros ? Number(data.centimetros) : 0
  const superficie = largo * ancho / 10000
  const work= await getFullWorkDAO(data.workId)
  if (!work) throw new Error("Work not found")

  const orden= work.items.length
  const color= work.color
  const client= work.cotization.client
  const clientType= client.type
  // @ts-ignore
  const areaValue= calculateAreaValue(clientType, superficie, color)
  const valor= areaValue
  const created = await prisma.item.create({
    data: {
      ...data,
      quantity,
      largo,
      ancho,
      centimetros,
      superficie,
      valor,
      orden,
    }
  })
  return created
}

export async function updateItem(id: string, data: ItemFormValues) {
  const quantity= data.quantity ? Number(data.quantity) : 1
  const largo = data.largo ? Number(data.largo) : 0
  const ancho = data.ancho ? Number(data.ancho) : 0
  const superficie = largo * ancho / 10000
  const centimetros = data.centimetros ? Number(data.centimetros) : 0
  const work= await getFullWorkDAO(data.workId)
  if (!work) throw new Error("Work not found")
  const color= work.color
  const client= work.cotization.client
  const clientType= client.type
  // @ts-ignore
  const valor= calculateAreaValue(clientType, superficie, color)
  const updated = await prisma.item.update({
    where: {
      id
    },
    data: {
      ...data,
      quantity,
      largo,
      ancho,
      superficie,
      centimetros,
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
      manoDeObra: true,
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
      manoDeObra: true,
		}
  })
  return found
}

export async function upsertBatchAreaItem(workId: string, areaItems: AreaItem[]): Promise<boolean> {
  for (let i = 0; i < areaItems.length; i++) {
    const dataItem: ItemFormValues = {
      workId,
      type: areaItems[i].type,
      largo: areaItems[i].length?.toString(),
      ancho: areaItems[i].width?.toString(),
      quantity: areaItems[i].quantity?.toString(),
    }
    await upsertAreaItem(areaItems[i].id, dataItem)
  }  

  return true
}

export async function upsertBatchTerminationItem(workId: string, items: TerminationItem[]): Promise<boolean> {
  for (let i = 0; i < items.length; i++) {
    const dataItem: TerminationFormValues = {
      workId,
      terminationId: items[i].terminationId!,
      quantity: items[i].quantity?.toString(),
      length: items[i].length?.toString(),
      width: items[i].width?.toString(),
      centimetros: (items[i].centimeters || 0).toString(),
      ajuste: items[i].ajuste?.toString(),
    }
    await upsertTerminationItem(items[i].id, dataItem)
  }  

  return true
}

export async function upsertTerminationItem(id: string | undefined, data: TerminationFormValues) {
  if (id) {
    await updateTerminationItem(id, data)
  } else {
    await createTerminationItem(data)
  }   
}

export async function upsertAreaItem(id: string | undefined, data: ItemFormValues) {
  if (id) {
    await updateItem(id, data)
  } else {
    await createItem(data)
  }   
}

export async function upsertBatchManoDeObraItem(workId: string, items: ManoDeObraItem[]): Promise<boolean> {
  for (let i = 0; i < items.length; i++) {
    const dataItem: ManoDeObraItemFormValues = {
      workId,
      manoDeObraId: items[i].manoDeObraId!,
      quantity: items[i].quantity?.toString(),
      ajuste: items[i].ajuste?.toString(),
    }
    await upsertManoDeObraItem(items[i].id, dataItem)
  }  

  return true
}

export async function upsertManoDeObraItem(id: string | undefined, data: ManoDeObraItemFormValues) {
  if (id) {
    await updateManoDeObraItem(id, data)
  } else {
    await createManoDeObraItem(data)
  }
}


export async function createTerminationItem(data: TerminationFormValues) {
  const workId= data.workId
  const termination= await getTerminacionDAO(data.terminationId)
  const work= await getFullWorkDAO(data.workId)
  if (!work) throw new Error("Work not found")
  const client= work.cotization.client
  const clientType= client.type
  const color= work.color
  // @ts-ignore
  const valor= calculateTerminationValue(data, termination, clientType, color)
  const created = await prisma.item.create({
    data: {
      type: ItemType.TERMINACION,
      quantity: data.quantity ? Number(data.quantity) : 0,
      centimetros: data.centimetros ? Number(data.centimetros) : 0,
      largo: data.length ? Number(data.length) : 0,
      ancho: data.width ? Number(data.width) : 0,
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
  const work= await getFullWorkDAO(data.workId)
  if (!work) throw new Error("Work not found")
  const client= work.cotization.client
  const clientType= client.type
  const color= work.color
  // @ts-ignore
  const valor= calculateTerminationValue(data, termination, clientType, color)
  const updated = await prisma.item.update({
    where: {
      id
    },
    data: {
      type: ItemType.TERMINACION,
      quantity: data.quantity ? Number(data.quantity) : 0,
      centimetros: data.centimetros ? Number(data.centimetros) : 0,
      largo: data.length ? Number(data.length) : 0,
      ancho: data.width ? Number(data.width) : 0,
      valor,
      ajuste: data.ajuste ? Number(data.ajuste) : 0,
      workId,
      terminacionId: data.terminationId,
    }
  })
  return updated
}

export async function createManoDeObraItem(data: ManoDeObraItemFormValues) {
  const workId= data.workId
  const manoDeObra= await getManoDeObraDAO(data.manoDeObraId)
  const type= ItemType.MANO_DE_OBRA
  const quantity= data.quantity ? Number(data.quantity) : 1
  let total= manoDeObra.price
  if (data.ajuste) {
    total += Number(data.ajuste)
  }
  const valor= total
  const created = await prisma.item.create({
    data: {
      type,
      quantity,
      valor,
      ajuste: data.ajuste ? Number(data.ajuste) : 0,
      workId,
      manoDeObraId: data.manoDeObraId,
    }
  })
  return created
}

export async function updateManoDeObraItem(id: string, data: ManoDeObraItemFormValues){
  const workId= data.workId
  const manoDeObra= await getManoDeObraDAO(data.manoDeObraId)
  const type= ItemType.MANO_DE_OBRA
  const quantity= data.quantity ? Number(data.quantity) : 1
  let total= manoDeObra.price
  if (data.ajuste) {
    total += Number(data.ajuste)
  }
  const valor= total
  const updated = await prisma.item.update({
    where: {
      id
    },
    data: {
      type,
      quantity,
      valor,
      ajuste: data.ajuste ? Number(data.ajuste) : 0,
      workId,
      manoDeObraId: data.manoDeObraId,
    }
  })
  return updated
}

export async function createAjusteItem(data: AjusteFormValues) {
  const workId= data.workId
  const type= ItemType.AJUSTE
  const valor= Number(data.value)
  const description= data.description
  const created = await prisma.item.create({
    data: {
      type,
      valor,
      description,
      workId,
    }
  })
  return created
}

export async function updateAjusteItem(id: string, data: AjusteFormValues){
  const workId= data.workId
  const type= ItemType.AJUSTE
  const valor= Number(data.value)
  const description= data.description
  const updated = await prisma.item.update({
    where: {
      id
    },
    data: {
      type,
      valor,
      description,
      workId,
    }
  })
  return updated
}

function calculateAreaValue(clientType: ClientType, superficie: number, color: ColorDAO): number {

  switch (clientType) {
    case ClientType.CLIENTE_FINAL:
      return superficie * color.clienteFinalPrice
    case ClientType.ARQUITECTO_ESTUDIO:
      return superficie * color.arquitectoStudioPrice
    case ClientType.DISTRIBUIDOR:
      return superficie * color.distribuidorPrice
  }
}

function calculateTerminationValue(item: TerminationFormValues, termination: TerminacionDAO, clientType: ClientType, color: ColorDAO): number {
  let valorLineal= 0
  let valorArea= 0
  let valorAjuste= item.ajuste ? Number(item.ajuste) : 0

  // calular valor lineal en función de la terminación y los centímetros
  const metros= item.centimetros ? Number(item.centimetros) / 100 : 0
  switch (clientType) {
    case ClientType.CLIENTE_FINAL:
      valorLineal = termination.clienteFinalPrice * metros
      break
    case ClientType.ARQUITECTO_ESTUDIO:
      valorLineal = termination.arquitectoStudioPrice * metros
      break
    case ClientType.DISTRIBUIDOR:
      valorLineal = termination.distribuidorPrice * metros
      break
  }

  // calcular valor de la superficie en función de la superficie (largo x ancho) y el color
  const largo= item.width ? Number(item.width) : 0
  const ancho= item.length ? Number(item.length) : 0
  const superficie= largo * ancho / 10000 
  valorArea = calculateAreaValue(clientType, superficie, color)

  const valorTotal= valorLineal + valorArea + valorAjuste
  return valorTotal
}

function calculateManoDeObraValue(type: ItemType, clientType: ClientType, quantity: number, manoDeObra: ManoDeObraDAO): number {
  let valor= 0
  if (type === ItemType.MANO_DE_OBRA) {
    valor = quantity * manoDeObra.price
  }
  return valor
}