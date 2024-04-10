"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteCotizationAction, createOrUpdateCotizationAction, getCotizationDAOAction } from "./cotization-actions"
import { cotizationSchema, CotizationFormValues } from '@/services/cotization-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { ClientSelector, SelectorData } from "./client-selector"
import { ClientDialog } from "../clients/client-dialogs"
import { CotizationType } from "@prisma/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "next-auth/react"

const types= Object.values(CotizationType)

type Props= {
  data: SelectorData[]
}

export function CotizationForm({ data }: Props) {
  const user= useSession().data?.user

  const form = useForm<CotizationFormValues>({
    resolver: zodResolver(cotizationSchema),
    defaultValues: {
      clientId: "",
      creatorId: user?.id,
      sellerId: user?.id,
      obra: "",
      type: "COMUN",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [newClientId, setNewClientId] = useState("")
  const router= useRouter()

  const onSubmit = async (data: CotizationFormValues) => {

    setLoading(true)
    try {
      const created= await createOrUpdateCotizationAction(null, data)
      if (!created) {
        toast({ title: "Hubo un error al crear el presupuesto", variant: "destructive" })
        return
      }
      toast({ title: "Presupuesto creado" })
      router.push(`/seller/cotizations/${created.id}`)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  function setClientId(clientId: string) {
    form.setValue("clientId", clientId)
    setNewClientId(clientId)
  }

  return (
    <div className="p-6 bg-white rounded-md max-w-xl border w-full mx-auto dark:bg-black">

      <div className="space-y-2 mb-6">
        <p>Cliente:</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClientSelector data={data} onSelect={setClientId} selectedId={newClientId} />
          </div>
          <ClientDialog onSelect={setClientId} />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de presupuesto:</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="obra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Obra (Opcional):</FormLabel> 
                <FormControl>
                  <Input placeholder="Pocitos Tower" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      
        <div className="flex justify-end">
            <Button type="button" variant={"secondary"} className="w-32" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" className="ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Crear presupuesto</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

type DeleteProps= {
  id?: string
  closeDialog: () => void
}

export function DeleteCotizationForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteCotizationAction(id)
    .then(() => {
      toast({title: "Cotization deleted" })
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
      <Button onClick={handleDelete} variant="destructive" className="ml-2 gap-1 w-32">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}

