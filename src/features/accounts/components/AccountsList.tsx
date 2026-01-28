import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAccountsFn } from '../functions'
import type { Account } from '../types'

export function AccountsList() {
  const { data: accounts } = useSuspenseQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccountsFn(),
  })

  const totalBalance = accounts.reduce((sum: number, acc: Account) => sum + acc.balance, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatAccountType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (accounts.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
        <div className='text-center space-y-2'>
          <h2 className='text-2xl font-semibold tracking-tight'>No accounts yet</h2>
          <p className='text-muted-foreground'>Get started by creating your first account.</p>
        </div>
        <Link to='/accounts/new'>
          <Button>Add Account</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Total Balance Card */}
      <Card className='border-2'>
        <CardHeader>
          <CardDescription>Total Balance</CardDescription>
          <CardTitle className='text-4xl font-bold tabular-nums'>{formatCurrency(totalBalance)}</CardTitle>
        </CardHeader>
      </Card>

      {/* Accounts List */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-semibold tracking-tight'>Accounts</h2>
          <Link to='/accounts/new'>
            <Button variant='outline'>Add Account</Button>
          </Link>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {accounts.map((account: Account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>{account.name}</CardTitle>
                    <CardDescription>{formatAccountType(account.type)}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='text-2xl font-bold tabular-nums'>{formatCurrency(account.balance)}</div>
                  <div className='text-xs text-muted-foreground'>Created {formatDate(account.createdAt)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
