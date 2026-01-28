import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { AccountsList } from '@/features/accounts/components/AccountsList'

export const Route = createFileRoute('/accounts/')({
  component: AccountsPage,
})

function AccountsPage() {
  return (
    <div className='container mx-auto py-8 px-4'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-muted-foreground'>Loading accounts...</div>
          </div>
        }
      >
        <AccountsList />
      </Suspense>
    </div>
  )
}
