"use client"

import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency } from "@/lib/utils"
import { CotizationDAO } from "@/services/cotization-services"
import Cabezal from "./cabezal"
import DatosPresupuesto from "./datos-presupuesto"
import WorksList from "./works-list"

type Props= {
    cotization: CotizationDAO
}
export default function PrintableCotization({ cotization }: Props) {

    const works= cotization.works

    return (
        <div className="space-y-2 w-full p-10">

            <div className="cabezal">
                <Cabezal />
            </div>

            <div className="datos-presupuesto">
                <DatosPresupuesto cotization={cotization} />
            </div>

            <WorksList works={works} showTotalInPreview={cotization.showTotalInPreview} showTaxesInPreview={cotization.showTaxesInPreview} />

            <div className="notas text-gray-800 pt-2">
            {
                cotization.cotizationNotes.length > 0 &&
                <div className="flex flex-col">
                    <p className="font-bold mb-1">Notas:</p>
                {
                    cotization.cotizationNotes.map((note) => {
                        return (
                            <div className="flex items-center gap-2" key={note.id}>
                                <p className="text-sm pb-1 whitespace-pre-line">{note.text}</p>
                            </div>
                        )
                    })
                }
                    <p className="mt-4 text-xl pb-3">Marmolería Aníbal Abbate</p>
                </div>

            }
            </div>

            {/* <div className={cn("text-xl font-bold w-full flex items-center gap-4",works.length === 0 && "justify-center")}>
                <p>
                    {works.length === 1 ? '1 trabajo:' : works.length === 0 ? 'Aún no hay trabajos en este presupuesto' : `${works.length} trabajos:`}
                </p>


                <Badge variant="secondary" className="bg-green-100 border-green-400 text-black text-lg font-bold">{totalValueStr}</Badge>

            </div> */}

        </div>
    )
}
