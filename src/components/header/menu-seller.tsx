"use client"

import { useVendedorRoles } from "@/app/admin/users/use-roles"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BriefcaseBusiness, FileBarChart, LayoutDashboard, Newspaper, Server, Settings } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"


export default function MenuSeller() {
    
    const user= useSession().data?.user
    const userRole= user?.role
    const alowedRoles= useVendedorRoles()

    const path= usePathname()
    const params= useParams()

    const data= [
        {
            href: `/seller`,
            icon: LayoutDashboard,
            text: "Dashboard",
            roles: alowedRoles
        },
        {
            href: `/seller/clients`,
            icon: BriefcaseBusiness,
            text: "Clientes",
            roles: alowedRoles
        },
        {
            href: `/seller/cotizations?last=30D`,
            icon: FileBarChart, 
            text: "Presupuestos",
            roles: alowedRoles
        },
    ]

    if (!path.startsWith("/seller"))
        return <div></div>
        
    return (
        <nav className="w-full">
            <ul className="flex items-center">
                {data.map((item, index) => {
                    if (item.roles && userRole && !item.roles.includes(userRole))
                        return null
                    return (
                        <li key={index} className={cn("border-b-primary w-full sm:w-fit text-center", path === item.href && "border-b-2")}>  
                            <Link href={item.href}>
                            <Button variant="ghost" className="px-3">
                                    <item.icon className="w-4 h-4 mr-1 mb-0.5" />
                                    <p className="hidden sm:block">{item.text}</p> 
                                </Button>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

