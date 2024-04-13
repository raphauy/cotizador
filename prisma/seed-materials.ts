import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding...")
  
}

export async function seedMaterials() {

  // iterate over the materials and create them with the colors asociated
  for (const [materialName, colors] of Object.entries(materials)) {
    const material = await prisma.material.create({
      data: {
        name: materialName,
      },
    })
    for (const color of colors) {
      await prisma.color.create({
        data: {
          name: color,
          materialId: material.id,
        },
      })
    }
  }

 console.log("Materials seeded")  
}


const materials= {
  "MARMOL": [
    "Blanco Espuma - Chapa",
    "Carrara - Chapa",
    "Arabescato A - Chapa",
    "Calacatta Viola - Chapa",
    "Rosso Venato",
    "Blanco Thassos",
    "Blanco Pirgon",
    "Volakas",
    "Golden Spider",
    "Tundra Grey - Chapa Pulido",
    "Tundra Grey Mate - Chapa",
    "Tundra Grey - Chapa Mate",
    "Tundra Grey - Chapa Brushed",
    "Negro Plata - Chapa",
    "Goflan Silver - Chapa",
    "Desert Beige - Chapa",
    "Crema Marfil - Chapa",
    "Beige Light - Chapa",
    "Giallo - Chapa",
    "Champagne - Chapa",
    "Botticino - Chapa",
    "Marrón Emperador Claro - Chapa",
    "Marrón San Nicolás - Chapa",
    "Marrón Oliva - Chapa",
    "Antracita Dark",
    "RF Brown - Chapa",
    "RF Brown Brushed - Chapa",
    "Rosso Verona - Chapa",
    "Rosso Levanto - Chapa",
    "Verde Alpes - Chapa",
    "Verde Mistico - Chapa",
    "RF Green - Chapa",
    "RF Green Brushed - Chapa",
    "Negro Marquina - Chapa",
    "Travertino al Agua Lustrado - Chapa",
    "Travertino al Agua Mate - Chapa",
    "Travertino al Agua Rústico - Chapa",
    "Travertino a la Veta Lustrado - Chapa",
    "Travertino a la Veta Lustrado - Faldas",
    "Travertino a la Veta Rústico - Chapa",
    "Travertino Rojo - Chapa",
    "Travertino Noche a la Veta Lust - Chapa",
    "Travertino Silver Claro Mate - Chapa",
    "Travertino Silver - Chapa"
  ],
  "GRANITO": [
    "Blanco Dallas - Chapa",
    "Cuarcita Mykonos - Chapa",
    "Krystallus",
    "Blue Roma",
    "Super White - Chapa",
    "Alpinus",
    "Avocatus - Chapa",
    "Madeirus",
    "Cuarcita Vel - Chapa",
    "Blanco Romano - Chapa",
    "Gris Flameado - Chapa",
    "Gris Flameado - Chapa 3 cms",
    "Gris comun",
    "Cinza Corumba",
    "Gris - Gris España - Chapa Alta",
    "Gris - Gris Ibiza - Chapa Alta",
    "Marrón Labrador - Chapa",
    "Gris Imperial - Chapa",
    "Gris Imperial - Faldas",
    "Carioca - Chapa",
    "Veneciatus - Chapa",
    "Juparana - Chapa - DISCONTINUADO",
    "Maracuya - Chapa - DISCONTINUADO",
    "Marrón Baltico - Chapa",
    "Sol - Chapa",
    "Lapidus - Chapa",
    "Rosa Porriño - Chapa",
    "Rojo F Flameado - Faldas",
    "Rojo Brasilia - Chapa",
    "Verde Labrador - Chapa",
    "Azul Escandinavo - Chapa",
    "Azul Bahia - Chapa",
    "Negro Absoluto - Chapa",
    "Negro Absoluto Flameado - Chapa",
    "Negro San Gabriel - Chapa",
    "Negro San Gabriel Leather - Chapa",
    "Negro Indiano - Chapa",
    "Via Lactea - Chapa",
    "Cosmic - Chapa",
    "Titanium - Chapa",
    "Volcano Gold - Chapa"
  ],
  "PIEDRA": [
    "Piedra Serena - Chapa",
    "Arenisca Arcoiris - Chapa",
    "Ardosia Gris - Chapa",
    "Ardosia Oxidada - Chapa",
    "Ardosia Negra - Chapa",
    "Jura Beige Pulida - Chapa",
    "Jura Beige Spazzolato - Chapa",
    "Jura Grey Pulida - Chapa"
  ],
  "SILESTONE": [
    "Blanco Norte - Chapa",
    "Blanco Matrix - 1.2 cms - Chapa",
    "Aspen Crystal - 1.2 cms - Chapa",
    "Miami White - Chapa",
    "White Storm - Chapa",
    "White Storm Suede - Chapa",
    "Blanco Zeus Extreme - Chapa",
    "Blanco Stellar - Chapa",
    "Miami Vena",
    "Aluminio Nube - Chapa",
    "Niebla - Chapa",
    "Gris Expo - Chapa",
    "Gris Expo - Suede - Chapa",
    "Marengo - Chapa",
    "Cemento Spa - Chapa",
    "Rougui - Chapa",
    "Noka - Chapa",
    "Unsui - Chapa",
    "Negro Tebas - Chapa",
    "Eternal Statuario - Chapa",
    "Eternal Calacatta - Chapa 1,2 cms",
    "Ethereal Glow - Chapa 1,2 cms",
    "Eternal Serena - Chapa 1,2 cms",
    "Eternal Marquina - Chapa 1,2 cms",
    "Faro White - Chapa 1,2 cms",
    "Arcilla Red - Chapa 1,2 cms",
    "Cala Blue - Chapa 1,2 cms"
  ],
  "DEKTON": [
    "DK Zenith - Chapa 1,2 cms",
    "DK Aeris - Chapa 1.2 cms",
    "DK Aura - Chapa 1.2 cms",
    "DK Morpheus - Chapa 1.2 cms",
    "DK Opera - Chapa 1.2 cms",
    "DK Bergen - Chapa 1.2 cms",
    "DK Portum - Chapa 1.2 cms",
    "DK Awake - Chapa 1.2 cms",
    "DK Neural - Chapa 1,2 cms",
    "DK Natura - Chapa 1.2 cms",
    "DK Entzo - Chapa 1.2 cms",
    "DK REM - Chapa 1.2 cms",
    "DK Danae - Chapa 1.2 cms",
    "DK Marmorio - Chapa 1,2 cms",
    "DK Sirocco - Chapa 1,2 cms - discontiuadas",
    "DK Keon - Chapa 1,2 cms",
    "DK Strato - Chapa 1,2 cms",
    "DK Kreta - Chapa 1,2 cms",
    "DK Grigio - Chapa 1,2 cms",
    "DK Nebbia - Chapa 1,2 cms",
    "DK Ceppo - Chapa 1,2 cms",
    "DK Vera - Chapa 1,2 cms",
    "DK Keranium - Chapa 1.2 cms - DISCONTINUADAS",
    "DK Trillium - Chapa 1.2 cms",
    "DK Orix - Chapa 1,2 cms",
    "DK Nillium - Chapa 1.2 cms",
    "DK Kelya - Chapa 1.2 cms",
    "DK Somnia - Chapa 1,2 cms",
    "DK Laurent - Chapa 1.2 cms",
    "DK Domoos - Chapa 1.2 cms",
    "DK Bromo - Chapa 1.2 cms",
    "DK Sirius - Chapa 1.2 cms",
    "DK HALO - Chapa 1.2 cms",
    "DK Marina - Chapa 1.2 cms",
    "DK Salina - Chapa 1.2 cms",
    "DK Vigil - Chapa 1.2 cms",
    "DK Sasea - Chapa 1,2 mm",
    "DK Reverie - Chapa 1.2 cms"
  ]
}
