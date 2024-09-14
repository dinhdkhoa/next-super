'use client'
import accountAPI from '@/apiRequests/account'
import mediaAPI from '@/apiRequests/media'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { handleApiError } from '@/lib/utils'
import useGetAccount from '@/queries/useGetAccount'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function UpdateProfileForm() {
  const [file, setFile] = useState<File | null>(null) 
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const queryClient = useQueryClient()
  const updateProfile = useMutation(
    {
      mutationFn: accountAPI.updateAccount,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['get-account-profile'] })
      }
    }
  )
  const uploadProfileImg = useMutation({
    mutationFn: mediaAPI.upload
  })
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name:  "",
      avatar:  undefined
    }
  })

  const { data, refetch } = useGetAccount()
  const user = data?.payload.data

  const handleSubmit =
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (uploadProfileImg.isPending || updateProfile.isPending) return
      const body = form.getValues()
      try {
        if (file) {
          const formData = new FormData()
          formData.append("file", file)
          const uploadDataRes = await uploadProfileImg.mutateAsync(formData)
          const imgURL = uploadDataRes.payload.data
          body.avatar = imgURL
        }
        const updateProfileRes = await updateProfile.mutateAsync(body)
        toast.success(updateProfileRes.payload.message)
        refetch()
      } catch (error) {
        handleApiError(error, form.setError)
      }
    }
  const resetForm = () => {
    if(file){
      setFile(null)
    }
    form.reset({
      name: user?.name ?? "",
      avatar: user?.avatar ?? undefined
    })
  }


  useEffect(() => {
    if (user) {
      form.setValue("name", user.name ?? "")
      form.setValue("avatar", user.avatar ?? undefined)
    }
  }, [form, user])

  const previewImage = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return user?.avatar ?? ""
  }, [file, user])

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={handleSubmit}
        onReset={resetForm}
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewImage} />
                        <AvatarFallback className="rounded-none">
                          {"duoc"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) {
                            setFile(file)
                          }
                        }}
                        onClick={(event) => {
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""
                          }
                        }}
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => {
                          fileInputRef?.current?.click()
                        }}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button size="sm" type="submit">
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
