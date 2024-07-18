import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserRole } from "@prisma/client";
import { getFullCotizationsDAO, getFullCotizationsDAOByUser } from "@/services/cotization-services";
import { DataTable } from "./cotizations/cotization-table-panel";
import { columns } from "./cotizations/cotization-columns-panel";

interface Props {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/auth/login")
  }
  const data= await getFullCotizationsDAO()
  // if (user.role === UserRole.ADMIN) {
  //   data=await getFullCotizationsDAO()
  // } else {
  //   data=await getFullCotizationsDAOByUser(user.id)
  // }

  const clientNames= Array.from(new Set(data.map((cotization) => cotization.client.name)))
  const sellerNames= Array.from(new Set(data.map((cotization) => cotization.client.name)))

  return (
    <div className="flex w-full gap-2 mt-3 h-full">
      <DataTable columns={columns} data={data} subject="Cotization" sellerNames={sellerNames} clientNames={clientNames}/>
      <TooltipProvider delayDuration={0}>
        {children}
      </TooltipProvider>
    </div>
  )
}
