'use client'
import AppProvider from "@/components/app-provider"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { handleApiError } from '@/lib/utils'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useGuestLoginMutation } from './queries/useGuestAuthQueries'
import { useEffect } from 'react'
import { socket } from '@/lib/socket'
import useAuthStore from "@/hooks/zustand/useAuthStore"

export default function GuestLoginForm() {
  const setRole = useAuthStore.use.setRole()
  const router = useRouter()
  const queryString = useSearchParams()
  const queryParams = useParams()

  const tableToken = queryString.get('token')
  const tableNumber = queryParams.number

  useEffect(() => {
    if(!tableToken || tableToken === '') router.push('/')
  }, [tableToken, router])

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: tableToken|| '',
      tableNumber: Number(tableNumber) || 1
    }
  })
  const guestLoginMutate = useGuestLoginMutation()

  const handleSubmit = () => {
    if(guestLoginMutate.isPending) return 
    guestLoginMutate.mutateAsync(form.getValues(),{
      onSuccess: (data) => {
        toast.success(data.payload.message)
        setRole(data.payload.data.guest.role)
        router.push('/guest/menu')
        socket.connect()
      },
      onError(error) {
        handleApiError(error, form.setError)
      },
    })
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-2 max-w-[600px] flex-shrink-0 w-full' noValidate onSubmit={form.handleSubmit(handleSubmit)}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>Tên khách hàng</Label>
                      <Input id='name' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
