const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt)
  const { subject, mood } = entry.analysis || { subject: 'N/A', mood: 'N/A' }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:px-6">{`${date.toDateString()}, ${date.toLocaleTimeString()}`}</div>
      <div className="px-4 py-5 sm:p-6">{subject}</div>
      <div className="px-4 py-4 sm:px-6">{mood}</div>
    </div>
  )
}

export default EntryCard
