import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'
import { incrementApiLimit, checkApiLimit } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const body = await req.json()
    const { prompt, amount = 1, resolution = '512x512' } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!configuration.apiKey) {
      return new NextResponse('OpenAI API key not configured', { status: 500 })
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 })
    }

    // 判断是否还可以免费使用
    const freeTrial = await checkApiLimit()
    const isPro = await checkSubscription()

    if (!freeTrial && !isPro) {
      return new NextResponse(
        'Free trial has expired. Please upgrade to pro.',
        { status: 403 }
      )
    }

    // 生成图片的api参数
    const response = await openai.createImage({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    })

    if (!isPro) {
      await incrementApiLimit()
    }

    // 获取图片数据
    return NextResponse.json(response.data.data)
  } catch (err) {
    console.log(err)
    return new NextResponse('image error', { status: 500 })
  }
}
