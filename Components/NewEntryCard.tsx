'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

const NewEntryCard = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const handleOnClick = async () => {
    setIsLoading(true)
    router.push('/journal/add')
  }

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow"
      onClick={handleOnClick}
    >
      {isLoading && (
        <div className="flex px-4 sm:p-2">
          <FaSpinner className="animate-spin" />
          <span className="px-2">Loading ...</span>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        <span className="text-3xl">New Entry</span>
      </div>
    </div>
  )
}

export default NewEntryCard
