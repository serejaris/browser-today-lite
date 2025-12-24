import type { Data } from '@/types'
import { EditableText } from './editable-text'
import { SectionHeader } from './section-header'

interface FocusSectionProps {
  weekFocus: string
  monthFocus: string
  quarterFocus: string
  update: (patch: Partial<Data>) => void
}

export function FocusSection({ weekFocus, monthFocus, quarterFocus, update }: FocusSectionProps) {
  return (
    <>
      <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
        <SectionHeader>Фокус недели</SectionHeader>
        <EditableText
          value={weekFocus}
          onSave={(v) => update({ weekFocus: v })}
          className="text-sm leading-relaxed"
          placeholder="Введите фокус недели..."
        />
      </div>
      <div className="p-4 rounded-lg border bg-card">
        <SectionHeader>Фокус месяца</SectionHeader>
        <EditableText
          value={monthFocus}
          onSave={(v) => update({ monthFocus: v })}
          className="text-sm leading-relaxed"
          placeholder="Введите фокус месяца..."
        />
      </div>
      <div className="p-4 rounded-lg border bg-muted/50">
        <SectionHeader>Фокус квартала</SectionHeader>
        <EditableText
          value={quarterFocus}
          onSave={(v) => update({ quarterFocus: v })}
          className="text-sm leading-relaxed"
          placeholder="Введите фокус квартала..."
        />
      </div>
    </>
  )
}
