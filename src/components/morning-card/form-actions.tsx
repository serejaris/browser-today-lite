import { Check, X } from 'lucide-react'
import { BTN_CONFIRM, BTN_CANCEL } from '@/constants'

interface FormActionsProps {
  onConfirm: () => void
  onCancel: () => void
}

export function FormActions({ onConfirm, onCancel }: FormActionsProps) {
  return (
    <>
      <button onClick={onConfirm} className={BTN_CONFIRM}>
        <Check className="w-4 h-4" />
      </button>
      <button onClick={onCancel} className={BTN_CANCEL}>
        <X className="w-4 h-4" />
      </button>
    </>
  )
}
