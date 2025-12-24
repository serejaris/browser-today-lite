import type { AppState } from '@/types'
import { EditableText } from './editable-text'
import { SectionHeader } from './section-header'

interface FocusSectionProps {
  weekFocus: string
  monthFocus: string
  quarterFocus: string
  onUpdate: (patch: Partial<AppState>) => void
}

export function FocusSection({ weekFocus, monthFocus, quarterFocus, onUpdate }: FocusSectionProps) {
  return (
    <>
      <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
        <SectionHeader>Фокус недели</SectionHeader>
        <EditableText
          value={weekFocus}
          onSave={(v) => onUpdate({ weekFocus: v })}
          className="text-sm leading-relaxed"
          placeholder="Введите фокус недели..."
        />
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <SectionHeader>Фокус месяца</SectionHeader>
        <EditableText
          value={monthFocus}
          onSave={(v) => onUpdate({ monthFocus: v })}
          className="text-sm leading-relaxed"
          placeholder="Введите фокус месяца..."
        />
      </div>
      <div className="p-4 rounded-lg border bg-muted/50">
        <SectionHeader>Фокус квартала</SectionHeader>
        <EditableText
          value={quarterFocus}
          onSave={(v) => onUpdate({ quarterFocus: v })}
          className="text-sm leading-relaxed"
          placeholder="Введите фокус квартала..."
        />
      </div>
    </>
  )
}
