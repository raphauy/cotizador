"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { CotizationDAO } from "@/services/cotization-services";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createVersionAction, getCotizationDAOAction, getNextLabelAction } from "../cotization-actions";

type Props= {
  searchParams: {
    id?: string
  }
}
export default function VersionPage({ searchParams }: Props) {

  const router= useRouter()

  const [cotization, setCotization] = useState<CotizationDAO | null>(null)
  const [nextLabel, setNextLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    if (!cotizationId) 
      return
    setLoading(true)
    getNextLabelAction(cotizationId)
    .then((label) => setNextLabel(label))
    .catch(console.error)
    .finally(() => setLoading(false))
  }, [cotizationId])
  

  function handleCreateVersion() {
    if (!cotizationId) 
      return

    setLoading(true)
    createVersionAction(cotizationId)
    .then((createdVersion) => {
      toast({ title: "Version creada", description: "La version se creó correctamente. Redirigiéndose a la versión creada" })
      router.push(`/seller/cotizations/${createdVersion.id}`)
    })
    .catch((error) => {
      console.error(error)
      toast({ title: "Error al crear la version", description: error.message })
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
          <CardTitle className="text-center">Crear versión basada en el presupuesto:</CardTitle>
          <CardTitle className="font-bold text-lg text-center">{cotization.label}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="mb-10 mx-auto border rounded-md p-7">
            <p>{wokrs.length > 1 ? `${wokrs.length} Trabajos:` : `1 Trabajo:`}</p>
            <ul className="list-disc list-inside">
              {wokrs.map((work) => (
                <li key={work.id}>{work.name}: {work.items.length} items</li>
              ))}
            </ul>
          </div>
          <Button className="btn btn-primary" onClick={handleCreateVersion}>
            {
              loading ? 
                <Loader className="h-6 w-6 animate-spin" /> :
                <span>Crear versión {nextLabel}</span>
            }
            
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
