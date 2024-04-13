import * as z from "zod"
import { prisma } from "@/lib/db"
import { WorkDAO, getFullWorkDAO, getWorkDAO } from "./work-services"
import { ClientType, ItemType } from "@prisma/client"
import { ColorDAO } from "./color-services"

export type ItemDAO = {
	id: string
	type: ItemType
	orden?: number
	largo?: number
	ancho?: number
  superficie?: number
	metros?: number
	valor?: number
  createdAt: Date
	work: WorkDAO
	workId: string
}

export const itemSchema = z.object({
  type: z.nativeEnum(ItemType),
  largo: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  ancho: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
  metros: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	workId: z.string().min(1, "workId is required."),
})

export type ItemFormValues = z.infer<typeof itemSchema>


export async function getItemsDAO() {
  const found = await prisma.item.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ItemDAO[]
}

export async function getItemDAO(id: string) {
  const found = await prisma.item.findUnique({
    where: {
      id
    },
  })
  return found as ItemDAO
}
    
export async function createItem(data: ItemFormValues) {
  const largo = data.largo ? Number(data.largo) : 0
  const ancho = data.ancho ? Number(data.ancho) : 0
  const metros = data.metros ? Number(data.metros) : 0
  const superficie = largo * ancho / 10000
  const type = data.type
  const work= await getFullWorkDAO(data.workId)
  const orden= work.items.length
  const color= work.color
  const client= work.cotization.client
  const clientType= client.type
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
  const color= work.color
  const client= work.cotization.client
  const clientType= client.type
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
        }
      }
		}
  })
  return found as ItemDAO[]
}
  
export async function getFullItemDAO(id: string) {
  const found = await prisma.item.findUnique({
    where: {
      id
    },
    include: {
			work: true,
		}
  })
  return found as ItemDAO
}
    