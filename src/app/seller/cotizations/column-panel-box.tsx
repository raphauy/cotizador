"use client"

import { Button } from "@/components/ui/button"
import { cn, formatWhatsAppStyle } from "@/lib/utils"
import { CotizationDAO } from "@/services/cotization-services"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getPostStatusColor } from "./[cotizationId]/status-selector"
import { ClientType } from "@prisma/client"

export type CotizationForPanel= {
    id: string
    status: string
    date: Date
    label: string
    clientName: string
    clientType: ClientType
    sellerName: string
    workCount: number
}

type Props = {
  cotization: CotizationForPanel
}
export default function ColumnPanelBox({ cotization }: Props) {
    const params= useParams()
    const cotizationId= params.cotizationId
    const status= cotization.status
    const darkColor= getPostStatusColor(status)
  
    return (
        <Link href={`/seller/cotizations/${cotization.id}`}>
            <div className={cn("px-2", cotizationId === cotization.id ? "bg-green-100 dark:bg-gray-800" : "")}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Button variant="link" className="pl-0 dark:text-white">
                            {cotization.label}
                        </Button>
                    </div>
                    <p className="text-xs">{formatWhatsAppStyle(cotization.date)}</p>
                </div>
                <div className="flex items-center justify-end gap-1">
                    <p className="font-bold text-right">{cotization.clientName}</p> 
                    <div 
                        className={cn("w-5 h-5 p-2 text-sm font-bold border rounded-full text-white flex items-center justify-center")}
                        style={{ backgroundColor: darkColor }}
                    >
                        {cotization.workCount}
                    </div>
                </div>
            </div>
        </Link>
    )
}
