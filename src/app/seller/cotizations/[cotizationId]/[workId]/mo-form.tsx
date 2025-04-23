"use client"

import { getItemDAOAction } from "@/app/admin/items/item-actions"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ManoDeObraDAO } from "@/services/manodeobra-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Archive } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"

export const schema = z.object({
    manoDeObraId: z.string().optional(),
  })
  
export type FormValues = z.infer<typeof schema>
  
type Props= {
    itemId: string | undefined
    index: number
    defaultManoDeObraId?: string | undefined
    notifyMOSelected: (itemId: string | undefined, index: number, manoDeObra: ManoDeObraDAO | undefined) => void
    manoDeObras: ManoDeObraDAO[]
}
export default function MOForm({ itemId, index, defaultManoDeObraId, notifyMOSelected, manoDeObras }: Props) {

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            manoDeObraId: defaultManoDeObraId,
        },
        mode: "onChange",
    })

    const manoDeObraId = form.watch("manoDeObraId")
    
    // Estado para guardar la mano de obra seleccionada
    const [selectedManoDeObra, setSelectedManoDeObra] = useState<ManoDeObraDAO | undefined>()
    // Flag para saber si la mano de obra seleccionada está archivada
    const [hasArchivedSelection, setHasArchivedSelection] = useState<boolean>(false)

    // Inicializar con defaultManoDeObraId si está presente
    useEffect(() => {
        if (defaultManoDeObraId) {
            form.setValue("manoDeObraId", defaultManoDeObraId);
            
            // Buscar la mano de obra seleccionada por defecto
            const manoDeObra = manoDeObras.find(mo => mo.id === defaultManoDeObraId);
            if (manoDeObra) {
                setSelectedManoDeObra(manoDeObra);
                setHasArchivedSelection(manoDeObra.archived);
            }
        }
    }, [defaultManoDeObraId, form, manoDeObras]);

    useEffect(() => {
        if (manoDeObraId) {
            const manoDeObra = manoDeObras.find(mo => mo.id === manoDeObraId);
            notifyMOSelected(itemId, index, manoDeObra);
            
            // Actualizar la mano de obra seleccionada
            setSelectedManoDeObra(manoDeObra);
            setHasArchivedSelection(manoDeObra?.archived || false);
        } else {
            setSelectedManoDeObra(undefined);
            setHasArchivedSelection(false);
            notifyMOSelected(itemId, index, undefined);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [manoDeObraId, manoDeObras]);
    
    useEffect(() => {
        if (itemId && !defaultManoDeObraId) {            
            getItemDAOAction(itemId)
            .then((item) => {
                if (!item || !item.manoDeObraId)
                    return

                item.manoDeObraId && form.setValue("manoDeObraId", item.manoDeObraId)
                
                // Verificar si la mano de obra seleccionada está archivada
                const manoDeObra = manoDeObras.find(mo => mo.id === item.manoDeObraId)
                if (manoDeObra) {
                    setSelectedManoDeObra(manoDeObra);
                    setHasArchivedSelection(manoDeObra.archived || false);
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [itemId, form, manoDeObras, defaultManoDeObraId])

    // Filtramos las manos de obra que se mostrarán en el desplegable
    const filteredManoDeObras = useMemo(() => {
        // Incluir todas las manos de obra activas
        const active = manoDeObras.filter(mo => !mo.archived);
        
        // Si hay una mano de obra archivada seleccionada, incluirla también
        if (hasArchivedSelection && selectedManoDeObra?.archived) {
            return [...active, selectedManoDeObra];
        }
        
        return active;
    }, [manoDeObras, hasArchivedSelection, selectedManoDeObra]);

    function onSubmit(data: FormValues) {
        console.log(data)        
    }

    return (
        <div className="max-w-lg min-w-40 flex flex-col items-center justify-between w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                
                <FormField
                    control={form.control}
                    name="manoDeObraId"
                    render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <div className="flex items-center w-full justify-between">
                                    {selectedManoDeObra ? (
                                        <div className="flex items-center gap-2">
                                            {selectedManoDeObra.name}
                                            {selectedManoDeObra.archived && (
                                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                                                    <Archive className="h-3 w-3" />
                                                    Archivado
                                                </Badge>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">Seleccione aquí</span>
                                    )}
                                </div>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {filteredManoDeObras.map(manoDeObra => (
                            <SelectItem key={manoDeObra.id} value={manoDeObra.id}>
                                <div className="flex items-center gap-2">
                                    <span>{manoDeObra.name}</span>
                                    {manoDeObra.archived && (
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                                            <Archive className="h-3 w-3" />
                                            Archivado
                                        </Badge>
                                    )}
                                </div>
                            </SelectItem>  
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                </form>
            </Form>
       </div>
   )
}

