"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { CotizationDAO } from "@/services/cotization-services";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getClientsAction } from "../../clients/client-actions";
import { ClientSelector, SelectorData } from "../client-selector";
import { createDuplicatedAction, getCotizationDAOAction, getNextLabelAction } from "../cotization-actions";
import { Input } from "@/components/ui/input";

type Props= {
  searchParams: {
    id?: string
  }
}
export default function DuplicatePage({ searchParams }: Props) {

  const router= useRouter()

  const [cotization, setCotization] = useState<CotizationDAO | null>(null)
  // const [obra, setObra] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const [clientSelectors, setClientSelectors] = useState<SelectorData[]>([])
  const [clientId, setClientId] = useState<string | null>(null)

  const cotizationId= searchParams.id

  useEffect(() => {    
    if (!cotizationId) 
      return
    setLoading(true)
    getCotizationDAOAction(cotizationId)
    .then((cotization) => setCotization(cotization))
    .catch(console.error)
    .finally(() => setLoading(false))
      
  }, [cotizationId])

  useEffect(() => {
    getClientsAction()
    .then((clients) => {
      const selectors= clients.map((client) => ({ id: client.id, name: client.name }))
      setClientSelectors(selectors)
    })
    .catch(console.error)
  }, [])


  function handleCreateDuplicated() {
    if (!cotizationId) 
      return
    if (!clientId) {
      toast({ title: "Seleccionar un cliente", description: "Para crear un duplicado debes seleccionar un cliente" })
      return
    }

    setLoading(true)
    createDuplicatedAction(cotizationId, clientId)
    .then((created) => {
      toast({ title: "Duplicado creado", description: "El duplicado se creó correctamente. Redirigiéndose al presupuesto creado" })
      router.push(`/seller/cotizations/${created.id}`)
    })
    .catch((error) => {
      console.error(error)
      toast({ title: "Error al crear el duplicado", description: error.message })
    })
    .finally(() => setLoading(false))    
  }

  if (!cotization) 
    return <div className="w-full pt-10 flex justify-center"><Loader className="h-6 w-6 animate-spin" /></div>

  const wokrs= cotization.works
  return (
    <div className="w-full pt-16 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">Duplicar presupuesto tomando como base:</CardTitle> 
          <CardTitle className="font-bold text-lg text-center">{cotization.label}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="mb-10 mx-auto border rounded-md p-7 min-w-[290px]">
            <p>{wokrs.length > 1 ? `${wokrs.length} Trabajos:` : `1 Trabajo:`}</p>
            <ul className="list-disc list-inside">
              {wokrs.map((work) => (
                <li key={work.id}>{work.name}: {work.items.length} items</li>
              ))}
            </ul>
            <p className="mt-7">Cliente actual:</p>
            <p className="font-bold">{cotization.client.name}</p>
          </div>
          <div className="mb-10 mx-auto min-w-[290px]">
            <p>Cliente para el nuevo presupuesto:</p>
            <ClientSelector data={clientSelectors} onSelect={setClientId} />
            {/* <p className="mt-5">Obra:</p>
            <Input value={obra} onChange={(e) => setObra(e.target.value)} /> */}
          </div>
          <Button className={cn(!clientId && "hidden")} onClick={handleCreateDuplicated}> 
            {
              loading ? 
                <Loader className="h-6 w-6 animate-spin" /> :
                <p>Crear duplicado</p> 
            }
            
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
