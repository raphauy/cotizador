import { getCurrentUser } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Home() {

  const user= await getCurrentUser()

  if (!user)
    redirect("/auth/login")

  const role= user && user.role
  if (role === "ADMIN")
    redirect("/admin")


  if (role === "VENDEDOR")
    redirect(`/seller`)

  return (
    <div>Inicio</div>
  );
}
