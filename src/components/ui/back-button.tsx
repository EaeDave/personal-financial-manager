import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  to: string
  label?: string
}

export function BackButton({ to, label = 'Back' }: BackButtonProps) {
  return (
    <div className='mb-6'>
      <Link to={to}>
        <Button variant='ghost' size='sm' className='gap-2 pl-2'>
          <ArrowLeft size={16} />
          {label}
        </Button>
      </Link>
    </div>
  )
}
