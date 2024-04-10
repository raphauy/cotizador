import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: Props) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return redirect("/auth/login")
  }

  return (
    <div className="flex flex-col items-center flex-grow p-1 w-full max-w-[1350px]">
      {children}
    </div>
  )
}
