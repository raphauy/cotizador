import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/utils"
import { getFullCotizationsDAO, getFullCotizationsDAOByUser } from "@/services/cotization-services"
import { UserRole } from "@prisma/client"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { columns } from "./cotization-columns"
import { DataTable } from "./cotization-table"

export default async function CotizationsPage() {
  const user= await getCurrentUser()
  if (!user)
    return <div>Usuario no autenticado</div>

  const data= await getFullCotizationsDAO()

  const clientNames= Array.from(new Set(data.map((cotization) => cotization.client.name)))
  const sellerNames= Array.from(new Set(data.map((cotization) => cotization.sellerName)))

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <Link href="/seller/cotizations/new">
          <Button><PlusCircle size={20} className="mr-2"/>Nuevo presupuesto</Button>
        </Link>
      </div>

      <div className="container bg-white  dark:bg-black p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Cotization" sellerNames={sellerNames} clientNames={clientNames}/>
      </div>
    </div>
  )
}
  
