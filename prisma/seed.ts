import { PrismaClient } from "@prisma/client"
import { seedMaterials } from "./seed-materials"
import { seedAdmin } from "./seed-admin"
import { seedWorkTypes } from "./seed-work-types"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding...")

  //await seedAdmin()
  //await seedMaterials()
  //await seedWorkTypes()
  
}

//main()

