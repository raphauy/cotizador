"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteItemAction, createOrUpdateItemAction, getItemDAOAction } from "./item-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { ItemType } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { useParams, useRouter } from "next/navigation"

const itemTypes = Object.values(ItemType).filter((itemType) => itemType === ItemType.TRAMO || itemType === ItemType.ZOCALO || itemType === ItemType.ALZADA)

export const transitionSchema = z.object({
  type: z.nativeEnum(ItemType),
  cantidad: z.string().refine((val) => !isNaN(Number(val)), { message: "(debe ser un número)" }).optional(),
	workId: z.string().min(1, "workId is required."),
})

export type TransitionFormValues = z.infer<typeof transitionSchema>

type Props= {
  workId: string
  closeDialog: () => void
}

export function TransitionForm({ workId, closeDialog }: Props) {
  const form = useForm<TransitionFormValues>({
    resolver: zodResolver(transitionSchema),
    defaultValues: {
      workId,
      type: ItemType.TRAMO,
      cantidad: "4",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const params= useParams()
  const cotizationId= params.cotizationId

  const onSubmit = async (data: TransitionFormValues) => {
    if (!cotizationId) {
      toast({ title: "Cotization no encontrada", description: "No se pudo encontrar la cotización", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      router.push(`/seller/cotizations/${cotizationId}/addItems?workId=${workId}&itemType=${data.type}&cantidad=${data.cantidad}`)
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Item:</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un Trabajo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {itemTypes.map(itemType => (
                      <SelectItem key={itemType} value={itemType}>{itemType}</SelectItem>   
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de Items a crear:</FormLabel>
                <FormControl>
                  <Input placeholder="ej: 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          

        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Continuar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}
