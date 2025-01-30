import { getWorkTypesDAO } from "@/services/worktype-services"
import { WorkTypeDialog } from "./worktype-dialogs"
import { DataTable } from "./worktype-table"
import { columns } from "./worktype-columns"

export default async function UsersPage() {
  
  const data= await getWorkTypesDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <WorkTypeDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Tipos"/>      
      </div>
    </div>
  )
}
  
