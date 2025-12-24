import type { AppState } from '@/types'
import { EditableText } from './editable-text'
import { SectionHeader } from './section-header'

interface QuoteProps {
  quote: string
  onUpdate: (patch: Partial<AppState>) => void
}

export function Quote({ quote, onUpdate }: QuoteProps) {
  return (
    <div className="pt-4 border-t">
      <SectionHeader>Мысль дня</SectionHeader>
      <EditableText
        value={quote}
        onSave={(v) => onUpdate({ quote: v })}
        className="text-muted-foreground italic text-sm leading-relaxed"
        placeholder="Введите цитату..."
      />
    </div>
  )
}
