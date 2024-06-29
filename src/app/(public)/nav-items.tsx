'use client'

import StorageService from '@/lib/storage'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu'
  },
  {
    title: 'Đơn hàng',
    href: '/orders'
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true
  }
]

export default function NavItems({ className }: { className?: string }) {
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    setIsSignedIn(Boolean(StorageService.getAccessToken))
  }, [])

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isSignedIn) ||
      (item.authRequired === true && !isSignedIn)
    ){
      return null
    }
      return (
        <Link href={item.href} key={item.href} className={className}>
          {item.title}
        </Link>
      )
  })
}
