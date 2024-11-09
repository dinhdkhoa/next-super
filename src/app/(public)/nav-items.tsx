'use client'

import { useAppContext } from '@/components/app-provider'
import { Button } from '@/components/ui/button'
import { checkPathName } from '@/constants/route-middleware'
import { Role } from '@/constants/type'
import { socket } from '@/lib/socket'
import { handleApiError } from '@/lib/utils'
import useLogout, { useLogoutGuest } from '@/queries/useLogout'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

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
    {menuItemsFiltered.map((item, i) => {
      return (
        <Link href={item.href} key={i} className={className}>
          {item.title}
        </Link>
      )
    })}
    <NavLogoutButton role={role} setRole={setRole}/>
  </>
}

const NavLogoutButton = ({role, setRole} : {role: RoleType, setRole: (role?: RoleType) => void}) => {

  const logoutMutation = useLogout()
  const logoutGuestMutation = useLogoutGuest()
  const router = useRouter()

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;

    const onSuccess = () => {
      setRole();
      router.push('/');
      socket.disconnect();
    };

    const mutation = role === 'Guest' ? logoutGuestMutation : logoutMutation;

    try {
      await mutation.mutate(null as any, { onSuccess });
    } catch (error) {
      handleApiError(error);
    }
  }

  return <Button variant='link' className='hover:no-underline p-0 text-muted-foreground' onClick={handleLogout}>
    Đăng xuất
  </Button>
}