"use client"

import { InputDataConfig, getInputDataConfigAction } from "@/app/admin/configs/config-actions"
import { deleteColocacionAction, updateColocacionAction, upsertBatchAjusteItemAction, upsertBatchAreaItemAction, upsertBatchManoDeObraItemAction, upsertBatchTerminationItemAction } from "@/app/admin/items/item-actions"
import { getWorkDAOAction } from "@/app/admin/works/work-actions"
import { Button, buttonVariants } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { cn, formatCurrency } from "@/lib/utils"
import { ItemDAO } from "@/services/item-services"
import { WorkDAO } from "@/services/work-services"
import { ItemType } from "@prisma/client"
import { ChevronLeft, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AreaBox from "./area-box"
import ManoDeObraBox from "./mo-box"
import TerminationsBox from "./termination-box"
import AjustesBox from "./ajuste-box"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

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

export type ColocacionItem = {
    id: string
    valor: number
    description: string | undefined | null
}

export type AjusteItem = {
    id: string | undefined
    valor: number | undefined | null
    description: string | undefined
}

type Props= {
    searchParams: {
      workId: string
    }
}
export default function AddItemsPage({ searchParams }: Props) {
    const workId= searchParams.workId

    const [inputDataConfig, setInputDataConfig] = useState<InputDataConfig>({
        manosDeObraIds: [],
        tramosPorDefecto: 0,
        zocalosPorDefecto: 0,
        alzadosPorDefecto: 0,
    })

    const [work, setWork] = useState<WorkDAO>()

    const [tramos, setTramos] = useState<AreaItem[]>([])
    const [zocalos, setZocalos] = useState<AreaItem[]>([])
    const [alzadas, setAlzadas] = useState<AreaItem[]>([])
    const [terminaciones, setTerminations] = useState<TerminationItem[]>([])
    const [manoDeObras, setManoDeObras] = useState<ManoDeObraItem[]>([])
    const [ajustes, setAjustes] = useState<AjusteItem[]>([])
    const [colocacion, setColocacion] = useState<ColocacionItem>()
    
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

    const ajustesWithData= ajustes.filter((item) => item.valor && item.valor > 0) 
    const totalAjustesWithData= ajustesWithData.length

    const [loading, setLoading] = useState(false)    

    const router = useRouter()

    useEffect(() => {
        getInputDataConfigAction()
        .then((data) => {
            setInputDataConfig(data)
        })
        .catch((error) => {
            console.log(error)            
        })
    }, [])
    
    useEffect(() => {
        getWorkDAOAction(workId)
        .then((workDao) => {
            if (workDao) {
                // @ts-ignore
                setWork(workDao)
                const colocaciones= workDao.items.filter((item) => item.type === ItemType.COLOCACION)
                if (colocaciones.length > 0) {
                    const item= colocaciones[0]
                    setColocacion({
                        id: item.id,
                        valor: item.valor ? item.valor : 0,
                        description: item.description
                    })
                }
            }
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })
    }, [workId])

    useEffect(() => {
        if (!work || !inputDataConfig) return

        const items= work?.items

        const areaItemsLoaded= items.filter((item) => item.type === ItemType.TRAMO || item.type === ItemType.ZOCALO || item.type === ItemType.ALZADA)

        const tramosLoaded= getAreaItems(areaItemsLoaded, ItemType.TRAMO, inputDataConfig.tramosPorDefecto)
        setTramos(tramosLoaded)
        const zocalosLoaded= getAreaItems(areaItemsLoaded, ItemType.ZOCALO, inputDataConfig.zocalosPorDefecto)
        setZocalos(zocalosLoaded)
        const alzadasLoaded= getAreaItems(areaItemsLoaded, ItemType.ALZADA, inputDataConfig.alzadosPorDefecto)
        setAlzadas(alzadasLoaded)

        const terminationsItem= items.filter((item) => item.type === ItemType.TERMINACION)
        const terminaciones= getTerminationsItems(terminationsItem)
        setTerminations(terminaciones)

        const manoDeObrasItem= items.filter((item) => item.type === ItemType.MANO_DE_OBRA)
        const manoDeObras= getManoDeObrasItems(manoDeObrasItem, inputDataConfig.manosDeObraIds)
        setManoDeObras(manoDeObras)

        const ajustesItem= items.filter((item) => item.type === ItemType.AJUSTE)
        const ajustes= getAjustesItems(ajustesItem)
        setAjustes(ajustes)

    }, [work, inputDataConfig])


    async function handleSave() {
        setLoading(true)

        let areaSaved= false
        let terminacionesSaved= false
        let manoDeObrasSaved= false
        let ajustesSaved= false

        const allItems= [...tramos, ...zocalos, ...alzadas]

        const areaItemsWithData= allItems.filter((itemArea) => itemArea.length && itemArea.width && itemArea.length > 0 && itemArea.width > 0)
        upsertBatchAreaItemAction(workId, areaItemsWithData)
        .then((items) => {if (items) areaSaved= true})
        .catch((error) => {toast({title: "Error", description: error.message, variant: "destructive"})})

        const terminacionesWithData= terminaciones.filter((item) => item.terminationId && (item.centimeters || item.length))  
        upsertBatchTerminationItemAction(workId, terminacionesWithData)
        .then((items) => {if (items) terminacionesSaved= true})
        .catch((error) => {toast({title: "Error", description: error.message, variant: "destructive"})})

        const manoDeObrasWithData= manoDeObras.filter((item) => item.manoDeObraId)  
        upsertBatchManoDeObraItemAction(workId, manoDeObrasWithData)
        .then((items) => {if (items) manoDeObrasSaved= true})
        .catch((error) => {toast({title: "Error", description: error.message, variant: "destructive"})})

        const ajustesWithData= ajustes.filter((item) => item.valor)  
        upsertBatchAjusteItemAction(workId, ajustesWithData)
        .then((items) => {if (items) ajustesSaved= true})
        .catch((error) => {toast({title: "Error", description: error.message, variant: "destructive"})})

        if (colocacion !== undefined) {
            updateColocacion()
        }

        const maxTimeToWait= 20000
        let timeWaiting= 0
        while (timeWaiting < maxTimeToWait) {
            if (areaSaved && terminacionesSaved && manoDeObrasSaved && ajustesSaved) 
                break
            // if (timeToWait > maxTimeToWait) 
            //     break
            await new Promise((resolve) => setTimeout(resolve, 1000))
            timeWaiting+= 1000
        }
        setLoading(false)
        if (timeWaiting >= maxTimeToWait) 
            toast({title: "Error", description: "No se pudo guardar todos los items", variant: "destructive"})
        else
            toast({title: "Guardado", description: "Todos los items guardados"})
    }

    async function saveAndBack() {
        await handleSave()
        router.back()
    }

    function updateColocacion() {
        updateColocacionAction(workId)
        .then((colocacion) => {
            if (colocacion) {
                setColocacion({
                    id: colocacion.id,
                    valor: colocacion.valor ? colocacion.valor : 0,
                    description: colocacion.description
                })
            }
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })
    }

    function toggleColocacion() {
        const enabled= colocacion !== undefined
        if (enabled) {
            deleteColocacionAction(colocacion.id)
            .then((colocacion) => {
                if (colocacion) {
                    setColocacion(undefined)
                    toast({title: "Colocación eliminada" })
                }
            })
            .catch((error) => {
                toast({title: "Error", description: error.message, variant: "destructive"})
            })
        } else {
            updateColocacion()
        }
    }

    return (
        <div className="w-full mb-20">
            <Button variant="link" onClick={() => router.back()} className="px-0">
                <ChevronLeft className="w-5 h-5" /> Volver
            </Button>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between"> 
                        <CardTitle className="flex items-center gap-1 lg:text-2xl">
                            {work?.workType.name}{work?.reference && <p className="lg:text-lg text-muted-foreground">({work?.reference})</p>}
                        </CardTitle>
                        <p className="lg:text-lg text-muted-foreground">{work?.material.name} ({work?.color.name})</p>
                    </div>
                </CardHeader>
            </Card>
            <div className="grid lg:grid-cols-3 gap-2">
                <div>
                    <p className="text-2xl font-bold mt-4 mb-3 text-center lg:text-left">Tramos <span className="font-bold text-xl">{totalTramosWithData > 0 ? "(" + totalTramosWithData + ")" : ""}</span></p>
                    <AreaBox workId={workId} itemType={ItemType.TRAMO} itemAreas={tramos} setItemAreas={setTramos} />
                </div>
                <div>
                    <p className="text-2xl font-bold mt-4 mb-3 text-center lg:text-left">Zocalos <span className="font-bold text-xl">{totalZocalosWithData > 0 ? "(" + totalZocalosWithData + ")" : ""}</span></p>
                    <AreaBox workId={workId} itemType={ItemType.ZOCALO} itemAreas={zocalos} setItemAreas={setZocalos} />
                </div>
                <div>
                    <p className="text-2xl font-bold mt-4 mb-3 text-center lg:text-left">Alzadas <span className="font-bold text-xl">{totalAlzadasWithData > 0 ? "(" + totalAlzadasWithData + ")" : ""}</span></p>
                    <AreaBox workId={workId} itemType={ItemType.ALZADA} itemAreas={alzadas} setItemAreas={setAlzadas} />
                </div>
            </div>

            <div className="mt-10">
                <p className="text-2xl font-bold mb-3 text-center lg:text-left">Terminaciones <span className="font-bold text-xl">{totalTerminationsWithData > 0 ? "(" + totalTerminationsWithData + ")" : ""}</span></p>
                <TerminationsBox workId={workId} cantidad={1} itemTerminations={terminaciones} setItemTerminations={setTerminations} />
            </div>

            <div className="mt-10">
                <p className="text-2xl font-bold mb-3 text-center lg:text-left">Mano de Obra <span className="font-bold text-xl">{totalManoDeObrasWithData > 0 ? "(" + totalManoDeObrasWithData + ")" : ""}</span></p>
                <ManoDeObraBox itemManoDeObras={manoDeObras} setItemManoDeObras={setManoDeObras} />
            </div>

            <div className="mt-10">
                <p className="text-2xl font-bold mb-3 text-center lg:text-left">Ajustes globales del trabajo<span className="font-bold text-xl">{totalAjustesWithData > 0 ? "(" + totalAjustesWithData + ")" : ""}</span></p>
                <AjustesBox items={ajustes} setAjustes={setAjustes} />
            </div>

            <div className="mt-10">
                <p className="text-2xl font-bold mb-3 text-center lg:text-left">Colocación</p>
                <div className="space-y-4 bg-white rounded-lg dark:bg-gray-800 p-4 border">
                    <Switch onCheckedChange={toggleColocacion} checked={colocacion !== undefined} />
                    <p className="whitespace-pre-line">{colocacion?.description}</p>
                    <p>{colocacion?.valor ? formatCurrency(colocacion?.valor) : ""}</p>
                </div>
            </div>

            <div className="mt-10">
                <div className="flex justify-end gap-4">
                    <div onClick={() => router.back()} className={cn("w-40 cursor-pointer", buttonVariants({ variant: "outline" }))}>
                        Volver
                    </div>
                    <Button onClick={handleSave} className="w-40">
                        {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar y seguir</p>}
                    </Button>
                    <Button onClick={saveAndBack} className="w-40">
                        {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar y volver</p>}
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

function getManoDeObrasItems(items: ItemDAO[], defaultManosDeObraIds: string[]) {
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
        const newManoDeObrasItems= getInitManoDeObrasItems(defaultManosDeObraIds)
        return newManoDeObrasItems
    }

    return manoDeObrasItemsMaped
}

function getInitManoDeObrasItems(defaultManosDeObraIds: string[]) {
    const items: ManoDeObraItem[] = []
    defaultManosDeObraIds.forEach((defaultManoDeObraId) => {
        
        const itemManoDeObra: ManoDeObraItem = {
            id: undefined,
            manoDeObraId: defaultManoDeObraId,
            quantity: 1,
            length: undefined,
            width: undefined,
            centimeters: 0,
            ajuste: 0,
        }
        items.push(itemManoDeObra)
    })
    return items
}

function getAjustesItems(items: ItemDAO[]) {
    const itemsFiltered= items.filter((item) => item.type === ItemType.AJUSTE)
    const ajustesItemsMaped= itemsFiltered.map((item) => ({
        id: item.id,
        valor: item.valor,
        description: item.description,
        type: item.type,
    }))

    // if (ajustesItemsMaped.length === 0) {
    //     const newAjustesItems= getInitAjustesItems()
    //     return newAjustesItems
    // }

    return ajustesItemsMaped
}

// function getInitAjustesItems() {
//     const items: AjusteItem[] = []
//     for (let i = 0; i < 1; i++) {
//         const itemAjuste: AjusteItem = {
//             id: undefined,
//             valor: 0,
//             description: "",
//         }
//         items.push(itemAjuste)
//     }
//     return items
// }

