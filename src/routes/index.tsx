import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { ArrowUpIcon, LogOut, Settings, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { getSessionFn } from '@/features/auth/functions'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session.success || !session.user) {
      throw redirect({ to: '/login' })
    }
  },
  component: App,
})

function App() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold'>{t('app.title')}</h1>
          {user && (
            <p className='text-muted-foreground text-sm mt-1'>
              {user.firstName} {user.lastName}
            </p>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <Link to='/settings'>
            <Settings className='h-6 w-6 text-muted-foreground hover:text-foreground transition-colors' />
          </Link>
          <Button variant='ghost' size='icon' onClick={handleLogout} title={t('auth.logout')}>
            <LogOut className='h-5 w-5 text-muted-foreground hover:text-foreground' />
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Link to='/accounts' className='block hover:no-underline'>
          <Card className='h-full hover:bg-slate-50 transition-colors'>
            <CardHeader>
              <CardTitle>{t('dashboard.viewAccounts')}</CardTitle>
              <CardDescription>{t('dashboard.viewAccountsDesc')}</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to='/cards' className='block hover:no-underline'>
          <Card className='h-full hover:bg-slate-50 transition-colors'>
            <CardHeader>
              <CardTitle>{t('dashboard.viewCreditCards')}</CardTitle>
              <CardDescription>{t('dashboard.viewCreditCardsDesc')}</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to='/bills/new' className='block hover:no-underline'>
          <Card className='h-full hover:bg-slate-50 transition-colors border-dashed border-2'>
            <CardHeader>
              <CardTitle>{t('dashboard.addBill')}</CardTitle>
              <CardDescription>{t('dashboard.addBillDesc')}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link to='/categories' className='block hover:no-underline'>
          <Card className='h-full hover:bg-slate-50 transition-colors'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Tag size={16} />
                {t('dashboard.manageCategories')}
              </CardTitle>
              <CardDescription>{t('dashboard.manageCategoriesDesc')}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6'>{t('dashboard.quickActions')}</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Link to='/transactions/new' className='block hover:no-underline'>
            <Card className='bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg'>
              <CardHeader className='flex flex-row items-center space-x-4'>
                <div className='bg-white/20 p-3 rounded-full'>
                  <ArrowUpIcon className='rotate-45' />
                </div>
                <div>
                  <CardTitle>{t('dashboard.newTransaction')}</CardTitle>
                  <CardDescription className='text-primary-foreground/80'>
                    {t('dashboard.newTransactionDesc')}
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
