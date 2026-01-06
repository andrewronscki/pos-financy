import { useState } from "react"
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
import { Transaction } from "@/types"
import { CreateTransactionDialog } from "../Dashboard/components/CreateTransactionDialog"
import { CategoryIcon } from "@/lib/category-icons"
import { getCategoryBaseColor, getCategoryLightBg } from "@/lib/category-colors"

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
                {paginatedTransactions.map((transaction, index) => (
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
                          {transaction.date}
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
                        {transaction.type === "income" ? (
                          <CircleArrowUp className="h-4 w-4 text-brand-base mr-2" />
                        ) : (
                          <CircleArrowDown className="h-4 w-4 text-red-base mr-2" />
                        )}
                        <span className="text-sm font-medium text-gray-800">
                          {transaction.type === "income" ? "Entrada" : "Saída"}
                        </span>
                      </div>

                      {/* Valor */}
                      <div className="flex items-center flex-1">
                        <span className="text-sm font-semibold text-gray-800">
                          {transaction.type === "income" ? "+" : "-"}{" "}
                          {formatCurrency(transaction.value)}
                        </span>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2 flex-1">
												<button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50">
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
                ))}
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
      />
    </div>
  )
}

