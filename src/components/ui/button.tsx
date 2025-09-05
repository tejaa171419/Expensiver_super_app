import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-target",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-medium",
        outline:
          "border border-primary/50 bg-card/50 text-primary hover:bg-primary/10 hover:text-primary backdrop-blur-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-gradient-success text-success-foreground hover:opacity-90 shadow-medium",
        cyber: "bg-gradient-to-r from-primary to-cyan-light text-primary-foreground hover:opacity-90 shadow-glow",
      },
      size: {
        default: "h-12 px-6 py-3 min-w-[48px]", // Mobile-first touch-friendly
        sm: "h-10 px-4 py-2 min-w-[40px] md:h-9 md:px-3", // Smaller on desktop
        lg: "h-14 px-8 py-4 min-w-[56px] text-base", // Extra large for important actions
        icon: "h-12 w-12 min-w-[48px] min-h-[48px]", // Touch-friendly icon buttons
        "icon-sm": "h-10 w-10 min-w-[40px] min-h-[40px] md:h-8 md:w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
