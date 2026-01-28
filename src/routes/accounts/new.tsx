import { createFileRoute } from '@tanstack/react-router'
import { AddAccountForm } from '../../features/accounts/components/AddAccountForm'

export const Route = createFileRoute('/accounts/new')({
  component: AddAccountPage,
})

function AddAccountPage() {
  return (
    <div className='p-4 flex justify-center items-center h-full'>
      <AddAccountForm />
    </div>
  )
}
