import { getShortItemDescription, getShortItemDescriptionWithoutAjust } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"

type Props = {
    header: string
    headerPlural: string
    items: ItemDAO[]
}
export default function ManoDeObraPrintable({ header, headerPlural, items }: Props) {
    if (!items || items.length === 0) return null

    const totalQuantity= items.reduce((acc, item) => acc + item.quantity, 0)
//    const title= totalQuantity === 1 ? totalQuantity + " " + header : totalQuantity + " " + headerPlural
    const title= headerPlural
    let detailString= ""
    items.forEach((item) => {
        if (!item.valor) return
        const desc= getShortItemDescriptionWithoutAjust(item).trim()
        detailString+= desc + ", "
    })

    detailString= detailString.slice(0, -2)

    return (
        <div className="flex items-start justify-between pb-1.5 -mt-2.5">
            <div className="flex items-center gap-2">
                <p className="">{title}:</p>
                <p>{detailString}</p>
            </div>                       
        </div>
    )
}
