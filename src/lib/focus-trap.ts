const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS))
}

export function createFocusTrap(
  container: HTMLElement,
  onDeactivate?: () => void
): { activate: () => void; deactivate: () => void } {
  let previouslyFocused: HTMLElement | null = null

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onDeactivate?.()
      return
    }

    if (e.key !== 'Tab') return

    const focusable = getFocusableElements(container)
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  return {
    activate() {
      previouslyFocused = document.activeElement as HTMLElement | null
      const focusable = getFocusableElements(container)
      focusable[0]?.focus()
      document.addEventListener('keydown', handleKeyDown)
    },
    deactivate() {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
      previouslyFocused = null
    },
  }
}
