"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlignVerticalDistributeStart, ArrowDownWideNarrow, CircleDollarSign, Combine, LayoutDashboard, ListChecks, Megaphone, Pickaxe, Receipt, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data= [
    {
      href: `/admin`,
      icon: LayoutDashboard,
      text: "Dashboard",
      disabled: false
    },
    {
      href: `/admin/users`,
      icon: User,
      text: "Usuarios",
      disabled: false
    },
    {
        href: `/admin/worktypes`,
        icon: Pickaxe, 
        text: "Trabajos",
        disabled: false
    },
    {
        href: `/admin/materials`,
        icon: Combine, 
        text: "Materiales",
        disabled: false
    },
    {
        href: `/admin/terminations`,
        icon: ArrowDownWideNarrow,  
        text: "Terminaciones",
        disabled: false
    },
    {
        href: `/admin/manodeobras`,
        icon: AlignVerticalDistributeStart,   
        text: "Mano de obra",
        disabled: false
    },
    {
        href: `/admin/configs`,
        icon: Settings,   
        text: "Configuraciones",
        disabled: false
    },
]

export default function MenuAdmin() {
    const path= usePathname()
    if (!path.startsWith("/admin"))
        return <div>Path is not /admin</div>
    
    return (
        <nav className="w-full">
            <ul className="flex items-center">
                {data.map((item, index) => {
                    return (
                        <li key={index} className={cn("border-b-primary w-full lg:w-fit text-center", path === item.href && "border-b-2")}> 
                            <Link href={item.disabled ? "#" : item.href}>
                                <Button variant="ghost" disabled={item.disabled} className="px-3">
                                    <item.icon className="w-4 h-4 mr-1 mb-0.5" />
                                    <p className="hidden lg:block">{item.text}</p> 
                                </Button>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

