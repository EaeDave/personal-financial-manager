import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Financial Manager</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
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
          <Card className='h-full hover:bg-slate-50 transition-colors'>
            <CardHeader>
              <CardTitle>Add Bill</CardTitle>
              <CardDescription>Track a recurring or one-time bill.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
