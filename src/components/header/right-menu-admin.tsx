"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ListChecks, Megaphone, Receipt, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data= [
    {
      href: `/admin`,
      text: "Admin"
    },
    {
        href: `/seller`,
        text: "Vendedor"
      },
    ]

export default function RightMenuAdmin() {
    const path= usePathname()
    const user= useSession().data?.user
    if (user?.role !== "ADMIN")
        return null
    
    return (
        <nav>
            <ul className="flex items-center bg-white border mb-1 rounded-md dark:bg-black">
                {data.map((item, index) => {
                    return (
                        <li key={index} className={cn("m-1 rounded-md", path.startsWith(item.href) && "bg-gray-100 text-gray-900 border")}> 
                            <Link href={item.href}>
                                <Button variant="ghost" className="h-8 w-20">
                                    {item.text}
                                </Button>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

