import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Props = {
    superficie: number
    total: number
    sufix: string
    hidePrice?: boolean
    bold?: boolean
}
export default function LineBox({ superficie, total, sufix, hidePrice, bold }: Props) {
  return (
    <div className={cn("text-right flex items-center justify-end", bold && "font-bold")}>
        {superficie > 0 && <p className="">{superficie.toFixed(2)} {sufix} </p>}
        
        {
          !hidePrice && 
          <>
            <Separator orientation="vertical" className="h-4 mx-2" />
            <div className="w-20">{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(total)}</div>
          </>
        }
    </div>
  )
}
