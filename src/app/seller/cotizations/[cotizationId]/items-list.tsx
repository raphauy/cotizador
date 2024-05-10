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
import NormalAccordion from "./normal-accordion"
import TerminationAreaAccordion from "./termination-area-accordion"

type Props = {
    work: WorkDAO
}
export function ItemsList({ work }: Props) {

    const [items, setItems] = useState<ItemDAO[]>([])
    const [tramos, setTramos] = useState<ItemDAO[]>([])
    const [zocalos, setZocalos] = useState<ItemDAO[]>([])
    const [alzadas, setAlzadas] = useState<ItemDAO[]>([])
    const [terminaciones, setTerminaciones] = useState<ItemDAO[]>([])
    const [manosDeObras, setManosDeObras] = useState<ItemDAO[]>([])
    const [ajustes, setAjustes] = useState<ItemDAO[]>([])
    const [colocaciones, setColocaciones] = useState<ItemDAO[]>([])

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

        const manosDeObrasFiltered= originalItems.filter((item) => item.type === ItemType.MANO_DE_OBRA)
        setManosDeObras(manosDeObrasFiltered)

        const ajustesFiltered= originalItems.filter((item) => item.type === ItemType.AJUSTE)
        setAjustes(ajustesFiltered)

        const colocacionesFiltered= originalItems.filter((item) => item.type === ItemType.COLOCACION)
        setColocaciones(colocacionesFiltered)        

        // set items with the other types
        const otherItems= originalItems.filter((item) => item.type !== ItemType.TRAMO && item.type !== ItemType.ZOCALO && item.type !== ItemType.ALZADA && item.type !== ItemType.TERMINACION && item.type !== ItemType.MANO_DE_OBRA && item.type !== ItemType.AJUSTE && item.type !== ItemType.COLOCACION)
        setItems(otherItems)
        // valorParcial is the sum of each item value multiplied by the quantity
        const valorParcial= originalItems.reduce((acc, item) => acc + (item.valor || 0) * (item.quantity || 0), 0)
        const valorTerminationArea= originalItems.reduce((acc, item) => acc + (item.valorAreaTerminacion || 0) * (item.quantity || 0), 0)
        setTotalValue(valorParcial + valorTerminationArea)
    }, [work])

    if (work.items.length === 0) {
        return (
            <div className="h-24 flex flex-col justify-center items-center w-full border rounded-md">
                <p>Aún no hay Items</p>
                <Link href={`/seller/cotizations/${work.cotizationId}/edit?workId=${work.id}`}>  
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
                <TerminationAreaAccordion terminationItems={terminaciones} header="Área de Terminación" headerPlural="Áreas de Terminación" />
                <NormalAccordion items={terminaciones} header="Terminación" headerPlural="Terminaciones" />
                <NormalAccordion items={manosDeObras} header="Mano de obra" headerPlural="Manos de obra" />
                <NormalAccordion items={ajustes} header="Ajuste" headerPlural="Ajustes" /> 
                <NormalAccordion items={colocaciones} header="Colocación" headerPlural="Colocaciones" />  
                <OtherAccordion surfaceItems={items} />
            </Accordion>
            <div className="flex font-bold flex-row justify-between w-full pr-4 pt-4">
                <p>Total</p>
                <p className="text-right">{formatCurrency(totalValue)}</p>
            </div>
        </div>
    )
}
