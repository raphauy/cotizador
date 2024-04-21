"use client"

import { createManoDeObraItemAction, getItemDAOAction, updateManoDeObraItemAction } from "@/app/admin/items/item-actions"
import { getManoDeObrasDAOAction } from "@/app/admin/manodeobras/manodeobra-actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { ManoDeObraItemFormValues, manoDeObraItemSchema } from "@/services/item-services"
import { ManoDeObraDAO } from "@/services/manodeobra-services"
import { zodResolver } from "@hookform/resolvers/zod"
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

    const form = useForm<ManoDeObraItemFormValues>({
        resolver: zodResolver(manoDeObraItemSchema),
        defaultValues: {
            workId,
            llevaAjuste: false,
            ajuste: "0",
        },
        mode: "onChange",
    })

    const manoDeObraId= form.watch("manoDeObraId")
    const llevaAjuste= form.watch("llevaAjuste")
    const ajuste= form.watch("ajuste")
    
    const [loading, setLoading] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)

    const [totalPrice, setTotalPrice] = useState(0)
    const [back, setBack] = useState(true)

    const [manosDeObra, setManosDeObra] = useState<ManoDeObraDAO[]>([])
    const [manoDeObraSelected, setManoDeObraSelected] = useState<ManoDeObraDAO | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (itemId) {
            getItemDAOAction(itemId)
            .then((item) => {
                if (!item || !item.manoDeObraId)
                    return

                form.setValue("workId", item.workId)
                form.setValue("manoDeObraId", item.manoDeObraId)
                form.setValue("ajuste", item.ajuste?.toString())
                form.setValue("llevaAjuste", item.ajuste !== 0)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [itemId, form])

    useEffect(() => {
        console.log("initializing...")

        setLoading(true)

        getManoDeObrasDAOAction()
        .then((manoDeObras) => {
            setManosDeObra(manoDeObras)
        })
        .finally(() => {
            setLoading(false)
        })
        
    }, [])

    useEffect(() => {
        if (manoDeObraId) {
            const selected= manosDeObra.find((item) => item.id === manoDeObraId)
            setManoDeObraSelected(selected || null)
        }
    }, [manosDeObra, manoDeObraId])

    useEffect(() => {
        if (manoDeObraSelected) {
            const total= manoDeObraSelected.price
            const curvaPr= Number(ajuste)
            setTotalPrice(curvaPr + total)
        }
    }, [manoDeObraSelected, ajuste])
    

    if (loading) {
        return <Loader className="w-7 h-7 animate-spin mt-10" />
    }

    function onSubmit(data: ManoDeObraItemFormValues) {
        console.log(data)
        setLoadingSave(true)
        if (itemId) {
            //updateTerminationItemAction(itemId, data)
            updateManoDeObraItemAction(itemId, data)
            .then(() => {
                toast({title: "Mano de obra actualizada" })
            })
            .catch((error) => {
                toast({title: "Error", description: error.message, variant: "destructive" })
            })
        } else {
            createManoDeObraItemAction(data)
            .then(() => {
                toast({title: "Mano de obra creada" })
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
            setManoDeObraSelected(null)
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
            <p className="text-3xl font-bold mt-7 mb-10">Crear Mano de obra</p>

            <div className="p-4 bg-white rounded-md min-w-[500px] border w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    
                    <FormField
                        control={form.control}
                        name="manoDeObraId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mano de obra</FormLabel>
                            <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Selecciona una Mano de obra" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {manosDeObra.map(item => (
                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>  
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="llevaAjuste"
                        render={({ field }) => (
                            <FormItem className="flex items-baseline justify-between rounded-lg border h-14 px-4 pt-1.5">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                Lleva ajuste?
                                </FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />

                        {
                            llevaAjuste &&
                            <FormField
                                control={form.control}
                                name="ajuste"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ajuste por curva en USD</FormLabel>
                                    <FormControl>
                                    <Input placeholder="ej: 100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        }
                
                    

                    <div className="flex justify-end items-center gap-2">
                        <Button onClick={router.back} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
                        <Button type="submit" className="ml-2 w-40">
                        {loadingSave ? <Loader className="h-4 w-4 animate-spin" /> : <p>{back ? "Guardar y Volver" : "Guardar y crear otro"}</p>}
                        </Button>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                        <Switch onCheckedChange={() => setBack(!back)} checked={!back} />
                        <p>seguir creando manos de obra</p> 
                    </div>
                    </form>
                </Form>
                </div>     


                {
                    manoDeObraSelected &&
                    <>
                    <p className="text-2xl font-bold mt-10 w-full">Resumen:</p>
                    <div className="p-4 bg-white rounded-md min-w-[500px] mt-5 border grid grid-cols-2"> 
                        <p className="font-bold col-span-2 text-center mb-5">{manoDeObraSelected?.name} ({manoDeObraSelected?.price} USD)</p> 
                        <p>Valor:</p>
                        <p className="font-bold text-right">{manoDeObraSelected?.price} USD</p>

                        {
                            llevaAjuste &&
                            <>
                            <p>Ajuste:</p>
                            <p className="font-bold text-right">{ajuste} USD</p>
                            </>
                        }

                        <p className="mt-4">Total:</p>
                        <p className="font-bold text-right mt-4">{totalPrice} USD</p>
                    </div>
                    </>
                }

       </div>
   )
}

