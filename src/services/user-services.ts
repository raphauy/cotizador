import * as z from "zod"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"

export type UserDAO = {
	id: string
	name: string
	email: string
	emailVerified: Date | undefined
	image: string | undefined
	role: UserRole
	createdAt: Date
	updatedAt: Date
}

export const userSchema = z.object({
	name: z.string().min(1, "nombre es obligatorio."),
	email: z.string({required_error: "email es obligatorio."}).email("email es obligatorio."),
  role: z.nativeEnum(UserRole),
	image: z.string().optional(),
})

export type UserFormValues = z.infer<typeof userSchema>


export async function getUsersDAO() {
  const found = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as UserDAO[]
}

export async function getUserDAO(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
  })
  return found as UserDAO
}
    
export async function createUser(data: UserFormValues) {
  const created = await prisma.user.create({
    data
  })
  return created
}

export async function updateUser(id: string, data: UserFormValues) {
  const updated = await prisma.user.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteUser(id: string) {
  const deleted = await prisma.user.delete({
    where: {
      id
    },
  })
  return deleted
}


export async function getFullUsersDAO() {
  const found = await prisma.user.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      notes: true,
		}
  })


  return found as UserDAO[]
}
  
export async function getFullUserDAO(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      notes: true,
    }
  })
  return found as UserDAO
}

export async function userCanBeDeleted(id: string) {
  const found = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      notes: true,
      createdCotizations: true,
      sellerCotizations: true,
    }
  })

  if (!found)
    throw new Error("No se encontro el usuario")
  
  if (found.createdCotizations.length > 0)
    throw new Error("No se puede eliminar el usuario porque tiene presupuestos creados por él") 
  
  if (found.sellerCotizations.length > 0)
    throw new Error("No se puede eliminar el usuario porque tiene presupuestos asociados. Para eliminarlo primero debes cambiar el cotizador de sus presupuestos")

  if (found.notes.length > 0)
    throw new Error("No se puede eliminar el usuario porque tiene notas asociadas")

  return true
}
