import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding...")
  
}

export async function seedManoDeObra() {

  // iterate over the manoDeObras array and create them
  for (const [index, manoDeObra] of Object.entries(manoDeObras)) {
    const data= {
      name: manoDeObra.name,
      price: manoDeObra.price
    }
    await prisma.manoDeObra.create({
      data,
    })
  } 


 console.log("ManoDeObra seeded")
}


// price random between 10 and 100
const manoDeObras= [
  {
    name: "Hueco Simple y pegado",
    price: 10
  },
  {
    name: "Hueco Doble  y pegado",
    price: 15
  },
  {
    name: "Hueco de Grifería",
    price: 20
  },
  {
    name: "Hueco de Anafe",
    price: 25
  },
  {
    name: "Hueco diámetro 5 cm y 15 cm",
    price: 30
  },
  {
    name: "Cajas de luz",
    price: 35
  },
  {
    name: "Colocación de toallero metálico en Obra",
    price: 40
  },
  {
    name: "Colocación de toallero metálico en Taller",
    price: 45
  },
  {
    name: "Pulido por m2 - Mármol",
    price: 50
  },
  {
    name: "Pulido por m2 - Granito",
    price: 55
  },
  {
    name: "Terminación mate en marmol",
    price: 60
  },
  {
    name: "Anticado al ácido en marmol",
    price: 65
  },
  {
    name: "Spazzolato en marmol",
    price: 70
  },
  {
    name: "Flameado en granito",
    price: 75
  },
  {
    name: "Flameado + Spazzolato en granito",
    price: 80
  },
  {
    name: "Travertino con resina Transparente",
    price: 85
  },
  {
    name: "Borde Rotoso - 2 cms",
    price: 90
  },
  {
    name: "Colocacion por m2 en Montevideo (minimo 1 m2)",
    price: 95
  },
  {
    name: "Service en el domicilio de un particular",
    price: 100
  },
]
