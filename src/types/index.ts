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
