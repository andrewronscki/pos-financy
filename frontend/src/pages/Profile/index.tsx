import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, LogOut } from "lucide-react"
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
      <div className="mx-auto px-6" style={{ maxWidth: "448px" }}>
        <Card className="rounded-lg shadow-md">
          <CardContent className="p-8">
            {/* Avatar and User Info */}
            <div className="flex flex-col items-center mb-8">
              <Avatar className="w-16 h-16 mb-6">
                <AvatarFallback className="bg-gray-300 text-gray-800 text-2xl font-medium">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-gray-800 mb-0.5">
                {user?.name || "Usuário"}
              </h2>
              <p className="text-base font-normal text-gray-500">{user?.email}</p>
            </div>

            {/* Form */}
            <div>
              {/* Divider */}
              <div className="border-t border-gray-200 my-8" />

              <div className="space-y-4">
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
                  <p className="text-xs font-normal text-gray-500">
                    O e-mail não pode ser alterado
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  className="w-full bg-brand-base hover:bg-brand-dark"
                  onClick={handleSave}
                >
                  Salvar alterações
                </Button>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-[18px] w-[18px] mr-2 text-danger" />
                  <span className="text-base font-medium text-gray-700">
                    Sair da conta
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

