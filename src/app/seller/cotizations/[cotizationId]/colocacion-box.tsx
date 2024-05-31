import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getShortItemDescription } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { ClientType, ItemType } from "@prisma/client"
import LineBox from "./superficie-box"

type Props = {
    items: ItemDAO[]
    clientType: ClientType
}
export default function ColocacionBox({ items, clientType }: Props) {
    if (!items || items.length === 0) return null

    const totalQuantity= items.reduce((acc, item) => acc + item.quantity, 0)
    const title= totalQuantity === 1 ? " Colocación" : totalQuantity + " Colocaciones"
    let areaTotal= 0
    let valueTotal= 0
    items.forEach((item) => {
        if (!item.valor) return

        areaTotal+= (item.centimetros || 0) / 100 * item.quantity 
        valueTotal+= item.valor * item.quantity
    })
    const colocacion= items[0].colocacion
    return (
        <div>
            <div>
                <div className="flex flex-row justify-between w-full">
                    <p className="font-bold">{title}</p>
                    <LineBox superficie={areaTotal} total={valueTotal} sufix="ml" price={colocacion.price} />
                </div>
            </div>
            <div className="text-sm">
                {items.map((item) => { 
                    return (
                        <div className="flex flex-row justify-between w-full" key={item.id}>
                            <p>{getShortItemDescription(item)}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

