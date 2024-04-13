import { getCotizationsDAO, getFullCotizationsDAO, getFullCotizationsDAOByUser } from "@/services/cotization-services"
import { DataTable } from "./cotization-table"
import { columns } from "./cotization-columns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getCurrentRole, getCurrentUser } from "@/lib/utils"
import { UserRole } from "@prisma/client"

export default async function UsersPage() {
  
  const user= await getCurrentUser()
  if (!user)
    return <div>Usuario no autenticado</div>

  let data
  if (user.role === UserRole.ADMIN) {
    data=await getFullCotizationsDAO()
  } else {
    data=await getFullCotizationsDAOByUser(user.id)
  }

  const clientNames= Array.from(new Set(data.map((cotization) => cotization.clientName)))
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
  
