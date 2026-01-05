import * as React from "react"
import { Eye, EyeOff, LucideIcon } from "lucide-react"
import { Input, InputProps } from "./input"
import { cn } from "@/lib/utils"

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  icon?: LucideIcon
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          icon={icon}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
          onClick={(e) => {
            e.preventDefault()
            setShowPassword(!showPassword)
          }}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }

