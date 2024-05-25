"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteManoDeObraAction, createOrUpdateManoDeObraAction, getManoDeObraDAOAction } from "./manodeobra-actions"
import { manoDeObraSchema, ManoDeObraFormValues } from '@/services/manodeobra-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { Switch } from "@/components/ui/switch"

type Props= {
  id?: string
  closeDialog: () => void
}

export function ManoDeObraForm({ id, closeDialog }: Props) {
  const form = useForm<ManoDeObraFormValues>({
    resolver: zodResolver(manoDeObraSchema),
    defaultValues: {
      name: "",
      clienteFinalPrice: "0",
      arquitectoStudioPrice: "0",
      distribuidorPrice: "0",
      isLinear: false,
      isSurface: false,
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: ManoDeObraFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateManoDeObraAction(id ? id : null, data)
      toast({ title: id ? "ManoDeObra updated" : "ManoDeObra created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getManoDeObraDAOAction(id).then((data) => {
        if (data) {
          form.setValue("name", data.name)
          data.clienteFinalPrice && form.setValue("clienteFinalPrice", data.clienteFinalPrice.toString())
          data.arquitectoStudioPrice && form.setValue("arquitectoStudioPrice", data.arquitectoStudioPrice.toString())
          data.distribuidorPrice && form.setValue("distribuidorPrice", data.distribuidorPrice.toString())
          data.isLinear && form.setValue("isLinear", data.isLinear)
          data.isSurface && form.setValue("isSurface", data.isSurface)
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la mano de obra" {...field} />
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
                <FormLabel>Precio al público</FormLabel>
                <FormControl>
                  <Input placeholder="Precio para cliente final" {...field} />
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
                <FormLabel>Precio para arquitecto y estudio</FormLabel>
                <FormControl>
                  <Input placeholder="Precio para arquitecto/estudio" {...field} />
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
                <FormLabel>Precio para distribuidor</FormLabel>
                <FormControl>
                  <Input placeholder="Precio para distribuidor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isLinear"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Mano de obra por metro lineals
                  </FormLabel>
                </div>
                
                <div className="pb-1">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isSurface"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Mano de obra por metro cuadrado
                  </FormLabel>
                </div>
                <div className="pb-1">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          

        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Save</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

export function DeleteManoDeObraForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteManoDeObraAction(id)
    .then(() => {
      toast({title: "ManoDeObra deleted" })
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

