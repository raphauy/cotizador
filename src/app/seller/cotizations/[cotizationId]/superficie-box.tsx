import { Separator } from "@/components/ui/separator"

type Props = {
    superficie: number
    total: number
    sufix: string
}
export default function LineBox({ superficie, total, sufix }: Props) {
  return (
    <div className="text-right flex items-center justify-end">
        <p className="">{superficie.toFixed(2)} {sufix} </p>
        <Separator orientation="vertical" className="h-4 mx-2" />
        <p className="w-20">{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(total)}</p>
    </div>
  )
}
