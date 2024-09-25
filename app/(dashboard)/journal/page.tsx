'use client'

import EntryCard from '@/Components/EntryCard'
import NewEntryCard from '@/Components/NewEntryCard'
import Question from '@/Components/Questions'
import { getEntries, ask } from '@/utils/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ReactTyped } from 'react-typed'

const JournalPage = () => {
  const [entries, setEntries] = useState([])
  const [answer, setAnswer] = useState('')
  const [loadingQuestion, setLoadingQuestion] = useState(false)
  const [loadingEntries, setLoadingEntries] = useState(false)
  useEffect(() => {
    setLoadingEntries(true)
    getEntries().then((data) => {
      setEntries(data)
      setLoadingEntries(false)
    })
  }, [])

  const askQuestion = (content: string) => {
    setLoadingQuestion(true)
    ask(content).then((response) => {
      const data = response.ai ? response.ai : response.error
      setAnswer(data)
      setLoadingQuestion(false)
    })
  }

  const renderEntries = (data) => {
    return data.map((entry) => (
      <Link href={`/journal/${entry.id}`} key={entry.id}>
        <EntryCard entry={entry} />
      </Link>
    ))
  }

  return (
    <div className="p-10 bg-zinc-400/10 overflow-y-scroll">
      <div className="flex flex-col">
        <Question askQuestion={askQuestion} loading={loadingQuestion} />
        <div className="mb-10 flex justify-center items-center">
          <ReactTyped strings={[answer]} typeSpeed={40} showCursor={false} />
        </div>
      </div>
      <div className="grid gap-4 pl-10 mb-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <NewEntryCard />
        {renderEntries(entries)}
      </div>
      {loadingEntries && <div className="text-xl p-10">Loading entries...</div>}
    </div>
  )
}

export default JournalPage
