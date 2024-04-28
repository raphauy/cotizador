"use client"

import { deleteItemAction } from "@/app/admin/items/item-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn, getItemLabel } from "@/lib/utils"
import { ItemType } from "@prisma/client"
import { Loader, PlusCircle, X } from "lucide-react"
import { useState } from "react"
import { AreaItem } from "./page"

type Props= {
    workId: string
    itemType: ItemType
    cantidad: number
    itemAreas: AreaItem[]
    setItemAreas: (itemAreas: AreaItem[]) => void
}
export default function AreaBox({ workId, itemType, cantidad, itemAreas, setItemAreas }: Props) {
    const [loading, setLoading] = useState(false)

    const itemLabel= getItemLabel(itemType)

    const itemsWithData= itemAreas.filter((itemArea) => itemArea.length && itemArea.width && itemArea.length > 0 && itemArea.width > 0)
    const totalItemsToSave= itemsWithData.reduce((acc, itemArea) => acc + (itemArea.quantity ? itemArea.quantity : 0), 0)

    function addItem() {
        const newAreas= [...itemAreas, { id: undefined, quantity: 1, length: 0, width: 0, type: itemType }]
        setItemAreas(newAreas)
    }

    function removeItem(index: number) {
        const itemToRemove= itemAreas[index]
        if (itemToRemove.id) {
            setLoading(true)
            deleteItemAction(itemToRemove.id)
            .then((items) => {
                if (items) {
                    toast({title: "Item eliminado" })
                }
                setItemAreas(itemAreas.filter((itemArea, i) => i !== index))        
            })
            .catch((error) => {
                toast({title: "Error", description: error.message, variant: "destructive"})
            })
            .finally(() => {
                setLoading(false)
            })
        } else {
            setItemAreas(itemAreas.filter((itemArea, i) => i !== index))        
        }
    }

    function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemAreas(itemAreas.map((itemArea, i) => i === index ? { ...itemArea, quantity: value } : itemArea))
    }

    function handleLenghtChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemAreas(itemAreas.map((itemArea, i) => i === index ? { ...itemArea, length: value } : itemArea))
    }

    function handleWidthChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemAreas(itemAreas.map((itemArea, i) => i === index ? { ...itemArea, width: value } : itemArea))
    }

    return (
        <div>
            <div className="max-w-xl mx-auto p-6 lg:p-2 space-y-2 border rounded-md dark:text-white bg-white dark:bg-black h-full">
                <p>Valores en <span className="font-bold">cm</span></p>
                {
                    itemAreas.map((itemArea, index) => (
                        <div key={index} className="grid grid-cols-[1fr,1fr,1fr,50px] gap-2 items-center">
                            <div className="flex items-center gap-2">
                                <Input type="number" value={itemArea.quantity ? itemArea.quantity : ""} onChange={(e) => handleQuantityChange(e, index)} /> 
                                x
                            </div>
                            <Input autoFocus={index === 0 && itemArea.type === ItemType.TRAMO} id={`item${index+1}-length`} placeholder="largo cm" type="number" value={itemArea.length ? itemArea.length : ""} onChange={(e) => handleLenghtChange(e, index)} />
                            <Input id={`item${index+1}-width`} placeholder="ancho cm" type="number" value={itemArea.width ? itemArea.width : ""} onChange={(e) => handleWidthChange(e, index)} />
                            <Button variant="ghost" onClick={() => removeItem(index)}>
                                {
                                    loading ? <Loader className="h-4 w-4 animate-spin" /> : <X className="w-5 h-5 text-red-400" />
                                }
                            </Button>
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

