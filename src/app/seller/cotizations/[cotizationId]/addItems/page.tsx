"use client"

import { createBulkItemAction } from "@/app/admin/items/item-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ItemType } from "@prisma/client"
import { set } from "date-fns"
import { ArrowLeftToLine, ChevronLeft, Loader, PlusCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export type AreaItem = {
    label: string
    length: number | undefined
    width: number | undefined
}

type Props= {
    params: {
      cotizationId: string
    }
    searchParams: {
      workId: string
      itemType: string
      cantidad: string
    }
}
export default function AddItemsPage({ params, searchParams }: Props) {
    const cotizationId= params.cotizationId
    const workId= searchParams.workId
    const itemType= searchParams.itemType as ItemType
    const [cantidad, setCantidad] = useState(parseInt(searchParams.cantidad))
    const itemLabel= getItemLabel(itemType)
    const [itemAreas, setItemAreas] = useState<AreaItem[]>([])
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        console.log("initializing, cantidad:", cantidad, itemType)

        setLoading(true)
        
        const label= getItemLabel(itemType)
        const newAreas= []
        for (let i = 0; i < cantidad; i++) {
            const itemArea: AreaItem = {
                label: `${label} ${i+1}`,
                length: undefined,
                width: undefined,
            }
            newAreas.push(itemArea)
        }
        setItemAreas(newAreas)
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const itemsToSave= itemAreas.filter((itemArea) => itemArea.length && itemArea.width && itemArea.length > 0 && itemArea.width > 0).length 

    function handleSave() {
        setLoading(true)
        const nonZeroAreas= itemAreas.filter((itemArea) => itemArea.length && itemArea.width && itemArea.length > 0 && itemArea.width > 0)

        createBulkItemAction(workId, itemType, nonZeroAreas)
        .then((items) => {
            if (items) {
                toast({title: "Items creados" })
            }
            router.back()
        })
        .catch((error) => {
            toast({title: "Error", description: error.message, variant: "destructive"})
        })
        .finally(() => {
            setLoading(false)
        })
    }

    function addItem() {
        setCantidad(cantidad + 1);
        const label= getItemLabel(itemType)
        const newAreas= [...itemAreas, { label: `${label} ${cantidad+1}`, length: 0, width: 0 }]
        setItemAreas(newAreas)
    }

    function removeItem(index: number) {
        setCantidad(cantidad - 1);
        setItemAreas(itemAreas.filter((itemArea, i) => i !== index))        
    }

    function handleLenghtChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemAreas(itemAreas.map((itemArea, i) => i === index ? { ...itemArea, length: value } : itemArea))
    }

    function handleWidthChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemAreas(itemAreas.map((itemArea, i) => i === index ? { ...itemArea, width: value } : itemArea))
    }

    if (loading) {
        return <Loader className="w-7 h-7 animate-spin mt-10" />
    }

    return (
        <>
        <div className="max-w-xl flex items-center justify-between w-full">
            <Button variant="link" onClick={() => router.back()} >
                <ChevronLeft className="w-5 h-5" /> Volver
            </Button>
        </div>
        <p className="text-3xl font-bold mt-7 mb-10">Crear {getItemLabel(itemType).toLowerCase()}s</p>
        <div className="max-w-xl mx-auto p-6 space-y-4 border rounded-md dark:text-white bg-white dark:bg-black">                        
            {
                itemAreas.map((itemArea, index) => (
                    <div key={index} className="grid grid-cols-[1fr,1fr,1fr,50px] gap-4 items-center">
                        <Label id={itemArea.label}>{itemArea.label}:</Label>
                        <Input id={`item${index+1}-length`} placeholder="Largo" type="number" value={itemArea.length ? itemArea.length : ""} onChange={(e) => handleLenghtChange(e, index)} />
                        <Input id={`item${index+1}-width`} placeholder="Ancho" type="number" value={itemArea.width ? itemArea.width : ""} onChange={(e) => handleWidthChange(e, index)} />
                        <Button variant="ghost" onClick={() => removeItem(index)}>
                            <X className="w-5 h-5 text-red-400" />
                        </Button>
                    </div>
                ))
            }
            <div className="flex justify-center">
                <Button variant="ghost" onClick={addItem}>
                    <PlusCircle className="w-5 h-5 text-verde-abbate" />
                </Button>
            </div>
           <div className="flex justify-between gap-4">
                <div>
                    <p className={cn("hidden", itemsToSave > 0 && "block")}>{itemsToSave} {itemLabel.toLowerCase()}s para guardar</p>
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => router.back()}>Cancelar</Button>
                    <Button onClick={handleSave}>
                        {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
                    </Button>
                    
                </div>
            </div>
       </div>
       </>
   )
}

function getItemLabel(itemType: string) {
    switch (itemType) {
        case "TRAMO":
            return "Tramo"
        case "ZOCALO":
            return "Zócalo"
        case "ALZADA":
            return "Alzada"
        case "TERMINACION":
            return "Terminación"
        case "REGRUESO":
            return "Regreso"
        case "MANO_DE_OBRA":
            return "Mano de obra"
        case "AJUSTE":
            return "Ajuste"
        default:
            return "Item"
    }
}