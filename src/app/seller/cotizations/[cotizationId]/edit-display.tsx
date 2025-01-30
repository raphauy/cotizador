import { columns } from "@/app/admin/items/item-columns"
import { ItemDialog } from "@/app/admin/items/item-dialogs"
import { DataTable } from "@/app/admin/items/item-table"
import { WorkDialog } from "@/app/admin/works/work-dialogs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { CotizationDAO } from "@/services/cotization-services"
import { WorkDAO } from "@/services/work-services"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

type Props= {
    work?: WorkDAO
    cotizationId: string
    showDialog: boolean
}
export default function EditDisplay({ work, cotizationId, showDialog }: Props) {

    if (!work)
        return (
            <Card className={cn("lg:w-1/2 h-fit")}>
                <CardHeader className="flex justify-between">
                    <CardTitle className="h-6">Editor de trabajos</CardTitle>
                </CardHeader>
                <CardContent className={cn("flex items-center justify-center")}>
                    {
                        showDialog ? 
                            <WorkDialog cotizationId={cotizationId} />  
                            :
                            <p className="text-muted-foreground pb-8">Selecciona un trabajo para editarlo aquí</p>
                    }
                </CardContent>
            </Card>
        )

    return (
        <Card className="lg:w-1/2 h-fit">
            <CardHeader>
                <div className="flex items-center justify-between"> 
                    <CardTitle className="flex items-center gap-1">
                        {work.workType.name}{work.reference && <p className="text-sm text-muted-foreground">({work.reference})</p>}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <p className="text-sm">{work.material.name} ({work.color.name})</p>
                        <WorkDialog id={work.id} cotizationId={work.cotizationId} />
                    </div>
                </div>
                <Separator />
            </CardHeader>
            <CardContent className="text-muted-foreground">
                <DataTable columns={columns} data={work.items} subject="Items" workId={work.id} cotizationId={work.cotizationId} />
            </CardContent>
        </Card>
    )
}
