'use client'
import * as z from 'zod'
import { Heading } from '@/components/heading'
import { Download, MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { amountOptions, formSchema, resolutionOptions } from './constants'
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Empty } from '@/components/Empty'
import { Loader } from '@/components/Loader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { useProModal } from '@/hooks/use-pro-modal'
import { toast } from 'react-hot-toast'

const ImagePage = () => {
  const router = useRouter()
  const proModal = useProModal()

  // 图片url列表
  const [images, setImages] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // 表单默认值
    defaultValues: {
      prompt: '',
      amount: '1',
      resolution: '512x512',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values); //{prompt: 'aa', amount: '4', resolution: '1024x1024'}
    // //values: 表单数据
    try {
      setImages([])
      const response = await axios.post('/api/image', values)
      // openai会返回生成图片对应的url
      const urls = response.data.map((image: { url: string }) => image.url)

      setImages(urls)
      form.reset()
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen()
      } else {
        toast.error('Something went wrong.')
      }
    } finally {
      router.refresh() //刷新页面？
    }
  }

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              {/* field中有onchange等事件 */}
              {/* 提示词 */}
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A picture of dogs"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* 生成图片数量下拉框 */}
              <FormField
                name="amount"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      {/* 下拉框选项 */}
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* 生成分辨率下拉框 */}
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>

        {/* 对话部分 */}
        <div className="space-y-4 mt-4">
          {/* loading页面 */}
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {/* 空白页面 */}
          {images.length === 0 && !isLoading && (
            <div>
              <Empty label="No images generated." />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-clos-4 gap-4 mt-8">
            {images.map((src) => (
              <Card key={src} className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image fill alt="Generated" src={src} />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(src)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePage
