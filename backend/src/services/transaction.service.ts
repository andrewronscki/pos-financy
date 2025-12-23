import { prismaClient } from '../../prisma/prisma'
import { CreateTransactionInput, UpdateTransactionInput } from '../dtos/input/transaction.input'

export class TransactionService {
  async createTransaction(data: CreateTransactionInput, userId: string) {
    // Validar tipo de transação
    if (data.type !== 'debit' && data.type !== 'credit') {
      throw new Error('Tipo de transação deve ser "debit" ou "credit"')
    }

    // Verificar se a categoria existe e pertence ao usuário
    const category = await prismaClient.category.findFirst({
      where: {
        id: data.categoryId,
        userId: userId,
      },
    })

    if (!category) throw new Error('Categoria não encontrada')

    return prismaClient.transaction.create({
      data: {
        type: data.type,
        description: data.description,
        date: data.date,
        amount: data.amount,
        categoryId: data.categoryId,
        userId: userId,
      },
    })
  }

  async listTransactions(userId: string) {
    return prismaClient.transaction.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        date: 'desc',
      },
    })
  }

  async listTransactionsByCategory(categoryId: string, userId: string) {
    return prismaClient.transaction.findMany({
      where: {
        categoryId: categoryId,
        userId: userId,
      },
      orderBy: {
        date: 'desc',
      },
    })
  }

  async getTransactionById(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })
    if (!transaction) throw new Error('Transação não encontrada')
    return transaction
  }

  async updateTransaction(id: string, data: UpdateTransactionInput, userId: string) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })

    if (!transaction) throw new Error('Transação não encontrada')

    // Validar tipo de transação se estiver sendo atualizado
    if (data.type && data.type !== 'debit' && data.type !== 'credit') {
      throw new Error('Tipo de transação deve ser "debit" ou "credit"')
    }

    // Se estiver atualizando a categoria, verificar se ela existe e pertence ao usuário
    if (data.categoryId) {
      const category = await prismaClient.category.findFirst({
        where: {
          id: data.categoryId,
          userId: userId,
        },
      })

      if (!category) throw new Error('Categoria não encontrada')
    }

    return prismaClient.transaction.update({
      where: { id },
      data: {
        type: data.type ?? undefined,
        description: data.description ?? undefined,
        date: data.date ?? undefined,
        amount: data.amount ?? undefined,
        categoryId: data.categoryId ?? undefined,
      },
    })
  }

  async deleteTransaction(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    })

    if (!transaction) throw new Error('Transação não encontrada')

    await prismaClient.transaction.delete({
      where: { id },
    })

    return true
  }
}

