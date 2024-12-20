'use client'
import authAPI from '@/apiRequests/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useAuthStore from '@/hooks/zustand/useAuthStore'
import { socket } from '@/lib/socket'
import { handleApiError } from '@/lib/utils'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import OauthGoogleBtn from './oauth-google-btn'
import { useTranslations } from 'next-intl'


export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const refreshToken = params.get("rt")
  const returnUrl = params.get("returnUrl")
  const setRole = useAuthStore.use.setRole()
  const t = useTranslations('LoginPage')

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
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
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
                      <Label htmlFor="email">{t('email-field-title')}</Label>
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
                        <Label htmlFor="password">{t('password-field-title')}</Label>
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
              {t('login-button')}
              </Button>
              <OauthGoogleBtn />
            </div>
          </form>
        </fieldset>
        </Form>
      </CardContent>
    </Card>
  )
}
