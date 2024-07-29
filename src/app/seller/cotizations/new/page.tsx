import { completeWithZeros } from "@/lib/utils";
import { getClientsDAO } from "@/services/client-services";
import { getCotizationDAO } from "@/services/cotization-services";
import { getUsersDAO } from "@/services/user-services";
import { CotizationStatus } from "@prisma/client";
import { ChevronLeft, TriangleAlert } from "lucide-react";
import { CotizationForm } from "../cotization-forms";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  const status= cotization?.status
  if (status !== CotizationStatus.BORRADOR) 
    return (
        <div className="mx-auto mt-10">
            <Link href={`/seller/cotizations/${cotization?.id}`}>
              <Button variant="link" className="px-0">
                  <ChevronLeft className="w-5 h-5" /> Volver
              </Button>
            </Link>
            <div className="p-4 bg-white border rounded-xl flex items-center gap-2 w-fit">
                <TriangleAlert className="w-5 h-5 text-yellow-400" />
                <p className="text-lg">Este presupuesto ya no se puede editar</p>
            </div>
        </div>
    )

  return (
    <div className="w-full pt-10">
      <p className="text-center text-2xl font-bold mb-5">{cotization ? "Editar presupuesto" : "Nuevo presupuesto"} {cotization && "#" +completeWithZeros(cotization.number)}</p>
      <CotizationForm clientSelectors={clientSelectors} sellerSelectors={sellerSelectors} cotization={cotization} />
    </div>
  )
}
