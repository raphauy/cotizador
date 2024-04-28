"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { ItemType } from "@prisma/client"
import { Loader } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createOrUpdateItemAction } from "./item-actions"

const itemTypes = Object.values(ItemType)

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
  const type= form.watch("type")

  const [loading, setLoading] = useState(false)

  const [isArea, setIsArea] = useState(false)

  const router = useRouter()
  const params= useParams()
  const cotizationId= params.cotizationId

  useEffect(() => {
    if (type === ItemType.TRAMO || type === ItemType.ZOCALO || type === ItemType.ALZADA){
      setIsArea(true)
    } else if (type === ItemType.TERMINACION || type === ItemType.MANO_DE_OBRA || type === ItemType.AJUSTE){
      setIsArea(false)
    } else {
      setIsArea(false)
    }  
  }, [type])
  

  const onSubmit = async (data: TransitionFormValues) => {
    if (!cotizationId) {
      toast({ title: "Cotization no encontrada", description: "No se pudo encontrar la cotización", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      if (data.type === ItemType.TRAMO || data.type === ItemType.ZOCALO || data.type === ItemType.ALZADA) {
        router.push(`/seller/cotizations/${cotizationId}/addItems?workId=${workId}&itemType=${data.type}&cantidad=${data.cantidad}`)
        return
      } else if (data.type === ItemType.TERMINACION) {
        router.push(`/seller/cotizations/${cotizationId}/addTermination?workId=${workId}`)
        return
      } else if (data.type === ItemType.MANO_DE_OBRA) {
        router.push(`/seller/cotizations/${cotizationId}/addManoDeObra?workId=${workId}`)
        return
      } else if (data.type === ItemType.AJUSTE) {
        router.push(`/seller/cotizations/${cotizationId}/addAjuste?workId=${workId}`)
        return
      }

      setLoading(true)
      try {
        const itemData= {
          workId,
          type: data.type,
          largo: "0",
          ancho: "0",
          centimetros: "0"
        }
        await createOrUpdateItemAction(null, itemData)
        toast({ title: "Item creado" })
        closeDialog()
      } catch (error: any) {
        toast({ title: "Error", description: error.message, variant: "destructive" })
      } finally {
        setLoading(false)
      }
  
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

          { isArea &&
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
          }
          

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
