import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { BackButton } from '@/components/ui/back-button'
import { CreditCardDetail } from '@/features/credit-cards/components/CreditCardDetail'

export const Route = createFileRoute('/cards/$cardId/')({
  component: CreditCardDetailPage,
})

function CreditCardDetailPage() {
  const { t } = useTranslation()
  const { cardId } = Route.useParams()

  return (
    <div className='container mx-auto py-8 px-4'>
      <BackButton to='/cards' label={t('cards.title')} />
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-muted-foreground'>{t('common.loading')}</div>
          </div>
        }
      >
        <CreditCardDetail cardId={cardId} />
      </Suspense>
    </div>
  )
}
