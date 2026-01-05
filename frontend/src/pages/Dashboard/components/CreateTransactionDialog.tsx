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
import { SelectField } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowDownCircle, ArrowUpCircle, X } from "lucide-react"
import { TransactionType } from "@/types"

interface CreateTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTransactionDialog({
  open,
  onOpenChange,
}: CreateTransactionDialogProps) {
  const [type, setType] = useState<TransactionType>("expense")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [value, setValue] = useState("0,00")
  const [category, setCategory] = useState("")

  const handleSave = () => {
    // TODO: Implementar salvamento
    onOpenChange(false)
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
          <DialogTitle>Nova transação</DialogTitle>
          <DialogDescription>
            Registre sua despesa ou receita
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tipo de Transação */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              className={`flex-1 ${
                type === "expense"
                  ? "border-red-500 bg-white text-red-600 hover:bg-red-50"
                  : ""
              }`}
              onClick={() => setType("expense")}
            >
              <ArrowDownCircle className="h-4 w-4 mr-2" />
              Despesa
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              className={`flex-1 ${
                type === "income"
                  ? "border-green-500 bg-white text-green-600 hover:bg-green-50"
                  : ""
              }`}
              onClick={() => setType("income")}
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Receita
            </Button>
          </div>

          {/* Campos do Formulário */}
          <InputField
            id="description"
            label="Descrição"
            placeholder="Ex. Almoço no restaurante"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <InputField
            id="date"
            label="Data"
            type="date"
            placeholder="Selecione"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="space-y-2">
            <Label htmlFor="value">Valor</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                R$
              </span>
              <input
                id="value"
                type="text"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent pl-12 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:border-brand-base"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(formatCurrencyInput(e.target.value))}
              />
            </div>
          </div>

          <SelectField
            id="category"
            label="Categoria"
            value={category}
            onChange={setCategory}
            placeholder="Selecione"
            options={[
              { value: "1", label: "Alimentação" },
              { value: "2", label: "Transporte" },
              { value: "3", label: "Mercado" },
              { value: "4", label: "Entretenimento" },
              { value: "5", label: "Utilidades" },
            ]}
          />

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

