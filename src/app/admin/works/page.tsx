import { getFullWorksDAO, getWorksDAO } from "@/services/work-services"
import { WorkDialog } from "./work-dialogs"
import { DataTable } from "./work-table"
import { columns } from "./work-columns"

export default async function UsersPage() {
  
  const data= await getFullWorksDAO()

  return (
    <div className="w-full">      

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Work"/>      
      </div>
    </div>
  )
}
  
