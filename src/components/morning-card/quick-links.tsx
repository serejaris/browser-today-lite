import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hasRequiredFields } from '@/lib/validation'
import { useItemManager } from '@/hooks/use-item-manager'
import type { QuickLink, AppState } from '@/types'
import { INPUT_CLASS } from '@/constants'
import { FormActions } from './form-actions'

interface QuickLinksProps {
  quickLinks: QuickLink[]
  onUpdate: (patch: Partial<AppState>) => void
}

export function QuickLinks({ quickLinks, onUpdate }: QuickLinksProps) {
  const {
    isAdding,
    draft,
    setDraft,
    add,
    remove,
    startAdding,
    cancelAdding,
  } = useItemManager<QuickLink>({
    items: quickLinks,
    onUpdate: (items) => onUpdate({ quickLinks: items }),
    createEmpty: () => ({ title: '', url: '' }),
  })

  const handleAdd = () => {
    if (!hasRequiredFields(draft, ['title', 'url'])) return
    add()
  }

  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-2 items-center">
        {quickLinks.map((link) => (
          <div key={link.id} className="group relative">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border bg-card text-sm font-medium transition-all flex items-center gap-2 hover:border-primary hover:shadow-sm"
            >
              {link.title}
            </a>
            <button
              onClick={() => remove(link.id)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {isAdding ? (
          <div className="flex items-center gap-2 p-2 rounded-lg border-2 border-dashed border-primary bg-card">
            <input
              type="text"
              placeholder="Название"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className={cn(INPUT_CLASS, 'w-24')}
            />
            <input
              type="url"
              placeholder="URL"
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              className={cn(INPUT_CLASS, 'w-40')}
            />
            <FormActions onConfirm={handleAdd} onCancel={cancelAdding} />
          </div>
        ) : (
          <button
            onClick={startAdding}
            className="px-4 py-2 rounded-lg border-2 border-dashed text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  )
}
