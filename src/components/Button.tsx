import classNames from "classnames";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "h-10 inline-flex items-center justify-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-3 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-sky-700 text-white border border-transparent hover:bg-sky-800 focus:ring-sky-500",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-300",
  };

  return (
    <button
      className={classNames(baseStyles, variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
