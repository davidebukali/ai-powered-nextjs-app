import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

const NewEntryCard = () => {
  return (
    <Link href="/journal/add">
      <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6 flex">
          <FaPlus className="text-xl mx-2 mt-2" />
          <span className="text-3xl">New Entry</span>
        </div>
      </div>
    </Link>
  )
}

export default NewEntryCard
