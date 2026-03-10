import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginFn, registerFn } from '@/features/auth/functions'
import { useAuth } from '@/lib/auth-context'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { refreshSession } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const resetForm = () => {
    setError(null)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFirstName('')
    setLastName('')
  }

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'))
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError(t('auth.errors.passwordMismatch'))
          setIsLoading(false)
          return
        }

        if (password.length < 6) {
          setError(t('auth.errors.passwordTooShort'))
          setIsLoading(false)
          return
        }

        const response = await registerFn({
          data: {
            firstName,
            lastName,
            email,
            password,
          },
        })

        if (!response.success) {
          setError(t(`auth.errors.${response.error}`))
          setIsLoading(false)
          return
        }
      } else {
        const response = await loginFn({
          data: { email, password },
        })

        if (!response.success) {
          setError(t(`auth.errors.${response.error}`))
          setIsLoading(false)
          return
        }
      }

      await refreshSession()
      navigate({ to: '/' })
    } catch {
      setError(t('auth.errors.unexpected'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/40 p-4'>
      {/* Decorative background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl' />
      </div>

      <div className='w-full max-w-md relative z-10'>
        {/* Logo / App Title */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg'>
            <Lock className='w-8 h-8' />
          </div>
          <h1 className='text-2xl font-bold tracking-tight'>{t('app.title')}</h1>
          <p className='text-muted-foreground mt-1'>
            {mode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
          </p>
        </div>

        <Card className='shadow-xl border-border/50 backdrop-blur-sm'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-xl'>{mode === 'login' ? t('auth.login') : t('auth.register')}</CardTitle>
            <CardDescription>{mode === 'login' ? t('auth.loginDesc') : t('auth.registerDesc')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Registration-only fields */}
              {mode === 'register' && (
                <div className='space-y-4 animate-in fade-in slide-in-from-top-2 duration-300'>
                  {/* First + Last Name */}
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='space-y-2'>
                      <Label htmlFor='firstName'>{t('auth.fields.firstName')}</Label>
                      <div className='relative'>
                        <User className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                          id='firstName'
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder={t('auth.placeholders.firstName')}
                          className='pl-9'
                          required
                        />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='lastName'>{t('auth.fields.lastName')}</Label>
                      <Input
                        id='lastName'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t('auth.placeholders.lastName')}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className='space-y-2'>
                <Label htmlFor='email'>{t('auth.fields.email')}</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.placeholders.email')}
                    className='pl-9'
                    autoComplete='email'
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className='space-y-2'>
                <Label htmlFor='password'>{t('auth.fields.password')}</Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.placeholders.password')}
                    className='pl-9 pr-10'
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (register only) */}
              {mode === 'register' && (
                <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-300'>
                  <Label htmlFor='confirmPassword'>{t('auth.fields.confirmPassword')}</Label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    <Input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.placeholders.confirmPassword')}
                      className='pl-9 pr-10'
                      autoComplete='new-password'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className='p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-200'>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button type='submit' className='w-full h-11 text-base font-semibold' disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  <span className='flex items-center gap-2'>
                    {mode === 'login' ? t('auth.loginButton') : t('auth.registerButton')}
                    <ArrowRight className='h-4 w-4' />
                  </span>
                )}
              </Button>
            </form>

            {/* Toggle Login/Register */}
            <div className='mt-6 pt-4 border-t text-center'>
              <p className='text-sm text-muted-foreground'>
                {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                <button
                  onClick={toggleMode}
                  className='text-primary font-semibold hover:underline transition-all'
                  type='button'
                >
                  {mode === 'login' ? t('auth.createAccount') : t('auth.signIn')}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
