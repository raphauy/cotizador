"use client"

import { deleteItemAction, setManoDeObraToItemAction } from "@/app/admin/items/item-actions"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Loader, PlusCircle, X } from "lucide-react"
import { useEffect, useState } from "react"
import { ManoDeObraItem, TerminationItem } from "./page"
import MOForm from "./mo-form"
import { getManoDeObrasDAOAction, getManoDeObrasForWorkDAOAction } from "@/app/admin/manodeobras/manodeobra-actions"
import { ManoDeObraDAO } from "@/services/manodeobra-services"

type Props= {
    itemManoDeObras: ManoDeObraItem[]
    setItemManoDeObras: (items: ManoDeObraItem[]) => void
    workId?: string
}
export default function ManoDeObraBox({ itemManoDeObras, setItemManoDeObras, workId }: Props) {
    
    const [loading, setLoading] = useState(false)
    const [loadingMO, setLoadingMO] = useState(false)

    const [manoDeObras, setManoDeObras] = useState<ManoDeObraDAO[]>([])
    
    useEffect(() => {
        setLoadingMO(true)

        if (workId) {
            // Si hay un workId, usar la función que incluye manos de obra archivadas en uso
            getManoDeObrasForWorkDAOAction(workId)
            .then((manoDeObras) => {
                setManoDeObras(manoDeObras)
            })
            .catch((error) => {
                console.error("Error al cargar manos de obra:", error)
                toast({
                    title: "Error al cargar manos de obra",
                    description: "No se pudieron cargar las manos de obra. Intente nuevamente.",
                    variant: "destructive"
                })
            })
            .finally(() => {
                setLoadingMO(false)
            })
        } else {
            // Si no hay workId, usar la función normal pero incluir archivados
            getManoDeObrasDAOAction(true) // true para incluir archivados
            .then((manoDeObras) => {
                setManoDeObras(manoDeObras)
            })
            .catch((error) => {
                console.error("Error al cargar manos de obra:", error)
                toast({
                    title: "Error al cargar manos de obra",
                    description: "No se pudieron cargar las manos de obra. Intente nuevamente.",
                    variant: "destructive"
                })
            })
            .finally(() => {
                setLoadingMO(false)
            })
        }
        
    }, [workId])

    function addItem() {
        const newAreas= [...itemManoDeObras, { id: undefined, manoDeObraId: undefined, quantity: 0, length: 0, width: 0, centimeters: 0, ajuste: 0, isLinear: false, isSurface: false }]
        setItemManoDeObras(newAreas)
    }

    function removeItem(index: number) {
        const itemToRemove= itemManoDeObras[index]
        if (itemToRemove.id) {
            setLoading(true)
            deleteItemAction(itemToRemove.id)
            .then((items) => {
                if (items) {
                    toast({title: "Item eliminado" })
                }
                setItemManoDeObras(itemManoDeObras.filter((item, i) => i !== index))
            })
            .catch((error) => {
                toast({title: "Error", description: error.message, variant: "destructive"})
            })
            .finally(() => {
                setLoading(false)
            })
        } else {
            console.log("Removing item at index:", index)
            const newItems = [...itemManoDeObras]
            newItems.splice(index, 1)
            setItemManoDeObras(newItems)
        }
    }

    function setManoDeObraToItem(itemId: string, manoDeObraId: string) {
        setLoading(true)
        setManoDeObraToItemAction(itemId, manoDeObraId)
        .then(() => {
            toast({title: "Mano de obra actualizada" })
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })
        .finally(() => {
            setLoading(false)
        })
    }

    function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const actualQuantity= itemManoDeObras[index].quantity
        if (actualQuantity?.toString() === e.target.value) {
            console.log("quantity already set")
            return
        }

        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemManoDeObras(itemManoDeObras.map((item, i) => i === index ? { ...item, quantity: value } : item))
    }

    function handleCentimetersChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const actualCentimeters= itemManoDeObras[index].centimeters
        if (actualCentimeters?.toString() === e.target.value) {
            console.log("centimeters already set")
            return
        }
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemManoDeObras(itemManoDeObras.map((item, i) => i === index ? { ...item, centimeters: value } : item))
    }

    function handleLenghtChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const actualLength= itemManoDeObras[index].length
        if (actualLength?.toString() === e.target.value) {
            console.log("length already set")
            return
        }
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemManoDeObras(itemManoDeObras.map((item, i) => i === index ? { ...item, length: value } : item))
    }

    function handleWidthChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const actualWidth= itemManoDeObras[index].width
        if (actualWidth?.toString() === e.target.value) {
            console.log("width already set")
            return
        }
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemManoDeObras(itemManoDeObras.map((item, i) => i === index ? { ...item, width: value } : item))
    }

    function handleAjusteChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const actualAjuste= itemManoDeObras[index].ajuste
        if (actualAjuste?.toString() === e.target.value) {
            console.log("ajuste already set")
            return
        }
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemManoDeObras(itemManoDeObras.map((item, i) => i === index ? { ...item, ajuste: value } : item))
    }

    function notifyMOSelected(itemId: string | undefined, index: number, manoDeObra: ManoDeObraDAO | undefined) {
        const actualManoDeObraId= itemManoDeObras[index].manoDeObraId
        if (actualManoDeObraId === manoDeObra?.id) {
            console.log("mano de obra already set")
            return
        }
        if (itemId && manoDeObra) {
            console.log(`updating item ${itemId} with mano de obra ${manoDeObra.id}`)            
            setManoDeObraToItem(itemId, manoDeObra.id)            
            setItemManoDeObras(itemManoDeObras.map((item, i) => i === index ? { ...item, manoDeObraId: manoDeObra?.id, isLinear: manoDeObra?.isLinear, isSurface: manoDeObra?.isSurface } : item))
        } else {
            console.log(`updating new item ${itemId} with mano de obra ${manoDeObra?.id}`)            
            setItemManoDeObras(itemManoDeObras.map((item, i) => i === index ? { ...item, manoDeObraId: manoDeObra?.id, isLinear: manoDeObra?.isLinear, isSurface: manoDeObra?.isSurface } : item))
        }
    }

    return (
        <div>
            <div className="mx-auto p-6 lg:p-2 space-y-4 border rounded-md dark:text-white bg-white dark:bg-black">                        
                {/* <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,50px] gap-2 items-center"> */}
                <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,50px] gap-2 items-center">
                    <p className="min-w-40">Mano de obra</p>
                    <p>Cantidad</p>
                    <p>Ajuste (USD)</p>
                    {/* <p>Cm lineales</p>
                    <p>Largo (cm)</p>
                    <p>Ancho (cm)</p> */}
                    <p></p>
                </div>
                {
                    itemManoDeObras.map((item, index) => (
                        // <div key={index} className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,50px] gap-2 items-center">
                        <div key={item.id || index} className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,50px] gap-2 items-center">
                            { loadingMO ?
                            <Loader className="h-4 w-4 animate-spin" />
                            :
                            <MOForm key={item.manoDeObraId} itemId={item.id} index={index} notifyMOSelected={notifyMOSelected} manoDeObras={manoDeObras} defaultManoDeObraId={item.manoDeObraId} />
                            }
                            <div className="flex items-center gap-2">
                                <Input type="number" value={item.quantity ? item.quantity : ""} onChange={(e) => handleQuantityChange(e, index)} disabled={!item.manoDeObraId} placeholder="cant"/>
                                x
                            </div>
                            <Input id={`item${index+1}-ajuste`} placeholder="ajuste" type="number" value={item.ajuste ? item.ajuste : ""} onChange={(e) => handleAjusteChange(e, index)} disabled={!item.manoDeObraId}/>
                            {
                                item.isLinear && <Input id={`item${index+1}-centimeters`} placeholder="lineal cm" type="number" value={item.centimeters ? item.centimeters : ""} onChange={(e) => handleCentimetersChange(e, index)} disabled={!item.manoDeObraId}/>
                            }
                            {
                                item.isSurface && 
                                <>
                                    <Input id={`item${index+1}-length`} placeholder="largo cm" type="number" value={item.length ? item.length : ""} onChange={(e) => handleLenghtChange(e, index)} disabled={!item.manoDeObraId}/>
                                    <Input id={`item${index+1}-width`} placeholder="ancho cm" type="number" value={item.width ? item.width : ""} onChange={(e) => handleWidthChange(e, index)} disabled={!item.manoDeObraId}/>
                                </>
                            }
                            
                            <div className={cn("cursor-pointer", buttonVariants({ variant: "ghost" }))} onClick={() => removeItem(index)}>
                                {
                                    loading ? <Loader className="h-4 w-4 animate-spin" /> : <X className="w-5 h-5 text-red-400" />
                                }
                            </div>
                        </div>
                    ))
                }
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={addItem}>
                        <PlusCircle className="w-5 h-5 text-verde-abbate" />
                    </Button>
                </div>
        </div>
       </div>
   )
}

