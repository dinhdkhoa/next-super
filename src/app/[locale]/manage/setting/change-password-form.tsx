'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useForm } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useMutation } from '@tanstack/react-query'
import accountAPI from '@/apiRequests/account'
import { handleApiError } from '@/lib/utils'
import { toast } from 'sonner'
import { FormEvent } from 'react'
import StorageService from '@/lib/storage'

export default function ChangePasswordForm() {
  const changePass = useMutation(
    {mutationFn: accountAPI.changePWv2}
  )
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = form.handleSubmit(async (data) => {
    if (changePass.isPending) return
    try {
      const changePWRes = await changePass.mutateAsync(data)
      const {payload: {data : {accessToken, refreshToken}}} = changePWRes
      StorageService.setAccessToken(accessToken)
      StorageService.setRefreshToken(refreshToken)
      toast.success(changePWRes.payload.message)
    
      form.reset()
    } catch (error) {
      handleApiError(error, form.setError)
    }
  })

  const handleDelete = () => {
    const promise = () =>
      new Promise((resolve, reject) =>
        setTimeout(() => reject({ name: "Sonner" }), 2000)
      )

    toast.promise(promise, {
      loading: "Deleting...",
      position: "top-center",
      success: (data) => {
        return `Alo toast has been added`
      },
      error: "Error"
    })
  }

  const confirm = () => {
    toast(" Delete Data", {
      description: "Are you sure you want to delete",
      action: {
        label: "Delete",
        onClick: () => handleDelete()
      },
      position: "top-center"
    })
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={onSubmit}
        // onReset={e => {form.reset()}}
        onReset={e => {      toast.success('changePWRes.payload.message')
}}
      >
        <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            {/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        className="w-full"
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
                    <div className="grid gap-3">
                      <Label htmlFor="password">Mật khẩu mới</Label>
                      <Input
                        id="password"
                        type="password"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">
                        Nhập lại mật khẩu mới
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type='reset'>
                  Hủy
                </Button>
                <Button variant="outline" size="sm" onClick={confirm}>
                  Toast
                </Button>
                <Button size="sm" type='submit'>Lưu thông tin</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
