import { getCotizationDAO } from "@/services/cotization-services"

type Props= {
  params: {
    cotizationId: string
  }
}
export default async function CotizationPage({ params }: Props) {
    const cotization= await getCotizationDAO(params.cotizationId)
  return (
    <div className="w-full">
      <p className="text-center text-2xl font-bold mb-5">Cotization {cotization.id}</p>
      <p className="text-center text-2xl font-bold mb-5">{cotization.obra}</p>
      <p className="text-center text-2xl font-bold mb-5">{cotization.type}</p>
      <p className="text-center text-2xl font-bold mb-5">{cotization.status}</p>
    </div>
  )
}
