"use client"

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CotizationStatus } from "@prisma/client"
import { setStatusAction } from "../cotization-actions"
import { toast } from "@/components/ui/use-toast"

interface Props {
  id: string
  status: string
}
export function StatusSelector({ id, status }: Props) {
  const [node, setNode] = useState<React.ReactNode>()  

  useEffect(() => {
    setNode(getNode(status))
  }, [status, id])
  

  function handleClick(status: CotizationStatus) {
    setStatusAction(id, status)
    .then((res) => {
      if (res){
        toast({ title: "Estado actualizado"})
        setNode(getNode(status))
      } else toast({ title: "Error al actualizar el estado", variant: "destructive"})
    })
    .catch((err) => {
      toast({ title: "Error al actualizar el estado", description: "El estado no puede volver a BORRADOR", variant: "destructive"})
    })    
  }
  return (
    <Menubar className="p-0 m-0 bg-transparent border-none">
      <MenubarMenu>
        <MenubarTrigger>
          {node}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => handleClick(CotizationStatus.BORRADOR)}>
            {getNode(CotizationStatus.BORRADOR)}
          </MenubarItem>
          <MenubarItem onClick={() => handleClick(CotizationStatus.COTIZADO)}>
            {getNode(CotizationStatus.COTIZADO)}
          </MenubarItem>
          <MenubarItem onClick={() => handleClick(CotizationStatus.VENDIDO)}>
            {getNode(CotizationStatus.VENDIDO)}
          </MenubarItem>
          <MenubarItem onClick={() => handleClick(CotizationStatus.PERDIDO)}>
            {getNode(CotizationStatus.PERDIDO)}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export function getNode(status: string) {
  const lightColor= getPostStatusColor(status, "0.3")
  const darkColor= getPostStatusColor(status)

  const res= (
    <div className={cn("flex w-28 justify-center text-gray-700 font-bold items-center h-6 gap-1 rounded-2xl cursor-pointer")} style={{ backgroundColor: lightColor }}>
      <p className={cn("w-2 h-2 rounded-full")} style={{ backgroundColor: darkColor }}></p>
      <p>{status}</p>
    </div>
  )  
  return res
}

export function getPostStatusColor(status: string, opacity?: string) {
  switch (status) {
    case CotizationStatus.BORRADOR:
      return `rgba(156, 163, 175, ${opacity || 1})`; // gray
    case CotizationStatus.PERDIDO:
      return `rgba(255, 140, 0, ${opacity || 1})`; // orange
    case CotizationStatus.VENDIDO:
      return `rgba(0, 128, 0, ${opacity || 1})`; // green
    case CotizationStatus.COTIZADO:
        return `rgba(51, 153, 255, ${opacity || 1})`; // sky
    // case "Publicado":
    //   return `rgba(255, 215, 0, ${opacity || 1})`; // yellow
    default:
      return `rgba(156, 163, 175, ${opacity || 1})`; // gray
    }
}
