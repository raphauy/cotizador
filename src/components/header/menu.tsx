"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import MenuAdmin from "./menu-admin"
import MenuSeller from "./menu-seller"
import RightMenuAdmin from "./right-menu-admin"

export default function Menu() {

    const path= usePathname()

    const user= useSession().data?.user

    if (!user) return null

    let menu
    if (path.startsWith("/admin")) {
        menu= <MenuAdmin />
    } else {
        menu= <MenuSeller />
    }



    return (
        <div className="flex justify-between">
            {menu}
            {user && 
                user.role === "ADMIN" ?
                <RightMenuAdmin />
                :
                <p className="mr-4 whitespace-nowrap">{user?.name} - {user?.role}</p>
            }
        </div>
    )
}
