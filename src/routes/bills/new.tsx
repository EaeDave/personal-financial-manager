import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AddBillForm } from '../../features/bills/components/AddBillForm'
import { BackButton } from '@/components/ui/back-button'

export const Route = createFileRoute('/bills/new')({
  component: AddBillPage,
})

function AddBillPage() {
  const { t } = useTranslation()
  return (
    <div className='container mx-auto py-8 px-4'>
      <BackButton to='/' label={t('dashboard.dashboard')} />
      <div className='flex justify-center'>
        <AddBillForm />
      </div>
    </div>
  )
}
