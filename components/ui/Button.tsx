import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-forest-600 text-cream-50 hover:bg-forest-700 shadow-sm hover:shadow-md",
        outline:
          "border border-cream-50/40 text-cream-50 hover:bg-cream-50/10 backdrop-blur-sm",
        outlineDark:
          "border border-forest-800/30 text-forest-900 hover:bg-forest-900/5",
        ghost: "text-forest-800 hover:bg-forest-900/5",
      },
      size: {
        sm: "text-xs px-4 py-2",
        md: "text-sm px-6 py-3",
        lg: "text-sm px-8 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
