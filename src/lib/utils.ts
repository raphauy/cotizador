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

  if (isToday(parsedDate)) {
    return format(parsedDate, 'HH:mm');
  } else if (isYesterday(parsedDate)) {
    return 'Ayer';
  } else if (isThisWeek(parsedDate)) {
    return format(parsedDate, 'eeee', { locale: es });
  } else {
    return format(parsedDate, 'dd/MM/yyyy');
  }
}

// m²`

export function getItemDescription(item: ItemDAO): string {
  const surface = item.largo && item.ancho ? item.largo * item.ancho / 10000 : 0
  switch (item.type) {
    case ItemType.TRAMO:
      return `Tramo ${item.largo}x${item.ancho} cm, ${surface}m²`
    case ItemType.ZOCALO:
      return `Zocalo ${item.largo}x${item.ancho} cm, ${surface}m²`
    case ItemType.ALZADA:
      return `Alzada ${item.largo}x${item.ancho} cm, ${surface}m²`
    case ItemType.TERMINACION:
      return `Terminación (no implementado)`
    case ItemType.REGRUESO:
      return `Regrueso (no implementado)`
    case ItemType.MANO_DE_OBRA:
      return `Mano de obra (no implementado)`
    case ItemType.AJUSTE:
      return `Ajuste (no implementado)`
    default:
      return `Trabajo ${item.work.name} de ${item.work.material.name} con ${item.work.color.name}`
  }
}

export function getShortItemDescription(item: ItemDAO): string {
  switch (item.type) {
    case ItemType.TRAMO:
      return `Tramo ${item.largo}x${item.ancho} cm`
    case ItemType.ZOCALO:
      return `Zocalo ${item.largo}x${item.ancho} cm`
    case ItemType.ALZADA:
      return `Alzada ${item.largo}x${item.ancho} cm`
    case ItemType.TERMINACION:
      return `Terminación (no implementado)`
    case ItemType.REGRUESO:
      return `Regrueso (no implementado)`
    case ItemType.MANO_DE_OBRA:
      return `Mano de obra (no implementado)`
    case ItemType.AJUSTE:
      return `Ajuste (no implementado)`
    default:
      return `Trabajo ${item.work.name} de ${item.work.material.name} con ${item.work.color.name}`
  }
}