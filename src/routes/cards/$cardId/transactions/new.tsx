import { Link, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddCreditCardTransactionForm } from '@/features/credit-cards/components/AddCreditCardTransactionForm'

export const Route = createFileRoute('/cards/$cardId/transactions/new')({
  component: NewCreditCardTransactionPage,
})

function NewCreditCardTransactionPage() {
  const { t } = useTranslation()
  const { cardId } = Route.useParams()

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='mb-6'>
        <Link to='/cards/$cardId' params={{ cardId }}>
          <Button variant='ghost' size='sm' className='gap-2 pl-2'>
            <ArrowLeft size={16} />
            {t('common.back')}
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-muted-foreground'>{t('common.loading')}</div>
          </div>
        }
      >
        <AddCreditCardTransactionForm cardId={cardId} />
      </Suspense>
    </div>
  )
}
