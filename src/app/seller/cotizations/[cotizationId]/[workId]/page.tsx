"use client"

import { getColocacionsDAOAction } from "@/app/admin/colocations/colocacion-actions"
import { InputDataConfig, getInputDataConfigAction } from "@/app/admin/configs/config-actions"
import { deleteColocacionAction, updateColocacionAction, upsertBatchAjusteItemAction, upsertBatchAreaItemAction, upsertBatchManoDeObraItemAction, upsertBatchTerminationItemAction } from "@/app/admin/items/item-actions"
import { getWorkDAOAction } from "@/app/admin/works/work-actions"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { cn, formatCurrency } from "@/lib/utils"
import { ColocacionDAO } from "@/services/colocacion-services"
import { ItemDAO } from "@/services/item-services"
import { WorkDAO } from "@/services/work-services"
import { CotizationStatus, ItemType } from "@prisma/client"
import { AlertCircle, ChevronLeft, Loader, RefreshCcw, TriangleAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import AjustesBox from "./ajuste-box"
import AreaBox from "./area-box"
import ColocationForm from "./colocation-form"
import ManoDeObraBox from "./mo-box"
import TerminationsBox from "./termination-box"

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
    isLinear: boolean | undefined
    isSurface: boolean | undefined
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
    colocacionId: string | undefined
}

export type AjusteItem = {
    id: string | undefined
    valor: number | undefined | null
    description: string | undefined
}

type Props= {
    params: {
      workId: string
    }
}
export default function AddItemsPage({ params }: Props) {
    const workId= params.workId

    const [inputDataConfig, setInputDataConfig] = useState<InputDataConfig>({
        manosDeObraIds: [],
        tramosPorDefecto: 0,
        zocalosPorDefecto: 0,
        alzadosPorDefecto: 0,
    })

    const [saveCount, setSaveCount] = useState(0)

    const [work, setWork] = useState<WorkDAO>()
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const [tramos, setTramos] = useState<AreaItem[]>([])
    const [zocalos, setZocalos] = useState<AreaItem[]>([])
    const [alzadas, setAlzadas] = useState<AreaItem[]>([])
    const [terminaciones, setTerminations] = useState<TerminationItem[]>([])
    const [manoDeObras, setManoDeObras] = useState<ManoDeObraItem[]>([])
    const [ajustes, setAjustes] = useState<AjusteItem[]>([])
    const [colocacion, setColocacion] = useState<ColocacionItem>()
    
    const [colocaciones, setColocaciones] = useState<ColocacionDAO[]>([])

    const tramosWithData = useMemo(() =>
        tramos.filter((items) => items.length && items.width && items.length > 0 && items.width > 0), [tramos])
    const totalTramosWithData = useMemo(() =>
        tramosWithData.reduce((acc, items) => acc + (items.quantity ? items.quantity : 0), 0), [tramosWithData])

    const zocalosWithData = useMemo(() =>
        zocalos.filter((items) => items.length && items.width && items.length > 0 && items.width > 0), [zocalos])
    const totalZocalosWithData = useMemo(() =>
        zocalosWithData.reduce((acc, items) => acc + (items.quantity ? items.quantity : 0), 0), [zocalosWithData])

    const alzadasWithData = useMemo(() =>
        alzadas.filter((items) => items.length && items.width && items.length > 0 && items.width > 0), [alzadas])
    const totalAlzadasWithData = useMemo(() =>
        alzadasWithData.reduce((acc, items) => acc + (items.quantity ? items.quantity : 0), 0), [alzadasWithData])

    const terminacionesWithData = useMemo(() =>
        terminaciones.filter((item) => item.terminationId && (item.centimeters && item.centimeters > 0) || (item.length && item.width && item.length > 0 && item.width > 0)), [terminaciones])
    const totalTerminationsWithData = useMemo(() =>
        terminacionesWithData.reduce((acc, item) => acc + (item.quantity ? item.quantity : 0), 0), [terminacionesWithData])

    const manoDeObrasWithData = useMemo(() =>
        manoDeObras.filter((item) => item.manoDeObraId), [manoDeObras])
    const totalManoDeObrasWithData = useMemo(() =>
        manoDeObrasWithData.reduce((acc, item) => acc + (item.quantity ? item.quantity : 0), 0), [manoDeObrasWithData])

    const ajustesWithData = useMemo(() =>
        ajustes.filter((item) => item.valor && item.valor > 0), [ajustes])
    const totalAjustesWithData = useMemo(() =>
        ajustesWithData.length, [ajustesWithData])

    const [loading, setLoading] = useState(false)    
    const [isColocacionLoading, setIsColocacionLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        getColocacionsDAOAction()
        .then((colocaciones) => {
            setColocaciones(colocaciones)
        })
        
    }, [])

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
                setWork(workDao)
                if (!isColocacionLoading) {
                    const colocaciones = workDao.items.filter((item) => item.type === ItemType.COLOCACION)
                    if (colocaciones.length > 0) {
                        const item = colocaciones[0]
                        setColocacion({
                            id: item.id,
                            valor: item.valor ? item.valor : 0,
                            description: item.description,
                            colocacionId: item.colocacionId
                        })
                    } else {
                        setColocacion(undefined)
                    }
                }
            }
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })
    }, [workId, isColocacionLoading])

    useEffect(() => {
        if (!work || !inputDataConfig || !isInitialLoad) return

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

        setIsInitialLoad(false)

    }, [work, inputDataConfig, isInitialLoad])


    async function handleSave() {
        if (!work) return
  
        const status= work.cotization.status
        if (status !== CotizationStatus.BORRADOR) {
            toast({title: "Este presupuesto ya no se puede editar", description: "Solo puede editar presupuestos en estado BORRADOR", variant: "destructive"})
            return
        }
          
        setLoading(true)

        const allItems= [...tramos, ...zocalos, ...alzadas]
        const areaItemsWithData= allItems.filter((itemArea) => itemArea.length && itemArea.width && itemArea.length > 0 && itemArea.width > 0)
        const terminacionesWithData= terminaciones.filter((item) => item.terminationId && (item.centimeters || item.length))  
        const manoDeObrasWithData= manoDeObras.filter((item) => item.manoDeObraId && ((item.quantity || 0) > 0))
        const ajustesWithData= ajustes.filter((item) => item.valor)  

        try {
            const [areaSaved, terminacionesSaved, manoDeObrasSaved, ajustesSaved] = await Promise.all([
                upsertBatchAreaItemAction(workId, areaItemsWithData),
                upsertBatchTerminationItemAction(workId, terminacionesWithData),
                upsertBatchManoDeObraItemAction(workId, manoDeObrasWithData),
                upsertBatchAjusteItemAction(workId, ajustesWithData)
            ])

            if (!areaSaved || !terminacionesSaved || !manoDeObrasSaved || !ajustesSaved) {
                throw new Error("No se pudo guardar todos los items")
            }

            if (colocacion && colocacion.colocacionId) {
                updateColocacion(colocacion.colocacionId)
            }

            toast({title: "Guardado", description: "Todos los items guardados."})
        } catch (error: any) {
            toast({title: "Error", description: error.message, variant: "destructive"})
        } finally {
            setLoading(false)
            setSaveCount(saveCount + 1)
        }
    }

    async function saveAndBack() {
        await handleSave()
        router.back()
    }

    function updateColocacion(colocacionId: string) {
        if (!colocacionId) return

        setIsColocacionLoading(true)
        updateColocacionAction(workId, colocacionId)
        .then((colocacionResponse) => {
            if (colocacionResponse) {
                setColocacion({
                    id: colocacionResponse.id,
                    valor: colocacionResponse.valor ? colocacionResponse.valor : 0,
                    description: colocacionResponse.description,
                    colocacionId: colocacionResponse.colocacionId ? colocacionResponse.colocacionId : undefined
                })
            }
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })
        .finally(() => {
            setIsColocacionLoading(false)
        })
    }

    function notifyColocationSelected(itemId: string | undefined, colocacionSelected: ColocacionDAO | undefined) {
        console.log("notifyColocationSelected")
        if (colocacion) {
            setColocacion({
                ...colocacion,
                colocacionId: colocacionSelected?.id ? colocacionSelected.id : undefined
            })
            if (colocacionSelected) {
                updateColocacion(colocacionSelected.id)
            }
        }
    }

    async function toggleColocacion(checked?: boolean) {
        if (colocacion) {
            // Caso: se está desactivando la colocación
            const previousColocacion = colocacion;
            setIsColocacionLoading(true);
            try {
                await handleSave()
                const resp = await deleteColocacionAction(previousColocacion.id);
                if (!resp) {
                    // Si falla, revertir el cambio
                    setColocacion(previousColocacion);
                    toast({ title: "Error al eliminar colocación", variant: "destructive" });
                } else {
                    setColocacion(undefined);
                    toast({ title: "Colocación eliminada" });
                }
            } catch (error: any) {
                setColocacion(previousColocacion);
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } finally {
                setIsColocacionLoading(false);
            }
        } else {
            // Caso: se está activando la colocación
            recalculateColocation()
        }
    }

    async function recalculateColocation() {
        const colocacionId = colocacion?.colocacionId || colocaciones[0]?.id;
        if (colocacionId) {
            setIsColocacionLoading(true);

            await handleSave()
            try {
                const colocacionResponse = await updateColocacionAction(workId, colocacionId);
                if (colocacionResponse) {
                    setColocacion({
                        id: colocacionResponse.id,
                        valor: colocacionResponse.valor ? colocacionResponse.valor : 0,
                        description: colocacionResponse.description,
                        colocacionId: colocacionResponse.colocacionId ? colocacionResponse.colocacionId : undefined
                    });
                    toast({ title: "Colocación actualizada" });
                } else {
                    setColocacion(undefined);
                    toast({ title: "Error", description: "No se pudo recalcular la colocación", variant: "destructive" });
                }
            } catch (error: any) {
                setColocacion(undefined);
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } finally {
                setIsColocacionLoading(false);
            }
        }
    }

    const status= work?.cotization.status
    if (!status) {
        return (
            <div className="">
                <Loader className="h-6 w-6 animate-spin" />
            </div>
        )
    } else if (status !== CotizationStatus.BORRADOR) {
        return (
            <div className="">
                <Button variant="link" onClick={() => router.back()} className="px-0">
                    <ChevronLeft className="w-5 h-5" /> Volver
                </Button>
                <div className="p-4 bg-white border rounded-xl flex items-center gap-2 w-fit">
                    <TriangleAlert className="w-5 h-5 text-yellow-400" />
                    <p className="text-lg">Este presupuesto ya no se puede editar</p>
                </div>
            </div>
        )
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
                <ManoDeObraBox itemManoDeObras={manoDeObras} setItemManoDeObras={setManoDeObras} workId={workId} />
            </div>

            <div className="mt-10">
                <p className="text-2xl font-bold mb-3 text-center lg:text-left">Ajustes globales del trabajo<span className="font-bold text-xl">{totalAjustesWithData > 0 ? "(" + totalAjustesWithData + ")" : ""}</span></p>
                <AjustesBox items={ajustes} setAjustes={setAjustes} />
            </div>

            <div className="mt-10">
                <p className="text-2xl font-bold mb-3 text-center lg:text-left">Colocación</p>
                <div className="space-y-4 bg-white rounded-lg dark:bg-gray-800 p-4 border">
                    <div className="flex items-center gap-4">
                        <Switch disabled={isColocacionLoading || loading} onCheckedChange={(checked, ...rest) => toggleColocacion(checked)} checked={colocacion !== undefined} />
                        {
                            colocacion && colocaciones[0] && 
                                <ColocationForm 
                                  itemId={colocacion.id} 
                                  defaultColocacionId={colocacion.colocacionId ? colocacion.colocacionId : colocaciones[0].id} 
                                  notifyColocationSelected={notifyColocationSelected} 
                                  colocaciones={colocaciones} 
                                  disabled={isColocacionLoading}
                                />
                        }
                        { colocacion && 
                            <Button onClick={recalculateColocation} disabled={isColocacionLoading || loading}>
                                <RefreshCcw className="w-4 h-4 mr-2" /> Recalcular
                            </Button>
                        }
                        {(isColocacionLoading || (loading && colocacion)) && (
                            <div className="flex items-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                <p>Guardando y calculando colocación...</p>
                            </div>
                        )}
                    </div>
                    <p className="whitespace-pre-line">{colocacion?.description}</p>
                    <p>{colocacion?.valor ? formatCurrency(colocacion?.valor) : ""}</p>
                </div>
            </div>

            <div className="mt-10">
                <div className="flex justify-end gap-4">
                    <Button onClick={() => router.back()} className="w-40" variant="outline" disabled={loading || isColocacionLoading}>
                        Volver
                    </Button>
                    <Button onClick={handleSave} className="w-40" disabled={loading || isColocacionLoading}>
                        {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar y seguir</p>}
                    </Button>
                    <Button onClick={saveAndBack} className="w-40" disabled={loading || isColocacionLoading}>
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
            quantity: 0,
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
            quantity: 0,
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
        isLinear: item.manoDeObra?.isLinear,
        isSurface: item.manoDeObra?.isSurface,
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
            quantity: 0,
            length: undefined,
            width: undefined,
            centimeters: 0,
            ajuste: 0,
            isLinear: false,
            isSurface: false,
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

