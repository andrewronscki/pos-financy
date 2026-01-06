export interface User {
  id: string
  name: string
  email: string
  role?: string
  createdAt?: string
  updatedAt?: string
}


export interface RegisterInput {
  name: string
  email: string
  password: string
}


export interface LoginInput {
  email: string
  password: string
}

export interface UpdateUserInput {
  name?: string
}

export interface Idea {
  id: string
  title: string
  description?: string | null
  authorId: string
  author?: User
  countVotes?: number
  comments?: Comment[]
  votes?: Vote[]
  createdAt: string
  updatedAt?: string
}

export interface Comment {
  id: string
  ideaId: string
  authorId: string
  author?: User
  content: string
  createdAt: string
  updatedAt?: string
}

export interface Vote {
  id: string
  ideaId: string
  userId: string
  createdAt: string
}

// Financial types
export interface Transaction {
  id: string
  categoryId: string
  userId: string
  date: string
  type: "credit" | "debit"
  description: string
  amount: number
  category?: Category
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  title: string
  description?: string
  icon: string
  color: string
  userId?: string
  itemCount?: number
  totalAmount?: number
  createdAt?: string
  updatedAt?: string
}

export type TransactionType = "credit" | "debit"

// GraphQL Input Types
export interface CreateCategoryInput {
  title: string
  description?: string
  icon: string
  color: string
}

export interface UpdateCategoryInput {
  title?: string
  description?: string
  icon?: string
  color?: string
}

export interface CreateTransactionInput {
  categoryId: string
  description: string
  date: string
  type: "credit" | "debit"
  amount: number
}

export interface UpdateTransactionInput {
  categoryId?: string
  description?: string
  date?: string
  type?: "credit" | "debit"
  amount?: number
}

