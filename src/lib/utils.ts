import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from "./auth"
import { format, isThisWeek, isToday, isYesterday, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ItemDAO } from "@/services/item-services"
import { ItemType } from "@prisma/client"

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
  return number.toString().padStart(5, "0")
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
      return `${item.quantity > 1 ? item.quantity : ""} ${item.terminacion && item.terminacion.name} ${superficie ? "(+" + superficie + "m²)" : ""} ${item.ajuste ? ` + ${formatCurrency(item.ajuste)}` : ""}` 
    case ItemType.MANO_DE_OBRA:
      return `${item.quantity > 1 ? item.quantity : ""} ${item.manoDeObra && item.manoDeObra.name} ${superficie ? "(" + superficie + "m²)" : ""} ${item.ajuste ? ` + ${formatCurrency(item.ajuste)}` : ""}`  
    case ItemType.AJUSTE:
      return `- ${item.description}`
    case ItemType.COLOCACION:
      return `${item.description}`
    default:
      return `Trabajo ${item.work.name} de ${item.work.material.name} con ${item.work.color.name}`
  }
}

export function formatCurrency(value: number): string {
  return Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(value)  
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