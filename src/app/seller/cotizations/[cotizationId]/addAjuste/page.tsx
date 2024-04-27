"use client"

import { createAjusteItemAction, getItemDAOAction, updateAjusteItemAction } from "@/app/admin/items/item-actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { AjusteFormValues, ajusteSchema } from "@/services/item-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { ItemType } from "@prisma/client"
import { ChevronLeft, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type Props= {
    searchParams: {
      workId: string
      itemId: string | null
    }
}
export default function AddItemsPage({ searchParams }: Props) {

    const workId= searchParams.workId
    const [itemId, setItemId] = useState<string | null>(searchParams.itemId)

    const form = useForm<AjusteFormValues>({
        resolver: zodResolver(ajusteSchema),
        defaultValues: {
            workId,
            value: "0",
            description: "",
        },
        mode: "onChange",
    })

    const value= form.watch("value")
    
    const [loadingSave, setLoadingSave] = useState(false)
    const [label, setLabel] = useState("Sobrecosto")

    const [back, setBack] = useState(true)

    const router = useRouter()

    useEffect(() => {
        if (!value)
            return
        
        const intValue= parseInt(value)
        if (intValue > 0) {
            setLabel("Sobrecosto")
        } else if (intValue < 0) {
            setLabel("Descuento")
        } else {
            setLabel("")
        }
    }, [value])

    useEffect(() => {
        if (itemId) {
            getItemDAOAction(itemId)
            .then((item) => {
                if (!item || item.type !== ItemType.AJUSTE)
                    return

                form.setValue("workId", item.workId)
                form.setValue("value", item.valor ? item.valor.toString() : "")
                form.setValue("description", item.description || "")
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [itemId, form])

    function onSubmit(data: AjusteFormValues) {
        setLoadingSave(true)
        if (itemId) {
            updateAjusteItemAction(itemId, data)
            .then(() => {
                toast({title: "Ajuste actualizado" })
            })
            .catch((error) => {
                toast({title: "Error", description: error.message, variant: "destructive" })
            })
        } else {
            createAjusteItemAction(data)
            .then(() => {
                toast({title: "Ajuste creado" })
            })
            .catch((error) => {
                toast({title: "Error", description: error.message, variant: "destructive" })
            })
        }
        setLoadingSave(false)

        if (back) {
            router.back()
        } else {
            // reset form
            form.reset()
            form.setValue("workId", data.workId)
            setItemId(null)
        }
        
    }

    return (
        <div className="max-w-lg flex flex-col items-center justify-between w-full">
            <div className="flex items-center justify-between w-full">
                <Button variant="link" onClick={() => router.back()} >
                    <ChevronLeft className="w-5 h-5" /> Volver
                </Button>
            </div>
            <p className="text-3xl font-bold mt-7 mb-10">Crear Ajuste al valor total del trabajo</p>

            <div className="p-4 bg-white rounded-md min-w-[500px] border w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ajuste en USD:</FormLabel>
                                <FormControl>
                                <Input placeholder="ej: 100" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción:</FormLabel>
                                <FormControl>
                                <Textarea rows={8} placeholder="ej: Ajuste por distancia de la obra" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    

                    <div className="flex justify-between items-center gap-2">
                        <p className=
                                {cn("font-bold", 
                                    { "text-green-600": label === "Sobrecosto" },
                                    { "text-red-600": label === "Descuento" }
                                )}> 
                            {label}
                        </p>
                        <div className="flex justify-end items-center gap-2">
                            <Button onClick={router.back} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
                            <Button type="submit" className="ml-2 w-40">
                            {loadingSave ? <Loader className="h-4 w-4 animate-spin" /> : <p>{back ? "Guardar y Volver" : "Guardar y crear otro"}</p>}
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                        <Switch onCheckedChange={() => setBack(!back)} checked={!back} />
                        <p>seguir creando manos de obra</p> 
                    </div>
                    </form>
                </Form>
                </div>     
       </div>
   )
}

