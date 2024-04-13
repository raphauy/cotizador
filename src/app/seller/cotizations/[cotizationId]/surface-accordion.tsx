import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getShortItemDescription } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { ItemType } from "@prisma/client"
import SuperficieBox from "./superficie-box"

type Props = {
    surfaceItems: ItemDAO[]
}
export default function SurfaceAccordion({ surfaceItems }: Props) {
    if (!surfaceItems || surfaceItems.length === 0) return null

    const type= surfaceItems[0].type
    const typeStr= type === ItemType.TRAMO? "Tramo" : type === ItemType.ZOCALO? "Zocalo" : type === ItemType.ALZADA? "Alzada" : ""
    const title= surfaceItems.length === 1 ? surfaceItems.length + " " + typeStr : surfaceItems.length + " " + typeStr + "s"
    let areaTotal= 0
    let valueTotal= 0
    surfaceItems.forEach((item) => {
        if (!item.superficie || !item.valor) return

        areaTotal+= item.superficie
        valueTotal+= item.valor
    })
  return (
    <AccordionItem value={title} key={title}>
        <AccordionTrigger>
            <div className="flex flex-row justify-between w-full">
                <p>{title}</p>
                <SuperficieBox superficie={areaTotal} total={valueTotal} />                
            </div>
        </AccordionTrigger>
        <AccordionContent>
            {surfaceItems.map((item) => { 
                return (
                    <div className="flex flex-row justify-between w-full" key={item.id}>
                        <p>{getShortItemDescription(item)}</p>
                        {
                            item.superficie && item.valor?
                            <SuperficieBox superficie={item.superficie} total={item.valor} />
                            : null
                        }
                        
                    </div>
                )
            })}
        </AccordionContent>
    </AccordionItem>
  )
}
