import { useState } from "react"
import logo from "@/assets/logo.svg"
import { Card, CardContent } from "@/components/ui/card"
import { InputField } from "@/components/ui/input-field"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"
import { Mail, Lock, UserPlus } from "lucide-react"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const loginMutate = await login({
        email,
        password,
      })
      if (loginMutate) {
        toast.success("Login realizado com sucesso!")
      }
    } catch (error) {
      toast.error("Falha ao realizar o login!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Conteúdo principal */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
        {/* Logo */}
        <img src={logo} className="w-64 h-22 mb-8" alt="Logo" />

        {/* Card de Login */}
        <Card className="w-full max-w-md rounded-lg shadow-md">
          <CardContent className="p-8">
            {/* Título e subtítulo */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Fazer login
              </h1>
              <p className="text-sm text-gray-500">
                Entre na sua conta para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
              </div>

              {/* Lembrar-me e Recuperar senha */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal text-gray-800 cursor-pointer"
                  >
                    Lembrar-me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-base hover:underline"
                >
                  Recuperar senha
                </Link>
              </div>

              {/* Botão Entrar */}
              <Button type="submit" className="w-full h-10" disabled={loading}>
                Entrar
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

              {/* Label e Botão Criar conta */}
              <div className="space-y-4">
                <p className="text-center text-sm text-gray-800">
                  Ainda não tem uma conta?
                </p>
                <Button
                  variant="outline"
                  className="w-full h-10"
                  asChild
                >
                  <Link to="/signup">
                    <UserPlus className="h-4 w-4" />
                    Criar conta
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
