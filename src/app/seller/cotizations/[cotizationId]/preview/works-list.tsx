import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { WorkDAO } from "@/services/work-services"
import { ItemsList } from "./items-list"
import { FilePenLine } from "lucide-react"

type Props = {
    works: WorkDAO[]
}
export default function WorksList({works}: Props) {
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
        </div>
    )
}
