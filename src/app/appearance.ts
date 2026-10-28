export type Theme = 'light' | 'dark'

const themeKey = 'ai-school-reading-theme'

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

export function savedTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = localStorage.getItem(themeKey)
    return isTheme(saved) ? saved : 'light'
  } catch {
    return 'light'
  }
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : ''
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#10191D' : '#172A33')
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(themeKey, theme)
  } catch {
    // La lectura sigue funcionando aunque el navegador no permita guardar la preferencia.
  }
}
