import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CategoryIcon } from "@/lib/category-icons"
import { categoryBaseColors } from "@/lib/category-colors"
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/Categories"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories"
import { toast } from "sonner"

export interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const availableIcons = [
  "briefcase-business",
  "car-front",
  "heart-pulse",
  "piggy-bank",
  "shopping-cart",
  "ticket",
  "tool-case",
  "utensils",
  "paw-print",
  "house",
  "gift",
  "dumbbell",
  "book-open",
  "baggage-claim",
  "mailbox",
  "receipt-text",
]

// Cores base para seleção (usando as cores base do projeto)
const availableColors = Object.entries(categoryBaseColors).map(([name, value]) => ({
  name,
  value,
}))

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("briefcase-business")
  const [selectedColor, setSelectedColor] = useState("green")

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: LIST_CATEGORIES }],
    onCompleted: () => {
      toast.success("Categoria criada com sucesso!")
      onOpenChange(false)
      // Reset form
      setTitle("")
      setDescription("")
      setSelectedIcon("briefcase-business")
      setSelectedColor("green")
      onSuccess?.()
    },
    onError: (error) => {
      toast.error("Erro ao criar categoria: " + error.message)
    },
  })

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("O título é obrigatório")
      return
    }

    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      icon: selectedIcon,
      color: selectedColor,
    }

    await createCategory({ variables: { data } })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-gray-800">
            Nova categoria
          </DialogTitle>
          <DialogDescription className="text-sm font-normal text-gray-600">
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Título
              </Label>
              <Input
                id="title"
                placeholder="Ex. Alimentação"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrição
              </Label>
              <Input
                id="description"
                placeholder="Descrição da categoria"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs font-normal text-gray-500 mt-2">Opcional</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Ícone</Label>
              <div className="grid grid-cols-8 gap-2">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`w-[42px] h-[42px] rounded-lg border-2 flex items-center justify-center transition-colors ${
                      selectedIcon === icon
                        ? "border-brand-base bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <CategoryIcon iconName={icon} className="h-5 w-5 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Cor</Label>
              <div className="flex gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-[50px] h-[30px] rounded-lg border-2 flex items-center justify-center transition-all ${
                      selectedColor === color.name
                        ? "border-brand-base"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div
                      className="w-10 h-5 rounded"
                      style={{ backgroundColor: color.value }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-brand-base hover:bg-brand-dark rounded-lg text-base font-medium text-white"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

