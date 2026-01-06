import { useState, useMemo } from "react"
import { useQuery } from "@apollo/client/react"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  ChevronRight,
  CircleArrowUp,
  CircleArrowDown,
} from "lucide-react"
import { Transaction, Category } from "@/types"
import { CreateTransactionDialog } from "./components/CreateTransactionDialog"
import { CategoryIcon } from "@/lib/category-icons"
import {
  getCategoryBaseColor,
  getCategoryLightBg,
} from "@/lib/category-colors"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transactions"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories"

type TransactionsQueryData = {
  listTransactions: Transaction[]
}

type CategoriesQueryData = {
  listCategories: Category[]
}

export function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data: transactionsData, loading: transactionsLoading, refetch: refetchTransactions } = useQuery<TransactionsQueryData>(LIST_TRANSACTIONS)
  const { data: categoriesData, loading: categoriesLoading } = useQuery<CategoriesQueryData>(LIST_CATEGORIES)

  const transactionsWithCategories = useMemo(() => {
    if (!transactionsData?.listTransactions || !categoriesData?.listCategories) {
      return []
    }

    return transactionsData.listTransactions.map((transaction) => {
      const category = categoriesData.listCategories.find((cat) => cat.id === transaction.categoryId)
      return {
        ...transaction,
        category: category || { id: transaction.categoryId, title: "Sem categoria", icon: "tag", color: "gray" },
      }
    })
  }, [transactionsData, categoriesData])

  const categoriesWithStats = useMemo(() => {
    if (!categoriesData?.listCategories || !transactionsData?.listTransactions) {
      return []
    }

    return categoriesData.listCategories.map((category) => {
      const categoryTransactions = transactionsData.listTransactions.filter(
        (t) => t.categoryId === category.id
      )
      return {
        ...category,
        itemCount: categoryTransactions.length,
        totalAmount: categoryTransactions.reduce((sum, t) => sum + t.amount, 0),
      }
    })
  }, [categoriesData, transactionsData])

  const totalBalance = useMemo(() => {
    if (!transactionsData?.listTransactions) return 0
    return transactionsData.listTransactions.reduce((sum, t) => {
      return t.type === "credit" ? sum + t.amount : sum - t.amount
    }, 0)
  }, [transactionsData])

  const monthlyIncome = useMemo(() => {
    if (!transactionsData?.listTransactions) return 0
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const incomeTransactions = transactionsData.listTransactions.filter((t) => {
      // Verificar se é uma transação de crédito (receita)
      if (t.type !== "credit") return false
      
      // Parsear a data da transação
      const transactionDate = new Date(t.date)
      
      // Verificar se a data é válida
      if (isNaN(transactionDate.getTime())) {
        console.warn("Data inválida na transação:", t)
        return false
      }
      
      // Comparar mês e ano (usando métodos locais)
      const transactionMonth = transactionDate.getMonth()
      const transactionYear = transactionDate.getFullYear()
      
      const isCurrentMonth = (
        transactionMonth === currentMonth &&
        transactionYear === currentYear
      )
      
      // Debug temporário - remover depois
      if (t.description?.includes("Salário")) {
        console.log("Debug Salário:", {
          description: t.description,
          date: t.date,
          parsedDate: transactionDate.toISOString(),
          transactionMonth,
          transactionYear,
          currentMonth,
          currentYear,
          isCurrentMonth,
          amount: t.amount
        })
      }
      
      return isCurrentMonth
    })
    
    const total = incomeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    
    return total
  }, [transactionsData])

  const monthlyExpenses = useMemo(() => {
    if (!transactionsData?.listTransactions) return 0
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return transactionsData.listTransactions
      .filter((t) => {
        // Verificar se é uma transação de débito (despesa)
        if (t.type !== "debit") return false
        
        // Parsear a data da transação
        const transactionDate = new Date(t.date)
        
        // Verificar se a data é válida
        if (isNaN(transactionDate.getTime())) {
          console.warn("Data inválida na transação:", t)
          return false
        }
        
        // Comparar mês e ano (usando métodos locais)
        const transactionMonth = transactionDate.getMonth()
        const transactionYear = transactionDate.getFullYear()
        
        return (
          transactionMonth === currentMonth &&
          transactionYear === currentYear
        )
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }, [transactionsData])

  const recentTransactions = useMemo(() => {
    return [...transactionsWithCategories]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  }, [transactionsWithCategories])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })
  }

  if (transactionsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Saldo Total */}
          <Card className="rounded-xl border border-gray-200">
            <CardContent className="py-6 px-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="h-5 w-5 text-purple-base" />
                <p className="text-xs font-medium text-gray-500">SALDO TOTAL</p>
              </div>
              <p className="text-[28px] font-bold text-gray-800">
                {formatCurrency(totalBalance)}
              </p>
            </CardContent>
          </Card>

          {/* Receitas do Mês */}
          <Card className="rounded-xl border border-gray-200">
            <CardContent className="py-6 px-6">
              <div className="flex items-center gap-3 mb-4">
                <ArrowUpCircle className="h-5 w-5 text-green-base" />
                <p className="text-xs font-medium text-gray-500">RECEITAS DO MÊS</p>
              </div>
              <p className="text-[28px] font-bold text-gray-800">
                {formatCurrency(monthlyIncome)}
              </p>
            </CardContent>
          </Card>

          {/* Despesas do Mês */}
          <Card className="rounded-xl border border-gray-200">
            <CardContent className="py-6 px-6">
              <div className="flex items-center gap-3 mb-4">
                <ArrowDownCircle className="h-5 w-5 text-red-base" />
                <p className="text-xs font-medium text-gray-500">DESPESAS DO MÊS</p>
              </div>
              <p className="text-[28px] font-bold text-gray-800">
                {formatCurrency(monthlyExpenses)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Transações Recentes */}
          <Card className="rounded-lg shadow-md lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-medium text-gray-500">
                  TRANSAÇÕES RECENTES
                </h2>
                <Link
                  to="/transactions"
                  className="text-sm font-medium text-brand-base hover:underline flex items-center gap-1"
                >
                  Ver todas <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="-mx-6">
                {/* Divisão superior */}
                <div className="border-t border-gray-200" />
                
                {recentTransactions.length === 0 ? (
                  <div className="py-8 text-center text-gray-600">
                    <p>Nenhuma transação encontrada</p>
                  </div>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id}>
                      <div className="flex items-center py-3 px-6">
                        {/* Ícone da categoria */}
                        <div className="flex-shrink-0 mr-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryLightBg(
                              transaction.category.color
                            )}`}
                          >
                            <CategoryIcon
                              iconName={transaction.category.icon}
                              className={`h-4 w-4 ${getCategoryBaseColor(
                                transaction.category.color
                              )}`}
                            />
                          </div>
                        </div>

                        {/* Descrição */}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-gray-800">
                            {transaction.description}
                          </p>
                          <p className="text-sm font-normal text-gray-600 mt-1">
                            {formatDate(transaction.date)}
                          </p>
                        </div>

                        {/* Tag da categoria */}
                        <div className="flex-shrink-0 mx-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryLightBg(
                              transaction.category.color
                            )} ${getCategoryBaseColor(transaction.category.color)}`}
                          >
                            {transaction.category.title}
                          </span>
                        </div>

                        {/* Valor e ícone */}
                        <div className="flex items-center flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-800">
                            {transaction.type === "credit" ? "+" : "-"}{" "}
                            {formatCurrency(transaction.amount)}
                          </span>
                          {transaction.type === "credit" ? (
                            <CircleArrowUp className="h-4 w-4 text-brand-base ml-2" />
                          ) : (
                            <CircleArrowDown className="h-4 w-4 text-red-base ml-2" />
                          )}
                        </div>
                      </div>
                      {/* Divisão entre transações */}
                      <div className="border-t border-gray-200" />
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  className="flex items-center gap-2 text-sm font-medium text-brand-base hover:underline"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 text-brand-base" />
                  Nova transação
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Categorias */}
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-medium text-gray-500">CATEGORIAS</h2>
                <Link
                  to="/categories"
                  className="text-sm font-medium text-brand-base hover:underline flex items-center gap-1"
                >
                  Gerenciar <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="-mx-6">
                {/* Divisão superior - separa título/gerenciar da listagem */}
                <div className="border-t border-gray-200" />
                
                {categoriesWithStats.length === 0 ? (
                  <div className="py-8 text-center text-gray-600">
                    <p>Nenhuma categoria encontrada</p>
                  </div>
                ) : (
                  categoriesWithStats.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between py-3 px-6"
                    >
                      {/* Tag da categoria */}
                      <div className="flex-shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryLightBg(
                            category.color
                          )} ${getCategoryBaseColor(category.color)}`}
                        >
                          {category.title}
                        </span>
                      </div>
                      
                      {/* Número de itens */}
                      <div className="flex items-center gap-4 flex-1 justify-end">
                        <span className="text-sm font-normal text-gray-600">
                          {category.itemCount} itens
                        </span>
                        {/* Valor */}
                        <span className="text-sm font-semibold text-gray-800">
                          {formatCurrency(category.totalAmount || 0)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateTransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          refetchTransactions()
        }}
      />
    </div>
  )
}

