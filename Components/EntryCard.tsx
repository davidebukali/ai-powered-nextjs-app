import { FaTimes } from 'react-icons/fa'
import Link from 'next/link'

const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt)
  const { subject, mood, color, summary } = entry.analysis || {
    subject: 'N/A',
    mood: 'N/A',
    color: '',
    summary: '',
  }

  return (
    <div className="h-200 divide-y divide-gray-200 rounded-lg bg-white shadow">
      <div className="h-15 px-4 py-5 font-semibold sm:px-6">
        {subject}
        <span className="float-right">
          <FaTimes />
        </span>
      </div>
      <div className="h-70 px-4 py-5 sm:p-6">
        <Link href={`/journal/${entry.id}`} key={entry.id}>
          <div className="text-xs">
            {date.toDateString()}, {date.toLocaleTimeString()}
          </div>
          <div className="py-4">{summary}</div>
        </Link>
      </div>
      <div className="h-15 px-2 py-2 sm:px-6">
        <span
          style={{ backgroundColor: color }}
          className="inline-block text-white text-xs font-semibold px-2 py-1 rounded-full"
        >
          {mood}
        </span>
      </div>
    </div>
  )
}

export default EntryCard
