import { createFileRoute } from '@tanstack/react-router'
import { CategoryManager } from '@/features/categories/components/CategoryManager'

export const Route = createFileRoute('/categories')({
  component: CategoriesPage,
})

function CategoriesPage() {
  return (
    <div className='p-8'>
      <CategoryManager />
    </div>
  )
}
