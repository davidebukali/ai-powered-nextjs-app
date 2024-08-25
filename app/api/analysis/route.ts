import { analyze } from '@/utils/ai'
import { NextRequest, NextResponse } from 'next/server'
import { logMetric } from '@/utils/errors'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 3600, // Per second(s)
})

export const POST = async (request: NextRequest, { params }) => {
  try {
    const { content } = await request.json()
    const ip = request.headers.get('x-forwarded-for') || ''
    await rateLimiter.consume(ip)

    const rateLimitInfo = await rateLimiter.get(ip)

    const analysis = await analyze(content)

    //Log these requests from guest users
    logMetric(request)

    return NextResponse.json({
      data: {
        ai: analysis,
        left: rateLimitInfo?.remainingPoints,
      },
    })
  } catch (err: any) {
    console.log(err.message)
    return NextResponse.json({
      data: {
        ai: null,
        left: 0,
        error: 'You can only send 5 requests per hour.',
      },
    })
  }
}
