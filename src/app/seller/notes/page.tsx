import { getNotesDAO } from "@/services/note-services"
import { NoteDialog } from "./note-dialogs"
import { DataTable } from "./note-table"
import { columns } from "./note-columns"

export default async function UsersPage() {
  
  const data= await getNotesDAO()

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <NoteDialog />
      </div>

      <div className="container bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Note"/>      
      </div>
    </div>
  )
}
  
