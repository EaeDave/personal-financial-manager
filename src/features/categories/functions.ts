import { createServerFn } from '@tanstack/react-start'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from './types'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const createCategoryFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const userId = await requireAuth()
  const payload = data as CreateCategoryDTO

  const category = await prisma.category.create({
    data: {
      name: payload.name,
      color: payload.color,
      userId,
    },
  })

  return category as Category
})

export const getCategoriesFn = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await requireAuth()

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  })

  return categories as Array<Category>
})

export const updateCategoryFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const userId = await requireAuth()
  const payload = data as UpdateCategoryDTO

  const category = await prisma.category.update({
    where: { id: payload.id, userId },
    data: {
      name: payload.name,
      color: payload.color,
    },
  })

  return category as Category
})

export const deleteCategoryFn = createServerFn({ method: 'POST' }).handler(async ({ data }: { data: any }) => {
  const userId = await requireAuth()
  const { id } = data as { id: string }

  await prisma.category.delete({
    where: { id, userId },
  })

  return { success: true }
})
