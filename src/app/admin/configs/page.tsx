import { getConfigsDAO } from "@/services/config-services"
import { ConfigDialog } from "./config-dialogs"
import { DataTable } from "./config-table"
import { columns } from "./config-columns"
import { getCurrentUser } from "@/lib/utils"
import { AppConfigDefaultManoDeObrasBox } from "../appconfigs/appconfig-dialogs"
import { getAppConfigDAOByName } from "@/services/appconfig-services"

export default async function ConfigsPage() {
  let data = await getConfigsDAO()

  const user= await getCurrentUser()
  const isSuperAdmin= user?.email === "rapha.uy@rapha.uy"
  if (!isSuperAdmin) {
    data= data.filter((item) => item.name !== "PROCESS_BLOCKED")
  }

  const defaultManoDeObras= await getAppConfigDAOByName("Manos de obra por defecto")

  return (
    <div className="w-full">
      <div className="flex justify-end mx-auto my-2 ">
        {
          defaultManoDeObras?.id ? <AppConfigDefaultManoDeObrasBox id={defaultManoDeObras.id} /> : <div>No se encontró la appConfig con el nombre Manos de obra por defecto</div>
        }
      </div>

      <div className="flex items-center justify-end mx-auto my-2 font-bold mt-10" >
        {
          isSuperAdmin && <ConfigDialog />
        }
      </div>      

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white bg-white dark:bg-gray-800">
        <DataTable columns={columns} data={data} subject="Config" />
      </div>

    </div>
  );
}
