import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface EditableTextProps {
  value: string
  onSave: (v: string) => void
  className?: string
  placeholder?: string
}

export function EditableText({
  value,
  onSave,
  className,
  placeholder = '...',
}: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)

  useEffect(() => setText(value), [value])

  const save = () => {
    onSave(text)
    setEditing(false)
  }

  const cancel = () => {
    setText(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') cancel()
        }}
        autoFocus
        className={cn('bg-transparent border-b-2 border-primary outline-none w-full', className)}
        placeholder={placeholder}
      />
    )
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={cn('cursor-pointer hover:bg-secondary rounded px-1 -mx-1 transition-colors', className)}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
    </span>
  )
}
