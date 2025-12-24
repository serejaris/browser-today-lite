export function isNonEmpty(value: string): boolean {
  return value.trim() !== ''
}

export function hasRequiredFields<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
): boolean {
  return keys.every((key) => {
    const value = obj[key]
    if (typeof value === 'string') return isNonEmpty(value)
    return value !== undefined && value !== null
  })
}
