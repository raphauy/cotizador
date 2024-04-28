"use client"

import { getItemDAOAction } from "@/app/admin/items/item-actions"
import { getTerminacionsDAOAction } from "@/app/admin/terminations/terminacion-actions"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TerminacionDAO } from "@/services/terminacion-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const schema = z.object({
    terminationId: z.string().optional(),
  })
  
  export type FormValues = z.infer<typeof schema>
  
type Props= {
    itemId: string | undefined
    index: number
    notifySelected: (itemId: string | undefined, index: number, terminationId: string | undefined) => void
    terminations: TerminacionDAO[]
}
export default function TerminationForm({ itemId, index, notifySelected, terminations }: Props) {

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            terminationId: "",
        },
        mode: "onChange",
    })

    const terminationId= form.watch("terminationId")

    useEffect(() => {
        notifySelected(itemId, index, terminationId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminationId])
    
    useEffect(() => {
        if (itemId) {
            getItemDAOAction(itemId)
            .then((item) => {
                if (!item || !item.terminacionId)
                    return

                form.setValue("terminationId", item.terminacionId)
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
                    name="terminationId"
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
                            {terminations.map(termination => (
                            <SelectItem key={termination.id} value={termination.id}>{termination.name}</SelectItem>  
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

