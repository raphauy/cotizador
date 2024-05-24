import { ItemDAO } from "@/services/item-services"
import { ItemType } from "@prisma/client"

type Props = {
    items: ItemDAO[]
}
export default function SurfacePrintable({ items }: Props) {
    console.log(items)
    
    if (!items || items.length === 0) return null

    const type= items[0].type
    let typeStr= type === ItemType.TRAMO? "Tramo" : type === ItemType.ZOCALO? "Zocalo" : type === ItemType.ALZADA? "Alzada" : ""
    const totalQuantity= items.reduce((acc, item) => acc + item.quantity, 0)
    let title= totalQuantity === 1 ? totalQuantity + " " + typeStr : totalQuantity + " " + typeStr + "s" 
    if (type === ItemType.TERMINACION) {
        title= totalQuantity === 1 ? "1 Área de terminación" : totalQuantity + " Áreas de terminación"
    }
    let areaTotal= 0
    let valueTotal= 0
    let detailString= ""
    items.forEach((item) => {
        if (!item.superficie || !item.valor) return

        areaTotal+= item.superficie * item.quantity
        valueTotal+= item.valor * item.quantity
        detailString+= (item.quantity > 1 ? item.largo + "x" + item.ancho + "x" + item.quantity :
        item.largo + "x" + item.ancho) + ", "
    })
    console.log(areaTotal, valueTotal)

    detailString= detailString.slice(0, -2)

    if (areaTotal === 0) return null

    return (
        <div className="flex items-start justify-between pb-1.5 -mt-2.5">
            <div className="flex items-center gap-2">
                <p>{title}:</p>
                <p>{detailString}</p>
            </div>       
                
            <div>{areaTotal.toFixed(2)} m²</div>
        </div>
)
}
