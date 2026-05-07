import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = ({
  variant = "default",
}: {
  variant?: "default" | "outline" | "ghost";
}) => {
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  return cn(baseStyles, variants[variant]);
};

export { buttonVariants };
