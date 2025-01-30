import { TooltipProvider } from "@/components/ui/tooltip";
import { getCurrentUser } from "@/lib/utils";
import { getCotizationsDAOForPanel } from "@/services/cotization-services";
import { redirect } from "next/navigation";
import { columns } from "./cotizations/cotization-columns-panel";
import { DataTable } from "./cotizations/cotization-table-panel";

interface Props {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/auth/login")
  }
  const data= await getCotizationsDAOForPanel()

  const clientNames= Array.from(new Set(data.map((cotization) => cotization.clientName)))
  const sellerNames= Array.from(new Set(data.map((cotization) => cotization.sellerName)))

  return (
    <div className="flex w-full gap-2 mt-3 h-full">
      <DataTable columns={columns} data={data} subject="Presupuestos" sellerNames={sellerNames} clientNames={clientNames}/>
      <TooltipProvider delayDuration={0}>
        {children}
      </TooltipProvider>
    </div>
  )
}
