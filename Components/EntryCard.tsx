const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt)
  const { subject, mood, color, summary } = entry.analysis || {
    subject: 'N/A',
    mood: 'N/A',
    color: '',
    summary: '',
  }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 font-semibold sm:px-6">{subject}</div>
      <div className="px-4 py-5 sm:p-6">
        <div className="text-xs">
          {date.toDateString()}, {date.toLocaleTimeString()}
        </div>
        <div className="py-4">{summary}</div>
      </div>
      <div className="px-4 py-4 sm:px-6">
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
