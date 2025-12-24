import { Plus, Check, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isNonEmpty } from '@/lib/validation'
import { useItemManager } from '@/hooks/use-item-manager'
import type { Task, Data } from '@/types'
import { BTN_DELETE, ADD_BTN, ADD_FORM } from '@/constants'
import { EditableText } from './editable-text'
import { FormActions } from './form-actions'
import { SectionHeader } from './section-header'

interface TaskListProps {
  tasks: Task[]
  onUpdate: (patch: Partial<Data>) => void
}

export function TaskList({ tasks, onUpdate }: TaskListProps) {
  const {
    isAdding,
    draft,
    setDraft,
    add,
    update,
    remove,
    startAdding,
    cancelAdding,
  } = useItemManager<Task>({
    items: tasks,
    onUpdate: (items) => onUpdate({ tasks: items }),
    createEmpty: () => ({ text: '', completed: false }),
  })

  const handleAdd = () => {
    if (!isNonEmpty(draft.text)) return
    add()
  }

  return (
    <section>
      <SectionHeader>Ключевые задачи</SectionHeader>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'group p-4 rounded-lg border transition-all flex items-center gap-4',
              task.completed ? 'bg-muted/50' : 'bg-card hover:shadow-sm'
            )}
          >
            <button
              onClick={() => update(task.id, { completed: !task.completed })}
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                task.completed ? 'bg-primary border-primary' : 'border-muted-foreground/40 hover:border-primary'
              )}
            >
              {task.completed && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </button>
            <div className="flex-1 min-w-0">
              <span className={cn('text-sm', task.completed && 'line-through text-muted-foreground')}>
                <EditableText
                  value={task.text}
                  onSave={(text) => update(task.id, { text })}
                />
              </span>
            </div>
            <button onClick={() => remove(task.id)} className={BTN_DELETE}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {isAdding ? (
          <div className={cn(ADD_FORM, 'flex items-center gap-2')}>
            <input
              type="text"
              placeholder="Новая задача..."
              value={draft.text}
              onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <FormActions onConfirm={handleAdd} onCancel={cancelAdding} />
          </div>
        ) : (
          <button onClick={startAdding} className={ADD_BTN}>
            <Plus className="w-4 h-4" />
            Добавить задачу
          </button>
        )}
      </div>
    </section>
  )
}
