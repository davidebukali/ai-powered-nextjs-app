'use client'

import { useState } from 'react'

const Question = ({ askQuestion, loading }) => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const handleSubmit = () => {
    askQuestion(value)
  }

  return (
    <div className="flex flex-row justify-center m-5">
      <input
        disabled={loading}
        type="text"
        onChange={onChange}
        value={value}
        placeholder="Ask a question about your journal entries ..."
        className="w-[500px] border border-black/20 px-5 py-3 rounded-lg text-lg mx-4 "
      />
      <button
        className="bg-blue-800 px-5 py-3 rounded-lg text-white"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'GO'}
      </button>
    </div>
  )
}

export default Question
