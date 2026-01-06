import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { Transaction, TransactionType, Category, UpdateTransactionInput } from "@/types"
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/Transactions"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories"
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transactions"
import { toast } from "sonner"

interface EditTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
  onSuccess?: () => void
}

type CategoriesQueryData = {
  listCategories: Category[]
}

export function EditTransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSuccess,
}: EditTransactionDialogProps) {
  const [type, setType] = useState<TransactionType>("debit")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [value, setValue] = useState("0,00")
  const [category, setCategory] = useState("")

  const { data: categoriesData } = useQuery<CategoriesQueryData>(LIST_CATEGORIES)

  // Preencher o formulário quando a transação mudar
  useEffect(() => {
    if (transaction) {
      setType(transaction.type)
      setDescription(transaction.description || "")
      setCategory(transaction.categoryId)
      
      // Converter a data ISO para formato do input (YYYY-MM-DD)
      if (transaction.date) {
        const dateObj = new Date(transaction.date)
        const year = dateObj.getFullYear()
        const month = String(dateObj.getMonth() + 1).padStart(2, "0")
        const day = String(dateObj.getDate()).padStart(2, "0")
        setDate(`${year}-${month}-${day}`)
      }
      
      // Formatar o valor para exibição
      if (transaction.amount) {
        const formatted = transaction.amount.toFixed(2).replace(".", ",")
        setValue(formatted)
      }
    }
  }, [transaction])

  const [updateTransaction, { loading }] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: [{ query: LIST_TRANSACTIONS }],
    onCompleted: () => {
      toast.success("Transação atualizada com sucesso!")
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error) => {
      toast.error("Erro ao atualizar transação: " + error.message)
    },
  })

  const handleSave = async () => {
    if (!transaction?.id) {
      toast.error("Transação não encontrada")
      return
    }

    if (!description.trim()) {
      toast.error("A descrição é obrigatória")
      return
    }
    if (!date) {
      toast.error("A data é obrigatória")
      return
    }
    if (!category) {
      toast.error("A categoria é obrigatória")
      return
    }
    
    const numericValue = parseFloat(value.replace(",", "."))
    if (isNaN(numericValue) || numericValue <= 0) {
      toast.error("O valor deve ser maior que zero")
      return
    }

    // Converter data para formato ISO preservando o dia/mês/ano exatos
    const dateISO = `${date}T12:00:00.000Z`

    const data: UpdateTransactionInput = {
      categoryId: category,
      description: description.trim(),
      date: dateISO,
      type: type,
      amount: numericValue,
    }

    await updateTransaction({ variables: { data, id: transaction.id } })
  }

  const formatCurrencyInput = (value: string) => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, "")
    // Converte para formato de moeda
    const formatted = (parseInt(numbers) / 100).toFixed(2).replace(".", ",")
    return formatted
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-800">
            Editar transação
          </DialogTitle>
          <DialogDescription className="text-sm font-normal text-gray-600">
            Atualize as informações da transação
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Tipo de Transação */}
          <div className="flex gap-3 p-1 rounded-xl border border-gray-200 mb-6">
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 ${
                type === "debit"
                  ? "border-red-base bg-white hover:bg-red-50 border"
                  : "border-transparent"
              }`}
              onClick={() => setType("debit")}
            >
              <ArrowDownCircle className={`h-4 w-4 mr-2 ${
                type === "debit" ? "text-red-base" : "text-gray-500"
              }`} />
              Despesa
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 ${
                type === "credit"
                  ? "border-brand-base bg-white hover:bg-brand-light border"
                  : "border-transparent"
              }`}
              onClick={() => setType("credit")}
            >
              <ArrowUpCircle className={`h-4 w-4 mr-2 ${
                type === "credit" ? "text-brand-base" : "text-gray-500"
              }`} />
              Receita
            </Button>
          </div>

          {/* Campos do Formulário */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descrição
            </Label>
            <Input
              id="description"
              placeholder="Ex. Almoço no restaurante"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Data e Valor na mesma linha */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Data
              </Label>
              <Input
                id="date"
                type="date"
                placeholder="Selecione"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value" className="text-sm font-medium text-gray-700">
                Valor
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <Input
                  id="value"
                  type="text"
                  className="pl-12"
                  placeholder="0,00"
                  value={value}
                  onChange={(e) => setValue(formatCurrencyInput(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Categoria
            </Label>
            <Select
              value={category}
              onChange={setCategory}
              placeholder="Selecione"
              options={
                categoriesData?.listCategories.map((cat) => ({
                  value: cat.id,
                  label: cat.title,
                })) || []
              }
            />
          </div>

          <Button
            className="w-full bg-brand-base hover:bg-brand-dark rounded-[8px] text-base font-medium h-10"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

