import type { AppState } from '@/types'
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

  const update = (patch: Partial<AppState>) => saveData({ ...data, ...patch })

  return (
    <div className="w-full max-w-7xl">
      <QuickLinks quickLinks={data.quickLinks} onUpdate={update} />
      <Header />

      <div className="grid lg:grid-cols-3 gap-8">
        <TaskList tasks={data.tasks} onUpdate={update} />
        <Schedule schedule={data.schedule} onUpdate={update} />

        <section className="space-y-4">
          <FocusSection
            weekFocus={data.weekFocus}
            monthFocus={data.monthFocus}
            quarterFocus={data.quarterFocus}
            onUpdate={update}
          />
          <Quote quote={data.quote} onUpdate={update} />
        </section>
      </div>
    </div>
  )
}
