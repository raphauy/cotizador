"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { TerminacionFormValues, terminacionSchema } from '@/services/terminacion-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateTerminacionAction, deleteTerminacionAction, getTerminacionDAOAction, archiveAndDuplicateTerminacionAction } from "./terminacion-actions"
import * as z from "zod"

type Props= {
  id?: string
  closeDialog: () => void
}

export function TerminacionForm({ id, closeDialog }: Props) {
  const form = useForm<TerminacionFormValues>({
    resolver: zodResolver(terminacionSchema),
    defaultValues: {
      name: "",
      price: "0",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: TerminacionFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateTerminacionAction(id ? id : null, data)
      toast({ title: id ? "Terminación actualizada" : "Terminación creada" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getTerminacionDAOAction(id).then((data) => {
        if (data) {
          form.setValue("name", data.name)
          data.price && form.setValue("price", data.price.toString())
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
                <FormLabel>Nombre:</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la terminación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio:</FormLabel>
                <FormControl>
                  <Input placeholder="Precio" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


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

export function DeleteTerminacionForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteTerminacionAction(id)
    .then(() => {
      toast({title: "Terminación eliminada" })
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
        Eliminar
      </Button>
    </div>
  )
}

// Schema para el formulario de archivar y duplicar
const archiveAndDuplicateSchema = z.object({
  newPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "El precio debe ser un número válido mayor o igual a cero"
  })
})

type ArchiveAndDuplicateFormValues = z.infer<typeof archiveAndDuplicateSchema>

export function ArchiveAndDuplicateTerminacionForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)
  
  const form = useForm<ArchiveAndDuplicateFormValues>({
    resolver: zodResolver(archiveAndDuplicateSchema),
    defaultValues: {
      newPrice: "0",
    },
    mode: "onChange",
  })

  // Cargar el precio actual como valor predeterminado
  useEffect(() => {
    if (id) {
      getTerminacionDAOAction(id).then((data) => {
        if (data && data.price) {
          form.setValue("newPrice", data.price.toString())
        }
      })
    }
  }, [form, id])

  const onSubmit = async (data: ArchiveAndDuplicateFormValues) => {
    if (!id) return
    
    setLoading(true)
    try {
      const newPrice = Number(data.newPrice)
      await archiveAndDuplicateTerminacionAction(id, newPrice)
      toast({ 
        title: "Terminación archivada y duplicada", 
        description: "Se ha archivado la terminación original y creado una nueva con el precio actualizado." 
      })
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
            name="newPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nuevo precio:</FormLabel>
                <FormControl>
                  <Input placeholder="Nuevo precio" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Confirmar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

