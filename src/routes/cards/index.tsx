import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { BackButton } from '@/components/ui/back-button'
import { CreditCardsList } from '@/features/credit-cards/components/CreditCardsList'

export const Route = createFileRoute('/cards/')({
  component: CreditCardsPage,
})

function CreditCardsPage() {
  const { t } = useTranslation()
  return (
    <div className='container mx-auto py-8 px-4'>
      <BackButton to='/' label={t('dashboard.dashboard')} />
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-muted-foreground'>{t('common.loading')}</div>
          </div>
        }
      >
        <CreditCardsList />
      </Suspense>
    </div>
  )
}
