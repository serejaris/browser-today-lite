import { ThemeProvider } from '@/components/theme-provider'
import { MorningCard } from '@/components/morning-card'

export function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-background text-foreground flex items-start justify-center p-8">
        <MorningCard />
      </main>
    </ThemeProvider>
  )
}
