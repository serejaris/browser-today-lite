import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hasRequiredFields } from '@/lib/validation'
import { useItemManager } from '@/hooks/use-item-manager'
import type { ScheduleItem, AppState } from '@/types'
import { SCHEDULE_STYLES, INPUT_CLASS, ADD_BTN, ADD_FORM } from '@/constants'
import { EditableText } from './editable-text'
import { FormActions } from './form-actions'
import { SectionHeader } from './section-header'

interface ScheduleProps {
  schedule: ScheduleItem[]
  onUpdate: (patch: Partial<AppState>) => void
}

export function Schedule({ schedule, onUpdate }: ScheduleProps) {
  const {
    isAdding,
    draft,
    setDraft,
    add,
    update,
    remove,
    startAdding,
    cancelAdding,
  } = useItemManager<ScheduleItem>({
    items: schedule,
    onUpdate: (items) => onUpdate({ schedule: items }),
    createEmpty: () => ({ time: '', title: '', type: 'focus' as const }),
  })

  const handleAdd = () => {
    if (!hasRequiredFields(draft, ['time', 'title'])) return
    add()
  }

  return (
    <section>
      <SectionHeader>Календарь дня</SectionHeader>
      <div className="space-y-3">
        {schedule.map((item) => (
          <div
            key={item.id}
            className={cn('group p-4 rounded-lg border transition-all', SCHEDULE_STYLES[item.type])}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <EditableText
                  value={item.time}
                  onSave={(time) => update(item.id, { time })}
                  className="text-xs font-mono text-muted-foreground mb-1 block"
                  placeholder="00:00"
                />
                <EditableText
                  value={item.title}
                  onSave={(title) => update(item.id, { title })}
                  className="text-sm font-medium"
                  placeholder="Событие..."
                />
              </div>
              <button
                onClick={() => remove(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {isAdding ? (
          <div className={cn(ADD_FORM, 'space-y-3')}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="00:00"
                value={draft.time}
                onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                className={cn(INPUT_CLASS, 'w-20 text-xs font-mono')}
              />
              <input
                type="text"
                placeholder="Название события"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className={cn(INPUT_CLASS, 'flex-1')}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value as ScheduleItem['type'] })}
                className={cn(INPUT_CLASS, 'text-xs')}
              >
                <option value="focus">Фокус</option>
                <option value="meeting">Встреча</option>
                <option value="break">Перерыв</option>
              </select>
              <FormActions onConfirm={handleAdd} onCancel={cancelAdding} />
            </div>
          </div>
        ) : (
          <button onClick={startAdding} className={ADD_BTN}>
            <Plus className="w-4 h-4" />
            Добавить событие
          </button>
        )}
      </div>
    </section>
  )
}
