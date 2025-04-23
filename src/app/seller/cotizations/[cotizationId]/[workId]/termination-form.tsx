"use client"

import { getItemDAOAction } from "@/app/admin/items/item-actions"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TerminacionDAO } from "@/services/terminacion-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Archive } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"

export const schema = z.object({
    terminationId: z.string().optional(),
})
  
export type FormValues = z.infer<typeof schema>
  
type Props= {
    itemId: string | undefined
    index: number
    notifySelected: (itemId: string | undefined, index: number, terminationId: string | undefined) => void
    terminations: TerminacionDAO[]
    defaultValue?: string
}

export default function TerminationForm({ itemId, index, notifySelected, terminations, defaultValue }: Props) {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            terminationId: defaultValue || "",
        },
        mode: "onChange",
    })

    const terminationId = form.watch("terminationId")
    
    // Estado para guardar la terminación seleccionada
    const [selectedTermination, setSelectedTermination] = useState<TerminacionDAO | undefined>()
    // Flag para saber si la terminación seleccionada está archivada
    const [hasArchivedSelection, setHasArchivedSelection] = useState<boolean>(false)

    // Inicializar con defaultValue si está presente
    useEffect(() => {
        if (defaultValue) {
            form.setValue("terminationId", defaultValue);
            
            // Buscar la terminación seleccionada por defecto
            const termination = terminations.find(t => t.id === defaultValue);
            if (termination) {
                setSelectedTermination(termination);
                setHasArchivedSelection(termination.archived);
            }
        }
    }, [defaultValue, form, terminations]);

    useEffect(() => {
        notifySelected(itemId, index, terminationId)
        
        // Actualizar la terminación seleccionada
        if (terminationId) {
            const termination = terminations.find(t => t.id === terminationId)
            setSelectedTermination(termination)
            setHasArchivedSelection(termination?.archived || false)
        } else {
            setSelectedTermination(undefined)
            setHasArchivedSelection(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [terminationId, terminations])
    
    useEffect(() => {
        if (itemId && !defaultValue) {
            getItemDAOAction(itemId)
            .then((item) => {
                if (!item || !item.terminacionId)
                    return

                form.setValue("terminationId", item.terminacionId)
                
                // Verificar si la terminación seleccionada está archivada
                const termination = terminations.find(t => t.id === item.terminacionId)
                setHasArchivedSelection(termination?.archived || false)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [itemId, form, terminations, defaultValue])

    // Filtramos las terminaciones que se mostrarán en el desplegable
    const filteredTerminations = useMemo(() => {
        // Solo mostrar archivados si la terminación seleccionada está archivada
        if (hasArchivedSelection) {
            return terminations;
        }
        // En todos los demás casos, filtrar las archivadas
        return terminations.filter(t => !t.archived);
    }, [terminations, hasArchivedSelection]);

    function onSubmit(data: FormValues) {
        console.log(data)        
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <FormField
                        control={form.control}
                        name="terminationId"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <div className="flex items-center w-full justify-between">
                                                {selectedTermination ? (
                                                    <div className="flex items-center gap-2">
                                                        {selectedTermination.name}
                                                        {selectedTermination.archived && (
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
                                        {filteredTerminations.map(termination => (
                                            <SelectItem key={termination.id} value={termination.id}>
                                                <div className="flex items-center gap-2">
                                                    <span>{termination.name}</span>
                                                    {termination.archived && (
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

