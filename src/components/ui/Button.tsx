import { cn } from "../../lib/utils";
import React from "react";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" | "ghost", size?: "sm" | "md" | "lg" }
>(({ className, variant = "primary", size = "md", ...props }, ref) => {
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 shadow-md",
    secondary: "bg-orange-400 text-white hover:bg-orange-500 shadow-md",
    outline: "border-4 border-blue-400 text-blue-500 hover:bg-blue-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-xl",
    md: "px-6 py-3 text-xl rounded-2xl",
    lg: "px-8 py-4 text-3xl rounded-3xl font-bold",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
