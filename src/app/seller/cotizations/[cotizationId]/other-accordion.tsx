import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getShortItemDescription } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import SuperficieBox from "./superficie-box"

type Props = {
    surfaceItems: ItemDAO[]
}
export default function OtherAccordion({ surfaceItems }: Props) {
    if (!surfaceItems || surfaceItems.length === 0) return null

    const type= surfaceItems[0].type
    const title= "Otros"
    return (
        <AccordionItem value={title} key={title}>
            <AccordionTrigger>
                <div className="flex flex-row justify-between w-full">
                    <p>{title}</p>
                    <SuperficieBox superficie={0} total={0} sufix="m²" />
                </div>
            </AccordionTrigger>
            <AccordionContent>
                {surfaceItems.map((item) => { 
                    return (
                        <div className="flex flex-row justify-between w-full" key={item.id}>
                            <p>{getShortItemDescription(item)}</p>
                            {
                                item.superficie && item.valor?
                                <SuperficieBox superficie={item.superficie * item.quantity} total={item.valor * item.quantity} sufix="m²" />
                                : null
                            }
                            
                        </div>
                    )
                })}
            </AccordionContent>
        </AccordionItem>
    )
}
