import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


export async function seedWorkTypes() {
  const workTypes = await prisma.workType.createMany({
    data: [
      {
        name: "Mesada de cocina",
      },
      {
        name: "Mesada de baño",
      },
      {
        name: "Estante",
      },
      {
        name: "Zoacalo de ducha",
      },
      {
        name: "Mesa",
      },
      {
        name: "Mesa redonda",
      },
      {
        name: "Isla",
      },
      {
        name: "Revestimiento",
      },
      {
        name: "Personalizado",
      },
    ],
  })
  return workTypes
}
