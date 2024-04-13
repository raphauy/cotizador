"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteColorAction, createOrUpdateColorAction, getColorDAOAction, getMaterialsDAOAction } from "./color-actions"
import { colorSchema, ColorFormValues } from '@/services/color-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { MaterialDAO } from "@/services/material-services"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props= {
  id?: string
  closeDialog: () => void
}

export function ColorForm({ id, closeDialog }: Props) {
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: "",
      image: "",
      materialId: "",
    },
    mode: "onChange",
  })
  const [materials, setMaterials] = useState<MaterialDAO[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getMaterialsDAOAction()
    .then((data) => {
      setMaterials(data)
    })
    .finally(() => {
      setLoading(false)
    })

  }, [])
  

  const onSubmit = async (data: ColorFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateColorAction(id ? id : null, data)
      toast({ title: id ? "Color actualizado" : "Color creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getColorDAOAction(id).then((data) => {
        if (data) {
          form.setValue("name", data.name)
          form.setValue("materialId", data.materialId)
          form.setValue("clienteFinalPrice", data.clienteFinalPrice.toString())
          form.setValue("arquitectoStudioPrice", data.arquitectoStudioPrice.toString())
          form.setValue("distribuidorPrice", data.distribuidorPrice.toString())
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
            name="materialId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un Material" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {materials.map(material => (
                      <SelectItem key={material.id} value={material.id}>{material.name}</SelectItem>  
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del color</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="clienteFinalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de cliente final</FormLabel>
                <FormControl>
                  <Input placeholder="Precio de cliente final" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="arquitectoStudioPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de arquitecto studio</FormLabel>
                <FormControl> 
                  <Input placeholder="Precio de arquitecto studio" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="distribuidorPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de distribuidor</FormLabel>
                <FormControl>
                  <Input placeholder="Precio de distribuidor" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      
          

        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

export function DeleteColorForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteColorAction(id)
    .then(() => {
      toast({title: "Color deleted" })
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
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}

