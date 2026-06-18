import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-gold/30 bg-gold/10 text-gold",
        secondary: "border-parchment/20 bg-parchment/5 text-parchment/80",
        outline: "border-gold/20 text-parchment/70",
        romance: "border-rose-500/30 bg-rose-500/10 text-rose-300",
        family: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        enemy: "border-red-500/30 bg-red-500/10 text-red-300",
        alliance: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
