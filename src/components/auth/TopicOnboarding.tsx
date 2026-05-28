import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'gridaan.topics.v1'

const TOPICS = [
  'AI',
  'Startups',
  'Programming',
  'Web Development',
  'React',
  'Cybersecurity',
  'Productivity',
  'Machine Learning',
  'Design',
  'Entrepreneurship',
] as const

export type Topic = (typeof TOPICS)[number]

export function hasCompletedTopicsOnboarding() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { topics?: string[] }
    return Array.isArray(parsed.topics) && parsed.topics.length > 0
  } catch {
    return false
  }
}

export default function TopicOnboarding({
  onComplete,
}: {
  onComplete: (topics: Topic[]) => void
}) {
  const [selected, setSelected] = useState<Set<Topic>>(new Set(['AI', 'Programming']))

  const selectedList = useMemo(() => Array.from(selected), [selected])

  const toggle = (topic: Topic) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(topic)) next.delete(topic)
      else next.add(topic)
      return next
    })
  }

  const save = () => {
    const topics = selectedList
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ topics, createdAt: new Date().toISOString() }))
    onComplete(topics)
  }

  return (
    <div>
      <p className="text-sm text-[#6b6b6b]">
        Choose a few topics to personalize your recommendations. You can update this later.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {TOPICS.map((topic) => {
          const active = selected.has(topic)
          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggle(topic)}
              className={`rounded-full border px-3 py-2 text-sm transition ${
                active
                  ? 'border-[#cfe0ff] bg-[#eef4ff] text-[#1d4ed8]'
                  : 'border-[#e6e6e6] bg-white text-[#242424] hover:bg-[#f5f5f2]'
              }`}
              aria-pressed={active}
            >
              {topic}
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-[#8a8a8a]">
          Selected: {selectedList.length}
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={save}
          disabled={selectedList.length === 0}
          className="rounded-full bg-[#1c1c1c] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2c2c2c] disabled:opacity-40"
        >
          Continue
        </motion.button>
      </div>
    </div>
  )
}

