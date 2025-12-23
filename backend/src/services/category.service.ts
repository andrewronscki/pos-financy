import { prismaClient } from '../../prisma/prisma'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'

export class CategoryService {
  async createCategory(data: CreateCategoryInput, userId: string) {
    return prismaClient.category.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        userId: userId,
      },
    })
  }

  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }

  async getCategoryById(id: string, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })
    if (!category) throw new Error('Categoria não encontrada')
    return category
  }

  async updateCategory(id: string, data: UpdateCategoryInput, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })

    if (!category) throw new Error('Categoria não encontrada')

    return prismaClient.category.update({
      where: { id },
      data: {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        icon: data.icon ?? undefined,
        color: data.color ?? undefined,
      },
    })
  }

  async deleteCategory(id: string, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        Transaction: true,
      },
    })

    if (!category) throw new Error('Categoria não encontrada')

    if (category.Transaction.length > 0) {
      throw new Error('Não é possível deletar uma categoria que possui transações vinculadas')
    }

    await prismaClient.category.delete({
      where: { id },
    })

    return true
  }
}

