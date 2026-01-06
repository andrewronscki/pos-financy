import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { SelectField } from "@/components/ui/select"
import {
  Search,
  Plus,
  Trash,
  PenSquare,
  ChevronLeft,
  ChevronRight,
  CircleArrowUp,
  CircleArrowDown,
} from "lucide-react"
import { Transaction, Category } from "@/types"
import { CreateTransactionDialog } from "../Dashboard/components/CreateTransactionDialog"
import { CategoryIcon } from "@/lib/category-icons"
import { getCategoryBaseColor, getCategoryLightBg } from "@/lib/category-colors"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transactions"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories"
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/Transactions"
import { toast } from "sonner"

type TransactionsQueryData = {
  listTransactions: Transaction[]
}

type CategoriesQueryData = {
  listCategories: Category[]
}

export function Transactions() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data: transactionsData, loading: transactionsLoading, refetch: refetchTransactions } = useQuery<TransactionsQueryData>(LIST_TRANSACTIONS)
  const { data: categoriesData, loading: categoriesLoading } = useQuery<CategoriesQueryData>(LIST_CATEGORIES)

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => {
      toast.success("Transação deletada com sucesso!")
      refetchTransactions()
    },
    onError: (error) => {
      toast.error("Erro ao deletar transação: " + error.message)
    },
  })

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

  const filteredTransactions = useMemo(() => {
    return transactionsWithCategories.filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesType = typeFilter === "all" || transaction.type === typeFilter
      const matchesCategory =
        categoryFilter === "all" || transaction.categoryId === categoryFilter
      
      let matchesPeriod = true
      if (periodFilter !== "all") {
        const transactionDate = new Date(transaction.date)
        const [month, year] = periodFilter.split("-")
        matchesPeriod =
          transactionDate.getMonth() + 1 === parseInt(month) &&
          transactionDate.getFullYear() === parseInt(year)
      }
      
      return matchesSearch && matchesType && matchesCategory && matchesPeriod
    })
  }, [transactionsWithCategories, search, typeFilter, categoryFilter, periodFilter])

  const totalResults = filteredTransactions.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)
  const totalPages = Math.ceil(totalResults / itemsPerPage)

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta transação?")) {
      await deleteTransaction({ variables: { id } })
    }
  }

  // Gerar opções de período dinamicamente
  const periodOptions = useMemo(() => {
    if (!transactionsData?.listTransactions) return []
    
    const periods = new Set<string>()
    transactionsData.listTransactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear()
      periods.add(`${month}-${year}`)
    })
    
    return Array.from(periods)
      .sort((a, b) => {
        const [monthA, yearA] = a.split("-").map(Number)
        const [monthB, yearB] = b.split("-").map(Number)
        if (yearA !== yearB) return yearB - yearA
        return monthB - monthA
      })
      .map((period) => {
        const [month, year] = period.split("-")
        const monthNames = [
          "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
          "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ]
        return {
          value: period,
          label: `${monthNames[parseInt(month) - 1]} / ${year}`,
        }
      })
  }, [transactionsData])

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Transações</h1>
            <p className="text-base font-normal text-gray-600">
              Gerencie todas as suas transações financeiras
            </p>
          </div>
          <Button
            className="bg-brand-base hover:bg-brand-dark rounded-lg px-4 py-2 text-sm font-medium text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova transação
          </Button>
        </div>

        {/* Filters */}
        <Card className="rounded-lg shadow-md mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <InputField
                id="search"
                label="Buscar"
                icon={Search}
                placeholder="Buscar por descrição"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SelectField
                id="type"
                label="Tipo"
                value={typeFilter}
                onChange={setTypeFilter}
                placeholder="Todos"
                options={[
                  { value: "all", label: "Todos" },
                  { value: "credit", label: "Entrada" },
                  { value: "debit", label: "Saída" },
                ]}
              />
              <SelectField
                id="category"
                label="Categoria"
                value={categoryFilter}
                onChange={setCategoryFilter}
                placeholder="Todas"
                options={[
                  { value: "all", label: "Todas" },
                  ...(categoriesData?.listCategories.map((cat) => ({
                    value: cat.id,
                    label: cat.title,
                  })) || []),
                ]}
              />
              <SelectField
                id="period"
                label="Período"
                value={periodFilter}
                onChange={setPeriodFilter}
                placeholder="Todos"
                options={[
                  { value: "all", label: "Todos" },
                  ...periodOptions,
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="rounded-xl border border-gray-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {/* Cabeçalho da tabela */}
              <div className="border-t border-b border-gray-200">
                <div className="flex items-center py-3 px-6">
                  <div className="flex-[2]">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      DESCRIÇÃO
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      DATA
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      CATEGORIA
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      TIPO
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      VALOR
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      AÇÕES
                    </span>
                  </div>
                </div>
              </div>

              {/* Corpo da tabela */}
              <div>
                {paginatedTransactions.length === 0 ? (
                  <div className="py-8 text-center text-gray-600">
                    <p>Nenhuma transação encontrada</p>
                  </div>
                ) : (
                  paginatedTransactions.map((transaction, index) => (
                    <div key={transaction.id}>
                      <div className="flex items-center py-3 px-6">
                        {/* Descrição */}
                        <div className="flex items-center flex-[2]">
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
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-medium text-gray-800">
                              {transaction.description}
                            </p>
                          </div>
                        </div>

                        {/* Data */}
                        <div className="flex-1">
                          <span className="text-sm font-normal text-gray-600">
                            {formatDate(transaction.date)}
                          </span>
                        </div>

                        {/* Categoria */}
                        <div className="flex-1">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryLightBg(
                              transaction.category.color
                            )} ${getCategoryBaseColor(transaction.category.color)}`}
                          >
                            {transaction.category.title}
                          </span>
                        </div>

                        {/* Tipo */}
                        <div className="flex items-center flex-1">
                          {transaction.type === "credit" ? (
                            <CircleArrowUp className="h-4 w-4 text-brand-base mr-2" />
                          ) : (
                            <CircleArrowDown className="h-4 w-4 text-red-base mr-2" />
                          )}
                          <span className="text-sm font-medium text-gray-800">
                            {transaction.type === "credit" ? "Entrada" : "Saída"}
                          </span>
                        </div>

                        {/* Valor */}
                        <div className="flex items-center flex-1">
                          <span className="text-sm font-semibold text-gray-800">
                            {transaction.type === "credit" ? "+" : "-"}{" "}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-2 flex-1">
                          <button 
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
                          >
                            <Trash className="h-4 w-4 text-danger" />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50">
                            <PenSquare className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>
                      </div>
                      {/* Divisão entre transações */}
                      {index < paginatedTransactions.length - 1 && (
                        <div className="border-t border-gray-200" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pagination - Footer do Card */}
            <div className="border-t border-gray-200">
              <div className="flex items-center justify-between py-4 px-6">
                <p className="text-sm text-gray-600">
                  {startIndex + 1} a {Math.min(endIndex, totalResults)} | {totalResults}{" "}
                  resultados
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={`w-8 h-8 p-0 ${
                        currentPage === page
                          ? "bg-brand-base hover:bg-brand-dark text-white"
                          : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

