"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlignVerticalDistributeStart, ArrowDownWideNarrow, CircleDollarSign, Combine, LayoutDashboard, ListChecks, Megaphone, Pickaxe, Receipt, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data= [
    {
      href: `/admin`,
      icon: LayoutDashboard,
      text: "Dashboard"
    },
    {
      href: `/admin/users`,
      icon: User,
      text: "Usuarios"
    },
    {
        href: `/admin/works`,
        icon: Pickaxe, 
        text: "Trabajos"
    },
    {
        href: `/admin/materials`,
        icon: Combine, 
        text: "Materiales"
    },
    {
        href: `/admin/terminations`,
        icon: ArrowDownWideNarrow,  
        text: "Terminaciones"
    },
    {
        href: `/admin/holes`,
        icon: AlignVerticalDistributeStart,   
        text: "Huecos"
    },
    {
        href: `/admin/prices`,
        icon: CircleDollarSign,    
        text: "Precios"
    },
]

export default function MenuAdmin() {
    const path= usePathname()
    if (!path.startsWith("/admin"))
        return <div>Path is not /admin</div>
    
    return (
        <nav>
            <ul className="flex items-center">
                {data.map((item, index) => {
                    return (
                        <li key={index} className={cn("border-b-primary", path === item.href && "border-b-2")}>
                            <Link href={item.href}>
                                <Button variant="ghost">
                                    <item.icon className="w-4 h-4 mr-1 mb-0.5" />
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

