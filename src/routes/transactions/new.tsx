import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { AddTransactionForm } from '@/features/transactions/components/AddTransactionForm'

export const Route = createFileRoute('/transactions/new')({
  component: NewTransactionPage,
})

function NewTransactionPage() {
  return (
    <div className='container mx-auto py-8 px-4'>
      <Suspense fallback={<div className='flex items-center justify-center min-h-[400px]'>Loading form...</div>}>
        <AddTransactionForm />
      </Suspense>
    </div>
  )
}
