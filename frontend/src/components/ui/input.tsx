import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed file:text-foreground",
  {
    variants: {
      variant: {
        default: "border-gray-300 text-gray-800 focus-visible:border-brand-base",
        error: "border-danger text-gray-800",
        disabled: "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {
  icon?: LucideIcon
  hasValue?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, icon: Icon, type, hasValue, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    
    // Detecta valor se hasValue não foi fornecido (para inputs controlados)
    const currentHasValue = hasValue !== undefined 
      ? hasValue 
      : (props.value !== undefined && props.value !== "" && props.value !== null)

    const inputClassName = React.useMemo(() => {
      if (variant === "error") return inputVariants({ variant: "error" })
      if (variant === "disabled" || props.disabled) return inputVariants({ variant: "disabled" })
      return inputVariants({ variant: "default" })
    }, [variant, props.disabled])

    const iconColor = React.useMemo(() => {
      if (variant === "error") return "text-danger"
      if (variant === "disabled" || props.disabled) return "text-gray-400"
      if (isFocused) return "text-brand-base"
      if (currentHasValue) return "text-gray-800"
      return "text-gray-400"
    }, [variant, isFocused, currentHasValue, props.disabled])

    return (
      <div className="relative w-full">
        {Icon && (
          <Icon
            className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none",
              iconColor
            )}
          />
        )}
        <input
          type={type}
          className={cn(
            inputClassName,
            Icon && "pl-9",
            className
          )}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
