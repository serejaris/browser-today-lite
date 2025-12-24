import type { AppState, ScheduleItem } from '@/types'

export const RU_WEEKDAYS = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]

export const RU_MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

export const STORAGE_KEY = 'morning-card-data'

export const defaultData: AppState = {
  tasks: [],
  schedule: [],
  quickLinks: [],
  weekFocus: '',
  monthFocus: '',
  quarterFocus: '',
  quote: '',
}

export const SCHEDULE_STYLES: Record<ScheduleItem['type'], string> = {
  meeting: 'bg-primary/10 border-primary/20',
  focus: 'bg-card border-border',
  break: 'bg-muted/50 border-border',
}

export const INPUT_CLASS = 'px-2 py-1.5 text-sm border rounded-md bg-background focus:outline-none focus:border-primary'
export const BTN_CONFIRM = 'p-1.5 text-primary hover:bg-primary/10 rounded-md'
export const BTN_CANCEL = 'p-1.5 text-muted-foreground hover:bg-muted rounded-md'
export const BTN_DELETE = 'opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-all'
export const ADD_BTN = 'w-full p-4 rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm'
export const ADD_FORM = 'p-4 rounded-lg border-2 border-dashed border-primary bg-card'
