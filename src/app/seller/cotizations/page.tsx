import { Button } from "@/components/ui/button"
import { getCurrentUser, getDatesFromSearchParams } from "@/lib/utils"
import { getFullCotizationsDAO, getFullCotizationsDAOByUser } from "@/services/cotization-services"
import { UserRole } from "@prisma/client"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { columns } from "./cotization-columns"
import { DataTable } from "./cotization-table"
import DatesFilter from "./dates-filter"

type Props = {
  searchParams: {
    from: string
    to: string
    last: string
  }
}

export default async function CotizationsPage({ searchParams }: Props) {
  const { from, to }= getDatesFromSearchParams(searchParams)
  console.log("from: ", from)
  console.log("to: ", to)
  const baseUrl= `/seller/cotizations`

  const user= await getCurrentUser()
  if (!user)
    return <div>Usuario no autenticado</div>

  const data= await getFullCotizationsDAO(from, to)

  const clientNames= Array.from(new Set(data.map((cotization) => cotization.client.name)))
  const sellerNames= Array.from(new Set(data.map((cotization) => cotization.sellerName)))

  return (
    <div className="w-full">      

      <div className="flex justify-between mx-auto my-2">
        <DatesFilter baseUrl={baseUrl} />

        <Link href="/seller/cotizations/new">
          <Button><PlusCircle size={20} className="mr-2"/>Nuevo presupuesto</Button>
        </Link>
      </div>

      <div className="container bg-white  dark:bg-black p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Presupuestos" sellerNames={sellerNames} clientNames={clientNames}/>
      </div>
    </div>
  )
}
  
