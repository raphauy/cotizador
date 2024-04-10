import { getCotizationsDAO } from "@/services/cotization-services"
import { DataTable } from "./cotization-table"
import { columns } from "./cotization-columns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function UsersPage() {
  
  const data= await getCotizationsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <Link href="/seller/cotizations/new">
          <Button><PlusCircle size={20} className="mr-2"/>Nuevo presupuesto</Button>
        </Link>
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Cotization"/>      
      </div>
    </div>
  )
}
  
