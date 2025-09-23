"use client"

import { deleteItemAction, getItemDAOAction } from "@/app/admin/items/item-actions"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Loader, PlusCircle, X } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { TerminationItem } from "./page"
import TerminationForm from "./termination-form"
import { getTerminacionsForWorkDAOAction } from "@/app/admin/terminations/terminacion-actions"
import { TerminacionDAO } from "@/services/terminacion-services"

type Props= {
    workId: string
    cantidad: number
    itemTerminations: TerminationItem[]
    setItemTerminations: (items: TerminationItem[]) => void
}
export default function TerminationsBox({ workId, cantidad, itemTerminations, setItemTerminations }: Props) {
    const [loading, setLoading] = useState(false)
    const [loadingTerminations, setLoadingTerminations] = useState(false)
    const processedItems = useRef<Set<string>>(new Set())

    const [terminations, setTerminations] = useState<TerminacionDAO[]>([])

    // Efecto para cargar los datos de los items existentes
    useEffect(() => {
        const loadItemsData = async () => {
            const updatedItems = [...itemTerminations];
            let hasChanges = false;

            // Crear un array de promesas para procesar todos los items con ID en paralelo
            const processingPromises = itemTerminations
                .map(async (item, index) => {
                    // Solo procesar items con ID que no tengan terminationId
                    if (item.id && !item.terminationId && !processedItems.current.has(item.id)) {
                        processedItems.current.add(item.id);
                        
                        try {
                            const itemData = await getItemDAOAction(item.id);
                            if (itemData && itemData.terminacionId) {
                                // Actualizar el item con la información completa
                                updatedItems[index] = {
                                    ...updatedItems[index],
                                    terminationId: itemData.terminacionId
                                };
                                return true; // Indica que hubo un cambio
                            }
                        } catch (error) {
                            console.error("Error al cargar datos del item:", error);
                        }
                    }
                    return false; // No hubo cambio
                })
                .filter(Boolean); // Filtrar solo las promesas válidas

            // Esperar a que todas las promesas se resuelvan
            if (processingPromises.length > 0) {
                const results = await Promise.all(processingPromises);
                // Si al menos una promesa retornó true, actualizar el estado
                if (results.some(result => result)) {
                    setItemTerminations([...updatedItems]);
                }
            }
        };

        // Ejecutar al inicio solo si hay items con ID
        if (itemTerminations.some(item => item.id)) {
            loadItemsData();
        }
    }, [itemTerminations, setItemTerminations]);

    // Efecto para cargar las terminaciones
    useEffect(() => {
        setLoadingTerminations(true);

        getTerminacionsForWorkDAOAction(workId)
            .then((terminaciones) => {
                setTerminations(terminaciones);
            })
            .catch((error) => {
                console.error("Error al cargar terminaciones:", error);
                toast({
                    title: "Error al cargar terminaciones",
                    description: "No se pudieron cargar las terminaciones. Intente nuevamente.",
                    variant: "destructive"
                });
            })
            .finally(() => {
                setLoadingTerminations(false);
            });
    }, [workId]);

    // Reset de los items procesados cuando cambia el workId
    useEffect(() => {
        processedItems.current.clear();
    }, [workId]);

    function addItem() {
        const newAreas= [...itemTerminations, { id: undefined, terminationId: undefined, quantity: 0, length: 0, width: 0, centimeters: 0, ajuste: 0 }]
        setItemTerminations(newAreas)
    }

    function removeItem(index: number) {
        const itemToRemove= itemTerminations[index]
        if (itemToRemove.id) {
            setLoading(true)
            deleteItemAction(itemToRemove.id)
            .then((items) => {
                if (items) {
                    toast({title: "Item eliminado" })
                }
                setItemTerminations(itemTerminations.filter((itemTermination, i) => i !== index))
            })
            .catch((error) => {
                toast({title: "Error", description: error.message, variant: "destructive"})
            })
            .finally(() => {
                setLoading(false)
            })
        } else {
            setItemTerminations(itemTerminations.filter((itemTermination, i) => i !== index))
        }
    }

    function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemTerminations(itemTerminations.map((itemTermination, i) => i === index ? { ...itemTermination, quantity: value } : itemTermination))
    }

    function handleCentimetersChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseFloat(e.target.value) : 0
        setItemTerminations(itemTerminations.map((itemTermination, i) => i === index ? { ...itemTermination, centimeters: value, length: value } : itemTermination))
    }

    function handleLenghtChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseFloat(e.target.value) : 0
        setItemTerminations(itemTerminations.map((itemTermination, i) => i === index ? { ...itemTermination, length: value } : itemTermination))
    }

    function handleWidthChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseFloat(e.target.value) : 0
        setItemTerminations(itemTerminations.map((itemTermination, i) => i === index ? { ...itemTermination, width: value } : itemTermination))
    }

    function handleAjusteChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value= e.target.value ? parseInt(e.target.value) : 0
        setItemTerminations(itemTerminations.map((itemTermination, i) => i === index ? { ...itemTermination, ajuste: value } : itemTermination))
    }

    function notifySelected(itemId: string | undefined, index: number, terminationId: string | undefined) {
        console.log("terminationId: ", terminationId)
        
        setItemTerminations(itemTerminations.map((itemTermination, i) => i === index ? { ...itemTermination, terminationId } : itemTermination))
    }

    return (
        <div>
            <div className="mx-auto p-6 lg:p-2 space-y-4 border rounded-md dark:text-white bg-white dark:bg-black">                        
                <p>Valores en <span className="font-bold">cm</span></p>
                <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,50px] gap-2 items-center">
                    <p className="min-w-40">Terminación</p>
                    <p>Cantidad</p>
                    <p>Cm lineales</p>
                    <p>Largo (cm)</p>
                    <p>Ancho (cm)</p>
                    <p>Ajuste (USD)</p>
                    <p></p>
                </div>
                {
                    itemTerminations.map((item, index) => (
                        <div key={item.id || `temp-${index}`} className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,50px] gap-2 items-center">
                            { loadingTerminations ?
                                <Loader className="h-4 w-4 animate-spin" />
                                :
                                <TerminationForm 
                                    itemId={item.id} 
                                    index={index} 
                                    notifySelected={notifySelected} 
                                    terminations={terminations}
                                    defaultValue={item.terminationId}
                                />
                            }

                            <div className="flex items-center gap-2">
                                <Input type="number" value={item.quantity ? item.quantity : ""} onChange={(e) => handleQuantityChange(e, index)} disabled={!item.terminationId} placeholder="cant"/> 
                                x
                            </div>
                            <Input id={`item${index+1}-centimeters`} placeholder="lineal cm" type="number" value={item.centimeters ? item.centimeters : ""} onChange={(e) => handleCentimetersChange(e, index)} disabled={!item.terminationId}/>
                            <Input id={`item${index+1}-length`} placeholder="largo cm" type="number" value={item.length ? item.length : ""} onChange={(e) => handleLenghtChange(e, index)} disabled={!item.terminationId}/>
                            <Input id={`item${index+1}-width`} placeholder="ancho cm" type="number" value={item.width ? item.width : ""} onChange={(e) => handleWidthChange(e, index)} disabled={!item.terminationId}/>
                            <Input id={`item${index+1}-ajuste`} placeholder="ajuste" type="number" value={item.ajuste ? item.ajuste : ""} onChange={(e) => handleAjusteChange(e, index)} disabled={!item.terminationId}/>
                            <div className={cn("cursor-pointer", buttonVariants({ variant: "ghost"}))} onClick={() => removeItem(index)}>
                                {
                                    loading ? <Loader className="h-4 w-4 animate-spin" /> : <X className="w-5 h-5 text-red-400" />
                                }
                            </div>
                        </div>
                    ))
                }
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={addItem}>
                        <PlusCircle className="w-5 h-5 text-verde-abbate" />
                    </Button>
                </div>
        </div>
       </div>
   )
}

