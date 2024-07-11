import * as Sentry from '@sentry/nextjs'
import { NextRequest } from 'next/server'

const createLogMessage = (req: NextRequest) => {
  const ip = req.ip ? req.ip : req.headers.get('x-forwarded-for')
  if (req.geo) {
    return JSON.stringify([ip, req.geo])
  }
  return JSON.stringify([ip])
}

export const logMetric = (req: NextRequest) => {
  const msg = createLogMessage(req)
  Sentry.metrics.set('home_page_ai_request', msg)
}
