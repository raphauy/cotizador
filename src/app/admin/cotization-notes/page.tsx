import { getFullCotizationNotesDAO } from "@/services/cotizationnote-services"
import { CotizationNoteDialog } from "./cotizationnote-dialogs"
import { DataTable } from "./cotizationnote-table"
import { columns } from "./cotizationnote-columns"
import NotesBox from "./notes-box"

export default async function CotizationNotePage() {
  
  const data= await getFullCotizationNotesDAO(null)
  console.log(data)  

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <CotizationNoteDialog />
      </div>

      <NotesBox initialNotes={data} isEditable={true} />
    </div>
  )
}
  
