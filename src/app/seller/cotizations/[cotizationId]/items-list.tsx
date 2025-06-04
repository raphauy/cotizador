"use client"

import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { OptionalColorsTotalResult } from "@/services/optional-colors-services"
import { WorkDAO } from "@/services/work-services"
import { ClientType, ItemType } from "@prisma/client"
import Link from "next/link"
import { useEffect, useState } from "react"
import NormalAccordion from "./normal-accordion"
import OtherAccordion from "./other-accordion"
import SurfaceAccordion from "./surface-accordion"
import TerminationAreaAccordion from "./termination-area-accordion"
import ColocacionBox from "./colocacion-box"

type Props = {
    work: WorkDAO
    clientType: ClientType
    colorPrice: number
    optionalColorsTotalResults: OptionalColorsTotalResult[]
}
export function ItemsList({ work, optionalColorsTotalResults, clientType, colorPrice }: Props) {

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
        const valorParcial= originalItems
        .filter((item) => item.type !== ItemType.COLOCACION)
        .reduce((acc, item) => acc + (item.valor || 0) * (item.quantity || 0), 0)
        const valorTerminationArea= originalItems.reduce((acc, item) => acc + (item.valorAreaTerminacion || 0) * (item.quantity || 0), 0)
        setTotalValue(valorParcial + valorTerminationArea)
    }, [work])

    if (work.items.length === 0) {
        return (
            <div className="h-24 flex flex-col justify-center items-center w-full border rounded-md">
                <p>Aún no hay Items</p>
                <Link href={`/seller/cotizations/${work.cotizationId}/${work.id}`}>  
                    <Button variant="link" className="mt-0.5">Editar este trabajo</Button>
                </Link>
            </div>
    )
    }

    return (
        <div className="flex flex-col items-center w-full">

            <Accordion type="single" collapsible className="w-full">
                <SurfaceAccordion surfaceItems={tramos} colorPrice={colorPrice} />
                <SurfaceAccordion surfaceItems={zocalos} colorPrice={colorPrice} />
                <SurfaceAccordion surfaceItems={alzadas} colorPrice={colorPrice} />
                <TerminationAreaAccordion terminationItems={terminaciones} header="Área de Terminación" headerPlural="Áreas de Terminación" colorPrice={colorPrice} />
                <NormalAccordion items={terminaciones} header="Terminación" headerPlural="Terminaciones" clientType={clientType} />
                <NormalAccordion items={manosDeObras} header="Mano de obra" headerPlural="Manos de obra" clientType={clientType} />
                <NormalAccordion items={ajustes} header="Ajuste" headerPlural="Ajustes" clientType={clientType} />
                <OtherAccordion surfaceItems={items} />
            </Accordion>
            <div className="flex font-bold flex-row justify-between w-full pt-4 mb-2">
                <p>Total</p>
                <p className="text-right">{formatCurrency(totalValue)}</p>
            </div>
            {
                optionalColorsTotalResults.map((result, index) => {

                    return(
                    <div key={index} className="flex flex-row items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <p className="text-sm">{result.materialName} {result.colorName}</p>
                            <div className="flex gap-1">
                                {result.archived && (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                                        Archivado
                                    </Badge>
                                )}
                                {result.discontinued && (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                        Discontinuado
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <p className="text-sm">({formatCurrency(result.colorPrice, 0)})</p>
                            <p className="text-right">{formatCurrency(result.totalValue, 0)}</p>
                        </div>
                    </div>
                )})
            }
            <div className="w-full mt-4">
                <ColocacionBox items={colocaciones} clientType={clientType} />
            </div>
        </div>
    )
}
