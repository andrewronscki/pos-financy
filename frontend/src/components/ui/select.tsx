import * as React from "react"
import { ChevronUp, Check, LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label } from "./label"

const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm transition-colors focus-visible:outline-none disabled:cursor-not-allowed",
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

const selectContentVariants = cva(
  "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md",
  {
    variants: {
      variant: {
        default: "border-gray-300",
        error: "border-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends Omit<React.ComponentProps<"button">, "onChange">,
    VariantProps<typeof selectTriggerVariants> {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ className, variant, options, value, onChange, placeholder, icon: Icon, disabled, open: controlledOpen, onOpenChange, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
    const setIsOpen = (open: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(open)
      }
      onOpenChange?.(open)
    }
    const selectRef = React.useRef<HTMLDivElement>(null)

    const selectedOption = options.find((opt) => opt.value === value)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [isOpen])

    const selectVariant = React.useMemo(() => {
      if (variant === "error") return "error"
      if (disabled) return "disabled"
      return variant || "default"
    }, [variant, disabled])

    const iconColor = React.useMemo(() => {
      if (variant === "error") return "text-danger"
      if (disabled) return "text-gray-400"
      if (selectedOption) return "text-gray-800"
      return "text-gray-400"
    }, [variant, disabled, selectedOption])

    return (
      <div className="relative w-full" ref={selectRef}>
        {Icon && (
          <Icon
            className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none z-10",
              iconColor
            )}
          />
        )}
        <button
          type="button"
          ref={ref}
          disabled={disabled}
          className={cn(
            selectTriggerVariants({ variant: selectVariant }),
            Icon && "pl-9",
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          {...props}
        >
          <span className={cn("flex-1 text-left", !selectedOption && "text-gray-400")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronUp
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen ? "transform rotate-180" : "",
              iconColor
            )}
          />
        </button>
        {isOpen && !disabled && (
          <div
            className={cn(
              "absolute z-50 w-full mt-1",
              selectContentVariants({ variant: selectVariant })
            )}
          >
            <div className="p-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
                    value === option.value && "bg-gray-50"
                  )}
                  onClick={() => {
                    onChange?.(option.value)
                    setIsOpen(false)
                  }}
                >
                  <span className="flex-1">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-brand-base ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export interface SelectFieldProps extends SelectProps {
  id: string
  label: string
  helperText?: string
  error?: string
  icon?: LucideIcon
}

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  ({ id, label, helperText, error, icon, variant, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const selectVariant = React.useMemo(() => {
      if (error) return "error"
      if (disabled) return "disabled"
      return variant || "default"
    }, [error, disabled, variant])

    const labelVariant = React.useMemo(() => {
      if (error) return "error"
      if (isOpen && !error) return "active"
      return "default"
    }, [error, isOpen])

    const helperTextColor = React.useMemo(() => {
      if (error) return "text-danger"
      if (isOpen && !error) return "text-brand-base"
      return "text-gray-500"
    }, [error, isOpen])

    const displayHelperText = error || helperText

    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} variant={labelVariant} className={labelVariant === "default" ? "text-gray-700" : undefined}>
          {label}
        </Label>
        <Select
          ref={ref}
          icon={icon}
          variant={selectVariant}
          disabled={disabled}
          open={isOpen}
          onOpenChange={setIsOpen}
          {...props}
        />
        {displayHelperText && (
          <p className={cn("text-sm", helperTextColor)}>
            {displayHelperText}
          </p>
        )}
      </div>
    )
  }
)
SelectField.displayName = "SelectField"

export { Select, SelectField }

