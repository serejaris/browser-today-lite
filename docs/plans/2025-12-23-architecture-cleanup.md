# Architecture Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove zombie code, extract duplicated patterns into reusable hooks/utilities, and establish consistent conventions.

**Architecture:** Bottom-up cleanup: first remove unused code, then extract shared patterns into hooks, finally standardize naming and validation.

**Tech Stack:** React 18, TypeScript, Vite

---

## Phase 1: Remove Zombie Code (−2500 LOC)

### Task 1.1: Delete Unused UI Components

**Files:**
- Delete: `src/components/ui/` (55 files)
- Delete: `src/hooks/use-toast.ts`
- Delete: `src/hooks/use-mobile.ts`

**Step 1: Verify no UI components are used in app**

Run: `grep -r "from '@/components/ui" src/components/morning-card src/App.tsx src/main.tsx`
Expected: No output (no imports from ui/)

**Step 2: Delete entire ui folder**

```bash
rm -rf src/components/ui
```

**Step 3: Delete unused hooks**

```bash
rm src/hooks/use-toast.ts src/hooks/use-mobile.ts
```

**Step 4: Verify build still works**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove 55 unused shadcn UI components and hooks"
```

---

## Phase 2: Extract Shared Utilities

### Task 2.1: Create generateId Utility

**Files:**
- Modify: `src/lib/utils.ts`

**Step 1: Add generateId function**

```typescript
// Add to src/lib/utils.ts
export function generateId(): number {
  return Date.now()
}
```

**Step 2: Commit**

```bash
git add src/lib/utils.ts
git commit -m "feat(utils): add generateId utility"
```

---

### Task 2.2: Create useItemManager Hook

**Files:**
- Create: `src/hooks/use-item-manager.ts`

**Step 1: Create the hook file**

```typescript
import { useState, useCallback } from 'react'
import { generateId } from '@/lib/utils'

interface HasId {
  id: number
}

interface UseItemManagerOptions<T extends HasId> {
  items: T[]
  onUpdate: (items: T[]) => void
  createEmpty: () => Omit<T, 'id'>
}

export function useItemManager<T extends HasId>({
  items,
  onUpdate,
  createEmpty,
}: UseItemManagerOptions<T>) {
  const [isAdding, setIsAdding] = useState(false)
  const [draft, setDraft] = useState<Omit<T, 'id'>>(createEmpty)

  const add = useCallback(() => {
    const newItem = { id: generateId(), ...draft } as T
    onUpdate([...items, newItem])
    setDraft(createEmpty())
    setIsAdding(false)
  }, [items, draft, onUpdate, createEmpty])

  const update = useCallback(
    (id: number, patch: Partial<T>) => {
      onUpdate(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
    },
    [items, onUpdate]
  )

  const remove = useCallback(
    (id: number) => {
      onUpdate(items.filter((item) => item.id !== id))
    },
    [items, onUpdate]
  )

  const startAdding = useCallback(() => setIsAdding(true), [])
  const cancelAdding = useCallback(() => {
    setIsAdding(false)
    setDraft(createEmpty())
  }, [createEmpty])

  return {
    isAdding,
    draft,
    setDraft,
    add,
    update,
    remove,
    startAdding,
    cancelAdding,
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/hooks/use-item-manager.ts
git commit -m "feat(hooks): add useItemManager for CRUD operations"
```

---

### Task 2.3: Create Validation Utilities

**Files:**
- Create: `src/lib/validation.ts`

**Step 1: Create validation helpers**

```typescript
export function isNonEmpty(value: string): boolean {
  return value.trim() !== ''
}

export function hasRequiredFields<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
): boolean {
  return keys.every((key) => {
    const value = obj[key]
    if (typeof value === 'string') return isNonEmpty(value)
    return value !== undefined && value !== null
  })
}
```

**Step 2: Commit**

```bash
git add src/lib/validation.ts
git commit -m "feat(lib): add validation utilities"
```

---

## Phase 3: Refactor Components to Use Shared Code

### Task 3.1: Refactor TaskList

**Files:**
- Modify: `src/components/morning-card/task-list.tsx`

**Step 1: Replace with useItemManager**

```typescript
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
```

**Step 2: Update parent to use onUpdate prop**

In `src/components/morning-card/index.tsx`, the `update` function is already compatible.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/components/morning-card/task-list.tsx
git commit -m "refactor(task-list): use useItemManager hook"
```

---

### Task 3.2: Refactor Schedule

**Files:**
- Modify: `src/components/morning-card/schedule.tsx`

**Step 1: Replace with useItemManager**

```typescript
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hasRequiredFields } from '@/lib/validation'
import { useItemManager } from '@/hooks/use-item-manager'
import type { ScheduleItem, Data } from '@/types'
import { SCHEDULE_STYLES, INPUT_CLASS, ADD_BTN, ADD_FORM } from '@/constants'
import { EditableText } from './editable-text'
import { FormActions } from './form-actions'
import { SectionHeader } from './section-header'

interface ScheduleProps {
  schedule: ScheduleItem[]
  onUpdate: (patch: Partial<Data>) => void
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
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/morning-card/schedule.tsx
git commit -m "refactor(schedule): use useItemManager hook"
```

---

### Task 3.3: Refactor QuickLinks

**Files:**
- Modify: `src/components/morning-card/quick-links.tsx`

**Step 1: Replace with useItemManager**

```typescript
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hasRequiredFields } from '@/lib/validation'
import { useItemManager } from '@/hooks/use-item-manager'
import type { QuickLink, Data } from '@/types'
import { INPUT_CLASS } from '@/constants'
import { FormActions } from './form-actions'

interface QuickLinksProps {
  quickLinks: QuickLink[]
  onUpdate: (patch: Partial<Data>) => void
}

export function QuickLinks({ quickLinks, onUpdate }: QuickLinksProps) {
  const {
    isAdding,
    draft,
    setDraft,
    add,
    remove,
    startAdding,
    cancelAdding,
  } = useItemManager<QuickLink>({
    items: quickLinks,
    onUpdate: (items) => onUpdate({ quickLinks: items }),
    createEmpty: () => ({ title: '', url: '' }),
  })

  const handleAdd = () => {
    if (!hasRequiredFields(draft, ['title', 'url'])) return
    add()
  }

  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-2 items-center">
        {quickLinks.map((link) => (
          <div key={link.id} className="group relative">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border bg-card text-sm font-medium transition-all flex items-center gap-2 hover:border-primary hover:shadow-sm"
            >
              {link.title}
            </a>
            <button
              onClick={() => remove(link.id)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {isAdding ? (
          <div className="flex items-center gap-2 p-2 rounded-lg border-2 border-dashed border-primary bg-card">
            <input
              type="text"
              placeholder="Название"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className={cn(INPUT_CLASS, 'w-24')}
            />
            <input
              type="url"
              placeholder="URL"
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              className={cn(INPUT_CLASS, 'w-40')}
            />
            <FormActions onConfirm={handleAdd} onCancel={cancelAdding} />
          </div>
        ) : (
          <button
            onClick={startAdding}
            className="px-4 py-2 rounded-lg border-2 border-dashed text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/morning-card/quick-links.tsx
git commit -m "refactor(quick-links): use useItemManager hook"
```

---

### Task 3.4: Update Parent Component Props

**Files:**
- Modify: `src/components/morning-card/index.tsx`

**Step 1: Rename update to onUpdate in child components**

```typescript
import type { Data } from '@/types'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Header } from './header'
import { QuickLinks } from './quick-links'
import { TaskList } from './task-list'
import { Schedule } from './schedule'
import { FocusSection } from './focus-section'
import { Quote } from './quote'

export function MorningCard() {
  const [data, saveData, isLoaded] = useLocalStorage()

  if (!isLoaded) {
    return (
      <div className="w-full max-w-7xl animate-pulse h-32 flex items-center justify-center text-muted-foreground">
        Загрузка...
      </div>
    )
  }

  const handleUpdate = (patch: Partial<Data>) => saveData({ ...data, ...patch })

  return (
    <div className="w-full max-w-7xl">
      <QuickLinks quickLinks={data.quickLinks} onUpdate={handleUpdate} />
      <Header />

      <div className="grid lg:grid-cols-3 gap-8">
        <TaskList tasks={data.tasks} onUpdate={handleUpdate} />
        <Schedule schedule={data.schedule} onUpdate={handleUpdate} />

        <section className="space-y-4">
          <FocusSection
            weekFocus={data.weekFocus}
            monthFocus={data.monthFocus}
            quarterFocus={data.quarterFocus}
            onUpdate={handleUpdate}
          />
          <Quote quote={data.quote} onUpdate={handleUpdate} />
        </section>
      </div>
    </div>
  )
}
```

**Step 2: Update FocusSection props**

In `src/components/morning-card/focus-section.tsx`, rename `update` to `onUpdate`:

```typescript
import type { Data } from '@/types'
import { EditableText } from './editable-text'
import { SectionHeader } from './section-header'

interface FocusSectionProps {
  weekFocus: string
  monthFocus: string
  quarterFocus: string
  onUpdate: (patch: Partial<Data>) => void
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
```

**Step 3: Update Quote props**

In `src/components/morning-card/quote.tsx`, rename `update` to `onUpdate`:

```typescript
import type { Data } from '@/types'
import { EditableText } from './editable-text'
import { SectionHeader } from './section-header'

interface QuoteProps {
  quote: string
  onUpdate: (patch: Partial<Data>) => void
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
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/components/morning-card/
git commit -m "refactor: standardize onUpdate prop naming across components"
```

---

## Phase 4: Type Cleanup

### Task 4.1: Rename Data to AppState

**Files:**
- Modify: `src/types/index.ts`
- Modify: All files importing `Data`

**Step 1: Update types file**

```typescript
export type Task = {
  id: number
  text: string
  completed: boolean
}

export type ScheduleItem = {
  id: number
  time: string
  title: string
  type: 'meeting' | 'focus' | 'break'
}

export type QuickLink = {
  id: number
  title: string
  url: string
}

export interface AppState {
  tasks: Task[]
  schedule: ScheduleItem[]
  quickLinks: QuickLink[]
  weekFocus: string
  monthFocus: string
  quarterFocus: string
  quote: string
}

/** @deprecated Use AppState instead */
export type Data = AppState
```

**Step 2: Update imports across codebase**

Run: `grep -rl "type { Data" src/ | xargs sed -i '' 's/Data/AppState/g'`

Or manually update each file to use `AppState`.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor(types): rename Data to AppState"
```

---

## Phase 5: Final Cleanup

### Task 5.1: Update components.json

**Files:**
- Modify: `components.json`

**Step 1: Remove UI-related paths since components are deleted**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

**Step 2: Commit**

```bash
git add components.json
git commit -m "chore: update components.json after UI removal"
```

---

### Task 5.2: Final Build Verification

**Step 1: Clean and rebuild**

```bash
rm -rf dist node_modules/.vite
npm run build
```

Expected: Build succeeds with no errors

**Step 2: Run dev server and test manually**

```bash
npm run dev
```

Expected: App loads, all CRUD operations work

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "chore: final cleanup after architecture refactor"
```

---

## Summary

| Phase | Tasks | LOC Impact |
|-------|-------|------------|
| 1. Remove Zombie Code | 1.1 | −2500 |
| 2. Extract Utilities | 2.1, 2.2, 2.3 | +80 |
| 3. Refactor Components | 3.1, 3.2, 3.3, 3.4 | −60 |
| 4. Type Cleanup | 4.1 | 0 |
| 5. Final Cleanup | 5.1, 5.2 | 0 |

**Net result:** ~2480 lines removed, cleaner architecture with shared hooks.
