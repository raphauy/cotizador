import { getAppConfigDAOByName, getAppConfigsDAO } from "@/services/appconfig-services"
import { AppConfigDialog } from "./appconfig-dialogs"
import { DataTable } from "./appconfig-table"
import { columns } from "./appconfig-columns"

export default async function AppConfigPage() {
  
  const data= await getAppConfigsDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <AppConfigDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="AppConfig"/>      
      </div>
    </div>
  )
}
  
