import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function seedAdmin() {
  const adminUser = await prisma.user.create({
    data: {
      name: "Rapha",
      email: "rapha.uy@rapha.uy",
      role: "ADMIN"
    },
  })
  return adminUser
}

