import { useState } from "react"
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

// Mock data - será substituído por dados reais depois
const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Pagamento de Salário",
    date: "01/12/25",
    category: { id: "1", title: "Receita", icon: "briefcase-business", color: "green" },
    type: "income",
    value: 4250.0,
  },
  {
    id: "2",
    description: "Jantar no Restaurante",
    date: "30/11/25",
    category: { id: "2", title: "Alimentação", icon: "utensils", color: "blue" },
    type: "expense",
    value: 89.5,
  },
  {
    id: "3",
    description: "Posto de Gasolina",
    date: "29/11/25",
    category: { id: "3", title: "Transporte", icon: "car-front", color: "purple" },
    type: "expense",
    value: 100.0,
  },
  {
    id: "4",
    description: "Compras no Mercado",
    date: "28/11/25",
    category: { id: "4", title: "Mercado", icon: "shopping-cart", color: "orange" },
    type: "expense",
    value: 156.8,
  },
  {
    id: "5",
    description: "Retorno de Investimento",
    date: "26/11/25",
    category: { id: "5", title: "Investimento", icon: "briefcase-business", color: "green" },
    type: "income",
    value: 340.25,
  },
]

const mockCategories: Category[] = [
  { id: "1", title: "Alimentação", icon: "utensils", color: "blue", itemCount: 12, totalAmount: 542.3 },
  { id: "2", title: "Transporte", icon: "car-front", color: "purple", itemCount: 8, totalAmount: 385.5 },
  { id: "3", title: "Mercado", icon: "shopping-cart", color: "orange", itemCount: 3, totalAmount: 298.75 },
  { id: "4", title: "Entretenimento", icon: "ticket", color: "pink", itemCount: 2, totalAmount: 186.2 },
  { id: "5", title: "Utilidades", icon: "house", color: "yellow", itemCount: 7, totalAmount: 245.8 },
]

export function Dashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const totalBalance = 12847.32
  const monthlyIncome = 4250.0
  const monthlyExpenses = 2180.45

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
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
                
                {mockTransactions.map((transaction) => (
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
                          {transaction.date}
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
                          {transaction.type === "income" ? "+" : "-"}{" "}
                          {formatCurrency(transaction.value)}
                        </span>
                        {transaction.type === "income" ? (
                          <CircleArrowUp className="h-4 w-4 text-brand-base ml-2" />
                        ) : (
                          <CircleArrowDown className="h-4 w-4 text-red-base ml-2" />
                        )}
                      </div>
                    </div>
                    {/* Divisão entre transações */}
                    <div className="border-t border-gray-200" />
                  </div>
                ))}
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
                
                {mockCategories.map((category) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateTransactionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}

