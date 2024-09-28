'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import authAPI from '@/apiRequests/auth'
import { handleApiError } from '@/lib/utils'
import accountAPI from '@/apiRequests/account'
import useGetAccount from '@/queries/useGetAccount'
import useLogout from '@/queries/useLogout'
import { useAppContext } from '@/components/app-provider'


export default function DropdownAvatar() {
  const router = useRouter()
  const {data} = useGetAccount()
  const {setRole} = useAppContext()

  const account = data?.payload.data

  const logoutMutation = useLogout()

  const handleLogout = async () => {
    if(logoutMutation.isPending) return 

    try {
      await logoutMutation.mutate(null as any, {
        onSuccess(data, variables, context) {
           router.push("/login")
           setRole()
        },
      })
    } catch (error) {
      handleApiError(error)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage src={account?.avatar ?? undefined} alt={account?.name} />
            <AvatarFallback>
              {account?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/manage/setting"} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
