import type { Data } from '@/types'
import { EditableText } from './editable-text'
import { SectionHeader } from './section-header'

interface QuoteProps {
  quote: string
  update: (patch: Partial<Data>) => void
}

export function Quote({ quote, update }: QuoteProps) {
  return (
    <div className="pt-4 border-t">
      <SectionHeader>Мысль дня</SectionHeader>
      <EditableText
        value={quote}
        onSave={(v) => update({ quote: v })}
        className="text-muted-foreground italic text-sm leading-relaxed"
        placeholder="Введите цитату..."
      />
    </div>
  )
}
