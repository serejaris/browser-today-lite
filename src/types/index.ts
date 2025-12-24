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

export interface Data {
  tasks: Task[]
  schedule: ScheduleItem[]
  quickLinks: QuickLink[]
  weekFocus: string
  monthFocus: string
  quarterFocus: string
  quote: string
}
