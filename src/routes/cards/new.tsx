import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AddCreditCardForm } from '../../features/credit-cards/components/AddCreditCardForm'
import { BackButton } from '@/components/ui/back-button'

export const Route = createFileRoute('/cards/new')({
  component: AddCreditCardPage,
})

function AddCreditCardPage() {
  const { t } = useTranslation()
  return (
    <div className='container mx-auto py-8 px-4'>
      <BackButton to='/' label={t('dashboard.dashboard')} />
      <div className='flex justify-center'>
        <AddCreditCardForm />
      </div>
    </div>
  )
}
