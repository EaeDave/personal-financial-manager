import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AddAccountForm } from '../../features/accounts/components/AddAccountForm'
import { BackButton } from '@/components/ui/back-button'

export const Route = createFileRoute('/accounts/new')({
  component: AddAccountPage,
})

function AddAccountPage() {
  const { t } = useTranslation()
  return (
    <div className='container mx-auto py-8 px-4'>
      <BackButton to='/accounts' label={t('accounts.title')} />
      <div className='flex justify-center'>
        <AddAccountForm />
      </div>
    </div>
  )
}
