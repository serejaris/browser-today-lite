import { useState, useEffect } from 'react'
import type { AppState } from '@/types'
import { defaultData, STORAGE_KEY } from '@/constants'

export function useLocalStorage(): [AppState, (data: AppState) => void, boolean] {
  const [data, setData] = useState<AppState>(defaultData)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setData(JSON.parse(stored))
      } catch {
        setData(defaultData)
      }
    }
    setIsLoaded(true)
  }, [])

  const saveData = (newData: AppState) => {
    setData(newData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  }

  return [data, saveData, isLoaded]
}
