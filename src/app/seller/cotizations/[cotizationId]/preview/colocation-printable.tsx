import { formatCurrency, getShortItemDescription } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { ItemType } from "@prisma/client"

type Props = {
    items: ItemDAO[]
}
export default function ColocationPrintable({ items }: Props) {
    if (!items || items.length === 0) return null

    const type= items[0].type

    if (type !== ItemType.COLOCACION) return <div>Este item debe ser de tipo COLOCACION</div>

    let areaTotal= 0
    items.forEach((item) => {
        if (!item.valor) return

        areaTotal+= (item.centimetros || 0) / 100 * item.quantity 
    })

    const description= items[0].description || ""
    // description is something like "Tramos: 1.62m², Zócalos: 0.28m², Terminaciones: 0.50m² Total: 2.39m²."
    // take the last part: Total: 2.39m²
    const descriptionParts= description.split("Total: ")
    const totalDescription= descriptionParts[1].slice(0, -1)


    return (
        <div className="mt-1 font-bold">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="">Colocación</p>
                    <p>{totalDescription} </p>
                </div>       
                    
                <p>{formatCurrency(Number(items[0].valor), 0)} + IVA</p>
            </div>
        </div>
    )
}
