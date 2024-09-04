"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { CotizationDAO, CotizationFormValues, cotizationSchema } from '@/services/cotization-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { CotizationType } from "@prisma/client"
import { CalendarIcon, Loader } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { ClientDialog } from "../clients/client-dialogs"
import { ClientSelector, SelectorData } from "./client-selector"
import { createOrUpdateCotizationAction, deleteCotizationAction, setCommentsAction } from "./cotization-actions"
import { SellerSelector } from "./seller-selector"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn, getCotizationTypeLabel } from "@/lib/utils"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const types= Object.values(CotizationType)

type Props= {
  clientSelectors: SelectorData[]
  sellerSelectors: SelectorData[]
  cotization?: CotizationDAO | null
}

export function CotizationForm({ clientSelectors, sellerSelectors, cotization }: Props) {
  const user= useSession().data?.user

  const form = useForm<CotizationFormValues>({
    resolver: zodResolver(cotizationSchema),
    defaultValues: {
      clientId: cotization?.clientId ?? "",
      creatorId: cotization?.creatorId ?? user?.id,
      sellerId: cotization?.sellerId ?? user?.id,
      obra: cotization?.obra ?? "",
      showTotalInPreview: cotization?.showTotalInPreview ?? false,
      showTaxesInPreview: cotization?.showTaxesInPreview ?? false,
      type: cotization?.type ?? "COMUN",
      date: cotization?.date ?? new Date(),
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [newClientId, setNewClientId] = useState(cotization?.clientId ?? "")
  const [sellerSelectedId, setSellerSelectedId] = useState(cotization?.sellerId ?? user?.id)
  const [openCalendar, setOpenCalendar] = useState(false)
  const router= useRouter()

  const onSubmit = async (data: CotizationFormValues) => {

    setLoading(true)
    try {
      const created= await createOrUpdateCotizationAction(cotization ? cotization.id : null, data)
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

  function setSellerId(sellerId: string) {
    form.setValue("sellerId", sellerId)
    setSellerSelectedId(sellerId)
  }

  return (
    <div className="p-6 bg-white rounded-md max-w-xl border w-full mx-auto dark:bg-black">
      <p>User: {user?.name}</p>
      <div className="space-y-2 mb-6">
        <p>Cliente:</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center w-full">
            <ClientSelector data={clientSelectors} onSelect={setClientId} selectedId={newClientId} />
          </div>
          <ClientDialog onSelect={setClientId} />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <p>Vendedor:</p>
        <SellerSelector data={sellerSelectors} onSelect={setSellerId} selectedId={sellerSelectedId} />
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
                      <SelectItem key={type} value={type}>{getCotizationTypeLabel(type)}</SelectItem>
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
      
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-3">Fecha:</FormLabel>
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona la fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      onSelect={(date) => {
                        field.onChange(date);
                        setOpenCalendar(false)
                      }}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showTotalInPreview"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Mostrar Total en Preview
                  </FormLabel>
                  <FormDescription>
                    Si se marca esta casilla, el total se mostrará en el Preview
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showTaxesInPreview"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Mostrar IVA en Preview
                  </FormLabel>
                  <FormDescription>
                    Si se marca esta casilla, el IVA se mostrará en el Preview
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />


        <div className="flex justify-end">
            <Button type="button" variant={"secondary"} className="w-32" onClick={() => router.back()}>
              Volver
            </Button>
            <Button type="submit" className="ml-2 min-w-32">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>{cotization ? "Guardar" : "Crear presupuesto"}</p>}
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



// --- Comments ---
const commentsSchema = z.object({
	comments: z.string(),
})

type CommentsFormValues = z.infer<typeof commentsSchema>

type CommentsProps= {
  cotizationId: string
  comments: string
  closeDialog: () => void
}

export function CommentsForm({ cotizationId, comments, closeDialog }: CommentsProps) {
  const form = useForm<CommentsFormValues>({
    resolver: zodResolver(commentsSchema),
    defaultValues: {
      comments,
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CommentsFormValues) => {
    setLoading(true)
    try {
      await setCommentsAction(cotizationId, data.comments)
      toast({ title: "Comentarios actualizados" })
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
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Textarea rows={10} placeholder="CotizationNote's text" {...field} />
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