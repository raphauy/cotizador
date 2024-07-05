import { getShortItemDescription, getShortItemDescriptionWithoutAjust } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { ItemType } from "@prisma/client"

type Props = {
    header: string
    headerPlural: string
    items: ItemDAO[]
}
export default function NormalPrintable({ header, headerPlural, items }: Props) {
    if (!items || items.length === 0) return null

    const totalQuantity= items.reduce((acc, item) => acc + item.quantity, 0)
//    let title= totalQuantity === 1 ? totalQuantity + " " + header : totalQuantity + " " + headerPlural
    let title= headerPlural
    const type= items[0].type

    let areaTotal= 0
    let valueTotal= 0
    items.forEach((item) => {
        if (!item.valor) return

        areaTotal+= (item.centimetros || 0) / 100 * item.quantity 
        valueTotal+= item.valor * item.quantity
    })
    let detailString= ""
    items.forEach((item) => {
        if (!item.valor) return
        const cm= Number(item.centimetros) / 100 || 0
        detailString+= getShortItemDescriptionWithoutAjust(item).trim() + ", " 
    })

    detailString= detailString.slice(0, -2)

    if (type === ItemType.COLOCACION) {
        title= "Colocación"
        detailString= getShortItemDescriptionWithoutAjust(items[0])
    }

    return (
        <div className="flex items-start justify-between pb-1.5 -mt-2.5 mr-0.5">
            <div className="flex items-center gap-2">
                <p>{title}:</p>
                <p>{detailString}</p>
            </div>       
                
            {
                areaTotal > 0 && <div>{areaTotal.toFixed(2)} ml</div>
            }                
        </div>
)
}
