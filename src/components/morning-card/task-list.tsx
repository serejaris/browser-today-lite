import { useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task, Data } from '@/types'
import { BTN_DELETE, ADD_BTN, ADD_FORM } from '@/constants'
import { EditableText } from './editable-text'
import { FormActions } from './form-actions'
import { SectionHeader } from './section-header'

interface TaskListProps {
  tasks: Task[]
  update: (patch: Partial<Data>) => void
}

export function TaskList({ tasks, update }: TaskListProps) {
  const [adding, setAdding] = useState(false)
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (!newTask.trim()) return
    update({ tasks: [...tasks, { id: Date.now(), text: newTask, completed: false }] })
    setNewTask('')
    setAdding(false)
  }

  const toggleTask = (id: number) => {
    update({ tasks: tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) })
  }

  const updateTaskText = (id: number, text: string) => {
    update({ tasks: tasks.map((t) => (t.id === id ? { ...t, text } : t)) })
  }

  const deleteTask = (id: number) => {
    update({ tasks: tasks.filter((t) => t.id !== id) })
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
              onClick={() => toggleTask(task.id)}
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
                  onSave={(text) => updateTaskText(task.id, text)}
                />
              </span>
            </div>
            <button onClick={() => deleteTask(task.id)} className={BTN_DELETE}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {adding ? (
          <div className={cn(ADD_FORM, 'flex items-center gap-2')}>
            <input
              type="text"
              placeholder="Новая задача..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              autoFocus
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <FormActions onConfirm={addTask} onCancel={() => setAdding(false)} />
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className={ADD_BTN}>
            <Plus className="w-4 h-4" />
            Добавить задачу
          </button>
        )}
      </div>
    </section>
  )
}
