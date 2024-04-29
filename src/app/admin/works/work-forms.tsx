"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ColorDAO } from "@/services/color-services"
import { MaterialDAO } from "@/services/material-services"
import { WorkFormValues, workSchema } from '@/services/work-services'
import { WorkTypeDAO } from "@/services/worktype-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { getColorsDAOByMaterialIdAction, getMaterialsDAOAction } from "../colors/color-actions"
import { getWorkTypesDAOAction } from "../worktypes/worktype-actions"
import { createOrUpdateWorkAction, deleteWorkAction, getWorkDAOAction } from "./work-actions"
import { Input } from "@/components/ui/input"

type Props= {
  id?: string
  cotizationId: string
  closeDialog: () => void
}

export function WorkForm({ id, cotizationId, closeDialog }: Props) {
  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      cotizationId,
      reference: "",
    },
    mode: "onChange",
  })
  const [materials, setMaterials] = useState<MaterialDAO[]>([])
  const [worktype, setWorktype] = useState<WorkTypeDAO[]>([])
  const [color, setColor] = useState<ColorDAO[]>([])
  const [loading, setLoading] = useState(false)

  const watchMaterialId = useWatch({ name: "materialId", control: form.control })

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

  useEffect(() => {
    setLoading(true)
    getWorkTypesDAOAction()
    .then((data) => {
      setWorktype(data)
    })
    .finally(() => {
      setLoading(false)
    })

  }, [])

  useEffect(() => {
    setLoading(true)
    getColorsDAOByMaterialIdAction(watchMaterialId)
    .then((data) => {
      setColor(data)
    })
    .finally(() => {
      setLoading(false)
    })

  }, [watchMaterialId])

  const onSubmit = async (data: WorkFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateWorkAction(id ? id : null, data)
      toast({ title: id ? "Trabajo actualizado" : "Trabajo creado" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getWorkDAOAction(id).then((data) => {
        if (data) {
          form.reset({
            ...data,
            reference: data.reference || "",
          })
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
            name="workTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trabajo:</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un Trabajo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {worktype.map(worktype => (
                      <SelectItem key={worktype.id} value={worktype.id}>{worktype.name}</SelectItem>  
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="materialId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material:</FormLabel>
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
            name="colorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color:</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un Color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {color.map(color => (
                      <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>  
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referencia:</FormLabel>
                <FormControl>
                  <Input placeholder="Referencia" {...field} />
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

type DeleteProps= {
  id: string
  closeDialog: () => void
}
export function DeleteWorkForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteWorkAction(id)
    .then(() => {
      toast({title: "Trabajo eliminado" })
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

