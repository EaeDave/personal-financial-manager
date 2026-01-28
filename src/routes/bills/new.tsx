import { createFileRoute } from '@tanstack/react-router'
import { AddBillForm } from '../../features/bills/components/AddBillForm'

export const Route = createFileRoute('/bills/new')({
  component: AddBillPage,
})

function AddBillPage() {
  return (
    <div className='p-4 flex justify-center items-center h-full'>
      <AddBillForm />
    </div>
  )
}
