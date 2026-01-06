import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash, PenSquare, Tag, ArrowUpDown } from "lucide-react"
import { Category } from "@/types"
import { CreateCategoryDialog } from "./components/CreateCategoryDialog"
import { CategoryIcon } from "@/lib/category-icons"
import { getCategoryBaseColor, getCategoryLightBg } from "@/lib/category-colors"

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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Categorias</h1>
            <p className="text-base font-normal text-gray-600">
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
          <Card className="rounded-xl border border-gray-200">
            <CardContent className="py-6 px-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <Tag className="h-6 w-6 text-gray-700" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[28px] font-bold text-gray-800 leading-none">{totalCategories}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">TOTAL DE CATEGORIAS</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total de Transações */}
          <Card className="rounded-xl border border-gray-200">
            <CardContent className="py-6 px-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <ArrowUpDown className="h-6 w-6 text-purple-base" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[28px] font-bold text-gray-800 leading-none">{totalTransactions}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">TOTAL DE TRANSAÇÕES</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categoria Mais Utilizada */}
          <Card className="rounded-xl border border-gray-200">
            <CardContent className="py-6 px-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <CategoryIcon
                    iconName={mostUsedCategory.icon}
                    className="h-6 w-6 text-blue-base"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-[28px] font-bold text-gray-800 leading-none">
                    {mostUsedCategory.title}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-1">
                    CATEGORIA MAIS UTILIZADA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCategories.map((category) => (
            <Card key={category.id} className="rounded-xl border border-gray-200 h-full flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                {/* Primeira linha: Ícone à esquerda, botões à direita */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryLightBg(
                      category.color
                    )}`}
                  >
                    <CategoryIcon
                      iconName={category.icon}
                      className={`h-4 w-4 ${getCategoryBaseColor(category.color)}`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50">
                      <Trash className="h-4 w-4 text-danger" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50">
                      <PenSquare className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Segunda linha: Título e descrição */}
                <div className="mb-4 flex-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm font-normal text-gray-600">
                    {category.description}
                  </p>
                </div>

                {/* Terceira linha: Tag à esquerda, quantidade à direita */}
                <div className="flex items-center justify-between mt-auto">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryLightBg(
                      category.color
                    )} ${getCategoryBaseColor(category.color)}`}
                  >
                    {category.title}
                  </span>
                  <span className="text-sm font-normal text-gray-600">
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

