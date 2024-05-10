import * as z from "zod"
import { prisma } from "@/lib/db"
import { FullWorkDAO, WorkDAO, getFullWorkDAO, getWorkDAO } from "./work-services"
import { ClientType, ItemType } from "@prisma/client"
import { ColorDAO } from "./color-services"
import { TerminacionDAO, getTerminacionDAO } from "./terminacion-services"
import { ManoDeObraDAO, ManoDeObraFormValues, getManoDeObraDAO } from "./manodeobra-services"
import { AjusteItem, AreaItem, ManoDeObraItem, TerminationItem } from "@/app/seller/cotizations/[cotizationId]/[workId]/page"
import { WorkTypeDAO } from "./worktype-services"
import { formatCurrency } from "@/lib/utils"
import { MaterialDAO } from "./material-services"
import { CotizationDAO } from "./cotization-services"
import { ColocacionDAO, getColocacionDAO } from "./colocacion-services"

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
  valorAreaTerminacion?: number | null | undefined
  ajuste?: number | null | undefined
  createdAt: Date
	workId: string
  work: WorkDAO
  terminacionId: string
  terminacion: TerminacionDAO
  manoDeObraId: string
  manoDeObra: ManoDeObraDAO
  colocacionId: string
  colocacion: ColocacionDAO
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
  description: z.string().optional(),
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
  centimetros: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  length: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  width: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
})

export type ManoDeObraItemFormValues = z.infer<typeof manoDeObraItemSchema>

export const ajusteSchema = z.object({
  value: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }),
  description: z.string().optional(),
  workId: z.string().min(1, "workId is required."),
})

export type AjusteFormValues = z.infer<typeof ajusteSchema>

export const colocacionSchema = z.object({
  workId: z.string().min(1, "workId is required."),
  colocacionId: z.string().min(1, "colocacionId is required."),
  type: z.nativeEnum(ItemType).refine((val) => val === ItemType.COLOCACION),
  valor: z.number(),
  description: z.string().optional(),
})

export type ColocacionFormValues = z.infer<typeof colocacionSchema>


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

export async function updateItem(id: string, data: ItemFormValues, work: WorkDAO) {
  const quantity= data.quantity ? Number(data.quantity) : 1
  const largo = data.largo ? Number(data.largo) : 0
  const ancho = data.ancho ? Number(data.ancho) : 0
  const superficie = largo * ancho / 10000
  const centimetros = data.centimetros ? Number(data.centimetros) : 0
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
      description: data.description,
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
      colocacion: true,
		}
  })
  return found
}

export async function upsertBatchAreaItem(workId: string, areaItems: AreaItem[]): Promise<boolean> {
  const work= await getFullWorkDAO(workId)
  if (!work) throw new Error("Work not found")

  for (let i = 0; i < areaItems.length; i++) {
    const dataItem: ItemFormValues = {
      workId,
      type: areaItems[i].type,
      largo: areaItems[i].length?.toString(),
      ancho: areaItems[i].width?.toString(),
      quantity: areaItems[i].quantity?.toString(),
    }
    await upsertAreaItem(areaItems[i].id, dataItem, work as FullWorkDAO)
  }  

  return true
}

export async function upsertBatchTerminationItem(workId: string, items: TerminationItem[]): Promise<boolean> {
  const work= await getFullWorkDAO(workId)
  if (!work) throw new Error("Work not found")

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
    await upsertTerminationItem(items[i].id, dataItem, work as FullWorkDAO)
  }  

  return true
}

export async function upsertTerminationItem(id: string | undefined, data: TerminationFormValues, work: FullWorkDAO) {
  if (id) {
    await updateTerminationItem(id, data, work)
  } else {
    await createTerminationItem(data)
  }   
}

export async function upsertAreaItem(id: string | undefined, data: ItemFormValues, work: FullWorkDAO) {
  if (id) {
    await updateItem(id, data, work)
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
      centimetros: items[i].centimeters?.toString(),
      length: items[i].length?.toString(),
      width: items[i].width?.toString(),
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

export async function createManoDeObraItem(data: ManoDeObraItemFormValues) {
  const workId= data.workId
  const manoDeObra= await getManoDeObraDAO(data.manoDeObraId)
  const type= ItemType.MANO_DE_OBRA
  const quantity= data.quantity ? Number(data.quantity) : 1
  const work= await getFullWorkDAO(data.workId)
  if (!work) throw new Error("Work not found")
  const client= work.cotization.client
  const clientType= client.type
  const valor= calculateManoDeObraValue(data, manoDeObra, clientType)
  const created = await prisma.item.create({
    data: {
      type,
      quantity,
      valor,
      ajuste: data.ajuste ? Number(data.ajuste) : 0,
      workId,
      manoDeObraId: data.manoDeObraId,
      centimetros: data.centimetros ? Number(data.centimetros) : 0,
      largo: data.length ? Number(data.length) : 0,
      ancho: data.width ? Number(data.width) : 0,
    }
  })
  return created
}


export async function updateManoDeObraItem(id: string, data: ManoDeObraItemFormValues){
  const workId= data.workId  
  const manoDeObra= await getManoDeObraDAO(data.manoDeObraId)
  const type= ItemType.MANO_DE_OBRA
  const quantity= data.quantity ? Number(data.quantity) : 1
  const work= await getFullWorkDAO(data.workId)
  if (!work) throw new Error("Work not found")
  const client= work.cotization.client
  const clientType= client.type
  const valor= calculateManoDeObraValue(data, manoDeObra, clientType)
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
      centimetros: data.centimetros ? Number(data.centimetros) : 0,
      largo: data.length ? Number(data.length) : 0,
      ancho: data.width ? Number(data.width) : 0,
    }
  })
  return updated
}

export async function upsertBatchAjusteItem(workId: string, items: AjusteItem[]): Promise<boolean> {
  for (let i = 0; i < items.length; i++) {
    const dataItem: AjusteFormValues = {
      workId,
      value: items[i].valor + "",
      description: items[i].description,
    }
    await upsertAjusteItem(items[i].id, dataItem)
  }  

  return true
}

async function upsertAjusteItem(id: string | undefined, data: AjusteFormValues) {
  if (id) {
    await updateAjusteItem(id, data)
  } else {
    await createAjusteItem(data)
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
  const valor= calculateTerminationValue(data, termination, clientType, color as ColorDAO)
  const largo= data.length ? Number(data.length) : 0
  const ancho= data.width ? Number(data.width) : 0
  const superficie= largo * ancho / 10000
  const valorAreaTerminacion = calculateAreaValue(clientType, superficie, color as ColorDAO)
  const created = await prisma.item.create({
    data: {
      type: ItemType.TERMINACION,
      quantity: data.quantity ? Number(data.quantity) : 0,
      centimetros: data.centimetros ? Number(data.centimetros) : 0,
      largo: data.length ? Number(data.length) : 0,
      ancho: data.width ? Number(data.width) : 0,
      superficie,
      valor,
      valorAreaTerminacion,
      ajuste: data.ajuste ? Number(data.ajuste) : 0,
      workId,
      terminacionId: data.terminationId,
    }
  })
  return created
}

export async function updateTerminationItem(id: string, data: TerminationFormValues, work: FullWorkDAO) {
  const workId= data.workId
  const termination= await getTerminacionDAO(data.terminationId)
  const client= work.cotization.client
  const clientType= client.type
  const color= work.color
  // @ts-ignore
  const valor= calculateTerminationValue(data, termination, clientType, color)
  const largo= data.length ? Number(data.length) : 0
  const ancho= data.width ? Number(data.width) : 0
  const superficie= largo * ancho / 10000
  const valorAreaTerminacion = calculateAreaValue(clientType, superficie, color)
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
      superficie,
      valor,
      valorAreaTerminacion,
      ajuste: data.ajuste ? Number(data.ajuste) : 0,
      workId,
      terminacionId: data.terminationId,
    }
  })
  return updated
}

function calculateTerminationValue(item: TerminationFormValues, termination: TerminacionDAO, clientType: ClientType, color: ColorDAO): number {
  let valorLineal= 0
  let valorAjuste= item.ajuste ? Number(item.ajuste) : 0

  // calular valor lineal en función de la terminación y los centímetros
  const metros= item.centimetros ? Number(item.centimetros) / 100 : 0
  valorLineal = termination.price * metros

  const valorTotal= valorLineal + valorAjuste
  return valorTotal
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
      ajuste: valor,
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
      ajuste: valor,
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


export function calculateManoDeObraValue(item: ManoDeObraItemFormValues, manoDeObra: ManoDeObraDAO, clientType: ClientType): number {
  let valorUnitario= 0
  let valorLineal= 0
  let valorArea= 0
  let valorAjuste= item.ajuste ? Number(item.ajuste) : 0

  // calular valor lineal en función de la manoDeObra y los centímetros por un lado y el área por la otra
  const metrosLineales= item.centimetros ? Number(item.centimetros) / 100 : 0
  const largo= item.width ? Number(item.width) : 0
  const ancho= item.length ? Number(item.length) : 0
  const superficie= largo * ancho / 10000
  switch (clientType) {
    case ClientType.CLIENTE_FINAL:
      valorUnitario= manoDeObra.clienteFinalPrice
      valorLineal= metrosLineales * manoDeObra.clienteFinalPrice
      valorArea= superficie * manoDeObra.clienteFinalPrice
      break
    case ClientType.ARQUITECTO_ESTUDIO:
      valorUnitario= manoDeObra.arquitectoStudioPrice
      valorLineal= metrosLineales * manoDeObra.arquitectoStudioPrice
      valorArea= superficie * manoDeObra.arquitectoStudioPrice
      break
    case ClientType.DISTRIBUIDOR:
      valorUnitario= manoDeObra.distribuidorPrice
      valorLineal= metrosLineales * manoDeObra.distribuidorPrice
      valorArea= superficie * manoDeObra.distribuidorPrice
      break
  }

  let valorTotal= valorUnitario
  if (valorLineal > 0 || valorArea > 0) {
    valorTotal= valorLineal + valorArea
  }

  valorTotal+= valorAjuste

  return valorTotal
}

export async function updateColocacion(workId: string, colocacionId: string) {
  console.log('updateColocacion')
  
  const work= await getFullWorkDAO(workId)
  if (!work) throw new Error("Work not found")
  const client= work.cotization.client
  const clientType= client.type
  const workType= work.workType

  const items= work.items
  const tramos= items.filter((item) => item.type === ItemType.TRAMO)
  const zocalos= items.filter((item) => item.type === ItemType.ZOCALO)
  const alzados= items.filter((item) => item.type === ItemType.ALZADA)
  const terminaciones= items.filter((item) => item.type === ItemType.TERMINACION)

  const tramosArea= tramos.reduce((acc, item) => acc + (item.largo || 0) * (item.ancho || 0) * item.quantity / 10000, 0)  
  const zocalosArea= zocalos.reduce((acc, item) => acc + (item.largo || 0) * (item.ancho || 0) * item.quantity / 10000, 0)
  const alzadosArea= alzados.reduce((acc, item) => acc + (item.largo || 0) * (item.ancho || 0) * item.quantity / 10000, 0)
  const terminacionesArea= terminaciones.reduce((acc, item) => acc + (item.largo || 0) * (item.ancho || 0) * item.quantity / 10000, 0)  

  const totalArea= tramosArea + zocalosArea + alzadosArea + terminacionesArea

  const colocacion= await getColocacionDAO(colocacionId)
  console.log("pricePerMeter", colocacion?.price)

  const totalPrice= totalArea * colocacion?.price

  let description= ""
  console.log("tramosArea", tramosArea)
  
  if (tramosArea > 0) description+= `Tramos: ${tramosArea.toFixed(2)}m²`
  if (zocalosArea > 0) description+= `, Zócalos: ${zocalosArea.toFixed(2)}m²`
  if (alzadosArea > 0) description+= `, Alzadas: ${alzadosArea.toFixed(2)}m²`
  if (terminacionesArea > 0) description+= `, Terminaciones: ${terminacionesArea.toFixed(2)}m²`
  description+= `\nTotal: ${totalArea.toFixed(2)}m².`

  const colocacionForm: ColocacionFormValues = {
    workId,
    type: ItemType.COLOCACION,
    valor: totalPrice,
    description,
    colocacionId,
  }

  const itemColocacion= items.find((item) => item.type === ItemType.COLOCACION)
  // if exist, update colocacion, if not create
  if (itemColocacion) {
    const updated= await prisma.item.update({
      where: {
        id: itemColocacion.id
      }, 
      data: colocacionForm
    })
    return updated
  } else {
    const created = await prisma.item.create({data: colocacionForm})
    return created
  }
}

export async function recalculateValues(workId: string): Promise<boolean> {
  const work= await getFullWorkDAO(workId)
  if (!work) throw new Error("Work not found")

  const items= work.items

  const areaItems= items.filter((item) => item.type === ItemType.TRAMO || item.type === ItemType.ZOCALO || item.type === ItemType.ALZADA)

  for (let i = 0; i < areaItems.length; i++) {
    const dataItem: ItemFormValues = {
      workId,
      type: areaItems[i].type,
      largo: areaItems[i].largo?.toString(),
      ancho: areaItems[i].ancho?.toString(),
      quantity: areaItems[i].quantity?.toString(),
    }
    await upsertAreaItem(areaItems[i].id, dataItem, work as FullWorkDAO)
  }

  const terminacionesItems= items.filter((item) => item.type === ItemType.TERMINACION)
  for (let i = 0; i < terminacionesItems.length; i++) {
    const dataItem: TerminationFormValues = {
      workId,
      terminationId: terminacionesItems[i].terminacionId!,
      quantity: terminacionesItems[i].quantity?.toString(),
      length: terminacionesItems[i].largo?.toString(),
      width: terminacionesItems[i].ancho?.toString(),
      centimetros: (terminacionesItems[i].centimetros || 0).toString(),
      ajuste: terminacionesItems[i].ajuste?.toString(),
   }
    await upsertTerminationItem(terminacionesItems[i].id, dataItem, work as FullWorkDAO)
  }

  return true
}