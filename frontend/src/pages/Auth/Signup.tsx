import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { InputField } from "@/components/ui/input-field"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import logo from "@/assets/logo.svg"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"
import { User, Mail, Lock, ArrowRight } from "lucide-react"

export function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const signup = useAuthStore((state) => state.signup)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const signupMutate = await signup({
        name,
        email,
        password,
      })
      if (signupMutate) {
        toast.success("Cadastro realizado com sucesso!")
      }
    } catch (error: any) {
      toast.error("Erro ao realizar o cadastro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
        {/* Logo */}
        <img src={logo} className="w-64 h-22 mb-8" alt="Logo" />

        {/* Card de Cadastro */}
        <Card className="w-full max-w-md rounded-lg shadow-md">
          <CardContent className="p-8">
            {/* Título e subtítulo */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Criar conta
              </h1>
              <p className="text-sm text-gray-500">
                Comece a controlar suas finanças ainda hoje
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nome completo */}
              <InputField
                id="name"
                label="Nome completo"
                icon={User}
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              {/* Campo Email */}
              <InputField
                id="email"
                label="E-mail"
                type="email"
                icon={Mail}
                placeholder="mail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Campo Senha */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <PasswordInput
                  id="password"
                  icon={Lock}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500">
                  A senha deve ter no mínimo 8 caracteres
                </p>
              </div>

              {/* Botão Cadastrar */}
              <Button type="submit" className="w-full h-10" disabled={loading}>
                Cadastrar
              </Button>

              {/* Separador */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">ou</span>
                </div>
              </div>

              {/* Label e Botão Login */}
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-800">
                  Já tem uma conta?
                </p>
                <Button variant="outline" className="w-full h-10" asChild>
                  <Link to="/login">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Fazer login
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
