import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function SellerPage() {

  return (
    <div className="flex flex-col items-center justify-center w-full h-full mt-10">
      <Link href="/seller/cotizations/new">
        <Button><PlusCircle size={20} className="mr-2"/>Nuevo presupuesto</Button> 
      </Link>

    </div>
  )
}