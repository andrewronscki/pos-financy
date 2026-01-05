import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Pencil, Tag, ArrowUpDown } from "lucide-react"
import { Category } from "@/types"
import { CreateCategoryDialog } from "./components/CreateCategoryDialog"
import { CategoryIcon } from "@/lib/category-icons"
import { getCategoryColorClasses } from "@/lib/category-colors"

// Mock data
const mockCategories: Category[] = [
  {
    id: "1",
    title: "Alimentação",
    description: "Restaurantes, delivery e refeições",
    icon: "utensils",
    color: "blue",
    itemCount: 12,
  },
  {
    id: "2",
    title: "Entretenimento",
    description: "Cinema, jogos e lazer",
    icon: "ticket",
    color: "pink",
    itemCount: 2,
  },
  {
    id: "3",
    title: "Investimento",
    description: "Aplicações e retornos financeiros",
    icon: "briefcase-business",
    color: "green",
    itemCount: 1,
  },
  {
    id: "4",
    title: "Mercado",
    description: "Compras de supermercado e mantimentos",
    icon: "shopping-cart",
    color: "orange",
    itemCount: 3,
  },
  {
    id: "5",
    title: "Salário",
    description: "Renda mensal e bonificações",
    icon: "briefcase-business",
    color: "green",
    itemCount: 3,
  },
  {
    id: "6",
    title: "Saúde",
    description: "Medicamentos, consultas e exames",
    icon: "heart-pulse",
    color: "red",
    itemCount: 0,
  },
  {
    id: "7",
    title: "Transporte",
    description: "Gasolina, transporte público e viagens",
    icon: "car-front",
    color: "purple",
    itemCount: 8,
  },
  {
    id: "8",
    title: "Utilidades",
    description: "Energia, água, internet e telefone",
    icon: "house",
    color: "yellow",
    itemCount: 7,
  },
]

const getCategoryColor = getCategoryColorClasses

export function Categories() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const totalCategories = mockCategories.length
  const totalTransactions = mockCategories.reduce(
    (sum, cat) => sum + (cat.itemCount || 0),
    0
  )
  const mostUsedCategory = mockCategories.reduce((prev, current) =>
    (prev.itemCount || 0) > (current.itemCount || 0) ? prev : current
  )

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Categorias</h1>
            <p className="text-gray-600">
              Organize suas transações por categorias
            </p>
          </div>
          <Button
            className="bg-brand-base hover:bg-brand-dark"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova categoria
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total de Categorias */}
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">TOTAL DE CATEGORIAS</p>
                  <p className="text-3xl font-bold text-gray-800">{totalCategories}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total de Transações */}
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">TOTAL DE TRANSAÇÕES</p>
                  <p className="text-3xl font-bold text-gray-800">{totalTransactions}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <ArrowUpDown className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categoria Mais Utilizada */}
          <Card className="rounded-lg shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    CATEGORIA MAIS UTILIZADA
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {mostUsedCategory.title}
                  </p>
                </div>
                <div>
                  <CategoryIcon iconName={mostUsedCategory.icon} className="h-8 w-8 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCategories.map((category) => (
            <Card key={category.id} className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CategoryIcon iconName={category.icon} className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(
                      category.color
                    )}`}
                  >
                    {category.title}
                  </span>
                  <span className="text-sm text-gray-600">
                    {category.itemCount} {category.itemCount === 1 ? "item" : "itens"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  )
}

