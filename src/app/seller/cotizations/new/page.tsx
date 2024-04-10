import { getClientsDAO } from "@/services/client-services";
import { CotizationForm } from "../cotization-forms";

export default async function NewCotizationPage() {

  const clients= await getClientsDAO()
  const selectors= clients.map((client) => ({
    id: client.id,
    name: client.name
  }))

  return (
    <div className="w-full pt-10">
      <p className="text-center text-2xl font-bold mb-5">Nuevo presupuesto</p>
      <CotizationForm data={selectors} />
    </div>
  )
}
