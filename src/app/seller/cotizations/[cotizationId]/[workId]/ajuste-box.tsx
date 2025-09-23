"use client"

import { deleteItemAction } from "@/app/admin/items/item-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { getItemLabel } from "@/lib/utils"
import { ItemType } from "@prisma/client"
import { Loader, PlusCircle, X } from "lucide-react"
import { useState } from "react"
import { AjusteItem } from "./page"
import { Textarea } from "@/components/ui/textarea"
import AjusteForm from "./ajuste-form"

type Props= {
    items: AjusteItem[]
    setAjustes: (itemAreas: AjusteItem[]) => void
}
export default function AjustesBox({ items, setAjustes }: Props) {
    const [loading, setLoading] = useState(false)

    function addItem() {
        const newAreas= [...items, { id: undefined, valor: 0, description: "", type: ItemType.AJUSTE }]
        setAjustes(newAreas)
    }

    function removeItem(index: number) {
        const itemToRemove= items[index]
        if (itemToRemove.id) {
            setLoading(true)
            deleteItemAction(itemToRemove.id)
            .then((item) => {
                if (item) {
                    toast({title: "Item eliminado" })
                }
                setAjustes(items.filter((itemArea, i) => i !== index))
            })
            .catch((error) => {
                toast({title: "Error", description: error.message, variant: "destructive"})
            })
            .finally(() => {
                setLoading(false)
            })
        } else {
            setAjustes(items.filter((itemArea, i) => i !== index))        
        }
    }

    function setValor(value: number, index: number){
        setAjustes(items.map((item, i) => i === index ? { ...item, valor: value } : item))
    }

    function setDescription(value: string, index: number){
        setAjustes(items.map((item, i) => i === index ? { ...item, description: value } : item))
    }

    return (
        <div>
            <div className="grid lg:grid-cols-2 gap-2 p-6 lg:p-2 space-y-2 border rounded-md dark:text-white bg-white dark:bg-black">
            {
                items.map((item, index) => (
                    <div key={item.id || `temp-${index}`} className="flex gap-2 items-center">
                        <AjusteForm index={index} item={item} setValor={setValor} setDescription={setDescription} /> 
                        <Button variant="ghost" onClick={() => removeItem(index)}>
                            {
                                loading ? <Loader className="h-4 w-4 animate-spin" /> : <X className="w-5 h-5 text-red-400" />
                            }
                        </Button>
                    </div>
                ))
            }
            <div className="flex justify-center col-span-2">
                <Button variant="ghost" onClick={addItem}>
                    <PlusCircle className="w-5 h-5 text-verde-abbate" />
                </Button>
            </div>
            </div>
        </div>
)
}

