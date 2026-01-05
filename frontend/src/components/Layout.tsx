import { Toaster } from "@/components/ui/sonner"
import { Header } from "./Header"
import { useLocation } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup"

  if (isAuthPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>{children}</main>
      <Toaster />
    </div>
  )
}
