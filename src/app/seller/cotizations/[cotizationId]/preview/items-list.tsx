"use client"

import { calculateTotalWorkValueAction } from "@/app/admin/works/work-actions"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { OptionalColorsTotalResult } from "@/services/optional-colors-services"
import { WorkDAO } from "@/services/work-services"
import { ItemType } from "@prisma/client"
import Link from "next/link"
import { useEffect, useState } from "react"
import OtherAccordion from "../other-accordion"
import ColocationPrintable from "./colocation-printable"
import ManoDeObraPrintable from "./mano-de-obra-printable"
import NormalPrintable from "./normal-printable"
import SurfacePrintable from "./surface-printable"
import { ArrowBigRight } from "lucide-react"
import { CardContent } from "@/components/ui/card"

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

    const [optionalColorsTotalResults, setOptionalColorsTotalResults] = useState<OptionalColorsTotalResult[]>([])

    const [totalValue, setTotalValue] = useState(0)

    useEffect(() => {
        calculateTotalWorkValueAction(work.id, work.optionalColors)
        .then((res) => setOptionalColorsTotalResults(res))
        .catch((err) => console.log(err))        
    }, [work])
    
  
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
        // const valorParcial= originalItems.reduce((acc, item) => acc + (item.valor || 0) * (item.quantity || 0), 0)
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
            </div>
    )
    }

    return (
        <div className="flex flex-col items-center w-full">

            <div className="w-full">
                <SurfacePrintable items={tramos} />
                <SurfacePrintable items={zocalos} />
                <SurfacePrintable items={alzadas} />
                <SurfacePrintable items={terminaciones} />
                <NormalPrintable items={terminaciones} header="Terminación" headerPlural="Terminaciones" />
                <ManoDeObraPrintable items={manosDeObras} header="Mano de obra" headerPlural="Manos de obra" />
                {/* <NormalPrintable items={ajustes} header="Ajuste" headerPlural="Ajustes" />  */}
                <OtherAccordion surfaceItems={items} />
            </div>
            <div className="flex flex-col w-full">
            {
                work.notes.length > 0 &&
                <div className="flex flex-col space-y-1">
                {
                    work.notes.map((note) => {
                        return (
                            <div className="flex items-center gap-2" key={note.id}>
                                <p className="text-sm pb-3 whitespace-pre-line">{note.text}</p>
                            </div>
                        )
                    })
                }
                </div>
            }
            </div>
            <div className="flex flex-row justify-between w-full font-bold h-6">
                <p>{work.material.name} {work.color.name}</p>
                <div className="text-right">{formatCurrency(totalValue, 0)}</div>
            </div>
            {
                optionalColorsTotalResults.map((result, index) => (
                    <div key={index} className="flex flex-row items-center justify-between w-full font-bold h-6">
                        <p>{result.materialName} {result.colorName}</p>
                        <p>{formatCurrency(result.totalValue, 0)}</p>
                    </div>
                ))
            }
            <div className="w-full">
                <ColocationPrintable items={colocaciones} />  
            </div>
        </div>
    )
}
