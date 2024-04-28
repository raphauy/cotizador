"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteItemAction, createOrUpdateItemAction, getItemDAOAction } from "./item-actions"
import { itemSchema, ItemFormValues } from '@/services/item-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { ItemType } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const itemTypes = Object.values(ItemType)

type Props= {
  id?: string
  cotizationId: string
  workId: string
  closeDialog: () => void
}

export function ItemForm({ id, workId, cotizationId, closeDialog }: Props) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      workId,
      type: ItemType.TRAMO,
      largo: "0",
      ancho: "0",
      centimetros: "0",
      quantity: "1",
    },
    mode: "onChange",
  })
  const [isArea, setIsArea] = useState(false)
  const [isLinear, setIsLinear] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const watchType = useWatch({ name: "type", control: form.control })

  useEffect(() => {
    if (watchType === ItemType.TRAMO || watchType === ItemType.ZOCALO || watchType === ItemType.ALZADA){
      setIsArea(true)
      setIsLinear(false)
    } else if (watchType === ItemType.REGRUESO){
      setIsLinear(true)
      setIsArea(false)
    } else {
      setIsArea(false)
      setIsLinear(false)
    }
  }, [watchType])

  const onSubmit = async (data: ItemFormValues) => {
    if (data.type === ItemType.TERMINACION) {
      router.push(`/seller/cotizations/${cotizationId}/addTermination?workId=${workId}`)
      return
    }
    setLoading(true)
    try {
      await createOrUpdateItemAction(id ? id : null, data)
      toast({ title: id ? "Item actualizado" : "Item creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getItemDAOAction(id).then((data) => {
        if (data) {
          form.setValue("workId", data.workId)
          form.setValue("type", data.type)
          form.setValue("largo", data.largo?.toString() || "0")
          form.setValue("ancho", data.ancho?.toString() || "0")
          form.setValue("centimetros", data.centimetros?.toString() || "0")
          form.setValue("quantity", data.quantity?.toString() || "1")
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

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
                <Select disabled={id ? true : false}
                  onValueChange={(value) => field.onChange(value)} 
                  value={field.value}
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
          <>

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad:</FormLabel>
                  <FormControl>
                    <Input placeholder="Cantidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="largo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Largo (cm):</FormLabel>
                  <FormControl>
                    <Input placeholder="Item's largo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
      
            <FormField
              control={form.control}
              name="ancho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ancho (cm):</FormLabel>
                  <FormControl>
                    <Input placeholder="Item's ancho" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
          }

          { isLinear &&
      
            <FormField
              control={form.control}
              name="centimetros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Centímetros</FormLabel>
                  <FormControl>
                    <Input placeholder="Centimetros" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          }
          

        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

type DeleteProps= {
  id: string
  closeDialog: () => void
}
export function DeleteItemForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteItemAction(id)
    .then(() => {
      toast({title: "Item eliminado" })
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}

