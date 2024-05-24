import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { completeWithZeros } from "@/lib/utils"
import { CotizationDAO } from "@/services/cotization-services"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Construction, Mail, Phone } from "lucide-react"

type Props= {
    cotization: CotizationDAO
}

export default function DatosPresupuesto({ cotization }: Props) {
  return (
    <Card>
        <CardHeader className="px-4 pt-2 pb-3">
            <CardTitle className="flex items-start justify-between w-full">
                <p className="font-bold text-xl">{"Presupuesto #" + completeWithZeros(cotization.number)}</p> 
                <p className="text-sm">{format(cotization.date, "d 'de' MMMM 'de' yyyy", { locale: es })}</p>
            </CardTitle>
            <CardDescription className="flex justify-between text-gray-800">
                <div>{cotization.client.name}</div>
                <div className="space-y-0"> 
                    {
                    cotization.obra &&
                        <div className="flex items-center gap-2 h-5">
                            <div className="mt-3">
                                <Construction className="h-4 w-4" />
                            </div>                            
                            <p className="text-xs">{cotization.obra}</p>
                        </div>
                    }
                    {
                    cotization.client.phone && 
                        <div className="flex items-center gap-2 h-5">
                            <div className="mt-3">
                                <Phone className="h-4 w-4" />
                            </div>                            
                            <p className="text-xs">{cotization.client.phone}</p>
                        </div>
                    }
                    {
                        cotization.client.email && 
                        <div className="flex items-center gap-2 h-5">
                            <div className="mt-3">
                                <Mail className="h-4 w-4" />
                            </div>                            
                            <p className="text-xs">{cotization.client.email}</p>
                        </div>
                    }

                </div>
            </CardDescription>
        </CardHeader>

    </Card>
)
}
