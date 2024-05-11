"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteCotizationNoteAction, createOrUpdateCotizationNoteAction, getCotizationNoteDAOAction } from "./cotizationnote-actions"
import { cotizationNoteSchema, CotizationNoteFormValues } from '@/services/cotizationnote-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

type Props= {
  id?: string
  closeDialog: () => void
}

export function CotizationNoteForm({ id, closeDialog }: Props) {
  const form = useForm<CotizationNoteFormValues>({
    resolver: zodResolver(cotizationNoteSchema),
    defaultValues: {
      text: "",
      order: 0,
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: CotizationNoteFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateCotizationNoteAction(id ? id : null, data)
      toast({ title: id ? "CotizationNote updated" : "CotizationNote created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getCotizationNoteDAOAction(id).then((data) => {
        if (data) {
          form.setValue("text", data.text)
          form.setValue("order", data.order)
        }
      })
    }
  }, [form, id])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="text"
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

export function DeleteCotizationNoteForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteCotizationNoteAction(id)
    .then(() => {
      toast({title: "CotizationNote deleted" })
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

