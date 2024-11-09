'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import authAPI from '@/apiRequests/auth'
import { toast } from "sonner"
import { handleApiError } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppContext } from '@/components/app-provider'
import { useEffect } from 'react'
import { socket } from '@/lib/socket'


export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const refreshToken = params.get("rt")
  const returnUrl = params.get("returnUrl")
  const {setRole} = useAppContext()

  useEffect(() => {
    if(refreshToken == 'expired'){
      setRole()
    }
  }, [refreshToken, setRole])

  const loginMutation = useMutation(
    {
      mutationFn: authAPI.loginClient,
      onSuccess: (data) => {
        toast.success(data.payload.message)
        setRole(data.payload.data.account.role)
        router.push(returnUrl ??'/manage/dashboard')
        socket.connect()
      },
      onError(error, variables, context) {
        handleApiError(error, form.setError)
      },
    }
  )
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (data: LoginBodyType) => {
    if(loginMutation.isPending) return 
    loginMutation.mutate(data)
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
        <fieldset className='group' disabled={loginMutation.isPending || loginMutation.isSuccess}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                        autoFocus
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </fieldset>
        </Form>
      </CardContent>
    </Card>
  )
}
