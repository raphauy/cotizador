import * as z from "zod"
import { prisma } from "@/lib/db"

export type NoteDAO = {
	id: string
	text: string
	private: boolean
	createdAt: Date
	updatedAt: Date
	userId: string
	workId: string
}

export const noteSchema = z.object({
	text: z.string().min(1, "text is required."),
  private: z.boolean(),
	
	userId: z.string().min(1, "userId is required."),
	workId: z.string().min(1, "cotizationId is required."),
})

export type NoteFormValues = z.infer<typeof noteSchema>


export async function getNotesDAO() {
  const found = await prisma.note.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as NoteDAO[]
}

export async function getNoteDAO(id: string) {
  const found = await prisma.note.findUnique({
    where: {
      id
    },
  })
  return found as NoteDAO
}
    
export async function createNote(data: NoteFormValues) {
  // TODO: implement createNote
  const created = await prisma.note.create({
    data
  })
  return created
}

export async function updateNote(id: string, data: NoteFormValues) {
  const updated = await prisma.note.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteNote(id: string) {
  const deleted = await prisma.note.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullNotesDAO() {
  const found = await prisma.note.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
		}
  })
  return found as NoteDAO[]
}
  
export async function getFullNoteDAO(id: string) {
  const found = await prisma.note.findUnique({
    where: {
      id
    },
    include: {
		}
  })
  return found as NoteDAO
}
    