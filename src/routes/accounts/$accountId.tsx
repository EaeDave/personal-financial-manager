import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAccountsFn } from '@/features/accounts/functions'
import { getTransactionsByAccountFn } from '@/features/transactions/functions'

export const Route = createFileRoute('/accounts/$accountId')({
  component: AccountDetailPage,
})

function AccountDetailPage() {
  const { accountId } = Route.useParams()

  return (
    <div className='p-8 max-w-4xl mx-auto space-y-8'>
      <Suspense fallback={<div>Loading account details...</div>}>
        <AccountDetails accountId={accountId} />
      </Suspense>

      <Suspense fallback={<div>Loading transactions...</div>}>
        <TransactionHistory accountId={accountId} />
      </Suspense>
    </div>
  )
}

function AccountDetails({ accountId }: { accountId: string }) {
  const { data: accounts } = useSuspenseQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccountsFn(),
  })

  const account = accounts.find((a) => a.id === accountId)

  if (!account) return <div>Account not found.</div>

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Card className='border-2'>
      <CardHeader>
        <CardDescription>{account.type.toUpperCase()}</CardDescription>
        <CardTitle className='text-3xl font-bold'>{account.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-4xl font-bold tabular-nums'>{formatCurrency(account.balance)}</div>
      </CardContent>
    </Card>
  )
}

function TransactionHistory({ accountId }: { accountId: string }) {
  const { data: transactions } = useSuspenseQuery({
    queryKey: ['transactions', accountId],
    queryFn: () => getTransactionsByAccountFn({ data: { accountId } }),
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>No transactions found for this account.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Transaction History</h2>
      <div className='space-y-2'>
        {transactions.map((tx) => (
          <Card key={tx.id}>
            <CardContent className='p-4 flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div
                  className={`p-2 rounded-full ${tx.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                >
                  {tx.type === 'INCOME' ? <ArrowUpIcon size={20} /> : <ArrowDownIcon size={20} />}
                </div>
                <div>
                  <div className='font-semibold'>{tx.description}</div>
                  <div className='text-sm text-muted-foreground'>{formatDate(tx.date)}</div>
                </div>
              </div>
              <div
                className={`text-lg font-bold tabular-nums ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}
              >
                {tx.type === 'INCOME' ? '+' : '-'}
                {formatCurrency(tx.amount)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
