import * as z from "zod"
import { prisma } from "@/lib/db"
import { CotizationDAO } from "./cotization-services"

export type CotizationNoteDAO = {
	id: string
	order: number
	text: string
	createdAt: Date
	updatedAt: Date
	cotizationId: string | null 
}

export const cotizationNoteSchema = z.object({
	order: z.number({required_error: "order is required."}),
	text: z.string().min(1, "text is required."),
	cotizationId: z.string().optional(),
})

export type CotizationNoteFormValues = z.infer<typeof cotizationNoteSchema>


export async function getCotizationNotesDAO() {
  const found = await prisma.cotizationNote.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as CotizationNoteDAO[]
}

export async function getCotizationNoteDAO(id: string) {
  const found = await prisma.cotizationNote.findUnique({
    where: {
      id
    },
  })
  return found as CotizationNoteDAO
}
    
export async function createCotizationNote(data: CotizationNoteFormValues) {
  const cotizationId = data.cotizationId || null
  let notesCount = 0
  notesCount = await prisma.cotizationNote.count({
    where: {
      cotizationId,
    },
  })
  data.order = notesCount + 1
  const created = await prisma.cotizationNote.create({
    data
  })
  return created
}

export async function updateCotizationNote(id: string, data: CotizationNoteFormValues) {
  const updated = await prisma.cotizationNote.update({
    where: {
      id
    },
    data: {
      text: data.text,
    },
  })
  return updated
}

export async function deleteCotizationNote(id: string) {
  const deleted = await prisma.cotizationNote.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullCotizationNotesDAO(cotizationId: string | null) {
  const found = await prisma.cotizationNote.findMany({
    where: {
      cotizationId,
    },
    orderBy: {
      order: 'asc'
    },
    include: {
			cotization: true,
		}
  })
  return found as CotizationNoteDAO[]
}
  
export async function getFullCotizationNoteDAO(id: string) {
  const found = await prisma.cotizationNote.findUnique({
    where: {
      id
    },
    include: {
			cotization: true,
		}
  })
  return found as CotizationNoteDAO
}
    

export async function updateOrder(notes: CotizationNoteDAO[]) {
  console.log("ordering notes")
  
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]
    await prisma.cotizationNote.update({
      where: {
        id: note.id,
      },
      data: {
        order: i,
      },
    })
  }
}

export async function copyOriginalNotes(cotizationId: string) {
  // there is some cotization notes that are the originals and they have no cotizationId
  // this function creates new cotization notes with the same text and order
  const cotization = await prisma.cotization.findUnique({
    where: {
      id: cotizationId,
    },
  })
  if (!cotization) {
    throw new Error("Cotization not found")
  }
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