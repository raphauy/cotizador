"use client"

import { getItemDAOAction } from "@/app/admin/items/item-actions"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ManoDeObraDAO } from "@/services/manodeobra-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const schema = z.object({
    manoDeObraId: z.string().optional(),
  })
  
  export type FormValues = z.infer<typeof schema>
  
type Props= {
    itemId: string | undefined
    index: number
    defaultManoDeObraId?: string | undefined
    notifyMOSelected: (itemId: string | undefined, index: number, manoDeObra: ManoDeObraDAO | undefined) => void
    manoDeObras: ManoDeObraDAO[]
}
export default function MOForm({ itemId, index, defaultManoDeObraId, notifyMOSelected, manoDeObras }: Props) {

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            manoDeObraId: defaultManoDeObraId,
        },
        mode: "onChange",
    })

    const manoDeObraId= form.watch("manoDeObraId")

    useEffect(() => {
        const manoDeObra= manoDeObras.find((manoDeObra) => manoDeObra.id === manoDeObraId)
        notifyMOSelected(itemId, index, manoDeObra)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manoDeObraId])
    
    
    useEffect(() => {
        if (itemId) {            
            getItemDAOAction(itemId)
            .then((item) => {
                if (!item || !item.manoDeObraId)
                    return

                item.manoDeObraId && form.setValue("manoDeObraId", item.manoDeObraId)
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
        <div className="max-w-lg min-w-40 flex flex-col items-center justify-between w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                
                <FormField
                    control={form.control}
                    name="manoDeObraId"
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
                            {manoDeObras.map(manoDeObra => (
                            <SelectItem key={manoDeObra.id} value={manoDeObra.id}>{manoDeObra.name}</SelectItem>  
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

