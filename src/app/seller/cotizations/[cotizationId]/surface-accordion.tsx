import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getShortItemDescription } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { ItemType } from "@prisma/client"
import LineBox from "./superficie-box"

type Props = {
    surfaceItems: ItemDAO[]
}
export default function SurfaceAccordion({ surfaceItems }: Props) {
    if (!surfaceItems || surfaceItems.length === 0) return null

    const type= surfaceItems[0].type
    const typeStr= type === ItemType.TRAMO? "Tramo" : type === ItemType.ZOCALO? "Zocalo" : type === ItemType.ALZADA? "Alzada" : ""
    const totalQuantity= surfaceItems.reduce((acc, item) => acc + item.quantity, 0)
    const title= totalQuantity === 1 ? totalQuantity + " " + typeStr : totalQuantity + " " + typeStr + "s"
    let areaTotal= 0
    let valueTotal= 0
    surfaceItems.forEach((item) => {
        if (!item.superficie || !item.valor) return

        areaTotal+= item.superficie * item.quantity
        valueTotal+= item.valor * item.quantity
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
            {surfaceItems.map((item) => { 
                return (
                    <div className="flex flex-row justify-between w-full" key={item.id}>
                        <p>{getShortItemDescription(item)}</p>
                        {
                            item.superficie && item.valor?
                            <LineBox superficie={item.superficie * item.quantity} total={item.valor * item.quantity} sufix="m²" />
                            : null
                        }
                        
                    </div>
                )
            })}
        </AccordionContent>
    </AccordionItem>
  )
}
