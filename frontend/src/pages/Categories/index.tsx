import { useState, useMemo } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash, PenSquare, Tag, ArrowUpDown } from "lucide-react"
import { Category } from "@/types"
import { CreateCategoryDialog } from "./components/CreateCategoryDialog"
import { CategoryIcon } from "@/lib/category-icons"
import { getCategoryBaseColor, getCategoryLightBg } from "@/lib/category-colors"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transactions"
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/Categories"
import { toast } from "sonner"

type CategoriesQueryData = {
  listCategories: Category[]
}

type TransactionsQueryData = {
  listTransactions: Array<{
    id: string
    categoryId: string
  }>
}

export function Categories() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useQuery<CategoriesQueryData>(LIST_CATEGORIES)
  const { data: transactionsData, loading: transactionsLoading } = useQuery<TransactionsQueryData>(LIST_TRANSACTIONS)
  
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      toast.success("Categoria deletada com sucesso!")
      refetchCategories()
    },
    onError: (error) => {
      toast.error("Erro ao deletar categoria: " + error.message)
    },
  })

  const categoriesWithCounts = useMemo(() => {
    if (!categoriesData?.listCategories || !transactionsData?.listTransactions) {
      return []
    }

    const transactionCounts = transactionsData.listTransactions.reduce((acc, transaction) => {
      acc[transaction.categoryId] = (acc[transaction.categoryId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return categoriesData.listCategories.map((category) => ({
      ...category,
      itemCount: transactionCounts[category.id] || 0,
    }))
  }, [categoriesData, transactionsData])

  const totalCategories = categoriesWithCounts.length
  const totalTransactions = categoriesWithCounts.reduce(
    (sum, cat) => sum + (cat.itemCount || 0),
    0
  )
  const mostUsedCategory = categoriesWithCounts.reduce((prev, current) =>
    (prev.itemCount || 0) > (current.itemCount || 0) ? prev : current,
    categoriesWithCounts[0] || { title: "N/A", icon: "tag", itemCount: 0 }
  )

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta categoria?")) {
      await deleteCategory({ variables: { id } })
    }
  }

  if (categoriesLoading || transactionsLoading) {
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
          {categoriesWithCounts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">Nenhuma categoria encontrada</p>
            </div>
          ) : (
            categoriesWithCounts.map((category) => (
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
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
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
                      {category.description || "Sem descrição"}
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
            ))
          )}
        </div>
      </div>

      <CreateCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          refetchCategories()
        }}
      />
    </div>
  )
}

