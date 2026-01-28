import { createFileRoute } from '@tanstack/react-router'
import { AddCreditCardForm } from '../../features/credit-cards/components/AddCreditCardForm'

export const Route = createFileRoute('/cards/new')({
  component: AddCreditCardPage,
})

function AddCreditCardPage() {
  return (
    <div className='p-4 flex justify-center items-center h-full'>
      <AddCreditCardForm />
    </div>
  )
}
