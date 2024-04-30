"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { AjusteItem } from "./page"

type Props= {
    index: number
    item: AjusteItem
    setValor: (value: number, index: number) => void
    setDescription: (value: string, index: number) => void
}
export default function AjusteForm({ index, item, setValor, setDescription }: Props) {

    const initLabel = item.valor && item.valor > 0 ? "Sobrecosto" : item.valor && item.valor < 0 ? "Descuento" : ""
    const [label, setLabel] = useState(initLabel)
    const [inputValue, setInputValue] = useState(item.valor ? item.valor.toString() : "")


    function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {

        const isMinusSign= e.target.value === "-"
        if (isMinusSign) {
            setLabel("Descuento")
            setInputValue("-")
            return
        }
        const isNumber= !isNaN(Number(e.target.value))
        if (!isNumber) {
            return
        }

        const value= e.target.value ? parseInt(e.target.value) : 0
        if (value > 0) {
            setInputValue(value.toString())
            setLabel("Sobrecosto")
        } else if (value < 0) {
            setInputValue(value.toString())
            setLabel("Descuento")
        } else {
            setInputValue("")
            setLabel("")
        }
        setValor(value, index)
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const value= e.target.value
        setDescription(value, index)
    }

        
    return (
        <div className="max-w-lg flex flex-col items-center w-full">

            <div className="p-4 bg-white rounded-md min-w-[400px] border w-full space-y-2">
                <div className="flex items-center gap-2">
                    <Input placeholder="ej: 100" onChange={handleValorChange} value={inputValue} />
                    <p className="font-bold">USD</p>
                </div>
                <Textarea rows={8} placeholder="ej: Ajuste por distancia de la obra" onBlurCapture={handleDescriptionChange} defaultValue={item.description} />
                <p className=
                        {cn("font-bold w-32 h-5", 
                            { "text-green-600": label === "Sobrecosto" },
                            { "text-red-600": label === "Descuento" }
                        )}> 
                        {label}
                </p>
            </div>     

       </div>
   )
}

