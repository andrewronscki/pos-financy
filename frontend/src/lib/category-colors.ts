// Cores base para seleção de categorias
export const categoryBaseColors = {
  green: "#16A34A", // green-base
  blue: "#2563EB", // blue-base
  purple: "#9333EA", // purple-base
  pink: "#DB2777", // pink-base
  red: "#DC2626", // red-base
  orange: "#EA580C", // orange-base
  yellow: "#CA8A04", // yellow-base
} as const

export type CategoryColor = keyof typeof categoryBaseColors

// Função para obter classes CSS das tags de categoria
// Sempre usa {cor}-light como background
export function getCategoryColorClasses(color: string): string {
  const colors: Record<string, string> = {
    blue: "bg-blue-light text-blue-dark",
    purple: "bg-purple-light text-purple-dark",
    orange: "bg-orange-light text-orange-dark",
    pink: "bg-pink-light text-pink-dark",
    yellow: "bg-yellow-light text-yellow-dark",
    green: "bg-green-light text-green-dark",
    red: "bg-red-light text-red-dark",
  }
  return colors[color] || "bg-gray-200 text-gray-700"
}

