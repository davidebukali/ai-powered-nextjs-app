import { auth } from '@clerk/nextjs/server'
import { prisma } from './db'
import { redirect } from 'next/navigation'

export const getUserByClerkID = async () => {
  const { userId } = await auth()

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        clerkId: userId,
      },
    })
    return user
  } catch (error) {
    redirect('new-user')
  }
}
