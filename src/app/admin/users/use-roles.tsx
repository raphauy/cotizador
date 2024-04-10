"use client"

import { UserRole } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useParams, usePathname } from "next/navigation"

export function useRoles() {
  const params= useParams()
  const path= usePathname()
  
  const currentRole= useSession().data?.user.role

  if (path === "/admin/users" || currentRole === "ADMIN") {
    return Object.values(UserRole)
  }

  return []
}

export function useAdminRoles(): UserRole[] {
  return [UserRole.ADMIN]
}

export function useVendedorRoles(): UserRole[] {
  return [UserRole.ADMIN, UserRole.VENDEDOR] 
}