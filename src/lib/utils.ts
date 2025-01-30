import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from "./auth"
import { format, isThisWeek, isToday, isYesterday, parseISO } from "date-fns"
import { format as formatTZ, fromZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale"
import { ItemDAO } from "@/services/item-services"
import { CotizationType, ItemType } from "@prisma/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getCurrentUser() {
  const session = await auth()

  return session?.user
}

export async function getCurrentRole() {
  const session = await auth()

  return session?.user?.role
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase() // Convertir a minúsculas
    .normalize('NFD') // Descomponer los acentos y diacríticos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar los diacríticos
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/[^\w\-]+/g, '') // Eliminar todos los caracteres que no sean palabras o guiones
    .replace(/\-\-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .trim(); // Eliminar espacios al inicio y al final
}

export function completeWithZeros(number: number): string {
  return number.toString().padStart(6, "0")
}

export function formatWhatsAppStyle(date: Date | string): string {
  let parsedDate = typeof date === 'string' ? parseISO(date) : date;

  // todo timezone
  
  if (isToday(parsedDate)) {
    return "hoy"
//    return format(parsedDate, 'HH:mm')
  } else if (isYesterday(parsedDate)) {
    return 'Ayer'
  } else if (isThisWeek(parsedDate)) {
    return format(parsedDate, 'eeee', { locale: es })
  } else {
    return format(parsedDate, 'dd/MM/yyyy')
  }
}

// m²`

export function getItemDescription(item: ItemDAO): string {
  const superficie= getSuperficie(item)
  switch (item.type) {
    case ItemType.TRAMO:
      return `${item.quantity > 1 ? item.quantity + " Tramos" : "Tramo"} ${item.largo}x${item.ancho} cm, ${superficie}m²`
    case ItemType.ZOCALO:
      return `${item.quantity > 1 ? item.quantity + " Zócalos" : "Zócalo"} ${item.largo}x${item.ancho} cm, ${superficie}m²`
    case ItemType.ALZADA:
      return `${item.quantity > 1 ? item.quantity + " Alzadas" : "Alzada"} ${item.largo}x${item.ancho} cm, ${superficie}m²`
    case ItemType.TERMINACION:
      return `${item.quantity > 1 ? item.quantity + " Terminaciones" : "Terminación"} ${item.terminacion && item.terminacion.name} (${(item.centimetros || 0)/100}ml${superficie ? " + " + superficie + "m²" : ""}) ${item.ajuste ? ` + ${formatCurrency(item.ajuste)}` : ""}`    
    case ItemType.MANO_DE_OBRA:
      return `${item.quantity > 1 ? item.quantity + " MO" : "MO"}: ${item.manoDeObra && item.manoDeObra.name} ${superficie ? "(" + superficie + "m²)" : ""} ${item.ajuste ? ` + ${formatCurrency(item.ajuste)}` : ""}`
    case ItemType.AJUSTE:
      return `Ajuste: ${item.description}`
    case ItemType.COLOCACION:
      return `Colocación: ${item.description}`
    default:
      return `Trabajo ${item.work.name} de ${item.work.material.name} con ${item.work.color.name}`
  }
}

export function getSuperficie(item: ItemDAO): number {
  const largo= item.largo ? Number(item.largo) : 0
  const ancho= item.ancho ? Number(item.ancho) : 0
  const superficie= largo * ancho / 10000 
  return superficie
}

export function getShortItemDescription(item: ItemDAO): string {
  const superficie= getSuperficie(item)
  switch (item.type) {
    case ItemType.TRAMO:
      return `${item.quantity > 1 ? item.quantity + " Tramos" : "Tramo"} ${item.largo}x${item.ancho} cm`
    case ItemType.ZOCALO:
      return `${item.quantity > 1 ? item.quantity + " Zócalos" : "Zócalo"} ${item.largo}x${item.ancho} cm`
    case ItemType.ALZADA:
      return `${item.quantity > 1 ? item.quantity + " Alzadas" : "Alzada"} ${item.largo}x${item.ancho} cm`
    case ItemType.TERMINACION:
      return `${item.quantity > 1 ? item.quantity : ""} ${item.terminacion && item.terminacion.name}  ${item.ajuste ? ` + ${formatCurrency(item.ajuste)}` : ""}` 
    case ItemType.MANO_DE_OBRA:
      return `${item.quantity > 1 ? item.quantity : ""} ${item.manoDeObra && item.manoDeObra.name} ${superficie && item.manoDeObra.isSurface ? "(" + superficie + "m²)" : ""} ${item.ajuste ? ` + ${formatCurrency(item.ajuste)}` : ""}`  
    case ItemType.AJUSTE:
      return `- ${item.description}`
    case ItemType.COLOCACION:
      return `${item.description}`
    default:
      return `Trabajo ${item.work.name} de ${item.work.material.name} con ${item.work.color.name}`
  }
}

export function getShortItemDescriptionWithoutAjust(item: ItemDAO): string {
  const superficie= getSuperficie(item)
  switch (item.type) {
    case ItemType.TRAMO:
      return `${item.quantity > 1 ? item.quantity + " Tramos" : "Tramo"} ${item.largo}x${item.ancho} cm`
    case ItemType.ZOCALO:
      return `${item.quantity > 1 ? item.quantity + " Zócalos" : "Zócalo"} ${item.largo}x${item.ancho} cm`
    case ItemType.ALZADA:
      return `${item.quantity > 1 ? item.quantity + " Alzadas" : "Alzada"} ${item.largo}x${item.ancho} cm`
    case ItemType.TERMINACION:
      return `${item.quantity > 1 ? item.quantity : ""} ${item.terminacion && item.terminacion.name}`
    case ItemType.MANO_DE_OBRA:
      return `${item.quantity > 1 ? item.quantity : ""} ${item.manoDeObra && item.manoDeObra.name} ${superficie && item.manoDeObra.isSurface ? "(" + superficie + "m²)" : ""}`  
    case ItemType.AJUSTE:
      return `- ${item.description}`
    case ItemType.COLOCACION:
      return `${item.description}`
    default:
      return `Trabajo ${item.work.name} de ${item.work.material.name} con ${item.work.color.name}`
  }
}

export function formatCurrency(value: number, decimals = 2): string {
  return Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)
}


export function getItemLabel(itemType: string) {
  switch (itemType) {
      case "TRAMO":
          return "Tramo"
      case "ZOCALO":
          return "Zócalo"
      case "ALZADA":
          return "Alzada"
      case "TERMINACION":
          return "Terminación"
      case "REGRUESO":
          return "Regreso"
      case "MANO_DE_OBRA":
          return "Mano de obra"
      case "AJUSTE":
          return "Ajuste"
      default:
          return "Item"
  }
}

export function getPluralItemLabel(itemType: string) {
  switch (itemType) {
      case "TRAMO":
          return "Tramos"
      case "ZOCALO":
          return "Zócalos"
      case "ALZADA":
          return "Alzadas"
      case "TERMINACION":
          return "Terminaciones"
      case "REGRUESO":
          return "Regresos"
      case "MANO_DE_OBRA":
          return "Manos de obra"
      case "AJUSTE":
          return "Ajustes"
      default:
          return "Items"
  }
}

export function getCotizationTypeLabel(type: CotizationType | string) {
  switch (type) {
    case CotizationType.TOP_HOME:
      return "Casas Grandes"
    case CotizationType.COMUN:
      return "Común"
    case CotizationType.DISTRIBUIDOR:
      return "Distribuidor"
    case CotizationType.EDIFICIO:
      return "Edificio"
    default:
      return "Otro"
  }
}

export function getDatesFromSearchParams(searchParams: { from: string, to: string, last: string }) {
  let from= null
  let to= null
  const last= searchParams.last
  const today= new Date()
  if (last === "HOY") {
      from= new Date(today.getFullYear(), today.getMonth(), today.getDate())
      to= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  } else if (last === "7D") {
      from= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7)
      to= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  } else if (last === "30D") {
      from= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 30)
      to= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  } else if (last === "LAST_MONTH") {
      from= new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      console.log("from: ", from)
      // the day should be the last day of the previous month
      const firstDayOfCurrentMonth= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      // substract one day to get the last day of the previous month
      const lastDayOfPreviousMonth= new Date(firstDayOfCurrentMonth.getTime() - 24 * 60 * 60 * 1000)
      to= new Date(new Date().getFullYear(), new Date().getMonth() - 1, lastDayOfPreviousMonth.getDate())
      console.log("to: ", to)
  } else if (last === "ALL") {
      from= null
      to= null
  } else {
      from= searchParams.from ? new Date(searchParams.from) : null
      to= searchParams.to ? new Date(searchParams.to) : null
  }

  from= from ? fromZonedTime(from, "America/Montevideo") : null
  to= to ? fromZonedTime(to, "America/Montevideo") : null

  return { from, to }
}
