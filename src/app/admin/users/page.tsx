import { getFullUsersDAO } from "@/services/user-services"
import { columns } from "./user-columns"
import { UserDialog } from "./user-dialogs"
import { DataTable } from "./user-table"

export default async function UsersPage() {
  
  const data= await getFullUsersDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <UserDialog />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white  bg-white dark:bg-black">
        <DataTable columns={columns} data={data} subject="Usuarios"/>      
      </div>
    </div>
  )
}
  
