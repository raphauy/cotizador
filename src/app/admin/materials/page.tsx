import { getFullColorsDAO, getFullColorsDAOToFilter } from "@/services/color-services"
import { getMaterialsDAO } from "@/services/material-services"
import { columns as colorColumns } from "../colors/color-columns"
import { ColorDialog } from "../colors/color-dialogs"
import { DataTable as ColorTable } from "../colors/color-table"
import { columns as materialColumns } from "./material-columns"
import { MaterialDialog } from "./material-dialogs"
import { DataTable as MaterialTable } from "./material-table"

export default async function UsersPage() {
  
  const dataMaterials= await getMaterialsDAO()
  const dataColors= await getFullColorsDAOToFilter()

  const materialNames= dataMaterials.map((material) => material.name)

  // when grid is 2 cols, first col is 1/5 and second col is 4/5
  return (
    <div className="w-full grid gap-2 lg:flex ">      
          <div className="w-full lg:w-1/4">      

            <div className="flex justify-end mx-auto my-2">
              <MaterialDialog />
            </div>

            <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
              <MaterialTable columns={materialColumns} data={dataMaterials} subject="Materiales"/>      
            </div>
          </div>

          <div className="w-full lg:w-3/4">

            <div className="flex justify-end mx-auto my-2">
              <ColorDialog />
            </div>

            <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
              <ColorTable columns={colorColumns} data={dataColors} subject="Colores" materialNames={materialNames}/>
            </div>
          </div>

    </div>
  )
}
  
