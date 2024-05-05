import { getColocacionsDAO } from "@/services/colocacion-services"
import { ColocacionDialog } from "./colocacion-dialogs"
import { DataTable } from "./colocacion-table"
import { columns } from "./colocacion-columns"

export default async function ColocacionPage() {
  
  const data= await getColocacionsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <ColocacionDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Colocacion"/>      
      </div>
    </div>
  )
}
  
