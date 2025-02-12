import { getFullCotizationDAO } from "@/services/cotization-services"
import PrintButton2 from "./print-button"

type Props= {
  params: {
    cotizationId: string
  }
  searchParams: {
    workId: string
  }
}
export default async function CotizationPage({ params, searchParams }: Props) {
  const cotization= await getFullCotizationDAO(params.cotizationId)  
  if (!cotization)
    return <div>Presupuesto no encontrado</div>

  return (
    <div className="w-full">
        {/* <PrintableCotization cotization={cotization} /> */}
        <PrintButton2 cotization={cotization} />
    </div>
  )
}
