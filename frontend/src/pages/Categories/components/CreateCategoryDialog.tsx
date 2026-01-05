import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CategoryIcon } from "@/lib/category-icons"
import { categoryBaseColors } from "@/lib/category-colors"

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
}: CreateCategoryDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("briefcase-business")
  const [selectedColor, setSelectedColor] = useState("green")

  const handleSave = () => {
    // TODO: Implementar salvamento
    onOpenChange(false)
    // Reset form
    setTitle("")
    setDescription("")
    setSelectedIcon("briefcase-business")
    setSelectedColor("green")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova categoria</DialogTitle>
          <DialogDescription>
            Organize suas transações com categorias
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <InputField
            id="title"
            label="Título"
            placeholder="Ex. Alimentação"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição da categoria"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500">Opcional</p>
          </div>

          <div className="space-y-3">
            <Label>Ícone</Label>
            <div className="grid grid-cols-5 gap-2">
              {availableIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-md border-2 flex items-center justify-center transition-colors ${
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

          <div className="space-y-3">
            <Label>Cor</Label>
            <div className="flex gap-2 flex-wrap">
              {availableColors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-10 h-10 rounded-md border-2 transition-all ${
                    selectedColor === color.name
                      ? "border-brand-base scale-110"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-brand-base hover:bg-brand-dark"
            onClick={handleSave}
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

