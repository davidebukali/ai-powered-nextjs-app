import JournalEditor from '@/Components/JournalEditor'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getEntry = async (id) => {
  let newEntry
  const user = await getUserByClerkID()
  let savedEntry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  })

  if (!savedEntry) {
    newEntry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        content: '',
      },
    })
    return newEntry
  }
  return savedEntry
}

const EntryPage = async ({ params }) => {
  const entry = await getEntry(params.id)

  return <JournalEditor entry={entry} />
}

export default EntryPage
