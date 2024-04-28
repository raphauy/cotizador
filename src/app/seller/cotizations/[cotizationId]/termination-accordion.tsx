import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getShortItemDescription } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { ItemType } from "@prisma/client"
import LineBox from "./superficie-box"

type Props = {
    header: string
    headerPlural: string
    terminationItems: ItemDAO[]
}
export default function TerminationAccordion({ header, headerPlural, terminationItems }: Props) {
    if (!terminationItems || terminationItems.length === 0) return null

    const totalQuantity= terminationItems.reduce((acc, item) => acc + item.quantity, 0)
    const title= totalQuantity === 1 ? totalQuantity + " " + header : totalQuantity + " " + headerPlural
    let areaTotal= 0
    let valueTotal= 0
    terminationItems.forEach((item) => {
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
                {terminationItems.map((item) => { 
                    return (
                        <div className="flex flex-row justify-between w-full" key={item.id}>
                            <p>{getShortItemDescription(item)}</p>
                            {
                                item.valor?
                                <LineBox superficie={Number(item.centimetros) / 100 * item.quantity} total={item.valor * item.quantity} sufix="ml" />
                                : null
                            }
                            
                        </div>
                    )
                })}
            </AccordionContent>
        </AccordionItem>
    )
}
