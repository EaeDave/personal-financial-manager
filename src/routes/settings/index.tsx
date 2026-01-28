import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/lib/settings-context'
import { BackButton } from '@/components/ui/back-button'

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { currency, setCurrency } = useSettings()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className='container mx-auto py-8 px-4 max-w-2xl'>
      <BackButton to='/' label={t('dashboard.dashboard')} />
      <h1 className='text-3xl font-bold mb-8'>{t('settings.title')}</h1>

      <div className='space-y-6'>
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.language')}</CardTitle>
          </CardHeader>
          <CardContent className='flex gap-4'>
            <Button
              variant={i18n.resolvedLanguage === 'en' ? 'default' : 'outline'}
              onClick={() => changeLanguage('en')}
              className='flex items-center gap-2'
            >
              {i18n.resolvedLanguage === 'en' && <Check size={16} />}
              {t('settings.english')}
            </Button>
            <Button
              variant={i18n.resolvedLanguage === 'pt' ? 'default' : 'outline'}
              onClick={() => changeLanguage('pt')}
              className='flex items-center gap-2'
            >
              {(i18n.resolvedLanguage === 'pt' || i18n.resolvedLanguage === 'pt-BR') && <Check size={16} />}
              {t('settings.portuguese')}
            </Button>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.currency')}</CardTitle>
          </CardHeader>
          <CardContent className='flex gap-4'>
            <Button
              variant={currency === 'USD' ? 'default' : 'outline'}
              onClick={() => setCurrency('USD')}
              className='flex items-center gap-2'
            >
              {currency === 'USD' && <Check size={16} />}
              USD ($)
            </Button>
            <Button
              variant={currency === 'BRL' ? 'default' : 'outline'}
              onClick={() => setCurrency('BRL')}
              className='flex items-center gap-2'
            >
              {currency === 'BRL' && <Check size={16} />}
              BRL (R$)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
