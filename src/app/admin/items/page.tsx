import { getFullItemsDAO } from "@/services/item-services"
import { columns } from "./item-columns"
import { DataTable } from "./item-table"

export default async function UsersPage() {
  
  const data= await getFullItemsDAO()

  return (
    <div className="w-full">      

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        No implementado
      </div>
    </div>
  )
}
  
