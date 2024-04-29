import * as z from "zod"
import { prisma } from "@/lib/db"
import { CotizationDAO } from "./cotization-services"
import { getCotizationsDAO } from "./cotization-services"
import { ClientType } from "@prisma/client"
import { generateSlug } from "@/lib/utils"

export type ClientDAO = {
	id: string
	name: string
	phone: string | undefined
	email: string | undefined
	slug: string
	type: ClientType
	createdAt: Date
	updatedAt: Date
	cotizations: CotizationDAO[]
}

export const clientSchema = z.object({
  name: z.string().min(1, "name is required."),
  phone: z.string().optional(),
  email: z.string().optional().refine((email) => !email || z.string().email().safeParse(email).success, {
    message: "El email no es válido",
  }),
  type: z.nativeEnum(ClientType),
}).superRefine((data, ctx) => {
  if (!data.phone && !data.email) {
    // Agregar el error a 'email' o 'phone', dependiendo de cuál prefieras mostrar el error
    ctx.addIssue({
      path: ['email'], // Asigna el error a 'email' para mantener la consistencia
      message: "Debe proporcionar al menos un teléfono o un email.",
      code: z.ZodIssueCode.custom,
    });
  }
});

export type ClientFormValues = z.infer<typeof clientSchema>


export async function getClientsDAO() {
  const found = await prisma.client.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as ClientDAO[]
}

export async function getClientDAO(id: string) {
  const found = await prisma.client.findUnique({
    where: {
      id
    },
  })
  return found as ClientDAO
}
    
export async function createClient(data: ClientFormValues) {
  const slug= generateSlug(data.name)
  const created = await prisma.client.create({
    data: {
      ...data,
      slug
    }
  })
  return created
}

export async function updateClient(id: string, data: ClientFormValues) {
  const updated = await prisma.client.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteClient(id: string) {
  const deleted = await prisma.client.delete({
    where: {
      id
    },
  })
  return deleted
}
    



export async function getFullClientsDAO() {
  const found = await prisma.client.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			cotizations: true,
		}
  })
  return found as ClientDAO[]
}
  
export async function getFullClientDAO(id: string) {
  const found = await prisma.client.findUnique({
    where: {
      id
    },
    include: {
			cotizations: true,
		}
  })
  return found as ClientDAO
}

