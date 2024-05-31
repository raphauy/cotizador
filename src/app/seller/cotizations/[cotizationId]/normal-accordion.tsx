import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getShortItemDescription } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { ClientType, ItemType } from "@prisma/client"
import LineBox from "./superficie-box"

type Props = {
    header: string
    headerPlural: string
    items: ItemDAO[]
    clientType: ClientType
}
export default function NormalAccordion({ header, headerPlural, items, clientType }: Props) {
    if (!items || items.length === 0) return null

    const totalQuantity= items.reduce((acc, item) => acc + item.quantity, 0)
    const title= totalQuantity === 1 ? totalQuantity + " " + header : totalQuantity + " " + headerPlural
    let areaTotal= 0
    let valueTotal= 0
    items.forEach((item) => {
        if (!item.valor) return

        areaTotal+= (item.centimetros || 0) / 100 * item.quantity 
        valueTotal+= item.valor * item.quantity
    })
    return (
        <AccordionItem value={title} key={title}>
            <AccordionTrigger>
                <div className="flex flex-row justify-between w-full">
                    <p>{title}</p>
                    <LineBox superficie={areaTotal} total={valueTotal} sufix="ml" />
                </div>
            </AccordionTrigger>
            <AccordionContent>
                {items.map((item) => { 
                    const price= getPrice(item, clientType)
                    return (
                        <div className="flex flex-row justify-between w-full" key={item.id}>
                            <p>{getShortItemDescription(item)}</p>
                            {
                                item.valor?
                                <LineBox superficie={Number(item.centimetros) / 100 * item.quantity} total={item.valor * item.quantity} sufix="ml" price={price} />
                                : null
                            }
                            
                        </div>
                    )
                })}
            </AccordionContent>
        </AccordionItem>
    )
}

function getPrice(item: ItemDAO, clientType: ClientType) {
    switch (item.type) {
        case ItemType.TERMINACION:
            return item.terminacion.price
        case ItemType.MANO_DE_OBRA:
            return clientType === "CLIENTE_FINAL" ? item.manoDeObra.clienteFinalPrice : clientType === "ARQUITECTO_ESTUDIO" ? item.manoDeObra.arquitectoStudioPrice : item.manoDeObra.distribuidorPrice
        default:
            return undefined
    }
}