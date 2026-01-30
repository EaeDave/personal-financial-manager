export interface CreateCategoryDTO {
  name: string
  color?: string
}

export interface UpdateCategoryDTO {
  id: string
  name: string
  color?: string
}

export interface Category extends CreateCategoryDTO {
  id: string
  createdAt: Date
  updatedAt: Date
}
