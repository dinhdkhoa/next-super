'use client'

import { useAppContext } from '@/components/app-provider'
import { checkPathName, isEmployeePath } from '@/constants/route-middleware'
import { Role } from '@/constants/type'
import StorageService from '@/lib/storage'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/',
  },
  {
    title: 'Đơn hàng',
    href: 'guest/orders',
    role: Role.Guest
  },
  // {
  //   title: 'Đăng nhập',
  //   href: '/login',z
  //   role: Role.
  // },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: Role.Employee
  },
  {
    title: 'Đăng xuất',
    href: '/guest/logout',
    role: Role.Guest
  },

]

export default function NavItems({ className }: { className?: string }) {
  const {isAuth : isSignedIn, role} = useAppContext()
  const pathname = usePathname()

  const {isGuestPath, isEmployeePath} = checkPathName(pathname)

  if (!isSignedIn || !role) return (<Link href={menuItems[0].href}  className={className}>
          {menuItems[0].title}
        </Link>)

  const menuItemsFiltered = menuItems.filter(item => {
    switch(role){
      case 'Guest':
        return isGuestPath && (item.role == 'Guest' || !item.role)
      case 'Employee':
        return isEmployeePath && (item.role == 'Employee' || !item.role)
      default: 
        return item.role !== 'Guest'
    }
  })

  return menuItemsFiltered.map((item) => {
      return (
        <Link href={item.href} key={item.href} className={className}>
          {item.title}
        </Link>
      )
  })
}

