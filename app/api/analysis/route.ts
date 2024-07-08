import { analyze } from '@/utils/ai'
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(4, '60 m'),
})

export const POST = async (request: NextRequest, { params }) => {
  try {
    const { content } = await request.json()

    const ip = request.headers.get('x-forwarded-for') ?? ''
    const { success } = await ratelimit.limit(ip)
    const left = await ratelimit.getRemaining(ip)

    if (!success) {
      return NextResponse.json({
        data: {
          ai: null,
          left,
          error: 'You can only send 4 requests per hour.',
        },
      })
    }

    const analysis = await analyze(content)

    return NextResponse.json({
      data: {
        ai: analysis,
        left,
      },
    })
  } catch (err: any) {
    console.log(err.message)
  }
}
