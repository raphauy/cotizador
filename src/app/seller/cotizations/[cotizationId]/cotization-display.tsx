import { OptionalColorsBoxDialog } from "@/app/admin/works/optional-works-box"
import { DeleteWorkDialog, WorkDialog } from "@/app/admin/works/work-dialogs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, formatCurrency, formatWhatsAppStyle, getCotizationTypeLabel } from "@/lib/utils"
import { CotizationDAO } from "@/services/cotization-services"
import { OptionalColorsTotalResult, calculateTotalWorkValue } from "@/services/optional-colors-services"
import { ClipboardPen, Construction, CopyPlus, Eye, Mail, Pencil, Phone, PlusCircle } from "lucide-react"
import Link from "next/link"
import { ClientDialog } from "../../clients/client-dialogs"
import { columns } from "../../notes/note-columns"
import { columns as notEditableColumns } from "../../notes/note-columns-not-editable"
import { NoteDialog } from "../../notes/note-dialogs"
import { DataTable } from "../../notes/note-table"
import CotizationNotesBox from "./cotization-notes-box"
import { ItemsList } from "./items-list"
import { StatusSelector } from "./status-selector"
import { VersionSelector } from "./version-selector"
import CommentsBox from "./comment-box"
import WorkMenu from "./work-menu"
import { CotizationStatus } from "@prisma/client"

type Props= {
    cotization: CotizationDAO
    creatorName: string
    sellerName: string
    selectedWorkId: string
}
export default function CotizationDisplay({ cotization, creatorName, sellerName, selectedWorkId }: Props) {

    const ownerIsSeller= cotization.creatorId === cotization.sellerId

    const updateClientTrigger= <Pencil size={26} className="pr-2 hover:cursor-pointer text-muted-foreground"/> 

    const works= cotization.works

    // totalValue= suma de todos los valores de los items
    const totalValue= works.reduce((acc, work) => acc + work.items
    //.filter(item => item.type !== "COLOCACION")
    .reduce((acc, item) => acc + (((item.valor || 0)+(item.valorAreaTerminacion || 0))*(item.quantity)), 0), 0)

    const isEditable= cotization.status === CotizationStatus.BORRADOR

    return (
        <div className="space-y-5 w-full">
            <Card>
                <CardHeader>
                    <div className="flex justify-between"> 
                        <div>
                            <CardTitle className="flex items-center gap-5 text-2xl">
                                <p className="text-green-900 font-bold">{cotization.label}</p> 
                                <Badge variant="secondary" className="bg-sky-100 border-sky-400 text-black">{getCotizationTypeLabel(cotization.type)}</Badge>
                                <Badge variant="secondary" className="bg-orange-100 border-orange-400 text-black">{cotization.client.type}</Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 text-lg">
                                {cotization.client.name} 
                                { isEditable && <ClientDialog id={cotization.clientId} updateTrigger={updateClientTrigger} /> }
                                {
                                    cotization.client.note &&
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <ClipboardPen size={20} />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-sm">{cotization.client.note}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                }
                            </CardDescription>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatWhatsAppStyle(cotization.date)}</p>
                    </div>
                    <Separator />
                </CardHeader>
                <CardContent className="flex gap-2 justify-between text-muted-foreground">

                    <div className="space-y-2"> 
                        {
                        cotization.obra ?
                            <div className="flex items-center gap-2">
                                <Construction className="h-5 w-5" />
                                <p className="text-sm">{cotization.obra}</p>
                            </div>
                            :
                            <p></p>
                        }
                        {
                        cotization.client.phone && 
                            <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                <p className="text-sm">{cotization.client.phone}</p>
                            </div>
                        }
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            <p className="text-sm">{cotization.client.email}</p>
                        </div>

                    </div>
                    <div>
                        <CommentsBox cotizationId={cotization.id} comments={cotization.comments} isEditable={true} />
                    </div>                    
                    <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm">Vendedor:</p>
                        <p className="text-sm font-bold">{sellerName}</p>
                        {
                            !ownerIsSeller && 
                            <>
                                <p className="text-sm">Ingresado:</p>
                                <p className="text-sm font-bold">{creatorName}</p>
                            </>
                        }
                    </div>
                </CardContent>

                <div className="flex items-center justify-between">
                    <div className="pb-4 ml-3">
                        <StatusSelector id={cotization.id} status={cotization.status} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/seller/cotizations/${cotization.id}/preview`} >
                            <Button variant="outline" className="gap-2 text-verde-abbate mb-3 w-36">
                                <Eye className="h-5 w-5" />Preview
                            </Button>
                        </Link>
                        <Link href={`/seller/cotizations/duplicate?id=${cotization.id}`} >
                            <Button variant="outline" className="gap-2 text-verde-abbate mb-3 px-2 w-36">
                                <CopyPlus className="h-5 w-5" />Duplicar
                            </Button>
                        </Link>
                        <Link href={`/seller/cotizations/version?id=${cotization.id}`} >
                            <Button variant="outline" className="gap-2 text-verde-abbate mb-3 px-2 w-36">
                                <PlusCircle className="h-5 w-5" />Crear versión
                            </Button>
                        </Link>
                        <VersionSelector cotization={cotization} />
                    </div>


                    <CardContent className="flex gap-4 justify-end text-muted-foreground">
                        <Link href={`/seller/cotizations/new?id=${cotization.id}`}>
                            <Pencil className="h-6 w-6 mt-0.5" />
                        </Link>
                    </CardContent>
                </div>
            </Card>

            <Card className="px-4">
                <CotizationNotesBox initialNotes={cotization.cotizationNotes} cotizationId={cotization.id} isEditable={isEditable} />
            </Card>

            <div className="flex items-center justify-between pt-10">
                <div className={cn("text-xl font-bold w-full flex items-center gap-4",works.length === 0 && "justify-center")}>
                    <p>
                        {works.length === 1 ? '1 trabajo:' : works.length === 0 ? 'Aún no hay trabajos en este presupuesto' : `${works.length} trabajos:`}
                    </p>
                    

                    {totalValue > 0 && <Badge variant="secondary" className="bg-green-100 border-green-400 text-black text-lg font-bold">{formatCurrency(totalValue)}</Badge>} 

                </div>
                {works.length > 0 && <WorkDialog cotizationId={cotization.id} />}
                
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
            {
                works.map(async (work) => {
                    const optionalColors= work.optionalColors
                    const optionalColorsTotalResults: OptionalColorsTotalResult[]= await calculateTotalWorkValue(work.id, optionalColors)
                    const colorPrice= cotization.client.type === "CLIENTE_FINAL" ? work.color.clienteFinalPrice : cotization.client.type === "ARQUITECTO_ESTUDIO" ? work.color.arquitectoStudioPrice : work.color.distribuidorPrice
                    return (
                        <Card key={work.id} className={cn("flex flex-col justify-between", work.id === selectedWorkId ? "border-green-500 border-2" : "")}>
                            <div>
                                <CardHeader>
                                    <div className="flex items-center justify-between"> 
                                        <Link href={`/seller/cotizations/${cotization.id}/${work.id}`} className="w-full space-y-2">
                                            <CardTitle className="flex items-center gap-1">
                                                {work.workType.name}
                                                {work.reference && <p className="text-sm text-muted-foreground">({work.reference})</p>}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">{work.material.name} {work.color.name} ({formatCurrency(colorPrice, 0)})</p>
                                        </Link>
                                        <WorkMenu workId={work.id} cotizationId={cotization.id} workName={work.workType.name} isEditable={isEditable} />
                                        {/* <OptionalColorsBoxDialog workId={work.id} />
                                        <WorkDialog id={work.id} cotizationId={work.cotizationId} />
                                        <DeleteWorkDialog id={work.id} description={`Seguro que quieres eliminar el trabajo ${work.workType.name}?`} /> */}
                                    </div>
                                    <Separator />
                                </CardHeader>
                                <CardContent className="flex gap-2 justify-between text-muted-foreground">
                                    <ItemsList work={work} optionalColorsTotalResults={optionalColorsTotalResults} clientType={cotization.client.type} colorPrice={colorPrice} />
                                </CardContent>
                            </div>
                            <CardContent>
                                <Separator className="mt-5"/>
                            </CardContent>
                            <div className="flex flex-col h-full">
                                <CardContent className="flex gap-2 justify-between text-muted-foreground w-full h-10">
                                    <p className="font-bold">Notas</p>
                                    {isEditable && <NoteDialog workId={work.id} />}
                                </CardContent>
                                <CardContent className="text-muted-foreground w-full">
                                {
                                    work.notes.length > 0 && isEditable &&
                                    <DataTable columns={columns} data={work.notes} subject="Note"/>
                                }
                                {
                                    work.notes.length > 0 && !isEditable &&
                                    <DataTable columns={notEditableColumns} data={work.notes} subject="Notas"/>
                                }
                                </CardContent>
                            </div>
            
                        </Card>
                    )
                })
            }
            </div>
        </div>
    )
}
