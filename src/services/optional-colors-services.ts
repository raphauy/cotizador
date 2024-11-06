import { prisma } from "@/lib/db"
import { ClientType, ItemType } from "@prisma/client"
import { ColorDAO, getColorsDAO } from "./color-services"
import { ManoDeObraItemFormValues, calculateManoDeObraValue } from "./item-services"
import { ManoDeObraDAO } from "./manodeobra-services"
import { WorkDAO, getFullWorkDAO } from "./work-services"

export type OptionalColorsTotalResult = {
  colorId: string
  materialName: string
  colorName: string
  colorPrice: number
  totalValue: number
}


   
export async function getOptionalColorsDAO(workId: string): Promise<ColorDAO[]> {
  const found = await prisma.work.findUnique({
    where: {
      id: workId
    },
    include: {
      optionalColors: true,
    }
  })
  const optionalColors= found?.optionalColors || []

  return optionalColors as ColorDAO[]
}

export async function getComplementaryOptionalColorsDAO(workId: string): Promise<ColorDAO[]> {
  const optionalColors= await getOptionalColorsDAO(workId)
  const allColors= await getColorsDAO()

  const complementaryColors= allColors.filter((c) => !optionalColors.find((o) => o.id === c.id))

  return complementaryColors as ColorDAO[]
}

export async function setOptionalColors(workId: string, colors: ColorDAO[]) {
  const work= await getFullWorkDAO(workId)
  if (!work) throw new Error("No existe el trabajo")

  // remove all optional colors
  await prisma.work.update({
    where: {
      id: workId
    },
    data: {
      optionalColors: {
        set: []
      }
    }
  })

  // add new optional colors connecting with ids
  await prisma.work.update({
    where: {
      id: workId
    },
    data: {
      optionalColors: {
        connect: colors.map((c) => ({id: c.id}))
      }
    }
  })
}

export async function calculateTotalWorkValue(workId: string, colors: ColorDAO[]): Promise<OptionalColorsTotalResult[]> {

  const work= await getFullWorkDAO(workId)
  if (!work) throw new Error("No existe el trabajo")
  
  const clientType= work.cotization.client.type

  // iterate over all colors, get the total value and return the results
  const results= await Promise.all(colors.map(async (color) => {
    let colorPrice= 0
    switch (clientType) {
      case ClientType.CLIENTE_FINAL:
        colorPrice= color.clienteFinalPrice
        break
      case ClientType.ARQUITECTO_ESTUDIO:
        colorPrice= color.arquitectoStudioPrice
        break
      case ClientType.DISTRIBUIDOR:
        colorPrice= color.distribuidorPrice
        break
    }
  
    const totalValue= await calculateTotalWorkValueForColor(work, colorPrice)

    const res= {
      colorId: color.id,
      materialName: color.material.name,
      colorName: color.name,
      colorPrice,
      totalValue
    }
    return res
  }))

  return results
}

async function calculateTotalWorkValueForColor(work: WorkDAO, colorPrice: number) {

  let totalValue= 0

  const totalAreaValue= await calculateAreaValues(work, colorPrice)
  const totalTerminationValue= await calculateTerminationValues(work)
  const totalManoDeObraValue= await calculateManoDeObraValues(work)
  const totalAjusteValue= await calculateAjusteValues(work)
  //const totalColocacionValue= await calculateColocacionValues(work)

  totalValue+= totalAreaValue
  totalValue+= totalTerminationValue
  totalValue+= totalManoDeObraValue
  totalValue+= totalAjusteValue
  //totalValue+= totalColocacionValue

  return totalValue
}


async function calculateAreaValues(work: WorkDAO, colorPrice: number): Promise<number> {

  const items= work.items.filter((item) => item.type === ItemType.TRAMO || item.type === ItemType.ZOCALO || item.type === ItemType.ALZADA || item.type === ItemType.TERMINACION)

  let totalValue= 0
  for (let i = 0; i < items.length; i++) {
    const largo= items[i].largo || 0
    const ancho= items[i].ancho || 0
    const quantity= items[i].quantity
    const value= largo * ancho / 10000 * quantity * colorPrice
    totalValue+= value
  }
  return totalValue
}

async function calculateTerminationValues(work: WorkDAO): Promise<number> {

  const items= work.items.filter((item) => item.type === ItemType.TERMINACION)

  let totalValue= 0
  for (let i = 0; i < items.length; i++) {
    const termination= items[i].terminacion
    let valorLineal= 0
    let valorAjuste= items[i].ajuste ? Number(items[i].ajuste) * items[i].quantity : 0
  
    // calular valor lineal en función de la terminación y los centímetros
    const metros= items[i].centimetros ? Number(items[i].centimetros) / 100 : 0
    valorLineal = termination.price * metros * items[i].quantity
  
    totalValue+= valorLineal + valorAjuste
  }
  
  return totalValue
}


async function calculateManoDeObraValues(work: WorkDAO): Promise<number> {

  const items= work.items.filter((item) => item.type === ItemType.MANO_DE_OBRA)

  const clientType= work.cotization.client.type

  let totalValue= 0
  for (let i = 0; i < items.length; i++) {
    const manoDeObra= items[i].manoDeObra as ManoDeObraDAO
    const itemFormValue: ManoDeObraItemFormValues = {
      workId: work.id,
      manoDeObraId: manoDeObra.id,
      quantity: items[i].quantity.toString(),
      ajuste: items[i].ajuste?.toString(),
      centimetros: items[i].centimetros?.toString(),
      length: items[i].largo?.toString(),
      width: items[i].ancho?.toString(),
    }
    const itemValue= calculateManoDeObraValue(itemFormValue, manoDeObra, clientType) * items[i].quantity
    
    totalValue+= itemValue
  }

  return totalValue
}

async function calculateAjusteValues(work: WorkDAO): Promise<number> {
  const items= work.items.filter((item) => item.type === ItemType.AJUSTE)

  let totalValue= 0
  for (let i = 0; i < items.length; i++) {
    const ajusteValue= items[i].ajuste ? Number(items[i].ajuste) : 0
    
    totalValue+= ajusteValue
  }

  return totalValue
}

async function calculateColocacionValues(work: WorkDAO): Promise<number> {
  const items= work.items.filter((item) => item.type === ItemType.COLOCACION)

  let totalValue= 0
  for (let i = 0; i < items.length; i++) {
    const colocacionValue= items[i].valor?? 0
    
    totalValue+= colocacionValue
  }

  return totalValue
}