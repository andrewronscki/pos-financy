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
  description: string
  date: string
  category: Category
  type: "income" | "expense"
  value: number
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  title: string
  description?: string
  icon: string
  color: string
  itemCount?: number
  totalAmount?: number
  createdAt?: string
  updatedAt?: string
}

export type TransactionType = "income" | "expense"

