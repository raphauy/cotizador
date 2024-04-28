"use client"

import { getItemDAOAction } from "@/app/admin/items/item-actions"
import { getManoDeObrasDAOAction } from "@/app/admin/manodeobras/manodeobra-actions"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ManoDeObraDAO } from "@/services/manodeobra-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const schema = z.object({
    manoDeObraId: z.string().optional(),
  })
  
  export type FormValues = z.infer<typeof schema>
  
type Props= {
    itemId: string | undefined
    index: number
    notifyMOSelected: (itemId: string | undefined, index: number, manoDeObraId: string | undefined) => void
}
export default function MOForm({ itemId, index, notifyMOSelected }: Props) {

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            manoDeObraId: "",
        },
        mode: "onChange",
    })

    const manoDeObraId= form.watch("manoDeObraId")

    useEffect(() => {
        notifyMOSelected(itemId, index, manoDeObraId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manoDeObraId])
    
    
    const [loading, setLoading] = useState(true)
    const [manoDeObras, setManoDeObras] = useState<ManoDeObraDAO[]>([])

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

    useEffect(() => {
        setLoading(true)

        getManoDeObrasDAOAction()
        .then((manoDeObras) => {
            setManoDeObras(manoDeObras)
        })
        .finally(() => {
            setLoading(false)
        })
        
    }, [])

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
                                {
                                    loading ? <Loader className="h-4 w-4 animate-spin" /> : <SelectValue placeholder="Seleccione aquí" />
                                }
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

