import { getFullColorsDAO } from "@/services/color-services"
import { columns } from "./color-columns"
import { ColorDialog } from "./color-dialogs"
import { DataTable } from "./color-table"

export default async function ColorsPage() {
  
  const data= await getFullColorsDAO(true)
  const materialNames= Array.from(new Set(data.map((color) => color.material.name)))

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <ColorDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Colores" materialNames={materialNames}/>
      </div>
    </div>
  )
}
  
