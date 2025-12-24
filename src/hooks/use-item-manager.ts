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
