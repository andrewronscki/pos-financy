import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, ArrowRight } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { useNavigate } from "react-router-dom"

export function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || "")
  const [email] = useState(user?.email || "")

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  const handleSave = () => {
    // TODO: Implementar atualização do perfil
    console.log("Salvando alterações...", { name })
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-6">
        <Card className="rounded-lg shadow-md">
          <CardContent className="p-8">
            {/* Avatar and User Info */}
            <div className="flex flex-col items-center mb-8">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="bg-gray-300 text-gray-700 text-2xl">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {user?.name || "Usuário"}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <InputField
                id="name"
                label="Nome completo"
                icon={User}
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="space-y-2">
                <InputField
                  id="email"
                  label="E-mail"
                  icon={Mail}
                  placeholder="seu@email.com"
                  value={email}
                  disabled
                />
                <p className="text-xs text-gray-500">
                  O e-mail não pode ser alterado
                </p>
              </div>

              <Button
                className="w-full bg-brand-base hover:bg-brand-dark"
                onClick={handleSave}
              >
                Salvar alterações
              </Button>

              <Button
                variant="outline"
                className="w-full border-red-500 text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Sair da conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

