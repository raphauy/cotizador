import { getTerminacionsDAO } from "@/services/terminacion-services"
import { TerminacionDialog } from "./terminacion-dialogs"
import { DataTable } from "./terminacion-table"
import { columns } from "./terminacion-columns"

export default async function TerminacionPage() {
  
  const data= await getTerminacionsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <TerminacionDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Terminacion"/>      
      </div>
    </div>
  )
}
  
