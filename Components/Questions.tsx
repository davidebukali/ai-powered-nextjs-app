'use client'

import { useState } from 'react'

const Question = () => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={value}
          placeholder="Ask a question"
          className="border border-black/20 px-10 py-6 rounded-lg text-lg"
        />
        <button type="submit" className="bg-blue-400 px-4 py-2 rounded-lg">
          Ask
        </button>
      </form>
    </div>
  )
}

export default Question
