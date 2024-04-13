import { Separator } from "@/components/ui/separator"

type Props = {
    superficie: number
    total: number
}
export default function SuperficieBox({ superficie, total }: Props) {
  return (
    <div className="text-right flex items-center justify-end">
        <p className="">{superficie.toFixed(2)} m²</p>
        <Separator orientation="vertical" className="h-4 mx-2" />
        <p className="w-20">{Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(total)}</p>
    </div>
  )
}
