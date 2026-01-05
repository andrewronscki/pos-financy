import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { SelectField } from "@/components/ui/select"
import { Search, Plus, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import { Transaction } from "@/types"
import { CreateTransactionDialog } from "../Dashboard/components/CreateTransactionDialog"
import { CategoryIcon } from "@/lib/category-icons"
import { getCategoryColorClasses } from "@/lib/category-colors"

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Jantar no Restaurante",
    date: "30/11/25",
    category: { id: "1", title: "Alimentação", icon: "utensils", color: "blue" },
    type: "expense",
    value: 89.5,
  },
  {
    id: "2",
    description: "Posto de Gasolina",
    date: "29/11/25",
    category: { id: "2", title: "Transporte", icon: "car-front", color: "purple" },
    type: "expense",
    value: 100.0,
  },
  {
    id: "3",
    description: "Compras no Mercado",
    date: "28/11/25",
    category: { id: "3", title: "Mercado", icon: "shopping-cart", color: "orange" },
    type: "expense",
    value: 156.8,
  },
  {
    id: "4",
    description: "Retorno de Investimento",
    date: "26/11/25",
    category: { id: "4", title: "Investimento", icon: "briefcase-business", color: "green" },
    type: "income",
    value: 340.25,
  },
  {
    id: "5",
    description: "Aluguel",
    date: "25/11/25",
    category: { id: "5", title: "Utilidades", icon: "house", color: "yellow" },
    type: "expense",
    value: 1700.0,
  },
  {
    id: "6",
    description: "Freelance",
    date: "24/11/25",
    category: { id: "6", title: "Salário", icon: "briefcase-business", color: "green" },
    type: "income",
    value: 2500.0,
  },
  {
    id: "7",
    description: "Compras Jantar",
    date: "23/11/25",
    category: { id: "3", title: "Mercado", icon: "shopping-cart", color: "orange" },
    type: "expense",
    value: 150.0,
  },
  {
    id: "8",
    description: "Cinema",
    date: "22/11/25",
    category: { id: "7", title: "Entretenimento", icon: "ticket", color: "pink" },
    type: "expense",
    value: 88.0,
  },
]

const getCategoryColor = getCategoryColorClasses

export function Transactions() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("november-2025")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesCategory =
      categoryFilter === "all" || transaction.category.id === categoryFilter
    return matchesSearch && matchesType && matchesCategory
  })

  const totalResults = filteredTransactions.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)
  const totalPages = Math.ceil(totalResults / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Transações</h1>
            <p className="text-gray-600">
              Gerencie todas as suas transações financeiras
            </p>
          </div>
          <Button
            className="bg-brand-base hover:bg-brand-dark"
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
                  { value: "income", label: "Entrada" },
                  { value: "expense", label: "Saída" },
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
                  { value: "1", label: "Alimentação" },
                  { value: "2", label: "Transporte" },
                  { value: "3", label: "Mercado" },
                  { value: "4", label: "Investimento" },
                  { value: "5", label: "Utilidades" },
                  { value: "6", label: "Salário" },
                  { value: "7", label: "Entretenimento" },
                ]}
              />
              <SelectField
                id="period"
                label="Período"
                value={periodFilter}
                onChange={setPeriodFilter}
                placeholder="Selecione"
                options={[
                  { value: "november-2025", label: "Novembro / 2025" },
                  { value: "december-2025", label: "Dezembro / 2025" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="rounded-lg shadow-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      DESCRIÇÃO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      DATA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      CATEGORIA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      TIPO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      VALOR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      AÇÕES
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <CategoryIcon iconName={transaction.category.icon} className="h-5 w-5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-800">
                            {transaction.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(
                            transaction.category.color
                          )}`}
                        >
                          {transaction.category.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              transaction.type === "income"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm text-gray-600">
                            {transaction.type === "income" ? "Entrada" : "Saída"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-semibold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}{" "}
                          {formatCurrency(transaction.value)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
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
                className={
                  currentPage === page
                    ? "bg-brand-base hover:bg-brand-dark text-white"
                    : ""
                }
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

      <CreateTransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}

