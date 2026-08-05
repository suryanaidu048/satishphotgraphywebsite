import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none border text-[11px] font-semibold uppercase tracking-[.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c7a66b] disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "border-[#c7a66b] bg-[#c7a66b] px-6 py-3 text-[#10100f] hover:bg-[#e0c68e]", outline: "border-white/25 bg-transparent px-6 py-3 text-white hover:border-white hover:bg-white/10", ghost: "border-transparent text-white hover:bg-white/10" }, size: { default: "h-11", sm: "h-9 px-4", lg: "h-12 px-8" } }, defaultVariants: { variant: "default", size: "default" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => { const Comp = asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />; });
Button.displayName = "Button";
