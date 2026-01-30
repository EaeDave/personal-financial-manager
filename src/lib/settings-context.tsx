import { createContext, useContext, useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

type Currency = 'USD' | 'BRL'
export type Theme = 'dark' | 'light' | 'system'

interface SettingsContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (amount: number) => string
  language: string
  theme: Theme
  setTheme: (theme: Theme) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currency') as Currency | null
      if (saved) return saved
      if (navigator.language.startsWith('pt')) return 'BRL'
    }
    return 'USD'
  })

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme | null
      if (saved) return saved
    }
    return 'system'
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  // Save to local storage on change
  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  return (
    <SettingsContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        formatCurrency,
        language: i18n.language,
        theme,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
