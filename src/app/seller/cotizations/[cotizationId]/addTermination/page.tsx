"use client"

import { createTerminationItemAction, getItemDAOAction, updateTerminationItemAction } from "@/app/admin/items/item-actions"
import { getTerminacionsDAOAction } from "@/app/admin/terminations/terminacion-actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { TerminationFormValues, terminationSchema } from "@/services/item-services"
import { TerminacionDAO } from "@/services/terminacion-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { se } from "date-fns/locale"
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

    const form = useForm<TerminationFormValues>({
        resolver: zodResolver(terminationSchema),
        defaultValues: {
            workId,
            meters: "0",
            llevaCurva: false,
            ajuste: "0",
        },
        mode: "onChange",
    })

    const terminationId= form.watch("terminationId")
    const meters= form.watch("meters")
    const llevaCurva= form.watch("llevaCurva")
    const ajuste= form.watch("ajuste")
    
    const [loading, setLoading] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)

    const [totalPrice, setTotalPrice] = useState(0)
    const [back, setBack] = useState(true)

    const [terminations, setTerminations] = useState<TerminacionDAO[]>([])
    const [terminationSelected, setTerminationSelected] = useState<TerminacionDAO | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (itemId) {
            getItemDAOAction(itemId)
            .then((item) => {
                if (!item || !item.terminacionId)
                    return

                form.setValue("workId", item.workId)
                form.setValue("terminationId", item.terminacionId)
                form.setValue("ajuste", item.ajuste?.toString())
                form.setValue("llevaCurva", item.ajuste !== 0)
                form.setValue("meters", item.metros?.toString())
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [itemId, form])

    useEffect(() => {
        console.log("initializing...")

        setLoading(true)

        getTerminacionsDAOAction()
        .then((terminaciones) => {
            setTerminations(terminaciones)
        })
        .finally(() => {
            setLoading(false)
        })
        
    }, [])

    useEffect(() => {
        if (terminationId) {
            const selected= terminations.find((terminacion) => terminacion.id === terminationId)
            setTerminationSelected(selected || null)
        }
    }, [terminations, terminationId])

    useEffect(() => {
        if (terminationSelected) {
            const metersNumber= Number(meters)
            const total= terminationSelected.price * metersNumber
            const curvaPr= Number(ajuste)
            setTotalPrice(curvaPr + total)
        }
    }, [terminationSelected, meters, ajuste])
    

    if (loading) {
        return <Loader className="w-7 h-7 animate-spin mt-10" />
    }

    function onSubmit(data: TerminationFormValues) {
        console.log(data)
        setLoadingSave(true)
        if (itemId) {
            updateTerminationItemAction(itemId, data)
            .then(() => {
                toast({title: "Terminación actualizada" })
            })
            .catch((error) => {
                toast({title: "Error", description: error.message, variant: "destructive" })
            })
        } else {
            createTerminationItemAction(data)
            .then(() => {
                toast({title: "Terminación creada" })
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
            setTerminationSelected(null)
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
            <p className="text-3xl font-bold mt-7 mb-10">Crear Terminación</p>

            <div className="p-4 bg-white rounded-md min-w-[500px] border w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    
                    <FormField
                        control={form.control}
                        name="terminationId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Terminación</FormLabel>
                            <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Selecciona una Terminación" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {terminations.map(termination => (
                                <SelectItem key={termination.id} value={termination.id}>{termination.name}</SelectItem>  
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="meters"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Metros lineales de terminación</FormLabel>
                            <FormControl>
                            <Input placeholder="ej: 10" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="llevaCurva"
                        render={({ field }) => (
                            <FormItem className="flex items-baseline justify-between rounded-lg border h-14 px-4 pt-1.5">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                Lleva curva?
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
                            llevaCurva &&
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
                        <p>seguir creando terminaciones</p>
                    </div>
                    </form>
                </Form>
                </div>     


                {
                    terminationSelected && meters !== "0" &&
                    <>
                    <p className="text-2xl font-bold mt-10 w-full">Resumen:</p>
                    <div className="p-4 bg-white rounded-md min-w-[500px] mt-5 border grid grid-cols-2"> 
                        <p className="font-bold col-span-2 text-center mb-5">{terminationSelected?.name} ({terminationSelected?.price} USD)</p>
                        <p>Valor {meters}ml:</p>
                        <p className="font-bold text-right">{terminationSelected?.price * Number(meters)} USD</p>

                        {
                            llevaCurva &&
                            <>
                            <p>Ajuste por curva:</p>
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

