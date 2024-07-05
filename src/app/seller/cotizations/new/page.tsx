import { getClientsDAO } from "@/services/client-services";
import { CotizationForm } from "../cotization-forms";
import { getUsersDAO } from "@/services/user-services";
import { getCotizationDAO } from "@/services/cotization-services";
import { completeWithZeros } from "@/lib/utils";

type Props= {
  searchParams: {
    id?: string
  }
}
export default async function NewCotizationPage({ searchParams }: Props) {
  const cotizationId= searchParams.id
  let cotization= null
  if (cotizationId) {
    cotization= await getCotizationDAO(cotizationId)
  }

  const clients= await getClientsDAO()
  console.log("count", clients.length)
  
  const clientSelectors= clients.map((client) => ({
    id: client.id,
    name: client.name
  }))

  const users= await getUsersDAO()
  const sellerSelectors= users.map((user) => ({
    id: user.id,
    name: user.name
  }))

  return (
    <div className="w-full pt-10">
      <p className="text-center text-2xl font-bold mb-5">{cotization ? "Editar presupuesto" : "Nuevo presupuesto"} {cotization && "#" +completeWithZeros(cotization.number)}</p>
      <CotizationForm clientSelectors={clientSelectors} sellerSelectors={sellerSelectors} cotization={cotization} />
    </div>
  )
}
