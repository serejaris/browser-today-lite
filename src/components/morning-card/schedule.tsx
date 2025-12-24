import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ScheduleItem, Data } from '@/types'
import { SCHEDULE_STYLES, INPUT_CLASS, ADD_BTN, ADD_FORM } from '@/constants'
import { EditableText } from './editable-text'
import { FormActions } from './form-actions'
import { SectionHeader } from './section-header'

interface ScheduleProps {
  schedule: ScheduleItem[]
  update: (patch: Partial<Data>) => void
}

export function Schedule({ schedule, update }: ScheduleProps) {
  const [adding, setAdding] = useState(false)
  const [newSchedule, setNewSchedule] = useState<{ time: string; title: string; type: 'focus' | 'meeting' | 'break' }>({ time: '', title: '', type: 'focus' })

  const addScheduleItem = () => {
    if (!newSchedule.time || !newSchedule.title) return
    update({ schedule: [...schedule, { id: Date.now(), ...newSchedule }] })
    setNewSchedule({ time: '', title: '', type: 'focus' })
    setAdding(false)
  }

  const updateScheduleItem = (id: number, patch: Partial<ScheduleItem>) => {
    update({ schedule: schedule.map((s) => (s.id === id ? { ...s, ...patch } : s)) })
  }

  const deleteScheduleItem = (id: number) => {
    update({ schedule: schedule.filter((s) => s.id !== id) })
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
                  onSave={(time) => updateScheduleItem(item.id, { time })}
                  className="text-xs font-mono text-muted-foreground mb-1 block"
                  placeholder="00:00"
                />
                <EditableText
                  value={item.title}
                  onSave={(title) => updateScheduleItem(item.id, { title })}
                  className="text-sm font-medium"
                  placeholder="Событие..."
                />
              </div>
              <button
                onClick={() => deleteScheduleItem(item.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {adding ? (
          <div className={cn(ADD_FORM, 'space-y-3')}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="00:00"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                className={cn(INPUT_CLASS, 'w-20 text-xs font-mono')}
              />
              <input
                type="text"
                placeholder="Название события"
                value={newSchedule.title}
                onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                className={cn(INPUT_CLASS, 'flex-1')}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={newSchedule.type}
                onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value as 'focus' | 'meeting' | 'break' })}
                className={cn(INPUT_CLASS, 'text-xs')}
              >
                <option value="focus">Фокус</option>
                <option value="meeting">Встреча</option>
                <option value="break">Перерыв</option>
              </select>
              <FormActions onConfirm={addScheduleItem} onCancel={() => setAdding(false)} />
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className={ADD_BTN}>
            <Plus className="w-4 h-4" />
            Добавить событие
          </button>
        )}
      </div>
    </section>
  )
}
