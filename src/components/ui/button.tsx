import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "src/lib/utils"
import { buttonVariants, type ButtonVariantsProps } from "./button-variants"

interface ButtonProps
  extends React.ComponentProps<"button">,
    ButtonVariantsProps {
  asChild?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
