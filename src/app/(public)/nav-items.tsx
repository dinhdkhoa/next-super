'use client'

import { useAppContext } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { checkPathName, isEmployeePath } from '@/constants/route-middleware'
import { Role } from '@/constants/type'
import StorageService from '@/lib/storage'
import { handleApiError } from '@/lib/utils'
import useLogout, { useLogoutGuest } from '@/queries/useLogout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/',
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
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

]

export default function NavItems({ className }: { className?: string }) {

  const { isAuth: isSignedIn, role, setRole } = useAppContext()
  const pathname = usePathname()
  const logoutMutation = useLogout()
  const logoutGuestMutation = useLogoutGuest()
  const router = useRouter()

  const handleLogout = async () => {
    if(logoutMutation.isPending) return 

    try {
      if(role == 'Guest') {
        await logoutGuestMutation.mutate(null as any, {
          onSuccess() {
             setRole()
             router.push('/')
          },
        })
      } else {
        await logoutMutation.mutate(null as any, {
          onSuccess() {
             setRole()
             router.push('/')
          },
        })
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  const { isGuestPath, isEmployeePath } = checkPathName(pathname)

  if (!isSignedIn || !role) return (<Link href={menuItems[0].href} className={className}>
    {menuItems[0].title}
  </Link>)

  const menuItemsFiltered = menuItems.filter(item => {
    switch (role) {
      case 'Guest':
        return isGuestPath && (item.role == 'Guest' || !item.role)
      case 'Employee':
        return isEmployeePath && (item.role == 'Employee' || !item.role)
      default:
        return item.role !== 'Guest'
    }
  })

  return <>
    {menuItemsFiltered.map((item) => {
      return (
        <Link href={item.href} key={item.href} className={className}>
          {item.title}
        </Link>
      )
    })}
    <Button variant='link' className='hover:no-underline p-0 text-muted-foreground' onClick={handleLogout}>
      Đăng xuất
    </Button>
  </>
}

