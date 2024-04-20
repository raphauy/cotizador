import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getShortItemDescription } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { ItemType } from "@prisma/client"
import LineBox from "./superficie-box"

type Props = {
    terminationItems: ItemDAO[]
}
export default function TerminationAccordion({ terminationItems }: Props) {
    if (!terminationItems || terminationItems.length === 0) return null

    const type= ItemType.TERMINACION
    const title= terminationItems.length === 1 ? terminationItems.length + " terminación" : terminationItems.length + " terminaciones" 
    let areaTotal= 0
    let valueTotal= 0
    terminationItems.forEach((item) => {
        if (!item.metros || !item.valor) return

        areaTotal+= item.metros
        valueTotal+= item.valor
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
                                item.metros && item.valor?
                                <LineBox superficie={Number(item.metros)} total={item.valor} sufix="ml" />
                                : null
                            }
                            
                        </div>
                    )
                })}
            </AccordionContent>
        </AccordionItem>
    )
}
