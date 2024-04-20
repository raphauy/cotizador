"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ItemDAO } from "@/services/item-services"
import { WorkDAO } from "@/services/work-services"
import { useEffect, useState } from "react"
import SuperficieBox from "./superficie-box"
import { ItemType } from "@prisma/client"
import SurfaceAccordion from "./surface-accordion"
import OtherAccordion from "./other-accordion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import TerminationAccordion from "./termination-accordion"

type Props = {
    work: WorkDAO
}
export function ItemsList({ work }: Props) {

    const [idSelected, setIdSelected] = useState("")

    const [loading, setLoading] = useState(false)

    const [items, setItems] = useState<ItemDAO[]>([])
    const [tramos, setTramos] = useState<ItemDAO[]>([])
    const [zocalos, setZocalos] = useState<ItemDAO[]>([])
    const [alzadas, setAlzadas] = useState<ItemDAO[]>([])
    const [terminaciones, setTerminaciones] = useState<ItemDAO[]>([])

    const [totalValue, setTotalValue] = useState(0)
  
    useEffect(() => {
        const originalItems= work.items
        const tramosFiltered= originalItems.filter((item) => item.type === ItemType.TRAMO)
        setTramos(tramosFiltered)
        const zocalosFiltered= originalItems.filter((item) => item.type === ItemType.ZOCALO)
        setZocalos(zocalosFiltered)
        const alzadosFiltered= originalItems.filter((item) => item.type === ItemType.ALZADA)
        setAlzadas(alzadosFiltered)

        const terminacionesFiltered= originalItems.filter((item) => item.type === ItemType.TERMINACION)
        setTerminaciones(terminacionesFiltered)
        // set items with the other types
        const otherItems= originalItems.filter((item) => item.type !== ItemType.TRAMO && item.type !== ItemType.ZOCALO && item.type !== ItemType.ALZADA && item.type !== ItemType.TERMINACION)
        setItems(otherItems)
        setTotalValue(originalItems.reduce((acc, item) => acc + (item.valor || 0), 0))
    }, [work])

    
    
    function handleSelectId(id: string) {
        if (idSelected === id) {
            setIdSelected("")
        } else {
            setIdSelected(id)
        }
    }

    if (work.items.length === 0) {
        return (
            <div className="h-24 flex flex-col justify-center items-center w-full border rounded-md">
                <p>Aún no hay Items</p>
                <Link href={`/seller/cotizations/${work.cotizationId}?workId=${work.id}`}>  
                    <Button variant="link" className="mt-0.5">Editar este trabajo</Button>
                </Link>
            </div>
    )
    }

    return (
        <div className="flex flex-col items-center w-full">

            <Accordion type="single" collapsible className="w-full">
                <SurfaceAccordion surfaceItems={tramos} />
                <SurfaceAccordion surfaceItems={zocalos} />
                <SurfaceAccordion surfaceItems={alzadas} />
                <TerminationAccordion terminationItems={terminaciones} />
                <OtherAccordion surfaceItems={items} />
            </Accordion>
            <div className="flex font-bold flex-row justify-between w-full pr-4 pt-4">
                <p>Total</p>
                <p className="w-20">{formatCurrency(totalValue)}</p>
            </div>
        </div>
    )
}
