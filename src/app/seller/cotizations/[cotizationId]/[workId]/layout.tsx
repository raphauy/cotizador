
import { columns } from "@/app/seller/notes/note-columns"
import { NoteDialog } from "@/app/seller/notes/note-dialogs"
import { DataTable } from "@/app/seller/notes/note-table"
import { getNotesDAOByWorkId } from "@/services/note-services";

interface Props {
  children: React.ReactNode;
  params: {
    workId: string;
  };
}

export default async function AdminLayout({ children, params }: Props) {
  const workId= params.workId
  console.log("workId: ", workId)

  const data= await getNotesDAOByWorkId(workId)  

  return (
    <div className="flex flex-col items-center flex-grow p-1 w-full max-w-[1350px]">
      {children}
      <div className="flex w-full flex-col h-full mt-10 bg-white dark:bg-gray-800 border p-4 rounded-lg">
          <div className="flex gap-2 justify-between text-muted-foreground w-full h-10">
              <p className="font-bold">Notas</p>
              <NoteDialog workId={workId} />
          </div>
          <div className="text-muted-foreground w-full">
          {
              data.length > 0 &&
              <DataTable columns={columns} data={data} subject="Note"/>
          }
          </div>
      </div>

    </div>
  )
}
