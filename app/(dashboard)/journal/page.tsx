'use client'

import EntryCard from '@/Components/EntryCard'
import NewEntryCard from '@/Components/NewEntryCard'
import Question from '@/Components/Questions'
import { getEntries, vectorSearch } from '@/utils/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const JournalPage = () => {
  const [entries, setEntries] = useState([])
  const [filterEntries, setFilterEntries] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    getEntries().then((data) => {
      setEntries(data)
      setLoading(false)
    })
  }, [])

  const search = (content: string) => {
    setLoading(true)
    vectorSearch(content).then((response) => {
      setFilterEntries(response)
      setLoading(false)
    })
  }

  const viewAll = (e) => {
    setFilterEntries([])
  }

  const renderEntries = (data, filtered) => {
    if (filtered.length > 0) {
      return filtered.map((entry) => (
        <Link href={`/journal/${entry.id}`} key={entry.id}>
          <EntryCard entry={entry} />
        </Link>
      ))
    } else {
      return data.map((entry) => (
        <Link href={`/journal/${entry.id}`} key={entry.id}>
          <EntryCard entry={entry} />
        </Link>
      ))
    }
  }

  return (
    <div className="p-10 bg-zinc-400/10 h-full">
      <div className="flex flex-col">
        <Question search={search} loading={loading} />
        {filterEntries && (
          <div
            className="cursor-pointer underline mb-5 flex justify-center items-center"
            onClick={viewAll}
          >
            View All
          </div>
        )}
      </div>
      <div className="grid gap-4 pl-10 mb-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <NewEntryCard />
        {renderEntries(entries, filterEntries)}
      </div>
      {loading && <div className="text-xl p-10">Loading entries...</div>}
    </div>
  )
}

export default JournalPage
