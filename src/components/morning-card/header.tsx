import { RU_WEEKDAYS, RU_MONTHS } from '@/constants'

export function Header() {
  const now = new Date()

  return (
    <header className="mb-8">
      <h1 className="text-5xl md:text-6xl font-light tracking-tight">
        {RU_WEEKDAYS[now.getDay()]}
      </h1>
      <p className="text-xl text-muted-foreground font-light mt-2">
        {now.getDate()} {RU_MONTHS[now.getMonth()]} {now.getFullYear()}
      </p>
    </header>
  )
}
