import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Input, InputProps } from "./input"
import { Label } from "./label"
import { cn } from "@/lib/utils"

export interface InputFieldProps extends Omit<InputProps, "id"> {
  id: string
  label: string
  helperText?: string
  error?: string
  icon?: LucideIcon
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id, label, helperText, error, icon, className, variant, disabled, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState(props.value ?? props.defaultValue ?? "")
    const isControlled = props.value !== undefined
    
    React.useEffect(() => {
      if (isControlled && props.value !== undefined) {
        setInternalValue(props.value)
      }
    }, [props.value, isControlled])
    
    const hasValue = isControlled
      ? (props.value !== undefined && props.value !== "" && props.value !== null)
      : (internalValue !== undefined && internalValue !== "" && internalValue !== null)

    // Determina o variant baseado no estado
    const inputVariant = React.useMemo(() => {
      if (error) return "error"
      if (disabled) return "disabled"
      return variant || "default"
    }, [error, disabled, variant])

    // Determina a cor do label
    const labelVariant = React.useMemo(() => {
      if (error) return "error"
      if (isFocused && !error) return "active"
      return "default"
    }, [error, isFocused])

    // Determina a cor do helper text
    const helperTextColor = React.useMemo(() => {
      if (error) return "text-danger"
      if (isFocused && !error) return "text-brand-base"
      return "text-gray-500"
    }, [error, isFocused])

    // Texto de ajuda a exibir (erro tem prioridade sobre helper text)
    const displayHelperText = error || helperText

    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} variant={labelVariant}>
          {label}
        </Label>
        <Input
          id={id}
          ref={ref}
          icon={icon}
          variant={inputVariant}
          disabled={disabled}
          className={className}
          hasValue={hasValue}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          onChange={(e) => {
            if (!isControlled) {
              setInternalValue(e.target.value)
            }
            props.onChange?.(e)
          }}
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
InputField.displayName = "InputField"

export { InputField }

