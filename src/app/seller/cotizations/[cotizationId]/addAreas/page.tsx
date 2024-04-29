"use client"

import { upsertBatchAreaItemAction, upsertBatchManoDeObraItemAction, upsertBatchTerminationItemAction } from "@/app/admin/items/item-actions"
import { getWorkDAOAction } from "@/app/admin/works/work-actions"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { WorkDAO } from "@/services/work-services"
import { ItemType } from "@prisma/client"
import { ChevronLeft, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AreaBox from "./area-box"
import TerminationsBox from "./termination-box"
import { ItemDAO } from "@/services/item-services"
import ManoDeObraBox from "./mo-box"

export type AreaItem = {
    id: string | undefined
    quantity: number | undefined | null
    length: number | undefined | null
    width: number | undefined | null
    type: ItemType
}

export type TerminationItem = {
    id: string | undefined
    terminationId: string | undefined
    quantity: number | undefined | null
    length: number | undefined | null
    width: number | undefined | null
    centimeters: number | undefined | null
    ajuste: number | undefined | null
}

export type ManoDeObraItem = {
    id: string | undefined
    manoDeObraId: string | undefined
    quantity: number | undefined | null
    length: number | undefined | null
    width: number | undefined | null
    centimeters: number | undefined | null
    ajuste: number | undefined | null
}

type Props= {
    searchParams: {
      workId: string
    }
}
export default function AddItemsPage({ searchParams }: Props) {
    const workId= searchParams.workId
    const [cantidadTramosIniciales, setCantidadTramosIniciales] = useState(4)

    const [work, setWork] = useState<WorkDAO>()

    const [tramos, setTramos] = useState<AreaItem[]>([])
    const [zocalos, setZocalos] = useState<AreaItem[]>([])
    const [alzadas, setAlzadas] = useState<AreaItem[]>([])
    const [terminaciones, setTerminations] = useState<TerminationItem[]>([])
    const [manoDeObras, setManoDeObras] = useState<ManoDeObraItem[]>([])
    
    const tramosWithData= tramos.filter((items) => items.length && items.width && items.length > 0 && items.width > 0)
    const totalTramosWithData= tramosWithData.reduce((acc, items) => acc + (items.quantity ? items.quantity : 0), 0)
    const zocalosWithData= zocalos.filter((items) => items.length && items.width && items.length > 0 && items.width > 0)
    const totalZocalosWithData= zocalosWithData.reduce((acc, items) => acc + (items.quantity ? items.quantity : 0), 0)
    const alzadasWithData= alzadas.filter((items) => items.length && items.width && items.length > 0 && items.width > 0)
    const totalAlzadasWithData= alzadasWithData.reduce((acc, items) => acc + (items.quantity ? items.quantity : 0), 0)

    const terminacionesWithData= terminaciones.filter((item) => item.terminationId && (item.centimeters && item.centimeters > 0) || (item.length && item.width && item.length > 0 && item.width > 0))
    const totalTerminationsWithData= terminacionesWithData.reduce((acc, item) => acc + (item.quantity ? item.quantity : 0), 0)

    const manoDeObrasWithData= manoDeObras.filter((item) => item.manoDeObraId)  
    const totalManoDeObrasWithData= manoDeObrasWithData.reduce((acc, item) => acc + (item.quantity ? item.quantity : 0), 0)

    const [loading, setLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        getWorkDAOAction(workId)
        .then((workDao) => {
            if (workDao) {
                // @ts-ignore
                setWork(workDao)
            }
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })
    }, [workId])

    useEffect(() => {
        if (!work) return

        const items= work?.items

        const areaItemsLoaded= items.filter((item) => item.type === ItemType.TRAMO || item.type === ItemType.ZOCALO || item.type === ItemType.ALZADA)

        const tramosLoaded= getAreaItems(areaItemsLoaded, ItemType.TRAMO, cantidadTramosIniciales)
        setTramos(tramosLoaded)
        const zocalosLoaded= getAreaItems(areaItemsLoaded, ItemType.ZOCALO)
        setZocalos(zocalosLoaded)
        const alzadasLoaded= getAreaItems(areaItemsLoaded, ItemType.ALZADA)
        setAlzadas(alzadasLoaded)

        const terminationsItem= items.filter((item) => item.type === ItemType.TERMINACION)
        const terminaciones= getTerminationsItems(terminationsItem)
        setTerminations(terminaciones)

        const manoDeObrasItem= items.filter((item) => item.type === ItemType.MANO_DE_OBRA)
        const manoDeObras= getManoDeObrasItems(manoDeObrasItem)
        setManoDeObras(manoDeObras)

    }, [work, cantidadTramosIniciales])


    function handleSave() {
        setLoading(true)

        const allItems= [...tramos, ...zocalos, ...alzadas]
        const areaItemsWithData= allItems.filter((itemArea) => itemArea.length && itemArea.width && itemArea.length > 0 && itemArea.width > 0)
        console.log(areaItemsWithData)


        upsertBatchAreaItemAction(workId, areaItemsWithData)
        .then((items) => {
            if (items) {
                // toast({title: "Items de áreas guardados" })
            }
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })

        const terminacionesWithData= terminaciones.filter((item) => item.terminationId && (item.centimeters || item.length))  
        upsertBatchTerminationItemAction(workId, terminacionesWithData)
        .then((items) => {
            if (items) {
                // toast({title: "Items de terminaciones guardados" })
            }
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })

        const manoDeObrasWithData= manoDeObras.filter((item) => item.manoDeObraId)  
        upsertBatchManoDeObraItemAction(workId, manoDeObrasWithData)
        .then((items) => {
            if (items) {
                toast({title: "Items guardados" })
            }
            setLoading(false)
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })

    }

    return (
        <div className="w-full mb-20">
            <Button variant="link" onClick={() => router.back()} className="px-0">
                <ChevronLeft className="w-5 h-5" /> Volver
            </Button>
            <div className="grid lg:grid-cols-3 gap-2">
                <div>
                    <p className="text-2xl font-bold mt-4 mb-3 text-center lg:text-left">Tramos <span className="font-bold text-xl">{totalTramosWithData > 0 ? "(" + totalTramosWithData + ")" : ""}</span></p>
                    <AreaBox workId={workId} itemType={ItemType.TRAMO} cantidad={cantidadTramosIniciales} itemAreas={tramos} setItemAreas={setTramos} />
                </div>
                <div>
                    <p className="text-2xl font-bold mt-4 mb-3 text-center lg:text-left">Zocalos <span className="font-bold text-xl">{totalZocalosWithData > 0 ? "(" + totalZocalosWithData + ")" : ""}</span></p>
                    <AreaBox workId={workId} itemType={ItemType.ZOCALO} cantidad={0} itemAreas={zocalos} setItemAreas={setZocalos} />
                </div>
                <div>
                    <p className="text-2xl font-bold mt-4 mb-3 text-center lg:text-left">Alzadas <span className="font-bold text-xl">{totalAlzadasWithData > 0 ? "(" + totalAlzadasWithData + ")" : ""}</span></p>
                    <AreaBox workId={workId} itemType={ItemType.ALZADA} cantidad={0} itemAreas={alzadas} setItemAreas={setAlzadas} />
                </div>
            </div>

            <div className="mt-10">
                <p className="text-2xl font-bold mb-3 text-center lg:text-left">Terminaciones <span className="font-bold text-xl">{totalTerminationsWithData > 0 ? "(" + totalTerminationsWithData + ")" : ""}</span></p>
                <TerminationsBox workId={workId} cantidad={1} itemTerminations={terminaciones} setItemTerminations={setTerminations} />
            </div>
            <div className="mt-10">
                <p className="text-2xl font-bold mb-3 text-center lg:text-left">Mano de Obra <span className="font-bold text-xl">{totalManoDeObrasWithData > 0 ? "(" + totalManoDeObrasWithData + ")" : ""}</span></p>
                <ManoDeObraBox workId={workId} cantidad={1} itemManoDeObras={manoDeObras} setItemManoDeObras={setManoDeObras} />
            </div>

            <div className="mt-10">
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => router.back()} className="w-40">
                        Volver
                    </Button>
                    <Button onClick={handleSave} className="w-40">
                        {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
                    </Button>
                    
                </div>
        </div>
       </div>
   )
}

function getAreaItems(items: ItemDAO[], type: ItemType, cantidadIniciales: number = 1) {
    const itemsFiltered= items.filter((item) => item.type === type)
    const areaItemsMaped= itemsFiltered.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        length: item.largo,
        width: item.ancho,
        type: item.type,
    }))

    if (areaItemsMaped.length === 0) {
        const newAreaItems= getInitAreaItems(cantidadIniciales, type)
        return newAreaItems
    }

    return areaItemsMaped
}

function getTerminationsItems(items: ItemDAO[], cantidadIniciales: number = 1) {
    const itemsFiltered= items.filter((item) => item.type === ItemType.TERMINACION)
    const terminationsItemsMaped= itemsFiltered.map((item) => ({
        id: item.id,
        type: item.type,
        terminationId: item.terminacionId,
        quantity: item.quantity,
        length: item.largo,
        width: item.ancho,
        centimeters: (item.centimetros ? item.centimetros : 0),
        ajuste: item.ajuste,
    }))

    if (terminationsItemsMaped.length === 0) {
        const newTerminationsItems= getInitTerminationsItems(cantidadIniciales)
        return newTerminationsItems
    }

    return terminationsItemsMaped
}

function getInitAreaItems(cantidad: number, type: ItemType) {
    const items= []
    for (let i = 0; i < cantidad; i++) {
        const itemArea: AreaItem = {
            id: undefined,
            quantity: 1,
            length: undefined,
            width: undefined,
            type: type,
        }
        items.push(itemArea)
    }
    return items
}

function getInitTerminationsItems(cantidad: number) {
    const items= []
    for (let i = 0; i < cantidad; i++) {
        const itemTermination: TerminationItem = {
            id: undefined,
            terminationId: undefined,
            quantity: 1,
            length: undefined,
            width: undefined,
            centimeters: 0,
            ajuste: 0,
        }
        items.push(itemTermination)
    }
    return items
}

function getManoDeObrasItems(items: ItemDAO[], cantidadIniciales: number = 1) {
    const itemsFiltered= items.filter((item) => item.type === ItemType.MANO_DE_OBRA)
    const manoDeObrasItemsMaped= itemsFiltered.map((item) => ({
        id: item.id,
        manoDeObraId: item.manoDeObraId,
        quantity: item.quantity,
        length: item.largo,
        width: item.ancho,
        centimeters: (item.centimetros ? item.centimetros : 0),
        ajuste: item.ajuste,
        type: item.type,
    }))

    if (manoDeObrasItemsMaped.length === 0) {
        const newManoDeObrasItems= getInitManoDeObrasItems(cantidadIniciales)
        return newManoDeObrasItems
    }

    return manoDeObrasItemsMaped
}

function getInitManoDeObrasItems(cantidad: number) {
    const items= []
    for (let i = 0; i < cantidad; i++) {
        const itemManoDeObra: ManoDeObraItem = {
            id: undefined,
            manoDeObraId: undefined,
            quantity: 1,
            length: undefined,
            width: undefined,
            centimeters: 0,
            ajuste: 0,
        }
        items.push(itemManoDeObra)
    }
    return items
}

