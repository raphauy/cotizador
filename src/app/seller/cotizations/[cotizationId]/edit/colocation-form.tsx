"use client"

import { getItemDAOAction } from "@/app/admin/items/item-actions"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColocacionDAO } from "@/services/colocacion-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const schema = z.object({
    colocacionId: z.string().optional(),
  })
  
  export type FormValues = z.infer<typeof schema>
  
type Props= {
    itemId: string | undefined
    defaultColocacionId?: string | undefined
    notifyColocationSelected: (itemId: string | undefined, colocacion: ColocacionDAO | undefined) => void
    colocaciones: ColocacionDAO[]
}
export default function ColocationForm({ itemId, defaultColocacionId, notifyColocationSelected, colocaciones }: Props) {

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            colocacionId: defaultColocacionId,            
        },
        mode: "onChange",
    })

    const colocacionId= form.watch("colocacionId")

    useEffect(() => {
        const colocacion= colocaciones.find((colocacion) => colocacion.id === colocacionId)
        notifyColocationSelected(itemId, colocacion)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colocacionId])
    
    
    useEffect(() => {
        if (itemId) {            
            getItemDAOAction(itemId)
            .then((item) => {
                if (!item || !item.colocacionId)
                    return

                item.colocacionId && form.setValue("colocacionId", item.colocacionId)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [itemId, form])

    function onSubmit(data: FormValues) {
        console.log(data)        
    }

    return (
        <div className="max-w-lg min-w-72 flex flex-col items-center justify-between">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                
                <FormField
                    control={form.control}
                    name="colocacionId"
                    render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                        >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione aquí" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {colocaciones.map(colocacion => (
                            <SelectItem key={colocacion.id} value={colocacion.id}>{colocacion.name}</SelectItem>  
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                </form>
            </Form>
       </div>
   )
}

