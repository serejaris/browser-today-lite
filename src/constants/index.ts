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
  tasks: [
    { id: 1, text: 'Завершить презентацию проекта', completed: false },
    { id: 2, text: 'Созвон с командой в 14:00', completed: false },
    { id: 3, text: 'Отправить отчёт за неделю', completed: false },
  ],
  schedule: [
    { id: 1, time: '09:00', title: 'Планирование дня', type: 'focus' },
    { id: 2, time: '10:30', title: 'Статус-митинг', type: 'meeting' },
    { id: 3, time: '12:00', title: 'Работа над проектом', type: 'focus' },
    { id: 4, time: '14:00', title: 'Созвон с командой', type: 'meeting' },
    { id: 5, time: '16:00', title: 'Перерыв', type: 'break' },
    { id: 6, time: '17:00', title: 'Ревью задач', type: 'focus' },
  ],
  quickLinks: [
    { id: 1, title: 'Gmail', url: 'https://mail.google.com' },
    { id: 2, title: 'Calendar', url: 'https://calendar.google.com' },
    { id: 3, title: 'Notion', url: 'https://notion.so' },
    { id: 4, title: 'Slack', url: 'https://slack.com' },
    { id: 5, title: 'GitHub', url: 'https://github.com' },
    { id: 6, title: 'Figma', url: 'https://figma.com' },
  ],
  weekFocus: 'Запуск нового продукта. Фокус на качестве и деталях.',
  monthFocus: 'Закрыть квартальные OKR. Подготовить демо для инвесторов.',
  quarterFocus: 'Масштабирование продукта на 3 новых рынка.',
  quote: 'Делай сегодня то, что другие не хотят — завтра будешь жить так, как другие не могут.',
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
