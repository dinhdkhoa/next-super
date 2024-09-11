'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AccountResType, UpdateEmployeeAccountBody, UpdateEmployeeAccountBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { useMutation, useQuery } from '@tanstack/react-query'
import accountAPI from '@/apiRequests/account'
import mediaAPI from '@/apiRequests/media'
import { toast } from 'sonner'
import { handleApiError } from '@/lib/utils'

export default function EditEmployee({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const { data } = useQuery({
    queryKey: ['getEmployeeDetail', id],
    queryFn: () => accountAPI.getEmployeeDetail(id as number),
    enabled: Boolean(id)
  })
  const uploadProfileImg = useMutation({
    mutationFn: mediaAPI.upload
  })
  const updateEmployeeMutation = useMutation({
    mutationFn: accountAPI.updateEmployee,
  })
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: '',
      email: '',
      avatar: undefined,
      password: undefined,
      confirmPassword: undefined,
      changePassword: false
    }
  })
  const avatar = form.watch('avatar')
  const name = form.watch('name')
  const changePassword = form.watch('changePassword')
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return avatar
  }, [file, avatar])

  useEffect(() => {
    if(data){
      const { avatar, name , email} = data.payload.data
      form.reset({
        avatar: avatar ?? form.getValues('avatar'),
        name,
        email,
        password: form.getValues('password'),
        confirmPassword: form.getValues('confirmPassword'),
        changePassword: form.getValues('changePassword'),
      })
    }
  }, [data, form])

  const handleSubmit =
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (uploadProfileImg.isPending || updateEmployeeMutation.isPending) return
      const body = form.getValues()
      try {
        if (file) {
          const formData = new FormData()
          formData.append("file", file)
          const uploadDataRes = await uploadProfileImg.mutateAsync(formData)
          const imgURL = uploadDataRes.payload.data
          body.avatar = imgURL
        }
        const updateProfileRes = await updateEmployeeMutation.mutateAsync({id, ...body})
        toast.success(updateProfileRes.payload.message)
        onSubmitSuccess && onSubmitSuccess()
        resetStateOnFormClosed()
      } catch (error) {
        handleApiError(error, form.setError)
      }
    }

    const resetStateOnFormClosed = () => {
      setId(undefined)
      if(file) setFile(null)
    }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          resetStateOnFormClosed()
        }
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật tài khoản</DialogTitle>
          <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' id='edit-employee-form' onSubmit={handleSubmit}>
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className='rounded-none'>{name || 'Avatar'}</AvatarFallback>
                      </Avatar>
                      <input
                        type='file'
                        accept='image/*'
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange('http://localhost:3000/' + file.name)
                          }
                        }}
                        className='hidden'
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Tên</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='name' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='email'>Email</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='email' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='changePassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='email'>Đổi mật khẩu</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {changePassword && (
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                        <Label htmlFor='password'>Mật khẩu mới</Label>
                        <div className='col-span-3 w-full space-y-2'>
                          <Input id='password' className='w-full' type='password' {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              {changePassword && (
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                        <Label htmlFor='confirmPassword'>Xác nhận mật khẩu mới</Label>
                        <div className='col-span-3 w-full space-y-2'>
                          <Input id='confirmPassword' className='w-full' type='password' {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-employee-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
