import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth"
import logo from "@/assets/logo.svg"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = location.pathname === "/dashboard" || location.pathname === "/"
  const isTransactions = location.pathname === "/transactions"
  const isCategories = location.pathname === "/categories"
  const isProfile = location.pathname === "/profile"

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {isAuthenticated && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-3 items-center">
            {/* Logo à esquerda */}
            <div className="flex justify-start">
              <Link to="/dashboard">
                <img src={logo} alt="FINANCY" className="h-8" />
              </Link>
            </div>
            
            {/* Navegação centralizada */}
            <nav className="flex items-center justify-center gap-1">
              <Link to="/dashboard">
                <Button
                  size="sm"
                  variant={isDashboard ? "default" : "ghost"}
                  className={`text-sm font-normal ${!isDashboard ? "text-gray-600" : ""}`}
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/transactions">
                <Button
                  size="sm"
                  variant={isTransactions ? "default" : "ghost"}
                  className={`text-sm font-normal ${!isTransactions ? "text-gray-600" : ""}`}
                >
                  Transações
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  size="sm"
                  variant={isCategories ? "default" : "ghost"}
                  className={`text-sm font-normal ${!isCategories ? "text-gray-600" : ""}`}
                >
                  Categorias
                </Button>
              </Link>
            </nav>
            
            {/* Avatar à direita */}
            <div className="flex justify-end">
              <Link to="/profile">
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-gray-300 text-gray-700">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
