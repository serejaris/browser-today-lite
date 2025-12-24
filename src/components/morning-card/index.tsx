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

  const update = (patch: Partial<Data>) => saveData({ ...data, ...patch })

  return (
    <div className="w-full max-w-7xl">
      <QuickLinks quickLinks={data.quickLinks} update={update} />
      <Header />

      <div className="grid lg:grid-cols-3 gap-8">
        <TaskList tasks={data.tasks} update={update} />
        <Schedule schedule={data.schedule} update={update} />

        <section className="space-y-4">
          <FocusSection
            weekFocus={data.weekFocus}
            monthFocus={data.monthFocus}
            quarterFocus={data.quarterFocus}
            update={update}
          />
          <Quote quote={data.quote} update={update} />
        </section>
      </div>
    </div>
  )
}
