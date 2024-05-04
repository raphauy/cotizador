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
export default function TerminationAreaAccordion({ header, headerPlural, terminationItems }: Props) {
    if (!terminationItems || terminationItems.length === 0) return null

    //const totalQuantity= terminationItems.reduce((acc, item) => acc + item.quantity, 0)
    // totalQuantity is the sum of each item quantity which have a valorAreaTerminacion
    const totalQuantity= terminationItems.reduce((acc, item) => acc + (item.valorAreaTerminacion ? item.quantity : 0), 0)
    const title= totalQuantity === 1 ? totalQuantity + " " + header : totalQuantity + " " + headerPlural
    let areaTotal= 0
    let valueTotal= 0
    terminationItems.forEach((item) => {
        if (!item.superficie || !item.valor) return

        areaTotal+= item.superficie * item.quantity
        valueTotal+= (item.valorAreaTerminacion || 0) * item.quantity
    })
    return (
        <AccordionItem value={title} key={title}>
            <AccordionTrigger>
                <div className="flex flex-row justify-between w-full">
                    <p>{title}</p>
                    <LineBox superficie={areaTotal} total={valueTotal} sufix="m²" />
                </div>
            </AccordionTrigger>
            <AccordionContent>
                {terminationItems.map((item) => { 
                    if (!item.valorAreaTerminacion) return null

                    return (
                        <div className="flex flex-row justify-between w-full" key={item.id}>
                            <p>{getShortItemDescription(item)}</p>
                            {
                                item.valorAreaTerminacion?
                                <LineBox superficie={Number(item.superficie) * item.quantity} total={item.valorAreaTerminacion * item.quantity} sufix="m²" />
                                : null
                            }
                            
                        </div>
                    )
                })}
            </AccordionContent>
        </AccordionItem>
    )
}
