import { authMiddleware } from '@clerk/nextjs/server'

export default authMiddleware({
  publicRoutes: ['/', '/api/analysis'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
