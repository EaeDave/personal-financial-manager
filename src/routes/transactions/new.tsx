import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { AddTransactionForm } from '@/features/transactions/components/AddTransactionForm'
import { BackButton } from '@/components/ui/back-button'

export const Route = createFileRoute('/transactions/new')({
  component: NewTransactionPage,
})

function NewTransactionPage() {
  const { t } = useTranslation()
  return (
    <div className='container mx-auto py-8 px-4'>
      <BackButton to='/' label={t('dashboard.dashboard')} />
      <Suspense fallback={<div className='flex items-center justify-center min-h-[400px]'>{t('common.loading')}</div>}>
        <AddTransactionForm />
      </Suspense>
    </div>
  )
}
