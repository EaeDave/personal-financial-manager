import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpIcon } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Financial Manager</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Link to='/accounts' className='block hover:no-underline'>
          <Card className='h-full hover:bg-slate-50 transition-colors'>
            <CardHeader>
              <CardTitle>View Accounts</CardTitle>
              <CardDescription>See all your accounts and balances.</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to='/accounts/new' className='block hover:no-underline'>
          <Card className='h-full hover:bg-slate-50 transition-colors'>
            <CardHeader>
              <CardTitle>Add Account</CardTitle>
              <CardDescription>Register a new bank account or wallet.</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to='/cards/new' className='block hover:no-underline'>
          <Card className='h-full hover:bg-slate-50 transition-colors'>
            <CardHeader>
              <CardTitle>Add Credit Card</CardTitle>
              <CardDescription>Register a new credit card.</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to='/bills/new' className='block hover:no-underline'>
          <Card className='h-full hover:bg-slate-50 transition-colors border-dashed border-2'>
            <CardHeader>
              <CardTitle>Add Bill</CardTitle>
              <CardDescription>Track a recurring or one-time bill.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Link to='/transactions/new' className='block hover:no-underline'>
            <Card className='bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg'>
              <CardHeader className='flex flex-row items-center space-x-4'>
                <div className='bg-white/20 p-3 rounded-full'>
                  <ArrowUpIcon className='rotate-45' />
                </div>
                <div>
                  <CardTitle>New Transaction</CardTitle>
                  <CardDescription className='text-primary-foreground/80'>
                    Add income or expense to an account.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
