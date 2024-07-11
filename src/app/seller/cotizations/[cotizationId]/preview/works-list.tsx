import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { WorkDAO } from "@/services/work-services"
import { ItemsList } from "./items-list"

type Props = {
    works: WorkDAO[]
    showTotalInPreview: boolean
    showTaxesInPreview: boolean
}
export default function WorksList({works, showTotalInPreview, showTaxesInPreview}: Props) {
    // totalValue= suma de todos los valores de los items
    const totalValue= works.reduce((acc, work) => acc + work.items
    //.filter(item => item.type !== "COLOCACION")
    .reduce((acc, item) => acc + (((item.valor || 0)+(item.valorAreaTerminacion || 0))*(item.quantity)), 0), 0)
    
    const ivaInc= totalValue * 1.22

    return (
        <div className="work-section space-y-1">
        {
            works.map( (work) => {
                return (
                    <Card key={work.id} className="flex flex-col justify-between card pb-4">
                        <div>
                            {/* <CardHeader className="pt-2 pb-0"> */}
                            <CardHeader className="pt-2 pb-3">
                                <CardTitle className="flex items-center justify-between mb-1">
                                    <p className="text-xl">{work.workType.name}</p>
                                    {work.reference && <p className="text-sm">{work.reference}</p>}
                                </CardTitle>
                                {/* <Separator className="-mb-3"/> */}
                            </CardHeader>
                            <CardContent className="pb-0">
                                <ItemsList work={work}/>
                            </CardContent>
                        </div>
        
                    </Card>
                )
            })
        }

        {
            showTotalInPreview &&
            <div className="flex flex-col items-end text-black card pb-1 pr-5 text-lg font-bold">
                {totalValue > 0 && <div className="border-gray-400">Total: {formatCurrency(totalValue, 0)}</div>} 
                {showTaxesInPreview && <div>Total IVA inc.: {formatCurrency(ivaInc, 0)}</div>} 
            </div>
        }            

        </div>
    )
}
