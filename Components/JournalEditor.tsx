'use client'

import { updatedEntry } from '@/utils/api'
import { useState } from 'react'
import { useAutosave } from 'react-autosave'
import Editor from 'react-simple-wysiwyg'

const JournalEditor = ({ entry }) => {
  const [value, setValue] = useState(entry.content)
  const [analysis, setAnalysis] = useState(entry.analysis)
  const [isLoading, setIsLoading] = useState(false)
  const { mood, summary, color, subject, negative } = analysis
  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'True' : 'False' },
  ]

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true)
      const data = await updatedEntry(entry.id, _value)
      setAnalysis(data.analysis)
      setIsLoading(false)
    },
  })

  return (
    <div className="h-full w-full grid md:grid-cols-3 p-5">
      <div className="md:col-span-2 pb-5 pr-2">
        <div className="w-full h-full">
          {isLoading && <div>Loading...</div>}
          <Editor
            containerProps={{ style: { width: '100%', height: '100%' } }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
      <div className="w-full h-full border border-black/10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                key={item.name}
                className="px-2 py-2 flex items-center justify-between border-b border-t border-black/10"
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span className="px-4">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>{' '}
      </div>
    </div>
  )
}

export default JournalEditor
