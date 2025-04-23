import { getManoDeObrasDAO } from "@/services/manodeobra-services"
import { ManoDeObraDialog } from "./manodeobra-dialogs"
import { DataTable } from "./manodeobra-table"
import { columns } from "./manodeobra-columns"

export default async function ManoDeObraPage() {
  
  const data = await getManoDeObrasDAO(true) // Incluye elementos archivados

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <ManoDeObraDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="ManoDeObras"/>      
      </div>
    </div>
  )
}
  
