import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding...")
  
}

export async function seedMaterials() {

  // iterate over data and create Materials and Colors asociated
  for (const data of dataArray) {
    const materialName = data.material
    // usert material
    let material = await prisma.material.findFirst({
      where: {
        name: materialName,
      },
    })
    if (!material) {
      const createdMaterial = await prisma.material.create({
        data: {
          name: materialName,
        },
      })
      material = createdMaterial
    }

    const colorName = data.color
    console.log(colorName)
    const distribuidorPrice = data.distribuidorPrice ? Number(data.distribuidorPrice) : 0
    const arquitectoStudioPrice = data.arquitectoStudioPrice ? Number(data.arquitectoStudioPrice) : 0
    const clienteFinalPrice = data.clienteFinalPrice ? Number(data.clienteFinalPrice) : 0

    let color = await prisma.color.findFirst({
      where: {
        name: colorName,
      },
    })
    if (!color) {
      const createdColor = await prisma.color.create({
        data: {
          name: colorName,
          materialId: material.id,
          distribuidorPrice,
          arquitectoStudioPrice,
          clienteFinalPrice,
        },
      })
      color = createdColor
    }    
  }

 console.log("Materials seeded")  
}

const dataArray = [
  {
    material: "Mármol",
    color: "Blanco Espuma - esp. 2 cm",
    distribuidorPrice: 212,
    arquitectoStudioPrice: 244.0,
    clienteFinalPrice: 280
},
{
    material: "Mármol",
    color: "Carrara Especial - esp. 2 cm",
    distribuidorPrice: 227,
    arquitectoStudioPrice: 261.0,
    clienteFinalPrice: 300
},
{
    material: "Mármol",
    color: "Arabescato - esp. 2 cm",
    distribuidorPrice: 370,
    arquitectoStudioPrice: 425.0,
    clienteFinalPrice: 490
},
{
    material: "Mármol",
    color: "Calacatta Viola - esp. 2 cm",
    distribuidorPrice: 369,
    arquitectoStudioPrice: 424.0,
    clienteFinalPrice: 490
},
{
    material: "Mármol",
    color: "Rosso Venato - esp. 2 cm",
    distribuidorPrice: 358,
    arquitectoStudioPrice: 412.0,
    clienteFinalPrice: 475
},
{
    material: "Mármol",
    color: "Blanco Thassos - esp. 2 cm",
    distribuidorPrice: 250,
    arquitectoStudioPrice: 288.0,
    clienteFinalPrice: 330
},
{
    material: "Mármol",
    color: "Dalmacia - esp. 2 cm",
    distribuidorPrice: 270,
    arquitectoStudioPrice: 310.0,
    clienteFinalPrice: 357
},
{
    material: "Mármol",
    color: "Volakas - esp. 2 cm",
    distribuidorPrice: 295,
    arquitectoStudioPrice: 340.0,
    clienteFinalPrice: 390
},
{
    material: "Mármol",
    color: "Goflan Silver - esp. 2 cm",
    distribuidorPrice: 220,
    arquitectoStudioPrice: 255.0,
    clienteFinalPrice: 295
},
{
    material: "Mármol",
    color: "Golden Spider - esp. 2 cm",
    distribuidorPrice: 245,
    arquitectoStudioPrice: 285.0,
    clienteFinalPrice: 330
},
{
    material: "Mármol",
    color: "Crema Marfil - esp. 2 cm",
    distribuidorPrice: 206,
    arquitectoStudioPrice: 238.0,
    clienteFinalPrice: 275
},
{
    material: "Mármol",
    color: "Beige Light - esp. 2 cm",
    distribuidorPrice: 168,
    arquitectoStudioPrice: 190.0,
    clienteFinalPrice: 215
},
{
    material: "Mármol",
    color: "Champagne - esp. 2 cm",
    distribuidorPrice: 168,
    arquitectoStudioPrice: 190.0,
    clienteFinalPrice: 215
},
{
    material: "Mármol",
    color: "Marrón Emperador Claro - esp. 2 cm",
    distribuidorPrice: 215,
    arquitectoStudioPrice: 250.0,
    clienteFinalPrice: 290
},
{
    material: "Mármol",
    color: "Antracita Dark - esp. 2 cm",
    distribuidorPrice: 265,
    arquitectoStudioPrice: 305.0,
    clienteFinalPrice: 350
},
{
    material: "Mármol",
    color: "Marrón San Nicolás - esp. 2 cm",
    distribuidorPrice: 218,
    arquitectoStudioPrice: 250.0,
    clienteFinalPrice: 288
},
{
    material: "Mármol",
    color: "RF Brown - esp. 2 cm",
    distribuidorPrice: 190,
    arquitectoStudioPrice: 220.0,
    clienteFinalPrice: 255
},
{
    material: "Mármol",
    color: "Rosso Levanto - esp. 2 cm",
    distribuidorPrice: 330,
    arquitectoStudioPrice: 380.0,
    clienteFinalPrice: 437
},
{
    material: "Mármol",
    color: "Verde Alpes - esp. 2 cm",
    distribuidorPrice: 165,
    arquitectoStudioPrice: 190.0,
    clienteFinalPrice: 220
},
{
    material: "Mármol",
    color: "Verde Mystic - esp. 2 cm",
    distribuidorPrice: 190,
    arquitectoStudioPrice: 219.0,
    clienteFinalPrice: 252
},
{
    material: "Mármol",
    color: "RF Green - esp. 2 cm",
    distribuidorPrice: 240,
    arquitectoStudioPrice: 276.0,
    clienteFinalPrice: 315
},
{
    material: "Mármol",
    color: "Negro Marquina - esp. 2 cm",
    distribuidorPrice: 215,
    arquitectoStudioPrice: 255.0,
    clienteFinalPrice: 295
},
{
    material: "Mármol",
    color: "Negro Plata - esp. 2 cm",
    distribuidorPrice: 225,
    arquitectoStudioPrice: 260.0,
    clienteFinalPrice: 300
},
{
    material: "Mármol",
    color: "Tundra Grey - esp. 2 cm",
    distribuidorPrice: 215,
    arquitectoStudioPrice: 250.0,
    clienteFinalPrice: 290
},
{
    material: "Mármol",
    color: "Tundra Grey - esp. 2 cm",
    distribuidorPrice: 230,
    arquitectoStudioPrice: 265.0,
    clienteFinalPrice: 305
},
{
    material: "Mármol",
    color: "Tundra Grey - esp. 2 cm",
    distribuidorPrice: 230,
    arquitectoStudioPrice: 265.0,
    clienteFinalPrice: 305
},
{
    material: "Mármol",
    color: "Travertino al Agua Lustrado - esp. 2 cm",
    distribuidorPrice: 200,
    arquitectoStudioPrice: 232.0,
    clienteFinalPrice: 267
},
{
    material: "Mármol",
    color: "Travertino al Agua Rustico - esp. 2 cm",
    distribuidorPrice: 182,
    arquitectoStudioPrice: 210.0,
    clienteFinalPrice: 242
},
{
    material: "Mármol",
    color: "Travertino a la Veta Lustrado - esp. 2 cm",
    distribuidorPrice: 242,
    arquitectoStudioPrice: 280.0,
    clienteFinalPrice: 322
},
{
    material: "Mármol",
    color: "Travertino a la Veta Rústico - esp. 2 cm",
    distribuidorPrice: 224,
    arquitectoStudioPrice: 260.0,
    clienteFinalPrice: 299
},
{
    material: "Mármol",
    color: "Travertino Rojo a la Veta Lust - esp. 2 cm",
    distribuidorPrice: 270,
    arquitectoStudioPrice: 310.0,
    clienteFinalPrice: 360
},
{
    material: "Mármol",
    color: "Travertino Silver Lustrado - esp. 2 cm",
    distribuidorPrice: 275,
    arquitectoStudioPrice: 320.0,
    clienteFinalPrice: 370
},
{
    material: "Piedra",
    color: "Serena - esp. 2 cm",
    distribuidorPrice: 210,
    arquitectoStudioPrice: 240.0,
    clienteFinalPrice: 275
},
{
    material: "Piedra",
    color: "Arenisca Arcoiris - esp. 2 cm",
    distribuidorPrice: 184,
    arquitectoStudioPrice: 210.0,
    clienteFinalPrice: 240
},
{
    material: "Piedra",
    color: "Ardosia Gris - esp. 2 cm",
    distribuidorPrice: 168,
    arquitectoStudioPrice: 193.0,
    clienteFinalPrice: 222
},
{
    material: "Piedra",
    color: "Ardosia Oxidada - esp. 2 cm",
    distribuidorPrice: 193,
    arquitectoStudioPrice: 222.0,
    clienteFinalPrice: 255
},
{
    material: "Piedra",
    color: "Ardosia Negra - esp. 2 cm",
    distribuidorPrice: 193,
    arquitectoStudioPrice: 222.0,
    clienteFinalPrice: 255
},
{
    material: "Piedra",
    color: "Jura Beige Pulida - esp. 2 cm",
    distribuidorPrice: 230,
    arquitectoStudioPrice: 265.0,
    clienteFinalPrice: 305
},
{
    material: "Piedra",
    color: "Jura Beige Brushed - esp. 2 cm",
    distribuidorPrice: 245,
    arquitectoStudioPrice: 280.0,
    clienteFinalPrice: 320
},
{
    material: "Piedra",
    color: "Jura Grey Pulida - esp. 2 cm",
    distribuidorPrice: 245,
    arquitectoStudioPrice: 280.0,
    clienteFinalPrice: 320
},
{
    material: "Piedra",
    color: "Krystalus - cristal traslúcido - esp. 2 cm",
    distribuidorPrice: 385,
    arquitectoStudioPrice: 445.0,
    clienteFinalPrice: 512
},
{
    material: "Piedra",
    color: "Mykonos - cuarcita - esp. 2 cm",
    distribuidorPrice: 402,
    arquitectoStudioPrice: 460.0,
    clienteFinalPrice: 529
},
{
    material: "Piedra",
    color: "Super White - dolomita - esp. 2 cm",
    distribuidorPrice: 445,
    arquitectoStudioPrice: 495.0,
    clienteFinalPrice: 570
},
{
    material: "Piedra",
    color: "Super White - mate - dolomita - esp. 2 cm",
    distribuidorPrice: 457,
    arquitectoStudioPrice: 525.0,
    clienteFinalPrice: 595
},
{
    material: "Piedra",
    color: "Blue Roma - traquito - esp. 2 cm",
    distribuidorPrice: 407,
    arquitectoStudioPrice: 470.0,
    clienteFinalPrice: 540
},
{
    material: "Piedra",
    color: "Vel - cuarcita - esp. 2 cm",
    distribuidorPrice: 402,
    arquitectoStudioPrice: 460.0,
    clienteFinalPrice: 529
},
{
    material: "Granito",
    color: "Alpinus - esp. 2 cm",
    distribuidorPrice: 303,
    arquitectoStudioPrice: 348.0,
    clienteFinalPrice: 400
},
{
    material: "Granito",
    color: "Avocatus - esp. 2 cm",
    distribuidorPrice: 395,
    arquitectoStudioPrice: 455.0,
    clienteFinalPrice: 520
},
{
    material: "Granito",
    color: "Blanco Dallas - esp. 2 cm",
    distribuidorPrice: 162,
    arquitectoStudioPrice: 187.0,
    clienteFinalPrice: 217
},
{
    material: "Granito",
    color: "Blanco Romano - esp. 2 cm",
    distribuidorPrice: 193,
    arquitectoStudioPrice: 222.0,
    clienteFinalPrice: 255
},
{
    material: "Granito",
    color: "Gris España - esp. 2 cm",
    distribuidorPrice: 162,
    arquitectoStudioPrice: 187.0,
    clienteFinalPrice: 215
},
{
    material: "Granito",
    color: "Gris Ibiza - esp. 2 cm",
    distribuidorPrice: 173,
    arquitectoStudioPrice: 201.0,
    clienteFinalPrice: 230
},
{
    material: "Granito",
    color: "Gris Corumbá - esp. 2 cm",
    distribuidorPrice: 155,
    arquitectoStudioPrice: 179.0,
    clienteFinalPrice: 210
},
{
    material: "Granito",
    color: "Gris Mara - Faldas - esp. 2 cm",
    distribuidorPrice: 155,
    arquitectoStudioPrice: 179.0,
    clienteFinalPrice: 210
},
{
    material: "Granito",
    color: "Gris Flameado - esp. 2 cm",
    distribuidorPrice: 165,
    arquitectoStudioPrice: 190.0,
    clienteFinalPrice: 220
},
{
    material: "Granito",
    color: "Gris Flameado - esp. 3 cm",
    distribuidorPrice: 176,
    arquitectoStudioPrice: 200.0,
    clienteFinalPrice: 230
},
{
    material: "Granito",
    color: "Marrón Labrador - esp. 2 cm",
    distribuidorPrice: 155,
    arquitectoStudioPrice: 178.0,
    clienteFinalPrice: 205
},
{
    material: "Granito",
    color: "Marron Baltico - esp. 2 cm",
    distribuidorPrice: 187,
    arquitectoStudioPrice: 215.0,
    clienteFinalPrice: 248
},
{
    material: "Granito",
    color: "Veneciatus - esp. 2 cm",
    distribuidorPrice: 158,
    arquitectoStudioPrice: 182.0,
    clienteFinalPrice: 209
},
{
    material: "Granito",
    color: "Lapidus - esp. 2 cm",
    distribuidorPrice: 225,
    arquitectoStudioPrice: 265.0,
    clienteFinalPrice: 305
},
{
    material: "Granito",
    color: "Sol - esp. 2 cm",
    distribuidorPrice: 220,
    arquitectoStudioPrice: 255.0,
    clienteFinalPrice: 290
},
{
    material: "Granito",
    color: "Rosa Porriño - esp. 2 cm",
    distribuidorPrice: 154,
    arquitectoStudioPrice: 177.0,
    clienteFinalPrice: 205
},
{
    material: "Granito",
    color: "Rojo F Flameado - Faldas - esp. 2 cm",
    distribuidorPrice: 150,
    arquitectoStudioPrice: 175.0,
    clienteFinalPrice: 200
},
{
    material: "Granito",
    color: "Rojo Brasilia - esp. 2 cm",
    distribuidorPrice: 187,
    arquitectoStudioPrice: 218.0,
    clienteFinalPrice: 250
},
{
    material: "Granito",
    color: "Verde Labrador - esp. 2 cm",
    distribuidorPrice: 165,
    arquitectoStudioPrice: 185.0,
    clienteFinalPrice: 220
},
{
    material: "Granito",
    color: "Azul Escandinavo - esp. 2 cm",
    distribuidorPrice: 275,
    arquitectoStudioPrice: 315.0,
    clienteFinalPrice: 365
},
{
    material: "Granito",
    color: "Azul Bahia - esp. 2 cm",
    distribuidorPrice: 900,
    arquitectoStudioPrice: 995.0,
    clienteFinalPrice: 1115
},
{
    material: "Granito",
    color: "Negro Absoluto - esp. 2 cm",
    distribuidorPrice: 275,
    arquitectoStudioPrice: 310.0,
    clienteFinalPrice: 355
},
{
    material: "Granito",
    color: "Negro Absoluto Flameado - esp. 2 cm",
    distribuidorPrice: 265,
    arquitectoStudioPrice: 300.0,
    clienteFinalPrice: 345
},
{
    material: "Granito",
    color: "Negro San Gabriel - esp. 2 cm",
    distribuidorPrice: 180,
    arquitectoStudioPrice: 207.0,
    clienteFinalPrice: 238
},
{
    material: "Granito",
    color: "Negro San Gabriel Leather - esp. 2 cm",
    distribuidorPrice: 190,
    arquitectoStudioPrice: 220.0,
    clienteFinalPrice: 250
},
{
    material: "Granito",
    color: "Via Lactea - esp. 2 cm",
    distribuidorPrice: 195,
    arquitectoStudioPrice: 227.0,
    clienteFinalPrice: 260
},
{
    material: "Granito",
    color: "Cosmico - esp. 2 cm",
    distribuidorPrice: 245,
    arquitectoStudioPrice: 282.0,
    clienteFinalPrice: 324
},
{
    material: "Granito",
    color: "Titanium - esp. 2 cm",
    distribuidorPrice: 285,
    arquitectoStudioPrice: 325.0,
    clienteFinalPrice: 375
},
{
    material: "Granito",
    color: "Volcano Gold - esp. 2 cm",
    distribuidorPrice: 305,
    arquitectoStudioPrice: 350.0,
    clienteFinalPrice: 400
},
{
    material: "Silestone",
    color: "Blanco Aspen - esp. 1.2 cm",
    distribuidorPrice: 200,
    arquitectoStudioPrice: 225.0,
    clienteFinalPrice: 260
},
{
    material: "Silestone",
    color: "Blanco Norte - esp. 2 cm",
    distribuidorPrice: 281,
    arquitectoStudioPrice: 312.0,
    clienteFinalPrice: 355
},
{
    material: "Silestone",
    color: "Blanco Norte - esp. 1.2 cms",
    distribuidorPrice: 252,
    arquitectoStudioPrice: 282.0,
    clienteFinalPrice: 324
},
{
    material: "Silestone",
    color: "Miami White - esp. 2 cm",
    distribuidorPrice: 310,
    arquitectoStudioPrice: 345.0,
    clienteFinalPrice: 399
},
{
    material: "Silestone",
    color: "Miami White - esp. 1.2 cms",
    distribuidorPrice: 279,
    arquitectoStudioPrice: 311.0,
    clienteFinalPrice: 359
},
{
    material: "Silestone",
    color: "White Storm - esp. 2 cm",
    distribuidorPrice: 347,
    arquitectoStudioPrice: 388.0,
    clienteFinalPrice: 440
},
{
    material: "Silestone",
    color: "White Storm Suede - esp. 2 cm",
    distribuidorPrice: 374,
    arquitectoStudioPrice: 415.0,
    clienteFinalPrice: 472
},
{
    material: "Silestone",
    color: "Blanco Zeus Extreme - esp. 2 cm",
    distribuidorPrice: 385,
    arquitectoStudioPrice: 425.0,
    clienteFinalPrice: 485
},
{
    material: "Silestone",
    color: "Blanco Zeus Extreme - esp. 1.2 cms",
    distribuidorPrice: 319,
    arquitectoStudioPrice: 350.0,
    clienteFinalPrice: 405
},
{
    material: "Silestone",
    color: "Blanco Stellar - esp. 2 cm",
    distribuidorPrice: 314,
    arquitectoStudioPrice: 350.0,
    clienteFinalPrice: 405
},
{
    material: "Silestone",
    color: "Miami Vena - esp. 2 cm",
    distribuidorPrice: 286,
    arquitectoStudioPrice: 320.0,
    clienteFinalPrice: 368
},
{
    material: "Silestone",
    color: "Gris Expo - esp. 2 cm",
    distribuidorPrice: 281,
    arquitectoStudioPrice: 312.0,
    clienteFinalPrice: 355
},
{
    material: "Silestone",
    color: "Gris Expo - 1,2 cms",
    distribuidorPrice: 252,
    arquitectoStudioPrice: 282.0,
    clienteFinalPrice: 324
},
{
    material: "Silestone",
    color: "Gris Expo Suede - esp. 2 cm",
    distribuidorPrice: 297,
    arquitectoStudioPrice: 330.0,
    clienteFinalPrice: 378
},
{
    material: "Silestone",
    color: "Niebla - esp. 2 cm",
    distribuidorPrice: 380,
    arquitectoStudioPrice: 424.0,
    clienteFinalPrice: 488
},
{
    material: "Silestone",
    color: "Cemento Spa - esp. 2 cm",
    distribuidorPrice: 380,
    arquitectoStudioPrice: 424.0,
    clienteFinalPrice: 488
},
{
    material: "Silestone",
    color: "Marengo - esp. 2 cm",
    distribuidorPrice: 340,
    arquitectoStudioPrice: 380.0,
    clienteFinalPrice: 437
},
{
    material: "Silestone",
    color: "Negro Tebas - esp. 2 cm",
    distribuidorPrice: 293,
    arquitectoStudioPrice: 328.0,
    clienteFinalPrice: 373
},
{
    material: "Silestone",
    color: "Rougi - esp. 2 cm",
    distribuidorPrice: 281,
    arquitectoStudioPrice: 312.0,
    clienteFinalPrice: 355
},
{
    material: "Silestone",
    color: "Noka - esp. 2 cm",
    distribuidorPrice: 293,
    arquitectoStudioPrice: 328.0,
    clienteFinalPrice: 373
},
{
    material: "Silestone",
    color: "Unsui - esp. 2 cm",
    distribuidorPrice: 320,
    arquitectoStudioPrice: 355.0,
    clienteFinalPrice: 405
},
{
    material: "Silestone",
    color: "Eternal Statuario - esp. 1,2 cms",
    distribuidorPrice: 470,
    arquitectoStudioPrice: 526.0,
    clienteFinalPrice: 590
},
{
    material: "Silestone",
    color: "Eternal Calacatta Gold - esp. 1,2 cms",
    distribuidorPrice: 460,
    arquitectoStudioPrice: 515.0,
    clienteFinalPrice: 580
},
{
    material: "Silestone",
    color: "Ethereal Glow - esp. 1,2 cms",
    distribuidorPrice: 460,
    arquitectoStudioPrice: 515.0,
    clienteFinalPrice: 580
},
{
    material: "Silestone",
    color: "Eternal Serena - esp. 1,2 cms",
    distribuidorPrice: 445,
    arquitectoStudioPrice: 498.0,
    clienteFinalPrice: 578
},
{
    material: "Silestone",
    color: "Eternal Marquina - esp. 1,2 cms",
    distribuidorPrice: 470,
    arquitectoStudioPrice: 526.0,
    clienteFinalPrice: 590
},
{
    material: "Silestone",
    color: "Faro White - esp. 1,2 cms",
    distribuidorPrice: 424,
    arquitectoStudioPrice: 475.0,
    clienteFinalPrice: 545
},
{
    material: "Silestone",
    color: "Cala Blue - esp. 1,2 cms",
    distribuidorPrice: 424,
    arquitectoStudioPrice: 475.0,
    clienteFinalPrice: 545
},
{
    material: "Silestone",
    color: "Arcilla Red - esp. 1,2 cms",
    distribuidorPrice: 424,
    arquitectoStudioPrice: 475.0,
    clienteFinalPrice: 545
},
{
    material: "Dekton",
    color: "Aeris - esp. 1,2 cms",
    distribuidorPrice: 290,
    arquitectoStudioPrice: 328.0,
    clienteFinalPrice: 375
},
{
    material: "Dekton",
    color: "Zenith - esp. 1,2 cms",
    distribuidorPrice: 332,
    arquitectoStudioPrice: 375.0,
    clienteFinalPrice: 428
},
{
    material: "Dekton",
    color: "Halo - esp. 1,2 cms",
    distribuidorPrice: 410,
    arquitectoStudioPrice: 465.0,
    clienteFinalPrice: 530
},
{
    material: "Dekton",
    color: "Aura - esp. 1,2 cms",
    distribuidorPrice: 380,
    arquitectoStudioPrice: 430.0,
    clienteFinalPrice: 490
},
{
    material: "Dekton",
    color: "Aura - esp 8 mm",
    distribuidorPrice: 280,
    arquitectoStudioPrice: 315.0,
    clienteFinalPrice: 360
},
{
    material: "Dekton",
    color: "Opera - esp. 1,2 cms",
    distribuidorPrice: 380,
    arquitectoStudioPrice: 430.0,
    clienteFinalPrice: 490
},
{
    material: "Dekton",
    color: "Natura - esp. 1,2 cms",
    distribuidorPrice: 380,
    arquitectoStudioPrice: 430.0,
    clienteFinalPrice: 490
},
{
    material: "Dekton",
    color: "Entzo - esp. 1,2 cms",
    distribuidorPrice: 380,
    arquitectoStudioPrice: 430.0,
    clienteFinalPrice: 490
},
{
    material: "Dekton",
    color: "Rem - esp. 1,2 cms",
    distribuidorPrice: 380,
    arquitectoStudioPrice: 430.0,
    clienteFinalPrice: 490
},
{
    material: "Dekton",
    color: "Morpheus - esp. 1,2 cms",
    distribuidorPrice: 395,
    arquitectoStudioPrice: 445.0,
    clienteFinalPrice: 505
},
{
    material: "Dekton",
    color: "Neural - esp. 1,2 cms",
    distribuidorPrice: 495,
    arquitectoStudioPrice: 560.0,
    clienteFinalPrice: 640
},
{
    material: "Dekton",
    color: "Bergen - esp. 1,2 cms",
    distribuidorPrice: 600,
    arquitectoStudioPrice: 670.0,
    clienteFinalPrice: 750
},
{
    material: "Dekton",
    color: "Portum - esp. 1,2 cms",
    distribuidorPrice: 600,
    arquitectoStudioPrice: 670.0,
    clienteFinalPrice: 750
},
{
    material: "Dekton",
    color: "Awake - esp. 1,2 cms",
    distribuidorPrice: 570,
    arquitectoStudioPrice: 640.0,
    clienteFinalPrice: 720
},
{
    material: "Dekton",
    color: "Reverie - esp. 1,2 cms",
    distribuidorPrice: 495,
    arquitectoStudioPrice: 560.0,
    clienteFinalPrice: 640
},
{
    material: "Dekton",
    color: "Keon - esp. 1,2 cms",
    distribuidorPrice: 315,
    arquitectoStudioPrice: 355.0,
    clienteFinalPrice: 405
},
{
    material: "Dekton",
    color: "Strato - esp. 1,2 cms",
    distribuidorPrice: 315,
    arquitectoStudioPrice: 355.0,
    clienteFinalPrice: 405
},
{
    material: "Dekton",
    color: "Kreta - esp. 1,2 cms",
    distribuidorPrice: 460,
    arquitectoStudioPrice: 515.0,
    clienteFinalPrice: 580
},
{
    material: "Dekton",
    color: "Vera - esp. 1,2 cms",
    distribuidorPrice: 400,
    arquitectoStudioPrice: 450.0,
    clienteFinalPrice: 510
},
{
    material: "Dekton",
    color: "Grigio - esp. 1,2 cms",
    distribuidorPrice: 475,
    arquitectoStudioPrice: 540.0,
    clienteFinalPrice: 615
},
{
    material: "Dekton",
    color: "Ceppo - esp. 1,2 cms",
    distribuidorPrice: 475,
    arquitectoStudioPrice: 540.0,
    clienteFinalPrice: 615
},
{
    material: "Dekton",
    color: "Danae - esp. 1,2 cms",
    distribuidorPrice: 315,
    arquitectoStudioPrice: 355.0,
    clienteFinalPrice: 400
},
{
    material: "Dekton",
    color: "Marmorio - esp. 1,2 cms",
    distribuidorPrice: 498,
    arquitectoStudioPrice: 560.0,
    clienteFinalPrice: 635
},
{
    material: "Dekton",
    color: "Nebbia - esp. 1,2 cms",
    distribuidorPrice: 475,
    arquitectoStudioPrice: 540.0,
    clienteFinalPrice: 615
},
{
    material: "Dekton",
    color: "Keranium - esp. 1,2 cms",
    distribuidorPrice: 428,
    arquitectoStudioPrice: 480.0,
    clienteFinalPrice: 540
},
{
    material: "Dekton",
    color: "Kelya - esp. 1,2 cms",
    distribuidorPrice: 345,
    arquitectoStudioPrice: 385.0,
    clienteFinalPrice: 440
},
{
    material: "Dekton",
    color: "Laurent - esp. 1,2 cms",
    distribuidorPrice: 540,
    arquitectoStudioPrice: 610.0,
    clienteFinalPrice: 695
},
{
    material: "Dekton",
    color: "Somnia - esp. 1,2 cms",
    distribuidorPrice: 495,
    arquitectoStudioPrice: 560.0,
    clienteFinalPrice: 640
},
{
    material: "Dekton",
    color: "Trilium - esp. 1,2 cms",
    distribuidorPrice: 480,
    arquitectoStudioPrice: 540.0,
    clienteFinalPrice: 595
},
{
    material: "Dekton",
    color: "Nilium - esp. 1,2 cms",
    distribuidorPrice: 345,
    arquitectoStudioPrice: 385.0,
    clienteFinalPrice: 440
},
{
    material: "Dekton",
    color: "Domoos - esp. 1,2 cms",
    distribuidorPrice: 332,
    arquitectoStudioPrice: 378.0,
    clienteFinalPrice: 430
},
{
    material: "Dekton",
    color: "Bromo - esp. 1,2 cms",
    distribuidorPrice: 430,
    arquitectoStudioPrice: 485.0,
    clienteFinalPrice: 550
},
{
    material: "Dekton",
    color: "Sirius - esp. 1,2 cms",
    distribuidorPrice: 415,
    arquitectoStudioPrice: 465.0,
    clienteFinalPrice: 530
},
{
    material: "Dekton",
    color: "Sasea - esp. 1,2 cms",
    distribuidorPrice: 250,
    arquitectoStudioPrice: 280.0,
    clienteFinalPrice: 320
},
{
    material: "Dekton",
    color: "Marina - esp. 1,2 cms",
    distribuidorPrice: 289,
    arquitectoStudioPrice: 325.0,
    clienteFinalPrice: 370
},
{
    material: "Dekton",
    color: "Salina - esp. 1,2 cms",
    distribuidorPrice: 289,
    arquitectoStudioPrice: 325.0,
    clienteFinalPrice: 370
},
{
    material: "Dekton",
    color: "Vigil - esp. 1,2 cms",
    distribuidorPrice: 310,
    arquitectoStudioPrice: 350.0,
    clienteFinalPrice: 395
},
{
    material: "Revestimiento",
    color: "Mármol Carrara C - 30,5 x 30,5 x 1",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 75.0,
    clienteFinalPrice: 79
},
{
    material: "Revestimiento",
    color: "Mármol Verde Alpes - 30,5 x 30,5 x 1",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 51.0,
    clienteFinalPrice: 56
},
{
    material: "Revestimiento",
    color: "Mármol Champagne - 61 x 1.22 x 1.8",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 48.0,
    clienteFinalPrice: 48
},
{
    material: "Revestimiento",
    color: "Mármol Beige Light - 60 x 120 x 1,5",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 50.0,
    clienteFinalPrice: 50
},
{
    material: "Revestimiento",
    color: "Piedra Jura Beige Veta Mate - 37.8 x LL x 2",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 60.0,
    clienteFinalPrice: 65
},
{
    material: "Revestimiento",
    color: "Piedra Jura Beige al Agua Spazzolato 60 x 60 x 2",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 60.0,
    clienteFinalPrice: 60
},
{
    material: "Revestimiento",
    color: "Travertino al Agua, poro tapado mate - 61 x 61 x 1,2",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 55.0,
    clienteFinalPrice: 60
},
{
    material: "Revestimiento",
    color: "Travertino a la Veta rústico - 30 x 60 x 1.5",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 51.0,
    clienteFinalPrice: 56
},
{
    material: "Revestimiento",
    color: "Travertino Roman Pattern",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 55.0,
    clienteFinalPrice: 60
},
{
    material: "Revestimiento",
    color: "Travertino cara rústica - 10 x LL x 3",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 39.0,
    clienteFinalPrice: 42
},
{
    material: "Revestimiento",
    color: "Granito Gris pulido - 30,5 x 30,5 x 1",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 35.0,
    clienteFinalPrice: 40
},
{
    material: "Revestimiento",
    color: "Granito Gris Flameado - 61 x 61 x 1,5",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 45.0,
    clienteFinalPrice: 50
},
{
    material: "Revestimiento",
    color: "Granito Negro pulido - 30,5 x 30,5 x 1",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 63.0,
    clienteFinalPrice: 68
},
{
    material: "Revestimiento",
    color: "Granito Negro pulido - 61 x 61 x 1,5",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 50.0,
    clienteFinalPrice: 50
},
{
    material: "Revestimiento",
    color: "Piedra Jabón - 23x11,5x3 cms",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 69.0,
    clienteFinalPrice: 75
},
{
    material: "Revestimiento",
    color: "Miracema 11.5 x 23 - esp. 1-1,3 cm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 20.0,
    clienteFinalPrice: 22
},
{
    material: "Revestimiento",
    color: "Miracema 11.5 x 23 - Oscura - esp. 1-1,3 cm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 22.4,
    clienteFinalPrice: 24.6
},
{
    material: "Revestimiento",
    color: "Miracema 23 x 47 - esp. 1,8 cm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 33.0,
    clienteFinalPrice: 36
},
{
    material: "Revestimiento",
    color: "Miracema 40 x 60 - esp. 2-2,3 cm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 44.0,
    clienteFinalPrice: 49
},
{
    material: "Revestimiento",
    color: "Miracema 50 x 100 - esp. 5-5,5 cm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 70.0,
    clienteFinalPrice: 75
},
{
    material: "Revestimiento",
    color: "Ardosia gris 15 x 30 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 13.0,
    clienteFinalPrice: 16
},
{
    material: "Revestimiento",
    color: "Ardosia gris 20 x 40 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 14.0,
    clienteFinalPrice: 17
},
{
    material: "Revestimiento",
    color: "Ardosia gris 40 x 40 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 15.5,
    clienteFinalPrice: 18.5
},
{
    material: "Revestimiento",
    color: "Ardosia gris 30 x 60 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 18.0,
    clienteFinalPrice: 21
},
{
    material: "Revestimiento",
    color: "Ardosia gris 40 x 60 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 19.0,
    clienteFinalPrice: 22
},
{
    material: "Revestimiento",
    color: "Ardosia gris 60 x 60 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 20.5,
    clienteFinalPrice: 23.5
},
{
    material: "Revestimiento",
    color: "Ardosia negra 15 x 30 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 15.0,
    clienteFinalPrice: 17.5
},
{
    material: "Revestimiento",
    color: "Ardosia negra 20 x 40 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 15.9,
    clienteFinalPrice: 18.3
},
{
    material: "Revestimiento",
    color: "Ardosia negra 40 x 40 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 18.5,
    clienteFinalPrice: 21.5
},
{
    material: "Revestimiento",
    color: "Ardosia negra 30 x 60 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 19.0,
    clienteFinalPrice: 22
},
{
    material: "Revestimiento",
    color: "Ardosia negra 40 x 60 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 20.0,
    clienteFinalPrice: 23
},
{
    material: "Revestimiento",
    color: "Ardosia negra 60 x 60 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 22.5,
    clienteFinalPrice: 25.5
},
{
    material: "Revestimiento",
    color: "Ardosia negra 90 x 90 - esp. 13-17 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 46.0,
    clienteFinalPrice: 49
},
{
    material: "Revestimiento",
    color: "Ardosia oxidada 5 x 40 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 21.0,
    clienteFinalPrice: 24
},
{
    material: "Revestimiento",
    color: "Ardosia oxidada 15 x 30 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 18.0,
    clienteFinalPrice: 21
},
{
    material: "Revestimiento",
    color: "Ardosia oxidada 40 x 40 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 20.5,
    clienteFinalPrice: 23.5
},
{
    material: "Revestimiento",
    color: "Ardosia oxidada 30 x 60 - esp. 6-10 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 22.0,
    clienteFinalPrice: 25
},
{
    material: "Revestimiento",
    color: "Pórfido Adoquin 10x10cm - esp 2/4 cms - 81 piezas por m2",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 57.0,
    clienteFinalPrice: 62
},
{
    material: "Revestimiento",
    color: "Pórfido - 25 cms x LL - esp 2/4 cms",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 63.0,
    clienteFinalPrice: 68
},
{
    material: "Revestimiento",
    color: "Paneles de piedra Beige - 15x55",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 41.0,
    clienteFinalPrice: 46
},
{
    material: "Revestimiento",
    color: "Paneles de piedra Beige - 18x35",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 43.0,
    clienteFinalPrice: 48
},
{
    material: "Revestimiento",
    color: "Paneles de piedra Oxido - 15x55",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 32.0,
    clienteFinalPrice: 37
},
{
    material: "Revestimiento",
    color: "Piedra bali mate - 20x20x1 cm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 43.0,
    clienteFinalPrice: 48
},
{
    material: "Revestimiento",
    color: "DK Aura - 260x100x8 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 155.0,
    clienteFinalPrice: 165
},
{
    material: "Revestimiento",
    color: "DK Danae - 159x142x8 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 90.0,
    clienteFinalPrice: 99
},
{
    material: "Revestimiento",
    color: "DK Keon - 159x142x8 mm",
    distribuidorPrice: 0,
    arquitectoStudioPrice: 90.0,
    clienteFinalPrice: 99
},

]